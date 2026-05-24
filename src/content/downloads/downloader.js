/*
 * Tubeless — Download initiation, quality resolution, metadata fetching
 *
 * Universal Download Initiator — can be called by hotkeys, buttons, or drag-drop manager.
 * Exports: initiateDownload(videoId, type) → window.YTPlusInitiateDownload
 */

async function ytPlusGetVideoMetadata(retries = 3) {
  return new Promise((resolve) => {
    let attempt = 0;

    const executeFetch = () => {
      const timeout = setTimeout(() => {
        window.removeEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
        if (attempt < retries) {
          attempt++;
          setTimeout(executeFetch, 400);
        } else {
          resolve(null);
        }
      }, 1500);

      const onMetadataResponse = (e) => {
        clearTimeout(timeout);
        window.removeEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
        if (e.detail) {
          resolve(e.detail);
        } else if (attempt < retries) {
          attempt++;
          setTimeout(executeFetch, 400);
        } else {
          resolve(null);
        }
      };

      window.addEventListener('YTPLUS_RESPONSE_METADATA_INTERNAL', onMetadataResponse);
      window.dispatchEvent(new CustomEvent('YTPLUS_REQUEST_METADATA_INTERNAL'));
    };

    executeFetch();
  });
}

/**
 * Universal Download Initiator
 * Can be called by hotkeys, buttons, or drag-drop manager.
 */
async function initiateDownload(videoId, type = null) {
  if (!videoId) return;

  // Ensure settings are loaded before proceeding
  if (!settingsLoaded) await settingsLoadPromise;

  const isPlaylist = (type === 'playlist');

  let downloadType = type;
  if (!type || type === 'video') {
    if (settingsState.defaultDownloadQuality === 'audio') downloadType = 'audio';
    else if (settingsState.defaultDownloadQuality === 'thumbnail') downloadType = 'thumbnail';
    else downloadType = 'video';
  }

  let metadata = (pageActiveMetadata && pageActiveMetadata.videoId === videoId && pageActiveMetadata.qualities?.length > 0) ? pageActiveMetadata : null;

  // Only attempt to fetch metadata from player if it's the current video
  const currentId = getVideoId();
  if (!isPlaylist && downloadType !== 'playlist' && !metadata && videoId === currentId) {
    if (window.location.pathname.includes('/watch') || window.location.pathname.includes('/shorts/')) {
      showToast(getLocalText('preparing'));
      try {
        metadata = await ytPlusGetVideoMetadata();
      } catch (err) {
        _log('error', 'Metadata fetch failed:', err);
      }
    }
  }

  try {
    let qualityValue = 'best';
    let displayLabel = 'Best';

    if (isPlaylist || downloadType === 'playlist') {
      const targetQuality = settingsState.defaultDownloadQuality || 'best';
      if (targetQuality === 'audio') {
        downloadType = 'audio';
        qualityValue = 'best';
        displayLabel = 'Playlist (Audio)';
      } else if (targetQuality === 'thumbnail') {
        downloadType = 'thumbnail';
        qualityValue = 'best';
        displayLabel = 'Playlist (Images)';
      } else {
        downloadType = 'playlist';
        qualityValue = targetQuality === 'best' ? 'best' : targetQuality;
        displayLabel = qualityValue === 'best' ? 'Playlist (Best)' : `Playlist (${qualityValue}p)`;
      }
    } else if (downloadType === 'audio') {
      qualityValue = 'best';
      displayLabel = 'Audio';
    } else if (downloadType === 'thumbnail') {
      qualityValue = 'best';
      displayLabel = 'Thumbnail';
    } else {
      const targetQuality = settingsState.defaultDownloadQuality || 'best';

      if (metadata && metadata.qualities?.length > 0) {
        const sorted = metadata.qualities.sort((a, b) => {
          const resA = parseInt(a.label) || 0;
          const resB = parseInt(b.label) || 0;
          return resB - resA;
        });

        let best = sorted[0];

        if (targetQuality !== 'best') {
          const targetRes = parseInt(targetQuality);
          const match = sorted.find(q => (parseInt(q.label) || 0) <= targetRes);
          if (match) best = match;
        }

        displayLabel = best.label;
        const qMatch = displayLabel.match(/(\d+)/);
        qualityValue = qMatch ? qMatch[1] : 'best';
      } else {
        qualityValue = targetQuality === 'best' ? 'best' : targetQuality;
        displayLabel = qualityValue === 'best' ? 'Best' : qualityValue + 'p';
      }
    }

    const request = {
      quality: qualityValue,
      type: downloadType
    };

    if (isPlaylist) {
      request.list = videoId;
    } else {
      request.v = videoId;
    }

    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ action: 'YTPLUS_START_DOWNLOAD', payload: request }, response => {
        if (chrome.runtime?.lastError) {
          showToast(getLocalText('serverError'), 'error');
          return;
        }
        if (response && response.success) {
          const finalLabel = displayLabel.replace('2160p', '4K').replace('1440p', '2K');
          showToast(getLocalText('downloading', { quality: finalLabel }), 'success');
        } else {
          showToast(getLocalText('serverError'), 'error');
        }
      });
    } else {
      showToast(getLocalText('serverError'), 'error');
    }
  } catch (err) {
    console.error('[Tubeless] Download initiation failed:', err);
    showToast(getLocalText('serverError'), 'error');
  }
}

// Expose to other scripts in the same world
window.YTPlusInitiateDownload = initiateDownload;
