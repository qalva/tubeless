/*
 * Tubeless — PiP toggle
 */

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
    _log('warn', 'No video found for PiP');
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
    _log('error', 'PiP toggle failed:', err);
  }
}
