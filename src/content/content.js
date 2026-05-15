

const API_URL = 'https://returnyoutubedislikeapi.com/votes';
const CACHE_TTL_MS = 10 * 60 * 1000;
const NAV_FALLBACK_INTERVAL_MS = 1500;
const INSERT_RETRY_INTERVAL_MS = 900;
const AD_SWEEP_THROTTLE_MS = 1000;

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

const runtime = typeof chrome !== 'undefined' && chrome.runtime
  ? chrome.runtime
  : (typeof browser !== 'undefined' && browser.runtime ? browser.runtime : null);

const utils = (typeof window !== 'undefined' && window.YTPlusUtils) || {
  getVideoIdFromLocation: () => null,
  formatNumber: value => String(value),
  waitForElement: () => Promise.resolve(null),
  debounce: (fn) => fn
};

const settingsState = { ...DEFAULT_SETTINGS };
let settingsLoaded = false;
let settingsLoadResolver = null;
const settingsLoadPromise = new Promise(resolve => { settingsLoadResolver = resolve; });
let lastVideoId = '';
const dislikeCache = new Map();
const inFlightRequests = new Map();
let pageActiveMetadata = null;
let isSpacePressed = false;

const state = {
  currentVideoId: null,
  currentDislikes: null,
  renderScheduled: false
};

const selectors = {
  dislikeContainers: [
    '#segmented-dislike-button',
    '#dislike-button',
    'ytd-reel-video-renderer #dislike-button',
    'ytd-segmented-like-dislike-button-renderer #dislike-button',
    'ytd-segmented-like-dislike-button-renderer',
    'yt-smartimation[slot="segmented-like-button"]',
    'button[aria-label*="dislike" i]'
  ],
  productivityTargets: {
    homeFeed: [
      'ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer',
      'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
      'ytd-page-manager ytd-browse[page-subtype="home"] #primary'
    ],
    shorts: [
      
      'ytd-guide-entry-renderer:has(a[title="Shorts"])',
      'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
      'ytd-guide-entry-renderer:has(a[href="/shorts"])',
      'ytd-mini-guide-entry-renderer:has(a[href="/shorts"])',
      'a[href="/shorts"]',
      '#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Shorts"]',
      'ytd-guide-entry-renderer:has(yt-icon[type="shorts"])',

      
      'ytd-reel-shelf-renderer',
      'ytd-rich-shelf-renderer[is-shorts]',
      'yt-horizontal-list-renderer:has(ytd-reel-item-renderer)',

      
      'ytd-rich-item-renderer:has(a[href^="/shorts/"])',
      'ytd-video-renderer:has(a[href^="/shorts/"])',
      'ytd-grid-video-renderer:has(a[href^="/shorts/"])',
      'ytd-compact-video-renderer:has(a[href^="/shorts/"])',
      'ytd-reel-item-renderer',
      'ytd-reel-video-renderer',
      'ytd-shorts',
      'ytd-rich-grid-slim-media',
      'ytd-rich-item-renderer:has(ytd-rich-grid-slim-media)',

      
      '#shorts-container',
      'ytd-tab-renderer:has(div[title="Shorts"])',
      'ytd-tab-renderer:has(div[title="short"])',
      'tp-yt-paper-tab:has(div[title="Shorts"])',
      '[aria-label="Shorts"]',
      '[title="Shorts"]',
      'yt-icon-button:has(yt-icon[type="shorts"])'
    ],
    searchShorts: [
      'ytd-search ytd-reel-shelf-renderer',
      'ytd-search ytd-video-renderer:has(a[href^="/shorts/"])',
      'ytd-search ytd-rich-item-renderer:has(a[href^="/shorts/"])',
      'ytd-search grid-shelf-view-model:has(a[href^="/shorts/"])',
      'ytd-search grid-shelf-view-model:has(yt-icon[type="shorts"])',
      'ytd-search grid-shelf-view-model:has([aria-label*="Shorts" i])',
      'ytd-search ytd-shelf-renderer:has(a[href^="/shorts/"])'
    ],
    sidebarRecommendations: [
      '#secondary ytd-watch-next-secondary-results-renderer',
      '#related'
    ],
    endscreenRecommendations: [
      // Stable: scoped to #movie_player, uses attribute-contains for resilience
      '#movie_player [class*="ytp-ce-"]',
      '#movie_player .ytp-endscreen',
      '#movie_player [class*="endscreen"]',
      '#movie_player [class*="videowall"]',
      '#movie_player [class*="suggestion"]'
    ],
    comments: ['#comments', 'ytd-comments'],
    player: '#movie_player video, ytd-player video, video.html5-main-video',
    cinemaButton: 'button[data-tooltip-target-id="ytp-size-button"], .ytp-size-button',
    skeletons: [
      'ytd-shell-renderer',
      '#home-page-skeleton',
      '#guide-skeleton',
      '#watch-skeleton',
      '#shimmer-container',
      '#shimmer-card',
      '[class*="ghost-card"]',
      'ytd-player [class*="placeholder"]',
      'ytd-search [class*="skeleton"]'
    ],
    premiumPromotions: [
      'ytd-mealbar-promo-renderer',
      'ytd-banner-promo-renderer',
      'yt-upsell-dialog-renderer',
      'ytd-popup-container:has(yt-upsell-dialog-renderer)',
      'ytd-guide-entry-renderer:has(a[href="/premium"])',
      'ytd-rich-section-renderer:has(ytd-banner-promo-renderer)',
      'ytd-clarification-renderer',
      '#offer-module'
    ]
  },
  protectedZones: '#segmented-dislike-button, #dislike-button, ytd-segmented-like-dislike-button-renderer, #top-level-buttons-computed'
};




