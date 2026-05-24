/*
 * Tubeless — CSS selectors for YouTube DOM targeting
 *
 * Strategy (in order of preference):
 *   1. ID selectors — most stable
 *   2. Web component tags — stable
 *   3. Data attributes — stable
 *   4. ARIA attributes — stable
 *   5. Wildcard class selectors — fallback only
 */

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
