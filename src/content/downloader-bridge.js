
(function () {
  
  window.addEventListener('YTPLUS_REQUEST_METADATA_INTERNAL', () => {
    let videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId) {
      const shortsMatch = window.location.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch) videoId = shortsMatch[1];
    }

    const getReels = () => {
      let r = Array.from(document.querySelectorAll('ytd-reel-video-renderer'));
      if (r.length === 0) {
        const shorts = document.querySelector('ytd-shorts, #shorts-container, ytd-reel-video-renderer');
        if (shorts?.shadowRoot) {
          r = Array.from(shorts.shadowRoot.querySelectorAll('ytd-reel-video-renderer'));
        }
      }
      
      if (r.length === 0) {
        const manager = document.querySelector('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]');
        if (manager) {
          r = Array.from(manager.querySelectorAll('ytd-reel-item-renderer, ytd-reel-video-renderer'));
        }
      }
      return r;
    };

    const reels = getReels();
    
    const activeReel = reels.find(r => r.hasAttribute('is-active'));
    
    let pr = null;
    const isMatch = (p, id) => {
      if (!p || !id) return false;
      const pId = p.videoDetails?.videoId || p.videoId || p.v;
      return pId === id;
    };

    
    if (activeReel && videoId) {
      const checkPr = activeReel.playerResponse || 
                      activeReel.data?.playerResponse || 
                      activeReel.__data?.playerResponse || 
                      activeReel.videoData?.playerResponse ||
                      activeReel.__data?.videoData?.playerResponse ||
                      activeReel.activePlayerResponse;

      if (isMatch(checkPr, videoId)) {
        pr = checkPr;
      } else {
        
        const innerPlayer = activeReel.querySelector('ytd-player') || (activeReel.shadowRoot?.querySelector('ytd-player'));
        if (innerPlayer) {
          const innerPr = innerPlayer.playerResponse || innerPlayer.getPlayerResponse?.() || innerPlayer.data?.playerResponse;
          if (isMatch(innerPr, videoId)) pr = innerPr;
        }
      }
    }

    
    if (!pr && videoId) {
      for (const r of reels) {
        const checkPr = r.playerResponse || 
                        r.data?.playerResponse || 
                        r.__data?.playerResponse || 
                        r.activePlayerResponse ||
                        r.videoData?.playerResponse ||
                        r.__data?.videoData?.playerResponse ||
                        r.playerData?.playerResponse;

        if (isMatch(checkPr, videoId)) {
          pr = checkPr;
          break;
        }
      }
    }
    
    
    if (!pr && videoId) {
      const allPlayers = Array.from(document.querySelectorAll('ytd-player, #movie_player, .html5-video-player'));
      for (const p of allPlayers) {
        const checkPr = (typeof p.getPlayerResponse === 'function' ? p.getPlayerResponse() : p.playerResponse) || p.data?.playerResponse;
        if (isMatch(checkPr, videoId)) {
          pr = checkPr;
          break;
        }
      }
    }
    
    
    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!pr && moviePlayer?.getPlayerResponse) {
      const mpr = moviePlayer.getPlayerResponse();
      if (isMatch(mpr, videoId)) pr = mpr;
    }

    if (!pr && isMatch(window.ytInitialPlayerResponse, videoId)) {
      pr = window.ytInitialPlayerResponse;
    }

    
    if (!pr && window.ytInitialData?.playerResponse) {
      if (isMatch(window.ytInitialData.playerResponse, videoId)) {
        pr = window.ytInitialData.playerResponse;
      }
    }
    
    if (!pr) {
      
      window.dispatchEvent(new CustomEvent('YTPLUS_RESPONSE_METADATA_INTERNAL', { detail: null }));
      return;
    }
    
    const metadata = {
      title: pr?.videoDetails?.title || document.title.replace(' - YouTube', ''),
      videoId: videoId || pr?.videoDetails?.videoId,
      qualities: []
    };
    const streamingData = pr?.streamingData;
    if (streamingData) {
      const allFormats = [...(streamingData.adaptiveFormats || []), ...(streamingData.formats || [])];
      const qualityMap = new Map();

      allFormats.forEach(f => {
        const rawLabel = f.qualityLabel;
        if (!rawLabel) return;

        
        const resMatch = rawLabel.match(/\d+p/);
        const res = resMatch ? resMatch[0] : rawLabel;

        
        const fps = parseInt(f.fps) || 0;
        const is60 = fps >= 50 || /p\s?(50|60)/.test(rawLabel);

        
        const colorInfo = f.colorInfo;
        const isHDR = (colorInfo && (
          colorInfo.transferCharacteristics?.includes('SMPTEST2084') ||
          colorInfo.transferCharacteristics?.includes('ARIB_STD_B67') ||
          /HDR/i.test(rawLabel)
        )) || false;

        
        const height = parseInt(f.height) || parseInt(res) || 0;
        const score = height + (isHDR ? 10000 : 0) + (is60 ? 5000 : 0);

        const existing = qualityMap.get(res);

        if (!existing || score > existing.score) {
          qualityMap.set(res, {
            label: rawLabel,
            res: res,
            is60: is60,
            isHDR: isHDR,
            score: score,
            itag: f.itag,
            mimeType: f.mimeType,
            width: f.width,
            height: f.height
          });
        }
      });
      metadata.qualities = Array.from(qualityMap.values());
    }

    
    metadata.subtitles = [];
    const captions = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (captions && Array.isArray(captions)) {
      metadata.subtitles = captions.map(track => ({
        label: track.name?.simpleText || track.languageCode,
        lang: track.languageCode,
        isAuto: track.kind === 'asr'
      }));
    }

    window.dispatchEvent(new CustomEvent('YTPLUS_RESPONSE_METADATA_INTERNAL', { detail: metadata }));
  });

  
  window.addEventListener('YTPLUS_APPLY_QUALITY_LOCK', (e) => {
    const target = e.detail.targetQuality; 
    if (!target || target === 'auto') return;

    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!moviePlayer || typeof moviePlayer.setPlaybackQualityRange !== 'function') return;

    const available = moviePlayer.getAvailableQualityLevels(); 
    if (!available || available.length === 0) return;

    
    const qualityMap = {
      '4320p': 'highres',
      '2160p': 'hd2160',
      '1440p': 'hd1440',
      '1080p': 'hd1080',
      '720p': 'hd720',
      '480p': 'large',
      '360p': 'medium',
      '240p': 'small',
      '144p': 'tiny'
    };

    const qualityOrder = ['4320p', '2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
    
    
    const targetIndex = qualityOrder.indexOf(target);
    if (targetIndex === -1) return;

    
    for (let i = targetIndex; i < qualityOrder.length; i++) {
      const qLabel = qualityOrder[i];
      const internalQ = qualityMap[qLabel];
      if (available.includes(internalQ)) {
        
        const current = moviePlayer.getPlaybackQuality();
        if (current !== internalQ) {
          moviePlayer.setPlaybackQualityRange(internalQ, internalQ);
          moviePlayer.setPlaybackQuality(internalQ);
        }
        break;
      }
    }
  });
})();
