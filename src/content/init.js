/*
 * Tubeless — Bootstrap / initialization
 *
 * Orchestrates loading settings, then starts all subsystems.
 */

const runtime = typeof chrome !== 'undefined' && chrome.runtime
  ? chrome.runtime
  : (typeof browser !== 'undefined' && browser.runtime ? browser.runtime : null);

const utils = (typeof window !== 'undefined' && window.YTPlusUtils) || {
  getVideoIdFromLocation: () => null,
  formatNumber: value => String(value),
  waitForElement: () => Promise.resolve(null),
  debounce: (fn) => fn
};

// Make utils globally available
window.YTPlusUtils = window.YTPlusUtils || utils;

// Re-export _log for modules that need it
function _log(level, ...args) {
  if (!settingsState.debug && level !== 'error') return;
  const logger = level === 'error' ? console.error : (level === 'warn' ? console.warn : console.log);
  logger('[Tubeless]', ...args);
}

// Make _log available to all modules
window._log = _log;

// Keep-alive IIFE
(function keepWorkerAlive() {
  if (!runtime || typeof runtime.connect !== 'function') return;
  let port = null;
  let reconnectTimer = null;
  function connect() {
    if (reconnectTimer) clearTimeout(reconnectTimer);
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

// Metadata listener for content script ↔ bridge communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'YTPLUS_GET_METADATA') {
    ytPlusGetVideoMetadata().then(sendResponse);
    return true;
  }
});

async function init() {
  try {
    // 1. Initial Styles (defaults)
    injectInstantStyles();

    // 2. Load Real Settings
    await loadSettings();

    // 3. Register hotkey listener now that settings are loaded
    document.addEventListener('keydown', handleHotkeys, true);

    // 4. Finalize Styles (productivity filters + video adjustments)
    injectInstantStyles();
    applyProductivityFilters();
    applyVideoAdjustments();
  } catch (err) {
    _log('error', 'Init failed:', err);
  } finally {
    liftBlackout();
  }

  // 5. Start Background Processes
  initSafeAdBlock();
  watchSettingsChanges();
  startNavigationWatchers();
  startContinuousInsertion();

  const initialId = getVideoId();
  if (initialId) {
    lastVideoId = initialId;
    void onVideoChange(initialId);
  }
  _log('info', 'Tubeless initialized (proactive mode)');
}

void init();
