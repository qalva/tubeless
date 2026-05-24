/*
 * Tubeless — Dislike restoration engine
 *
 * Fetches dislikes from RYD API, caches them, renders badges.
 */

const API_URL = 'https://returnyoutubedislikeapi.com/votes';
const CACHE_TTL_MS = 10 * 60 * 1000;

const state = {
  currentVideoId: null,
  currentDislikes: null,
  renderScheduled: false
};

const dislikeCache = new Map();
const inFlightRequests = new Map();
const shadowRoots = new WeakMap();

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

  // Expire old cache entries
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
      _log('error', 'Fetch error:', err);
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

      _log('info', 'Video changed to (dislikes):', videoId);

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
