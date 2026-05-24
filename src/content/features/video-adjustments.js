/*
 * Tubeless — Video adjustments: playback speed, auto-replay, cinema mode, quality lock
 */

let isSpacePressed = false;

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') isSpacePressed = false;
}, true);
window.addEventListener('blur', () => { isSpacePressed = false; });

function syncPlaybackSpeed(video) {
  if (!video) return;

  // Allow native 2x speed-up when Space is held
  if (isSpacePressed && Math.abs(video.playbackRate - 2.0) < 0.01) {
    return;
  }

  if (Math.abs(video.playbackRate - settingsState.playbackSpeed) > 0.01) {
    video.playbackRate = settingsState.playbackSpeed;
  }

  video.dataset.ytPlusSyncAttached = 'true';
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
