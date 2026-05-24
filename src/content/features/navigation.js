/*
 * Tubeless — Navigation watchers: SPA events, MutationObserver, continuous insertion
 */

const NAV_FALLBACK_INTERVAL_MS = 1500;
const INSERT_RETRY_INTERVAL_MS = 900;
let lastVideoId = '';
let pageActiveMetadata = null;

function getVideoId() {
  return utils.getVideoIdFromLocation(window.location);
}

function handleNavigationChange() {
  const newId = getVideoId();

  if (newId !== state.currentVideoId) {
    if (newId && newId !== lastVideoId) {
      lastVideoId = newId;
    }
    void onVideoChange(newId);

    if (chrome.runtime?.id && newId) {
      chrome.runtime.sendMessage({ action: 'YTPLUS_VIDEO_CHANGED', videoId: newId }).catch(() => { });
    }

    // Pre-fetch quality metadata for downloads
    setTimeout(async () => {
      try {
        const meta = await ytPlusGetVideoMetadata();
        if (meta && meta.qualities && meta.qualities.length > 0) {
          pageActiveMetadata = meta;
        }
      } catch (err) {
        pageActiveMetadata = null;
      }
    }, 1200);
  }

  // Always apply adjustments — needed for cinema mode, speed, etc.
  applyVideoAdjustments();
  injectInstantStyles();
  sweepShorts();
}

function startContinuousInsertion() {
  setInterval(() => {
    applyVideoAdjustments();
    if (!document.getElementById('ytd-enhanced-styles-internal')) {
      injectInstantStyles();
    }
    if (!settingsState.showDislikes) return;

    const text = state.currentDislikes !== null
      ? utils.formatNumber(state.currentDislikes)
      : (settingsState.showLoadingState ? '...' : null);

    if (text) {
      scheduleRenderBadge(text);
    }
  }, INSERT_RETRY_INTERVAL_MS);
}

function startNavigationWatchers() {
  document.addEventListener('yt-navigate-finish', handleNavigationChange, true);
  window.addEventListener('yt-page-data-updated', handleNavigationChange, true);
  window.addEventListener('popstate', handleNavigationChange);

  const shortsObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'is-active') {
        if (mutation.target.hasAttribute('is-active')) {
          handleNavigationChange();
          break;
        }
      }
    }
  });

  let shortsObserverActive = false;
  let shortsRetryInterval = null;

  const observeShorts = () => {
    const container = document.querySelector('ytd-shorts, #shorts-container, ytd-reel-video-renderer');
    if (container) {
      if (shortsObserverActive) {
        try { shortsObserver.disconnect(); } catch (_) { }
        shortsObserverActive = false;
      }
      shortsObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['is-active']
      });
      shortsObserverActive = true;
      return true;
    }
    return false;
  };

  if (!observeShorts()) {
    shortsRetryInterval = setInterval(() => {
      if (observeShorts()) {
        clearInterval(shortsRetryInterval);
        shortsRetryInterval = null;
      }
    }, 2000);
  }

  setInterval(handleNavigationChange, NAV_FALLBACK_INTERVAL_MS);
}

// Listen for screenshot events from MAIN world (YoutubePiP.js)
window.addEventListener('YTPLUS_SCREENSHOT_CAPTURED', () => {
  if (typeof showScreenshotFeedback === 'function') showScreenshotFeedback();
});
