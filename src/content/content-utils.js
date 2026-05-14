
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

  const api = {
    getVideoIdFromLocation,
    formatNumber
  };

  root.YTPlusUtils = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
