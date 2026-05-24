/*
 * Tubeless — Hotkey handler
 *
 * Customizable shortcuts for download, options, PiP, screenshot, Ctrl+C frame copy.
 */

async function handleHotkeys(e) {
  const activeEl = document.activeElement;
  const isTextInput = (el) => {
    if (!el) return false;
    const tagName = el.tagName;
    const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA';
    const isEditable = el.isContentEditable || el.closest('[contenteditable="true"]');
    const isARIALive = el.getAttribute('role') === 'textbox' || el.getAttribute('role') === 'combobox';

    if (isInput) {
      const type = el.type?.toLowerCase();
      const nonTextTypes = ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'reset', 'submit', 'range', 'color'];
      return !nonTextTypes.includes(type);
    }
    return isEditable || isARIALive;
  };

  if (isTextInput(activeEl)) return;

  // Handle Ctrl + C (or Cmd + C) for copying video frame
  const isCtrlC = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
  if (isCtrlC) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length === 0) {
      const isWatch = window.location.pathname.includes('/watch');
      const isShorts = window.location.pathname.startsWith('/shorts/');
      if (isWatch || (isShorts && !settingsState.hideShorts)) {
        e.preventDefault();
        e.stopPropagation();
        await copyFrameToClipboard();
      }
      return;
    }
  }

  const downloadHotkey = (settingsState.downloadHotkey || 'd').toLowerCase();
  const optionsHotkey = (settingsState.optionsHotkey || 'o').toLowerCase();
  const pipHotkey = (settingsState.pipHotkey || 'b').toLowerCase();
  const screenshotHotkey = (settingsState.screenshotHotkey || 'v').toLowerCase();
  const pressedKey = e.key.toLowerCase();

  if (e.code === 'Space') {
    isSpacePressed = true;
  }

  if (pressedKey === optionsHotkey) {
    e.preventDefault();
    e.stopPropagation();
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ action: 'YTPLUS_OPEN_OPTIONS' });
    }
    return;
  }

  if (pressedKey === pipHotkey) {
    e.preventDefault();
    e.stopPropagation();
    togglePiP();
    return;
  }

  if (pressedKey === screenshotHotkey) {
    const isWatch = window.location.pathname.includes('/watch');
    const isShorts = window.location.pathname.startsWith('/shorts/');

    if (isWatch || (isShorts && !settingsState.hideShorts)) {
      e.preventDefault();
      e.stopPropagation();
      await captureScreenshot();
    }
    return;
  }

  if (pressedKey === downloadHotkey) {
    const videoId = getVideoId();
    if (!videoId) return;

    e.preventDefault();
    e.stopPropagation();

    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('list');
    if (settingsState.playlistDownloadEnabled && listId) {
      initiateDownload(listId, 'playlist');
    } else {
      initiateDownload(videoId);
    }
  }
}

