/*
 * Tubeless — i18n / translations
 *
 * Exports: getLocalText(key, replacements) → window.YTPlusGetLocalText
 */

const CONTENT_TEXT = {
  en: {
    preparing: 'Preparing download...',
    downloading: 'Downloading {quality}...',
    serverError: 'Server Error',
    notAvailable: 'Download not available',
    dropToDownload: 'Download',
    dropToCancel: 'Cancel',
    dragSubtext: 'Video • Shorts • Playlist',
    frameCaptured: 'Screenshot captured',
    screenshotTitle: 'YouTube Screenshot',
    frameCopied: 'Copied'
  },
  ar: {
    preparing: 'جاري التحضير للتحميل...',
    downloading: 'جاري تحميل {quality}...',
    serverError: 'خطأ في الخادم',
    notAvailable: 'التحميل غير متاح',
    dropToDownload: 'تنزيل',
    dropToCancel: 'إلغاء',
    dragSubtext: 'فيديو • شورتس • قائمة تشغيل',
    frameCaptured: 'تم التقاط لقطة الشاشة',
    screenshotTitle: 'لقطة شاشة يوتيوب',
    frameCopied: 'تم النسخ'
  },
  fr: {
    preparing: 'Préparation du téléchargement...',
    downloading: 'Téléchargement {quality}...',
    serverError: 'Erreur du Serveur',
    notAvailable: 'Téléchargement non disponible',
    dropToDownload: 'Télécharger',
    dropToCancel: 'Annuler',
    dragSubtext: 'Vidéo • Shorts • Playlist',
    frameCaptured: 'Capture d\'écran effectuée',
    screenshotTitle: 'Capture d\'écran YouTube',
    frameCopied: 'Copié'
  },
  de: {
    preparing: 'Download wird vorbereitet...',
    downloading: 'Lade {quality} herunter...',
    serverError: 'Serverfehler',
    notAvailable: 'Download nicht verfügbar',
    dropToDownload: 'Herunterladen',
    dropToCancel: 'Abbrechen',
    dragSubtext: 'Video • Shorts • Playlist',
    frameCaptured: 'Screenshot aufgenommen',
    screenshotTitle: 'YouTube-Screenshot',
    frameCopied: 'Kopiert'
  },
  es: {
    preparing: 'Preparando descarga...',
    downloading: 'Descargando {quality}...',
    serverError: 'Error del servidor',
    notAvailable: 'Descarga no disponible',
    dropToDownload: 'Descargar',
    dropToCancel: 'Cancelar',
    dragSubtext: 'Video • Shorts • Lista de reproducción',
    frameCaptured: 'Captura de pantalla realizada',
    screenshotTitle: 'Captura de pantalla de YouTube',
    frameCopied: 'Copiado'
  },
  ja: {
    preparing: 'ダウンロードを準備中...',
    downloading: '{quality}をダウンロード中...',
    serverError: 'サーバーエラー',
    notAvailable: 'ダウンロード不可',
    dropToDownload: 'ダウンロード',
    dropToCancel: 'キャンセル',
    dragSubtext: '動画 • ショート • プレイリスト',
    frameCaptured: 'スクリーンショットを保存しました',
    screenshotTitle: 'YouTubeスクリーンショット',
    frameCopied: 'コピーしました'
  },
  zh: {
    preparing: '正在准备下载...',
    downloading: '正在下载 {quality}...',
    serverError: '服务器错误',
    notAvailable: '不可下载',
    dropToDownload: '下载',
    dropToCancel: '取消',
    dragSubtext: '视频 • Shorts • 播放列表',
    frameCaptured: '已截屏',
    screenshotTitle: 'YouTube 截图',
    frameCopied: '已复制'
  },
  pt: {
    preparing: 'Preparando download...',
    downloading: 'Baixando {quality}...',
    serverError: 'Erro no servidor',
    notAvailable: 'Download indisponível',
    dropToDownload: 'Baixar',
    dropToCancel: 'Cancelar',
    dragSubtext: 'Vídeo • Shorts • Playlist',
    frameCaptured: 'Captura de tela realizada',
    screenshotTitle: 'Captura de tela do YouTube',
    frameCopied: 'Copiado'
  },
  ru: {
    preparing: 'Подготовка к загрузке...',
    downloading: 'Загрузка {quality}...',
    serverError: 'Ошибка сервера',
    notAvailable: 'Загрузка недоступна',
    dropToDownload: 'Скачать',
    dropToCancel: 'Отмена',
    dragSubtext: 'Видео • Shorts • Плейлист',
    frameCaptured: 'Скриншот сохранен',
    screenshotTitle: 'Скриншот YouTube',
    frameCopied: 'Скопировано'
  },
  ko: {
    preparing: '다운로드 준비 중...',
    downloading: '{quality} 다운로드 중...',
    serverError: '서버 오류',
    notAvailable: '다운로드할 수 없음',
    dropToDownload: '다운로드',
    dropToCancel: '취소',
    dragSubtext: '동영상 • Shorts • 재생목록',
    frameCaptured: '스크린샷이 캡처됨',
    screenshotTitle: 'YouTube 스크린샷',
    frameCopied: '복사됨'
  },
  tr: {
    preparing: 'İndirme hazırlanıyor...',
    downloading: '{quality} indiriliyor...',
    serverError: 'Sunucu Hatası',
    notAvailable: 'İndirme mevcut değil',
    dropToDownload: 'İndir',
    dropToCancel: 'İptal',
    dragSubtext: 'Video • Shorts • Oynatma Listesi',
    frameCaptured: 'Ekran görüntüsü alındı',
    screenshotTitle: 'YouTube Ekran Görüntüsü',
    frameCopied: 'Kopyalandı'
  },
  hi: {
    preparing: 'डाउनलोड की तैयारी हो रही है...',
    downloading: '{quality} डाउनलोड हो रहा है...',
    serverError: 'सर्वर त्रुटि',
    notAvailable: 'डाउनलोड उपलब्ध नहीं है',
    dropToDownload: 'डाउनलोड',
    dropToCancel: 'रद्द करें',
    dragSubtext: 'वीडियो • शॉर्ट्स • प्लेलिस्ट',
    frameCaptured: 'स्क्रीनशॉट लिया गया',
    screenshotTitle: 'YouTube स्क्रीनशॉट',
    frameCopied: 'कॉपी किया गया'
  }
};

function getLocalText(key, replacements = {}) {
  const lang = settingsState.language === 'auto' ? (navigator.language.split('-')[0] || 'en') : settingsState.language;
  const textMap = CONTENT_TEXT[lang] || CONTENT_TEXT.en;
  let text = textMap[key] || CONTENT_TEXT.en[key] || key;

  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

window.YTPlusGetLocalText = getLocalText;
