
(function () {
  'use strict';

  
  const UnifiedUrlProcessor = {
    
    process(input) {
      if (!input) return null;
      input = input.trim();

      try {
        const url = new URL(input);
        const host = url.hostname.replace('www.', '');

        if (host === 'youtube.com' || host === 'm.youtube.com') {
          
          const v = url.searchParams.get('v');
          if (v) return { type: 'video', id: v };

          
          const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/);
          if (shortsMatch) return { type: 'video', id: shortsMatch[1] };

          
          const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/);
          if (embedMatch) return { type: 'video', id: embedMatch[1] };

          
          const list = url.searchParams.get('list');
          if (list) return { type: 'playlist', id: list };

        } else if (host === 'youtu.be') {
          
          const id = url.pathname.slice(1).split(/[?#]/)[0];
          if (id) return { type: 'video', id: id };
        }
      } catch (e) {
        
        
        const videoIdMatch = input.match(/(?:v=|shorts\/|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (videoIdMatch) return { type: 'video', id: videoIdMatch[1] };
      }

      return null;
    }
  };

  
  class DragDropManager {
    constructor() {
      this.overlay = null;
      this.dragCounter = 0;
      this.init();
    }

    init() {
      
      document.addEventListener('dragenter', this.handleDragEnter.bind(this), true);
      document.addEventListener('dragover', this.handleDragOver.bind(this), true);
      document.addEventListener('dragleave', this.handleDragLeave.bind(this), true);
      document.addEventListener('drop', this.handleDrop.bind(this), true);
      
      
      window.addEventListener('YTPLUS_SETTINGS_UPDATED', this.updateTranslations.bind(this));
      
      this.injectStyles();
    }

    updateTranslations() {
      if (!this.overlay) return;
      const t = (key) => (typeof window.YTPlusGetLocalText === 'function' ? window.YTPlusGetLocalText(key) : key);
      
      const downloadText = this.overlay.querySelector('#ytplus-download-zone .ytplus-drag-text');
      const downloadSub = this.overlay.querySelector('#ytplus-download-zone .ytplus-drag-subtext');
      const cancelText = this.overlay.querySelector('#ytplus-cancel-zone .ytplus-drag-text');
      
      if (downloadText) downloadText.textContent = t('dropToDownload');
      if (downloadSub) downloadSub.textContent = t('dragSubtext');
      if (cancelText) cancelText.textContent = t('dropToCancel');
    }

    injectStyles() {
      if (document.getElementById('ytplus-drag-drop-styles')) return;

      const style = document.createElement('style');
      style.id = 'ytplus-drag-drop-styles';
      style.textContent = `
        #ytplus-drag-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          font-family: "YouTube Sans", Roboto, Arial, sans-serif;
          visibility: hidden;
        }

        #ytplus-drag-overlay.active {
          opacity: 1;
          visibility: visible;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.4);
        }

        .ytplus-drag-content {
          display: flex;
          gap: 30px;
          align-items: center;
          justify-content: center;
          transform: translateY(30px);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto; /* Allow interaction with buttons */
        }

        #ytplus-drag-overlay.active .ytplus-drag-content {
          transform: translateY(0);
        }

        .ytplus-drag-zone {
          text-align: center;
          background: rgba(28, 28, 28, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 35px 55px;
          border-radius: 50px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 45px rgba(0,0,0,0.5);
          transition: all 0.3s cubic-bezier(0.2, 1, 0.2, 1);
          min-width: 260px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .ytplus-drag-zone::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .ytplus-drag-zone.download-zone {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .ytplus-drag-zone.cancel-zone {
          background: rgba(40, 40, 40, 0.6);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .ytplus-drag-zone.hover {
          transform: scale(1.1) translateY(-10px);
          background: rgba(45, 45, 45, 0.9);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.1);
        }

        .ytplus-drag-zone.download-zone.hover {
          border-color: #ff0000;
          box-shadow: 0 25px 80px rgba(255,0,0,0.2), 0 0 30px rgba(255,0,0,0.1);
        }

        .ytplus-drag-zone.cancel-zone.hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(60, 60, 60, 0.9);
        }

        .ytplus-drag-zone.hover::after {
          opacity: 0.05;
        }

        .ytplus-drag-text {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #fff;
          margin-bottom: 6px;
          transition: transform 0.3s;
        }

        .ytplus-drag-zone.hover .ytplus-drag-text {
          transform: scale(1.02);
        }

        .ytplus-drag-zone.cancel-zone .ytplus-drag-text {
          font-size: 24px;
          opacity: 0.8;
        }

        .ytplus-drag-subtext {
          font-size: 13px;
          opacity: 0.5;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Dark mode adjustments */
        html[dark] #ytplus-drag-overlay {
          background: rgba(0, 0, 0, 0.6);
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }

    createOverlay() {
      if (this.overlay) return;

      const t = (key) => (typeof window.YTPlusGetLocalText === 'function' ? window.YTPlusGetLocalText(key) : key);

      this.overlay = document.createElement('div');
      this.overlay.id = 'ytplus-drag-overlay';
      this.overlay.innerHTML = `
        <div class="ytplus-drag-content">
          <div class="ytplus-drag-zone download-zone" id="ytplus-download-zone">
            <div class="ytplus-drag-text">${t('dropToDownload')}</div>
            <div class="ytplus-drag-subtext">${t('dragSubtext')}</div>
          </div>
          <div class="ytplus-drag-zone cancel-zone" id="ytplus-cancel-zone">
            <div class="ytplus-drag-text">${t('dropToCancel')}</div>
          </div>
        </div>
      `;
      document.body.appendChild(this.overlay);
    }

    handleDragEnter(e) {
      this.dragCounter++;
      if (this.isValidDrag(e)) {
        e.preventDefault();
        this.showOverlay();
      }
    }

    handleDragOver(e) {
      if (this.isValidDrag(e)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        
        const target = e.target.closest('.ytplus-drag-zone');
        document.querySelectorAll('.ytplus-drag-zone').forEach(z => z.classList.remove('hover'));
        if (target) target.classList.add('hover');
      }
    }

    handleDragLeave(e) {
      this.dragCounter--;
      if (this.dragCounter === 0) {
        this.hideOverlay();
      }
    }

    handleDrop(e) {
      this.dragCounter = 0;
      
      const dropZone = e.target.closest('.ytplus-drag-zone');
      const isDownload = dropZone?.id === 'ytplus-download-zone';
      const isCancel = dropZone?.id === 'ytplus-cancel-zone';
      
      this.hideOverlay();
      document.querySelectorAll('.ytplus-drag-zone').forEach(z => z.classList.remove('hover'));

      
      if (!isDownload && !isCancel) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (isCancel) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const data = this.getTransferData(e);
      if (!data) return;

      const result = UnifiedUrlProcessor.process(data);
      if (result) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.YTPlusInitiateDownload === 'function') {
          window.YTPlusInitiateDownload(result.id, result.type);
        } else {
          console.error('[Tubeless] Download function not found on window.');
        }
      }
    }

    isValidDrag(e) {
      const types = e.dataTransfer.types;
      
      return types.includes('text/uri-list') || types.includes('text/plain') || types.includes('Files');
    }

    getTransferData(e) {
      
      const uriList = e.dataTransfer.getData('text/uri-list');
      if (uriList) return uriList.split('\n')[0];

      
      const text = e.dataTransfer.getData('text/plain');
      if (text) return text;

      
      const html = e.dataTransfer.getData('text/html');
      if (html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const link = div.querySelector('a');
        if (link && link.href) return link.href;
      }

      return null;
    }

    showOverlay() {
      this.createOverlay();
      this.overlay.classList.add('active');
    }

    hideOverlay() {
      if (this.overlay) {
        this.overlay.classList.remove('active');
      }
    }
  }

  
  if (!window.YTPlusDragDropInitialized) {
    new DragDropManager();
    window.YTPlusDragDropInitialized = true;
  }

})();
