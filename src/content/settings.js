/*
 * Tubeless — Settings management
 *
 * DEFAULT_SETTINGS (30 keys) must stay in sync across:
 *   service-worker.js, settings.js, popup.js, options.js
 */

const DEFAULT_SETTINGS = {
  showDislikes: true,
  showLoadingState: true,
  showRetryState: true,
  hideHomeFeed: false,
  hideShorts: false,
  hideSidebarRecommendations: false,
  hideEndscreenRecommendations: false,
  darkMode: false,
  debug: false,
  forceCinemaMode: false,
  playbackSpeed: 1,
  hideComments: false,
  autoReplayVideos: false,
  autoReplayShorts: true,
  deepWorkMode: false,
  hideShortsSearch: false,
  adBlockEnabled: true,
  language: 'auto',
  smartQualityLock: 'auto',
  downloadHotkey: 'd',
  optionsHotkey: 'o',
  pipHotkey: 'b',
  screenshotHotkey: 'v',
  screenshotSoundEnabled: true,
  defaultDownloadQuality: 'best',
  hideShortsSearchManual: false,
  playlistDownloadEnabled: true,
  sidebarCollapsed: false,
  settingStats: {}
};

const settingsState = { ...DEFAULT_SETTINGS };
let settingsLoaded = false;
let settingsLoadResolver = null;
const settingsLoadPromise = new Promise(resolve => { settingsLoadResolver = resolve; });

async function loadSettings() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  try {
    const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    Object.assign(settingsState, DEFAULT_SETTINGS, stored);
    settingsLoaded = true;
    if (settingsLoadResolver) settingsLoadResolver();
  } catch (err) {
    _log?.('warn', 'Could not load settings from storage:', err);
    settingsLoaded = true;
    if (settingsLoadResolver) settingsLoadResolver();
  }
}

function watchSettingsChanges() {
  if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return;
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (changes[key]) settingsState[key] = changes[key].newValue;
    }
    _log?.('info', 'Settings updated:', settingsState);

    if (changes.forceCinemaMode && changes.forceCinemaMode.newValue === false) {
      const watchFlexy = document.querySelector('ytd-watch-flexy');
      if (watchFlexy && watchFlexy.hasAttribute('theater')) {
        const btn = document.querySelector(selectors.productivityTargets.cinemaButton);
        if (btn) btn.click();
      }
    }

    if (changes.showDislikes && changes.showDislikes.newValue === false) {
      if (typeof clearExistingCount === 'function') clearExistingCount();
    }

    if (changes.hideShorts) {
      const isShortsPage = window.location.pathname.startsWith('/shorts/');
      if (isShortsPage) {
        const videos = document.querySelectorAll('video');
        if (changes.hideShorts.newValue) {
          videos.forEach(v => v.pause());
        } else {
          const mainVideo = document.querySelector('ytd-reel-video-renderer[is-active] video') || videos[0];
          if (mainVideo) mainVideo.play().catch(() => { });
        }
      }
    }

    if (typeof injectInstantStyles === 'function') injectInstantStyles();
    if (typeof applyVideoAdjustments === 'function') applyVideoAdjustments();

    window.dispatchEvent(new CustomEvent('YTPLUS_SETTINGS_UPDATED', { detail: settingsState }));
  });
}