(function preEmptiveBlackout() {
  const style = document.createElement('style');
  style.id = 'ytd-initial-render-styles';
  
  
  style.textContent = `
    html:not(.ytd-shell-ready) ytd-rich-grid-renderer,
    html:not(.ytd-shell-ready) ytd-reel-shelf-renderer,
    html:not(.ytd-shell-ready) ytd-rich-shelf-renderer,
    html:not(.ytd-shell-ready) #shorts-container,
    html:not(.ytd-shell-ready) #home-page-skeleton,
    html:not(.ytd-shell-ready) #watch-skeleton,
    html:not(.ytd-shell-ready) [class*="ghost-card"],
    html:not(.ytd-shell-ready) ytd-shell-renderer,
    html:not(.ytd-shell-ready) #shimmer-container,
    html:not(.ytd-shell-ready) #shimmer-card,
    html:not(.ytd-shell-ready) ytd-player [class*="placeholder"],
    html:not(.ytd-shell-ready) ytd-search [class*="skeleton"],
    html:not(.ytd-shell-ready) .yt-skeleton,
    html:not(.ytd-shell-ready) .rich-grid-skeleton-renderer,
    html:not(.ytd-shell-ready) #spinner {
       display: none !important;
    }
  `;
  document.documentElement.appendChild(style);
})();


function log(level, ...args) {
  if (!settingsState.debug && level !== 'error') return;
  const logger = level === 'error' ? console.error : (level === 'warn' ? console.warn : console.log);
  logger('[Tubeless]', ...args);
}

async function loadSettings() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  try {
    const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    Object.assign(settingsState, DEFAULT_SETTINGS, stored);
    settingsLoaded = true;
    if (settingsLoadResolver) settingsLoadResolver();
  } catch (err) {
    log('warn', 'Could not load settings from storage:', err);
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
    log('info', 'Settings updated:', settingsState);

    if (changes.forceCinemaMode && changes.forceCinemaMode.newValue === false) {
      const watchFlexy = document.querySelector('ytd-watch-flexy');
      if (watchFlexy && watchFlexy.hasAttribute('theater')) {
        const btn = document.querySelector(selectors.productivityTargets.cinemaButton);
        if (btn) btn.click();
      }
    }

    if (changes.showDislikes && changes.showDislikes.newValue === false) {
      clearExistingCount();
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

    injectInstantStyles();
    applyVideoAdjustments();

    
    window.dispatchEvent(new CustomEvent('YTPLUS_SETTINGS_UPDATED', { detail: settingsState }));
  });
}

function getVideoId() {
  return utils.getVideoIdFromLocation(window.location);
}

async function fetchDislikesRaw(videoId, retries = 2, delay = 1000) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(`${API_URL}?videoId=${videoId}`);

      if (response.status === 503 && i < retries) {
        
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return typeof data.dislikes === 'number' ? data.dislikes : null;
    } catch (err) {
      if (i === retries) throw err;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
}

async function fetchDislikes(videoId) {
  const now = Date.now();

  
  for (const [key, val] of dislikeCache.entries()) {
    if (val.expiresAt <= now) dislikeCache.delete(key);
  }

  const cached = dislikeCache.get(videoId);
  if (cached && cached.expiresAt > now) return cached.value;

  if (inFlightRequests.has(videoId)) return inFlightRequests.get(videoId);

  const request = (async () => {
    try {
      const dislikes = await fetchDislikesRaw(videoId);
      if (dislikes !== null) {
        dislikeCache.set(videoId, { value: dislikes, expiresAt: now + CACHE_TTL_MS });
      }
      return dislikes;
    } catch (err) {
      log('error', 'Fetch error:', err);
      return null;
    } finally {
      inFlightRequests.delete(videoId);
    }
  })();

  inFlightRequests.set(videoId, request);
  return request;
}

