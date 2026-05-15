
(function initYTPlusUtils(root) {
  function getVideoIdFromLocation(locationLike) {
    if (!locationLike) return null;
    const search = locationLike.search || '';
    const pathname = locationLike.pathname || '';

    const params = new URLSearchParams(search);
    const watchId = params.get('v');
    if (watchId) return watchId;

    const shortsMatch = pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

    const embedMatch = pathname.match(/^\/embed\/([^/?#]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    return null;
  }

  function formatNumber(value) {
    if (value == null || Number.isNaN(value)) return 'N/A';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return String(value);
  }

  /**
   * Wait for a DOM element to appear. Returns a Promise that resolves with
   * the element or null on timeout. Uses MutationObserver for efficiency.
   */
  function waitForElement(selector, timeout = 5000, root = document) {
    return new Promise((resolve) => {
      const el = root.querySelector(selector);
      if (el) return resolve(el);

      let settled = false;
      const observer = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el && !settled) {
          settled = true;
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(root.documentElement || root, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        if (!settled) {
          settled = true;
          observer.disconnect();
          resolve(null);
        }
      }, timeout);
    });
  }

  /**
   * Debounce a function: delays invocation until `ms` milliseconds have
   * elapsed since the last call. Trailing-edge by default.
   */
  function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { timer = null; fn.apply(this, args); }, ms);
    };
  }

  const api = {
    getVideoIdFromLocation,
    formatNumber,
    waitForElement,
    debounce
  };

  root.YTPlusUtils = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
