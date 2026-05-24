/*
 * Tubeless — Style injection, productivity filtering via CSS, self-mutation protection
 */

const AD_SWEEP_THROTTLE_MS = 1000;

// Pre-emptive blackout during initial render
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

function liftBlackout() {
  document.documentElement.classList.add('ytd-shell-ready');
  const blackout = document.getElementById('ytd-initial-render-styles');
  if (blackout) blackout.remove();
}

function _isOwnNode(node) {
  if (node.nodeType !== 1) return true;
  const id = node.id;
  return id && (id.startsWith('ytplus-') || id.startsWith('ytd-enhanced') || id === 'ytplus-toast');
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

  document.querySelectorAll('ytd-tab-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, grid-shelf-view-model').forEach(el => {
    const text = el.textContent.trim();
    if (el.tagName !== 'GRID-SHELF-VIEW-MODEL') {
      if (text === 'Shorts') el.style.display = 'none';
    } else {
      const header = el.querySelector('#title, .title, [role="heading"]');
      if (header && header.textContent.includes('Shorts')) {
        el.style.display = 'none';
      } else if (text.startsWith('Shorts')) {
        el.style.display = 'none';
      }
    }
  });
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