function findDislikeButtonContainer() {
  const isShorts = window.location.pathname.startsWith('/shorts/');
  let root = document;

  if (isShorts) {
    const active = document.querySelector('ytd-reel-video-renderer[is-active]');
    if (active) root = active;
  }

  const watchRoot = document.querySelector('ytd-watch-flexy');
  
  const metadata = document.querySelector('ytd-watch-metadata');

  for (const sel of selectors.dislikeContainers) {
    const candidates = root.querySelectorAll(sel);
    for (const el of candidates) {
      if (!el || !el.isConnected) continue;
      if (el.closest('ytd-comment-thread-renderer') || el.closest('#comments')) continue;

      
      if (!isShorts && watchRoot && !watchRoot.contains(el)) continue;

      if (el.getClientRects().length === 0) continue;

      const innerButton = el.querySelector('button');
      if (innerButton) {
        
        
        if (isShorts) {
          const wrapper = el.querySelector('a.yt-simple-endpoint');
          if (wrapper) return wrapper;
        }
        return innerButton;
      }

      return el;
    }
  }
  return null;
}

function clearExistingCount() {
  document.querySelectorAll('.ydc-dislike-count, #ytplus-dislike-shadow, .ytplus-shorts-dislike-count').forEach(el => el.remove());
  
  document.querySelectorAll('[data-original-text]').forEach(el => {
    el.textContent = el.dataset.originalText;
    el.classList.remove('ytplus-shorts-dislike-label');
    delete el.dataset.originalText;
  });
}

const shadowRoots = new WeakMap();

function renderBadgeText(text) {
  const container = findDislikeButtonContainer();
  if (!container) return false;

  
  if (window.location.pathname.startsWith('/shorts/')) {
    let badge = container.querySelector('.ytplus-shorts-dislike-count');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ytplus-shorts-dislike-count ytplus-shorts-dislike-label';
      container.appendChild(badge);
    }
    badge.textContent = text;
    
    container.querySelectorAll('#ytplus-dislike-shadow').forEach(e => e.remove());
    return true;
  }

  let shadowHost = container.querySelector('#ytplus-dislike-shadow');
  if (!shadowHost) {
    shadowHost = document.createElement('div');
    shadowHost.id = 'ytplus-dislike-shadow';
    container.appendChild(shadowHost);

    const shadow = shadowHost.attachShadow({ mode: 'closed' });
    shadowRoots.set(shadowHost, shadow);

    const badge = document.createElement('span');
    badge.id = 'badge';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-live', 'polite');
    badge.style.fontSize = 'inherit';
    badge.style.fontWeight = '500';
    badge.style.color = 'var(--yt-spec-text-secondary)';
    shadow.appendChild(badge);
  }

  const shadow = shadowRoots.get(shadowHost);
  if (shadow) {
    const badge = shadow.getElementById('badge');
    if (badge) {
      badge.textContent = text;
      badge.setAttribute('aria-label', `Dislike count ${text}`);
    }
  }
  return true;
}

function scheduleRenderBadge(text) {
  if (state.renderScheduled) return;
  state.renderScheduled = true;
  requestAnimationFrame(() => {
    state.renderScheduled = false;
    renderBadgeText(text);
  });
}

async function onVideoChange(videoId) {
  if (!videoId) {
    state.currentVideoId = null;
    state.currentDislikes = null;
    return;
  }

  
  if (settingsState.showDislikes) {
    if (videoId === state.currentVideoId && state.currentDislikes !== null) {
      scheduleRenderBadge(utils.formatNumber(state.currentDislikes));
    } else {
      state.currentVideoId = videoId;
      state.currentDislikes = null;

      
      if (settingsState.showLoadingState) {
        scheduleRenderBadge('...');
      }

      log('info', 'Video changed to (dislikes):', videoId);

      fetchDislikes(videoId).then(dislikes => {
        if (videoId !== state.currentVideoId) return;
        if (dislikes === null) {
          if (settingsState.showRetryState) scheduleRenderBadge('retry');
          else clearExistingCount();
          return;
        }
        state.currentDislikes = dislikes;
        scheduleRenderBadge(utils.formatNumber(dislikes));
      });
    }
  }

  
  try {
    
    setTimeout(async () => {
      const currentId = getVideoId();
      if (videoId !== currentId) return;
      const meta = await ytPlusGetVideoMetadata();
      if (meta && meta.qualities && meta.qualities.length > 0) {
        pageActiveMetadata = meta;
      }
    }, 1200); 
  } catch (err) {
    pageActiveMetadata = null;
  }
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
  }

  // Always run these on any navigation (including non-video pages like /results)
  applyVideoAdjustments();
  injectInstantStyles();
  sweepShorts();
}


