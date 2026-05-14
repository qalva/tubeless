
console.log('[Tubeless] Loading AdBlock logic...');
try {
  importScripts('../../adblock/background.js');
  console.log('[Tubeless] AdBlock logic loaded successfully.');
} catch (e) {
  console.error('[Tubeless] Failed to load AdBlock logic:', e);
}


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
  loopVideo: false,
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

async function updateAdBlockRules(enabled) {
  try {
    
    await chrome.storage.local.set({ ads: enabled });
    console.log(`[Tubeless] Ad-blocking (new) ${enabled ? 'enabled' : 'disabled'}`);
  } catch (err) {
    console.warn('[Tubeless] Failed to update ad-blocking state:', err);
  }
}

chrome.runtime.onInstalled.addListener(async (details) => {
  try {
    const existing = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    const merged = { ...DEFAULT_SETTINGS, ...existing };
    
    
    merged.playbackSpeed = 1;
    
    await chrome.storage.local.set(merged);
    
    
    await updateAdBlockRules(merged.adBlockEnabled);
    
    console.log('[Tubeless] AdBlock sync completed');
    console.log('[Tubeless] Default settings initialized (Speed reset to 1x)');

    
    const allTabs = await chrome.tabs.query({});
    for (const tab of allTabs) {
      updateActionState(tab.id, tab.url);
      if (tab.url?.includes('youtube.com')) {
        chrome.tabs.reload(tab.id);
      }
    }
    console.log(`[Tubeless] Initialized ${allTabs.length} tabs and reloaded YouTube tabs`);
  } catch (err) {
    console.warn('[Tubeless] Could not initialize defaults:', err?.message || err);
  }
});


chrome.runtime.onStartup.addListener(async () => {
  try {
    await chrome.storage.local.set({ playbackSpeed: 1 });
    console.log('[Tubeless] Playback speed reset to 1x on browser startup');
  } catch (err) {
    console.warn('[Tubeless] Failed to reset playback speed on startup:', err);
  }
});


chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') {
    console.log('[Tubeless] Keep-alive port connected');
    port.onMessage.addListener((msg) => {
      if (msg.type === 'ping') port.postMessage({ type: 'pong' });
    });
    port.onDisconnect.addListener(() => {
      console.log('[Tubeless] Keep-alive port disconnected (will reconnect from content script)');
    });
  }
});


function updateActionState(tabId, url) {
  
  const isYouTube = url && (
    url.startsWith('https://www.youtube.com/') || 
    url.startsWith('https://m.youtube.com/') ||
    url.startsWith('https://youtube.com/')
  );

  if (isYouTube) {
    chrome.action.enable(tabId);
    console.log(`[Tubeless] Extension ENABLED for tab ${tabId} (${url})`);
  } else {
    chrome.action.disable(tabId);
    console.log(`[Tubeless] Extension DISABLED for tab ${tabId} (Not a YouTube page)`);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' || changeInfo.url) {
    updateActionState(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    updateActionState(activeInfo.tabId, tab.url);
  } catch (err) {
    
  }
});



chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.adBlockEnabled) {
    updateAdBlockRules(changes.adBlockEnabled.newValue);
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'YTPLUS_START_DOWNLOAD') {
    handleDownloadRequest(request.payload)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; 
  }
  
  if (request.action === 'YTPLUS_OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
  }
});

async function handleDownloadRequest(payload) {
  const { v: videoId, list: listId, quality, type } = payload;
  
  
  let cookies = [];
  try {
    cookies = await chrome.cookies.getAll({ domain: '.youtube.com' });
  } catch (err) {
    console.warn('[Tubeless] Could not get cookies for download:', err);
  }

  const downloadUrl = 'http://localhost:8791/';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); 

  try {
    const response = await fetch(downloadUrl, {
      method: 'POST',
      mode: 'cors',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        v: videoId,
        list: listId,
        quality: quality,
        type: type,
        cookies: cookies
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json().catch(() => ({ status: 'ok' }));
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Server request timed out');
    }
    throw err;
  }
}

console.log('[Tubeless] Background service worker started (port keep-alive active)');