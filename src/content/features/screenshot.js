/*
 * Tubeless — Screenshot capture and clipboard copy
 */

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

  // Copy to clipboard
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

async function copyFrameToClipboard() {
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

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  try {
    canvas.toBlob(blob => {
      if (blob && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item])
          .then(() => { showCopiedFeedback(); })
          .catch((err) => { console.warn('[Tubeless] Clipboard copy failed:', err); });
      }
    });
  } catch (err) {
    console.warn('[Tubeless] Clipboard copy failed:', err);
  }
}

function showScreenshotFeedback() {
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

function showCopiedFeedback() {
  showToast(getLocalText('frameCopied'), 'none');
}