function ytPlusGetVideoMetadata(retries = 3) {
  return new Promise((resolve) => {
    let attempt = 0;

    const executeFetch = () => {
      const timeout = setTimeout(() => {
        window.removeEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
        if (attempt < retries) {
          attempt++;
          setTimeout(executeFetch, 400); 
        } else {
          resolve(null);
        }
      }, 1500);

      const onMetadataResponse = (e) => {
        clearTimeout(timeout);
        window.removeEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
        if (e.detail) {
          resolve(e.detail);
        } else if (attempt < retries) {
          
          attempt++;
          setTimeout(executeFetch, 400);
        } else {
          resolve(null);
        }
      };

      window.addEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
      window.dispatchEvent(new CustomEvent('YTPLUS_REQUEST_METADATA_INTERNAL'));
    };

    executeFetch();
  });
}

function handleDislikeInteraction(e) {
  const container = e.target.closest(selectors.dislikeContainers.join(','));
  if (!container || state.currentDislikes === null) return;

  const button = container.tagName === 'BUTTON' ? container : container.querySelector('button');
  if (!button) return;

  const isPressed = button.getAttribute('aria-pressed') === 'true';

  if (isPressed) {
    state.currentDislikes--;
  } else {
    state.currentDislikes++;
  }
  scheduleRenderBadge(utils.formatNumber(state.currentDislikes));
}

document.addEventListener('click', handleDislikeInteraction, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'YTPLUS_GET_METADATA') {
    ytPlusGetVideoMetadata().then(sendResponse);
    return true; 
  }
});

const CONTENT_TEXT = {
  en: {
    preparing: 'Preparing download...',
    downloading: 'Downloading {quality}...',
    serverError: 'Server Error',
    notAvailable: 'Download not available',
    dropToDownload: 'Drop to Download',
    dropToCancel: 'Cancel',
    dragSubtext: 'Video • Shorts • Playlist',
    frameCaptured: 'Screenshot captured',
    screenshotTitle: 'YouTube Screenshot'
  },
  ar: {
    preparing: 'جاري التحضير للتحميل...',
    downloading: 'جاري تحميل {quality}...',
    serverError: 'خطأ في الخادم',
    notAvailable: 'التحميل غير متاح',
    dropToDownload: 'إسقاط للتحميل',
    dropToCancel: 'إلغاء',
    dragSubtext: 'فيديو • شورتس • قائمة تشغيل',
    frameCaptured: 'تم التقاط لقطة الشاشة',
    screenshotTitle: 'لقطة شاشة يوتيوب'
  },
  fr: {
    preparing: 'Préparation du téléchargement...',
    downloading: 'Téléchargement {quality}...',
    serverError: 'Erreur du Serveur',
    notAvailable: 'Téléchargement non disponible',
    dropToDownload: 'Déposer pour télécharger',
    dropToCancel: 'Annuler',
    dragSubtext: 'Vidéo • Shorts • Playlist',
    frameCaptured: 'Capture d\'écran effectuée',
    screenshotTitle: 'Capture d\'écran YouTube'
  }
};

function getLocalText(key, replacements = {}) {
  const lang = settingsState.language === 'auto' ? (navigator.language.split('-')[0] || 'en') : settingsState.language;
  const textMap = CONTENT_TEXT[lang] || CONTENT_TEXT.en;
  let text = textMap[key] || CONTENT_TEXT.en[key] || key;

  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

window.YTPlusGetLocalText = getLocalText;

function showToast(message, type = 'info') {
  const existing = document.getElementById('ytplus-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ytplus-toast';

  
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.gap = '12px';

  
  let icon = '';
  if (type === 'success') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  } else if (type === 'screenshot') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
  } else {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>';
  }

  toast.innerHTML = `<div style="display:flex; align-items:center; gap:12px;">${icon}<span>${message}</span></div>`;

  
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 32px;
    background: rgba(28, 28, 28, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #f1f1f1;
    padding: 14px 24px;
    border-radius: 12px;
    z-index: 2147483647;
    font-family: "YouTube Sans", Roboto, Arial, sans-serif;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
    pointer-events: none;
    direction: ltr !important;
  `;

  
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes ytplus-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: ytplus-spin 0.8s linear infinite; }
  `;
  document.head.appendChild(styleSheet);

  document.body.appendChild(toast);

  
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-20px)';

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      toast.remove();
      styleSheet.remove();
    }, 400);
  }, 4000);
}


async function togglePiP() {
  const isShorts = window.location.pathname.startsWith('/shorts/');
  let video;

  if (isShorts) {
    
    video = document.querySelector('ytd-reel-video-renderer[is-active] video') ||
      document.querySelector('ytd-reel-video-renderer[active] video');

    
    if (!video) {
      const allVideos = Array.from(document.querySelectorAll('ytd-reel-video-renderer video, #shorts-container video, ytd-shorts video'));
      video = allVideos.find(v => {
        const rect = v.getBoundingClientRect();
        return rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight;
      });
    }
  } else {
    
    video = document.querySelector('video.html5-main-video') ||
      document.querySelector('#movie_player video') ||
      document.querySelector('video');
  }

  
  if (!video) {
    video = Array.from(document.querySelectorAll('video')).find(v => !v.paused && v.offsetWidth > 0) ||
      document.querySelector('video');
  }

  if (!video) {
    log('warn', 'No video found for PiP');
    return;
  }

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      if (video.disablePictureInPicture) video.disablePictureInPicture = false;
      await video.requestPictureInPicture();
    }
  } catch (err) {
    log('error', 'PiP toggle failed:', err);
  }
}

