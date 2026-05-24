/*
 * Tubeless — Toast notification UI
 */

function showToast(message, type = 'info') {
  const existing = document.getElementById('ytplus-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ytplus-toast';

  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.gap = '12px';

  let icon = '';
  if (type === 'success') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  } else if (type === 'screenshot') {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
  } else if (type === 'none') {
    icon = '';
  } else {
    icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>';
  }

  toast.innerHTML = `<div style="display:flex; align-items:center; gap:12px;">${icon}<span>${message}</span></div>`;

  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 32px;
    background: rgba(28, 28, 28, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #f1f1f1;
    padding: 14px 24px;
    border-radius: 12px;
    z-index: 2147483647;
    font-family: "YouTube Sans", Roboto, Arial, sans-serif;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
    pointer-events: none;
    direction: ltr !important;
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes ytplus-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: ytplus-spin 0.8s linear infinite; }
  `;
  document.head.appendChild(styleSheet);

  document.body.appendChild(toast);

  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-20px)';

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      toast.remove();
      styleSheet.remove();
    }, 400);
  }, 4000);
}