async function captureScreenshot() {
  const isShorts = window.location.pathname.startsWith('/shorts/');
  let video;
  if (isShorts) {
    video = document.querySelector('ytd-reel-video-renderer[is-active] video') ||
      document.querySelector('ytd-shorts video') ||
      document.querySelector('#shorts-container video');
  } else {
    video = document.querySelector('video.html5-main-video') ||
      document.querySelector('#movie_player video') ||
      document.querySelector('video');
  }

  if (!video || video.videoWidth === 0) return;

  const metaPromise = ytPlusGetVideoMetadata();

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  
  try {
    canvas.toBlob(blob => {
      if (blob && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).catch(() => { });
      }
    });
  } catch (err) {
    console.warn('[Tubeless] Clipboard copy failed');
  }

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;

  
  let title = getLocalText('screenshotTitle');
  try {
    const meta = await metaPromise;
    if (meta && meta.title) {
      title = meta.title;
    } else {
      const titleEl = (isShorts ? document.querySelector('ytd-reel-video-renderer[is-active] #title') : null) ||
        document.querySelector('h1.ytd-watch-metadata') ||
        document.querySelector('#title yt-formatted-string') ||
        document.querySelector('ytd-reel-player-overlay-renderer #title') ||
        document.querySelector('title');
      if (titleEl) {
        title = titleEl.innerText || titleEl.textContent;
      }
    }
  } catch (err) {
    console.warn('[Tubeless] Metadata fetch failed for screenshot title');
  }

  title = title.trim().replace(/[/\\?%*:|"<>]/g, '-');

  const time = Math.floor(video.currentTime);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const timeStr = `${minutes.toString().padStart(2, '0')}-${seconds.toString().padStart(2, '0')}`;

  link.download = `${title} (${timeStr}) (Screenshot) [qalva].png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showScreenshotFeedback();
}

function showScreenshotFeedback() {
  // Play camera sound if enabled
  if (settingsState.screenshotSoundEnabled) {
    try {
      const audio = new Audio(chrome.runtime.getURL('assets/screenshot.mp3'));
      audio.volume = 0.5;
      audio.play();
    } catch (err) {
      console.warn('[Tubeless] Failed to play screenshot sound:', err);
    }
  }

  showToast(getLocalText('frameCaptured'), 'screenshot');
}

// Listen for screenshot events from MAIN world (YoutubePiP.js)
window.addEventListener('YTPLUS_SCREENSHOT_CAPTURED', showScreenshotFeedback);

async function handleHotkeys(e) {
  const activeEl = document.activeElement;
  const isTextInput = (el) => {
    if (!el) return false;
    const tagName = el.tagName;
    const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA';
    const isEditable = el.isContentEditable || el.closest('[contenteditable="true"]');
    const isARIALive = el.getAttribute('role') === 'textbox' || el.getAttribute('role') === 'combobox';

    if (isInput) {
      const type = el.type?.toLowerCase();
      const nonTextTypes = ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'reset', 'submit', 'range', 'color'];
      return !nonTextTypes.includes(type);
    }
    return isEditable || isARIALive;
  };

  if (isTextInput(activeEl)) return;

  const downloadHotkey = (settingsState.downloadHotkey || 'd').toLowerCase();
  const optionsHotkey = (settingsState.optionsHotkey || 'o').toLowerCase();
  const pipHotkey = (settingsState.pipHotkey || 'b').toLowerCase();
  const screenshotHotkey = (settingsState.screenshotHotkey || 'v').toLowerCase();
  const pressedKey = e.key.toLowerCase();

  if (e.code === 'Space') {
    isSpacePressed = true;
  }

  if (pressedKey === optionsHotkey) {
    e.preventDefault();
    e.stopPropagation();
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ action: 'YTPLUS_OPEN_OPTIONS' });
    }
    return;
  }

  if (pressedKey === pipHotkey) {
    e.preventDefault();
    e.stopPropagation();
    togglePiP();
    return;
  }

  if (pressedKey === screenshotHotkey) {
    const isWatch = window.location.pathname.includes('/watch');
    const isShorts = window.location.pathname.startsWith('/shorts/');

    if (isWatch || (isShorts && !settingsState.hideShorts)) {
      e.preventDefault();
      e.stopPropagation();
      await captureScreenshot();
    }
    return;
  }

  if (pressedKey === downloadHotkey) {
    const videoId = getVideoId();
    if (!videoId) return;

    e.preventDefault();
    e.stopPropagation();

    initiateDownload(videoId);
  }
}

/**
 * Universal Download Initiator
 * Can be called by hotkeys, buttons, or drag-drop manager.
 */
async function initiateDownload(videoId, type = null) {
  if (!videoId) return;

  // Ensure settings are loaded before proceeding
  if (!settingsLoaded) await settingsLoadPromise;

  // Determine intended download type. 
  // If no specific type is requested (e.g. from hotkey), or if it's a generic 'video' drop,
  // respect the user's default preference (audio/thumbnail/video).
  let downloadType = type;
  if (!type || type === 'video') {
    if (settingsState.defaultDownloadQuality === 'audio') downloadType = 'audio';
    else if (settingsState.defaultDownloadQuality === 'thumbnail') downloadType = 'thumbnail';
    else downloadType = 'video';
  }

  let metadata = (pageActiveMetadata && pageActiveMetadata.videoId === videoId && pageActiveMetadata.qualities?.length > 0) ? pageActiveMetadata : null;

  // Only attempt to fetch metadata from player if it's the current video
  const currentId = getVideoId();
  if (!metadata && videoId === currentId) {
    if (window.location.pathname.includes('/watch') || window.location.pathname.includes('/shorts/')) {
      showToast(getLocalText('preparing'));
      try {
        metadata = await ytPlusGetVideoMetadata();
      } catch (err) {
        log('error', 'Metadata fetch failed:', err);
      }
    }
  }

  try {
    let qualityValue = 'best';
    let displayLabel = 'Best';

    if (downloadType === 'audio') {
      qualityValue = 'best';
      displayLabel = 'Audio';
    } else if (downloadType === 'thumbnail') {
      qualityValue = 'best';
      displayLabel = 'Thumbnail';
    } else {
      // Video download path
      const targetQuality = settingsState.defaultDownloadQuality || 'best';

      if (metadata && metadata.qualities?.length > 0) {
        // Resolve quality from metadata if available
        const sorted = metadata.qualities.sort((a, b) => {
          const resA = parseInt(a.label) || 0;
          const resB = parseInt(b.label) || 0;
          return resB - resA;
        });

        let best = sorted[0];

        if (targetQuality !== 'best') {
          const targetRes = parseInt(targetQuality);
          const match = sorted.find(q => (parseInt(q.label) || 0) <= targetRes);
          if (match) best = match;
        }

        displayLabel = best.label;
        const qMatch = displayLabel.match(/(\d+)/);
        qualityValue = qMatch ? qMatch[1] : 'best';
      } else {
        // Fallback for external links or if metadata fetch failed
        qualityValue = targetQuality === 'best' ? 'best' : targetQuality;
        displayLabel = qualityValue === 'best' ? 'Best' : qualityValue + 'p';
      }
    }

    const request = {
      v: videoId,
      quality: qualityValue,
      type: downloadType
    };

    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ action: 'YTPLUS_START_DOWNLOAD', payload: request }, response => {
        if (chrome.runtime?.lastError) {
          showToast(getLocalText('serverError'), 'error');
          return;
        }
        if (response && response.success) {
          const finalLabel = displayLabel.replace('2160p', '4K').replace('1440p', '2K');
          showToast(getLocalText('downloading', { quality: finalLabel }), 'success');
        } else {
          showToast(getLocalText('serverError'), 'error');
        }
      });
    } else {
      showToast(getLocalText('serverError'), 'error');
    }
  } catch (err) {
    console.error('[Tubeless] Download initiation failed:', err);
    showToast(getLocalText('serverError'), 'error');
  }
}

// Expose to other scripts in the same world
window.YTPlusInitiateDownload = initiateDownload;

document.addEventListener('keydown', handleHotkeys, true);
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') isSpacePressed = false;
}, true);
window.addEventListener('blur', () => { isSpacePressed = false; });

function startNavigationWatchers() {
  document.addEventListener('yt-navigate-finish', handleNavigationChange, true);
  window.addEventListener('yt-page-data-updated', handleNavigationChange, true);
  window.addEventListener('popstate', handleNavigationChange);

  // High-frequency detection for Shorts transitions
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

  // Start observing the shorts container if it exists, or the body for dynamic reels
  const observeShorts = () => {
    const container = document.querySelector('ytd-shorts, #shorts-container, ytd-reel-video-renderer');
    if (container) {
      shortsObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['is-active']
      });
      return true;
    }
    return false;
  };

  if (!observeShorts()) {
    const setupRetry = setInterval(() => {
      if (observeShorts()) clearInterval(setupRetry);
    }, 2000);
  }

  setInterval(handleNavigationChange, NAV_FALLBACK_INTERVAL_MS);
}

function startContinuousInsertion() {
  setInterval(() => {
    applyVideoAdjustments();
    // Safety net: re-inject styles if YouTube cleared them
    if (!document.getElementById('ytd-enhanced-styles-internal')) {
      injectInstantStyles();
    }
    if (!settingsState.showDislikes) return;

    // Show current count if available, otherwise show placeholder if enabled
    const text = state.currentDislikes !== null
      ? utils.formatNumber(state.currentDislikes)
      : (settingsState.showLoadingState ? '...' : null);

    if (text) {
      scheduleRenderBadge(text);
    }
  }, INSERT_RETRY_INTERVAL_MS);
}

function syncPlaybackSpeed(video) {
  if (!video) return;

  // Extension priority: Only enforce the extension's preferred speed.
  // We no longer listen for 'ratechange' events from the native player
  // to avoid 'ghost' updates and logical loops.

  // Allow native 2x speed-up when Space is held
  if (isSpacePressed && Math.abs(video.playbackRate - 2.0) < 0.01) {
    return;
  }

  if (Math.abs(video.playbackRate - settingsState.playbackSpeed) > 0.01) {
    video.playbackRate = settingsState.playbackSpeed;
  }

  // We mark it as attached just to maintain consistency with other logic,
  // but we don't add a listener anymore.
  video.dataset.ytPlusSyncAttached = 'true';
}




function applyProductivityFilters() {
  // Now handled by injectInstantStyles via CSS for maximum performance
  injectInstantStyles();
}

// ---------------------------------------------------------------------------
//  MutationObserver — watches full document for YouTube DOM changes.
//  Uses ID-prefix filter to skip mutations caused by our own elements.
//  Debounced to prevent excessive re-processing.
// ---------------------------------------------------------------------------
function _isOwnNode(node) {
  if (node.nodeType !== 1) return true; // skip text nodes
  const id = node.id;
  return id && (id.startsWith('ytplus-') || id.startsWith('ytd-enhanced') || id === 'ytplus-toast');
}

function initSafeAdBlock() {
  applyProductivityFilters();
  applyVideoAdjustments();
  sweepShorts();

  const debouncedHandler = utils.debounce(() => {
    applyProductivityFilters();
    applyVideoAdjustments();
    sweepShorts();
    injectInstantStyles();
  }, 150);

  const adObserver = new MutationObserver((mutations) => {
    // Check if any mutation involves non-extension DOM changes
    const isRelevant = mutations.some(m => {
      for (const node of m.addedNodes) {
        if (!_isOwnNode(node)) return true;
      }
      for (const node of m.removedNodes) {
        if (!_isOwnNode(node)) return true;
      }
      return false;
    });

    if (isRelevant) debouncedHandler();
  });

  const target = document.body || document.documentElement;
  adObserver.observe(target, { childList: true, subtree: true });
}

function sweepShorts() {
  const isSearchPage = window.location.pathname === '/results' || window.location.search.includes('search_query=');
  const shouldHide = settingsState.hideShorts || (settingsState.hideShortsSearch && isSearchPage);

  if (!shouldHide) {
    document.querySelectorAll('ytd-tab-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, grid-shelf-view-model').forEach(el => {
      const text = el.textContent.trim();
      if (text.includes('Shorts') && el.style.display === 'none') {
        el.style.display = '';
      }
    });
    return;
  }

  // Look for tabs, guide entries, and view models by text
  document.querySelectorAll('ytd-tab-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, grid-shelf-view-model').forEach(el => {
    // For tabs and guide entries, check exact text
    const text = el.textContent.trim();
    if (el.tagName !== 'GRID-SHELF-VIEW-MODEL') {
      if (text === 'Shorts') el.style.display = 'none';
    } else {
      // For grid-shelf-view-model, check if it contains "Shorts" in its header/title
      const header = el.querySelector('#title, .title, [role="heading"]');
      if (header && header.textContent.includes('Shorts')) {
        el.style.display = 'none';
      } else if (text.startsWith('Shorts')) {
        // Fallback for some layouts
        el.style.display = 'none';
      }
    }
  });
}




function liftBlackout() {
  document.documentElement.classList.add('ytd-shell-ready');
  const blackout = document.getElementById('ytd-initial-render-styles');
  if (blackout) blackout.remove();
}


function injectInstantStyles() {
  const styleId = 'ytd-enhanced-styles-internal';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  const styles = [
    '[class*="free-preview-countdown"] { display: none !important; visibility: hidden !important; }',
    '#ytplus-dislike-shadow { display: inline-flex !important; align-items: center !important; vertical-align: middle !important; margin-left: 6px !important; margin-right: 4px !important; min-width: max-content !important; }',
    'ytd-watch-flexy[fullscreen] #ytplus-dislike-shadow, ytd-watch-flexy[fullscreen] .ydc-dislike-count { display: none !important; }',
    'button:has(#ytplus-dislike-shadow), [role="button"]:has(#ytplus-dislike-shadow) { width: auto !important; min-width: unset !important; padding-right: 8px !important; overflow: visible !important; }',
    'ytd-watch-metadata #top-level-buttons-computed > * { display: inline-flex !important; visibility: visible !important; }',
    'ytd-watch-metadata ytd-download-button-renderer { display: inline-flex !important; visibility: visible !important; }'
  ];

  if (settingsState.showDislikes) {
    styles.push(`
      .ytplus-shorts-dislike-label {
        font-family: Roboto, Arial, sans-serif !important;
        font-size: 12px !important;
        line-height: 18px !important;
        font-weight: 400 !important;
        text-align: center !important;
        color: rgb(241, 241, 241) !important;
        margin: 0px !important;
        padding: 0px !important;
        height: 18px !important;
        display: block !important;
        width: 100% !important;
        overflow-wrap: anywhere !important;
        white-space: pre !important;
        pointer-events: auto !important;
        background: transparent !important;
      }
    `);
  }

  // Productivity Hiding Logic
  const hideIf = (condition, selectorsList) => {
    if (condition) {
      styles.push(...selectorsList.map(s => `${s} { display: none !important; visibility: hidden !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }`));
    }
  };

  hideIf(settingsState.hideShorts, selectors.productivityTargets.shorts);
  hideIf(settingsState.hideShortsSearch, selectors.productivityTargets.searchShorts);
  hideIf(settingsState.hideHomeFeed, selectors.productivityTargets.homeFeed);
  hideIf(settingsState.hideComments, selectors.productivityTargets.comments);
  hideIf(settingsState.hideSidebarRecommendations, selectors.productivityTargets.sidebarRecommendations);
  hideIf(settingsState.hideEndscreenRecommendations, selectors.productivityTargets.endscreenRecommendations);
  hideIf(settingsState.adBlockEnabled, selectors.productivityTargets.premiumPromotions);

  styleEl.textContent = styles.join('\n');
}

function applyProductivityFilters() {
  injectInstantStyles();
}



function applyVideoAdjustments() {
  const videos = document.querySelectorAll(selectors.productivityTargets.player);
  if (videos.length > 0) {
    videos.forEach(video => {
      syncPlaybackSpeed(video);
      const isShorts = window.location.pathname.startsWith('/shorts/');
      const shouldLoop = isShorts ? settingsState.autoReplayShorts : settingsState.autoReplayVideos;
      if (video.loop !== shouldLoop) {
        video.loop = shouldLoop;
      }
    });
  }

  if (settingsState.hideShorts && window.location.pathname.startsWith('/shorts/')) {
    const shortsVideos = document.querySelectorAll('video');
    shortsVideos.forEach(v => {
      if (!v.paused) v.pause();
    });
  }

  if (settingsState.smartQualityLock !== 'auto') {
    window.dispatchEvent(new CustomEvent('YTPLUS_APPLY_QUALITY_LOCK', {
      detail: { targetQuality: settingsState.smartQualityLock }
    }));
  }

  if (settingsState.forceCinemaMode) {
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    if (watchFlexy && !watchFlexy.hasAttribute('theater')) {
      const btn = document.querySelector(selectors.productivityTargets.cinemaButton);
      if (btn) btn.click();
    }
  }

}

(function keepWorkerAlive() {
  if (!runtime || typeof runtime.connect !== 'function') return;
  let port = null;
  let reconnectTimer = null;
  function connect() {
    if (port) {
      try { port.disconnect(); } catch (_) { }
    }
    try {
      port = runtime.connect({ name: 'keepAlive' });
      port.onDisconnect.addListener(() => {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connect, 1000);
      });
      port.postMessage({ type: 'ping' });
    } catch (_) {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 5000);
    }
  }
  connect();
  setInterval(() => {
    if (!port) return;
    try {
      port.postMessage({ type: 'ping' });
    } catch (_) {
      connect();
    }
  }, 20000);
})();

// (Note: Request blocking now primarily handled by tracker-blocker.js in MAIN world for maximum efficacy)





async function init() {
  try {
    // 1. Initial Styles (defaults)
    injectInstantStyles();

    // 2. Load Real Settings
    await loadSettings();

    // 3. Finalize Styles
    injectInstantStyles();
    applyProductivityFilters();
  } catch (err) {
    log('error', 'Init failed:', err);
  } finally {
    liftBlackout();
  }

  // 4. Start Background Processes
  initSafeAdBlock();
  watchSettingsChanges();
  startNavigationWatchers();
  startContinuousInsertion();

  const initialId = getVideoId();
  if (initialId) {
    lastVideoId = initialId;
    void onVideoChange(initialId);
  }
  log('info', 'Tubeless initialized (proactive mode)');
}

void init();
