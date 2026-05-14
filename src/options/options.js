const DEFAULT_SETTINGS = {
  showDislikes: true,
  showLoadingState: true,
  showRetryState: true,
  hideHomeFeed: false,
  hideShorts: false,
  hideSidebarRecommendations: false,
  hideEndscreenRecommendations: false,
  darkMode: false,
  debug: false,
  forceCinemaMode: false,
  playbackSpeed: 1,
  hideComments: false,
  autoReplayVideos: false,
  autoReplayShorts: true,
  deepWorkMode: false,
  hideShortsSearch: false,
  adBlockEnabled: true,
  language: 'auto',
  smartQualityLock: 'auto',
  downloadHotkey: 'd',
  optionsHotkey: 'o',
  pipHotkey: 'b',
  screenshotHotkey: 'v',
  screenshotSoundEnabled: true,
  defaultDownloadQuality: 'best',
  hideShortsSearchManual: false,
  playlistDownloadEnabled: true,
  sidebarCollapsed: false,
  settingStats: {}
};

let currentDarkMode = false;

const settingKeys = Object.keys(DEFAULT_SETTINGS);
const SETTINGS_SCHEMA_VERSION = 1;
const UI_TEXT = {
  en: {
    
    navGeneral: 'General',
    navAdBlocking: 'Ad Blocking',
    navDislikes: 'Dislikes',
    navProductivity: 'Productivity',
    navPlayer: 'Player',
    navMedia: 'Media',
    navAdvanced: 'Advanced',
    brandName: 'Tubeless',
    brandHint: 'qalva',

    
    pageTitle: 'Settings',
    pageSubtitle: 'Personalize your YouTube experience.',
    searchPlaceholder: 'Search settings...',
    resetDefaults: 'Restore Defaults',
    toggleTheme: 'Toggle Theme',

    
    sectionGeneral: 'General',
    sectionAdBlocking: 'Ad Blocking',
    sectionDislikes: 'Dislike Counter',
    sectionProductivity: 'Productivity & Feed',
    sectionPlayer: 'Player',
    sectionMedia: 'Media & Shortcuts',
    sectionAdvanced: 'Advanced',
    sectionData: 'Data Management',

    
    labelLanguage: 'Language',
    optAuto: 'Automatic',

    
    adBlockEnabled: 'Blocks All Ads',
    adBlockDesc: 'Zero-latency ad removal',

    
    deepWork: 'Deep Work Mode',
    deepWorkDesc: 'Activate Deep Work Mode to remove all distractions',
    hideHome: 'Hide Home Feed',
    hideHomeDesc: 'See only what you search',
    hideShorts: 'Hide Shorts',
    cleanFeed: 'Stop the unlimited scrolling',
    hideShortsSearch: 'Hide Shorts from Search',
    focusSearch: 'Keep search results clean',
    hideSidebar: 'Hide Sidebar',
    hideSidebarDesc: 'Remove sidebar recommendations',
    hideEndscreen: 'Hide Endscreen Wall',
    removeEndscreenDesc: 'Block recommended videos at the end',

    
    showDislikes: 'Return Dislikes',
    showLoading: 'Loading placeholder (--)',
    showRetry: 'Retry text on API failure',

    
    qualityLock: 'Quality Lock',
    optAutoQuality: 'Auto',
    cinemaMode: 'Cinema Mode',
    loopDefault: 'Auto Replay',
    loopVideos: 'Auto Replay Videos',
    loopShorts: 'Auto Replay Shorts',
    hideComments: 'Hide Comments',
    focusVideo: 'Focus on the video only',
    playbackSpeed: 'Playback Speed',
    resetSpeedHint: 'Reset Speed',

    
    playlistMode: 'Playlist Mode',
    playlistDesc: 'Download full playlist if found',
    downloadHotkey: 'Download Hotkey',
    defaultDownloadQuality: 'Download quality',
    highestQuality: 'Highest Video Quality',
    change: 'Change',
    restore: 'Reset',
    optionsHotkey: 'Options Hotkey',
    pipHotkey: 'Floating Player Hotkey',
    screenshotHotkey: 'Screenshot Hotkey',
    screenshotSound: 'Screenshot capture sound',

    
    exportSettings: 'Export Settings',
    importSettings: 'Import Settings',

    
    debugLogs: 'Enable debug logs',

    
    saved: 'Saved.',
    saveFailed: 'Save failed.',
    loadFailed: 'Failed to load settings.',
    exportReady: 'Settings exported.',
    importDone: 'Settings imported.',
    importFailed: 'Invalid settings file.',
    resetDone: 'Defaults restored.',
    noResults: 'No settings found',
    pressKey: 'Press a key...',
    conflict: 'Key conflict with YouTube',
    otherConflict: 'Key conflict with another hotkey',
    invalidKey: 'Invalid key',
    audioOnly: 'Audio Only',
    thumbnails: 'Thumbnail',
    toggleSidebarHint: 'Toggle Sidebar',
    githubHint: 'GitHub Repository',
    reportIssueHint: 'Report an Issue',
    clearSearchHint: 'Clear Search',
    themeHint: 'Toggle Theme',
    exportHint: 'Export settings to file',
    importHint: 'Import settings from file',
    resetDefaultsHint: 'Restore all default settings',
    quickAccess: 'Quick Access',
    upToDate: 'Up To Date',
    downloadAppHint: 'Download Tubeless for PC to enable downloads'
  },
  ar: {
    
    navGeneral: 'عام',
    navAdBlocking: 'منع الإعلانات',
    navDislikes: 'عدم الإعجاب',
    navProductivity: 'الإنتاجية',
    navPlayer: 'المشغل',
    navMedia: 'الوسائط',
    navAdvanced: 'متقدم',
    brandName: 'تيوب لِس',
    brandHint: 'qalva',
    pageTitle: 'الإعدادات',
    pageSubtitle: 'خصص تجربتك على يوتيوب.',
    searchPlaceholder: 'البحث عن الإعدادات...',
    resetDefaults: 'استعادة الافتراضي',
    toggleTheme: 'تبديل المظهر',
    sectionGeneral: 'عام',
    sectionAdBlocking: 'منع الإعلانات',
    sectionDislikes: 'عداد عدم الإعجاب',
    sectionProductivity: 'الإنتاجية والخلاصة',
    sectionPlayer: 'المشغل',
    sectionMedia: 'الوسائط والاختصارات',
    sectionAdvanced: 'متقدم',
    sectionData: 'إدارة البيانات',
    labelLanguage: 'اللغة',
    optAuto: 'تلقائي',
    adBlockEnabled: 'منع جميع الإعلانات',
    adBlockDesc: 'إزالة الإعلانات بدون تأخير',
    deepWork: 'وضع التركيز',
    deepWorkDesc: 'قم بتمكين وضع التركيز لإزالة جميع المشتتات',
    hideHome: 'إخفاء خلاصة الصفحة الرئيسية',
    hideHomeDesc: 'شاهد فقط ما تبحث عنه',
    hideShorts: 'إخفاء الفيديوهات القصيرة (Shorts)',
    cleanFeed: 'إيقاف التمرير اللانهائي',
    hideShortsSearch: 'إخفاء القصيرة في البحث',
    focusSearch: 'حافظ على نظافة نتائج البحث',
    hideSidebar: 'إخفاء الشريط الجانبي',
    hideSidebarDesc: 'إزالة توصيات الشريط الجانبي',
    hideEndscreen: 'إخفاء شاشة النهاية',
    removeEndscreenDesc: 'منع الفيديوهات المقترحة في النهاية',
    showDislikes: 'إظهار عدم الإعجاب',
    showLoading: 'مكان التحميل (--)',
    showRetry: 'نص إعادة المحاولة عند فشل API',
    qualityLock: 'قفل الجودة',
    optAutoQuality: 'تلقائي',
    cinemaMode: 'الوضع السينمائي',
    loopDefault: 'تكرار تلقائي',
    loopVideos: 'تكرار الفيديوهات تلقائياً',
    loopShorts: 'تكرار Shorts تلقائياً',
    hideComments: 'إخفاء التعليقات',
    focusVideo: 'التركيز فقط على الفيديو',
    playbackSpeed: 'سرعة التشغيل',
    resetSpeedHint: 'إعادة تعيين السرعة',
    playlistMode: 'وضع قائمة التشغيل',
    playlistDesc: 'تحميل قائمة التشغيل كاملة إذا وجدت',
    downloadHotkey: 'اختصار التحميل',
    defaultDownloadQuality: 'جودة التحميل',
    highestQuality: 'أعلى جودة فيديو',
    change: 'تغيير',
    restore: 'استعادة',
    optionsHotkey: 'اختصار الإعدادات',
    pipHotkey: 'اختصار المشغل العائم',
    screenshotHotkey: 'اختصار لقطة الشاشة',
    screenshotSound: 'صوت لقطة الشاشة',
    exportSettings: 'تصدير الإعدادات',
    importSettings: 'استيراد الإعدادات',
    debugLogs: 'تمكين سجلات التصحيح',
    saved: 'تم الحفظ.',
    saveFailed: 'فشل الحفظ.',
    loadFailed: 'فشل التحميل.',
    exportReady: 'تم تصدير الإعدادات.',
    importDone: 'تم استيراد الإعدادات.',
    importFailed: 'ملف غير صالح.',
    resetDone: 'تمت استعادة الافتراضيات.',
    noResults: 'لم يتم العثور على إعدادات',
    pressKey: 'اضغط على مفتاح...',
    conflict: 'تعارض مع مفتاح يوتيوب',
    otherConflict: 'تعارض مع اختصار آخر',
    invalidKey: 'مفتاح غير صالح',
    audioOnly: 'صوت فقط',
    thumbnails: 'صورة مصغرة',
    toggleSidebarHint: 'تبديل الشريط الجانبي',
    githubHint: 'مستودع GitHub',
    reportIssueHint: 'الإبلاغ عن مشكلة',
    clearSearchHint: 'مسح البحث',
    themeHint: 'تبديل المظهر',
    exportHint: 'تصدير الإعدادات إلى ملف',
    importHint: 'استيراد الإعدادات من ملف',
    resetDefaultsHint: 'استعادة جميع الإعدادات الافتراضية',
    quickAccess: 'الوصول السريع',
    upToDate: 'مُحدّث',
    downloadAppHint: 'حمّل Tubeless للكمبيوتر لتفعيل التحميل'
  },
  fr: {
    
    navGeneral: 'Général',
    navAdBlocking: 'Publicités',
    navDislikes: 'Dislikes',
    navProductivity: 'Productivité',
    navPlayer: 'Lecteur',
    navMedia: 'Média',
    navAdvanced: 'Avancé',
    brandName: 'Tubeless',
    brandHint: 'qalva',

    
    pageTitle: 'Paramètres',
    pageSubtitle: 'Personnalisez votre expérience YouTube.',
    searchPlaceholder: 'Rechercher des paramètres...',
    resetDefaults: 'Réinitialiser',
    toggleTheme: 'Changer le thème',

    
    sectionGeneral: 'Général',
    sectionAdBlocking: 'Blocage de publicités',
    sectionDislikes: 'Compteur de dislikes',
    sectionProductivity: 'Productivité & Flux',
    sectionPlayer: 'Lecteur',
    sectionMedia: 'Médias & Raccourcis',
    sectionAdvanced: 'Avancé',
    sectionData: 'Gestion des données',

    
    labelLanguage: 'Langue',
    optAuto: 'Automatique',

    
    adBlockEnabled: 'Bloque toutes les publicités',
    adBlockDesc: 'Suppression instantanée',

    
    deepWork: 'Mode Concentration',
    deepWorkDesc: 'Activer le mode concentration pour supprimer les distractions',
    hideHome: 'Masquer accueil',
    hideHomeDesc: 'Voyez seulement ce que vous cherchez',
    hideShorts: 'Masquer Shorts',
    cleanFeed: 'Arrêtez le défilement illimité',
    hideShortsSearch: 'Masquer Shorts recherche',
    focusSearch: 'Recherche propre',
    hideSidebar: 'Masquer barre latérale',
    hideSidebarDesc: 'Supprimer les recommandations latérales',
    hideEndscreen: 'Masquer Écran de Fin',
    removeEndscreenDesc: 'Bloquer les recommandations de fin',

    
    showDislikes: 'Afficher dislikes',
    showLoading: 'Indicateur de chargement (--)',
    showRetry: 'Texte de réessai sur échec API',

    
    qualityLock: 'Verrou de Qualité',
    optAutoQuality: 'Auto',
    cinemaMode: 'Mode Cinéma',
    loopDefault: 'Relecture auto',
    loopVideos: 'Relecture auto des vidéos',
    loopShorts: 'Relecture auto des Shorts',
    hideComments: 'Masquer commentaires',
    focusVideo: 'Focus sur la vidéo',
    playbackSpeed: 'Vitesse de lecture',
    resetSpeedHint: 'Réinitialiser la vitesse',

    
    playlistMode: 'Mode Playlist',
    playlistDesc: 'Télécharger la playlist complète si trouvée',
    downloadHotkey: 'Raccourci de téléchargement',
    defaultDownloadQuality: 'Qualité de téléchargement',
    highestQuality: 'Qualité vidéo maximale',
    change: 'Modifier',
    restore: 'Réinitialiser',
    optionsHotkey: 'Raccourci des options',
    pipHotkey: 'Raccourci lecteur flottant',
    screenshotHotkey: 'Raccourci capture d\'écran',
    screenshotSound: 'Son de capture d\'écran',

    
    exportSettings: 'Exporter les paramètres',
    importSettings: 'Importer les paramètres',

    
    debugLogs: 'Activer les journaux de débogage',

    
    saved: 'Enregistré.',
    saveFailed: 'Échec de l\'enregistrement.',
    loadFailed: 'Échec du chargement des paramètres.',
    exportReady: 'Paramètres exportés.',
    importDone: 'Paramètres importés.',
    importFailed: 'Fichier de paramètres invalide.',
    resetDone: 'Paramètres par défaut restaurés.',
    noResults: 'Aucun paramètre trouvé',
    pressKey: 'Appuyez sur une touche...',
    conflict: 'Conflit de touches avec YouTube',
    otherConflict: 'Conflit avec un autre raccourci',
    invalidKey: 'Touche invalide',
    audioOnly: 'Audio Uniquement',
    thumbnails: 'Miniature',
    toggleSidebarHint: 'Masquer/Afficher la barre latérale',
    githubHint: 'Dépôt GitHub',
    reportIssueHint: 'Signaler un problème',
    clearSearchHint: 'Effacer la recherche',
    themeHint: 'Changer le thème',
    exportHint: 'Exporter vers un fichier',
    importHint: 'Importer depuis un fichier',
    resetDefaultsHint: 'Restaurer tous les paramètres',
    quickAccess: 'Accès Rapide',
    upToDate: 'À jour',
    downloadAppHint: 'Téléchargez Tubeless pour PC pour activer les téléchargements'
  },
  de: {
    navGeneral: 'Allgemein',
    navAdBlocking: 'Ad-Blocker',
    navDislikes: 'Dislikes',
    navProductivity: 'Produktivität',
    navPlayer: 'Player',
    navMedia: 'Medien',
    navAdvanced: 'Erweitert',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'Einstellungen',
    pageSubtitle: 'Personalisiere dein YouTube-Erlebnis.',
    searchPlaceholder: 'Einstellungen suchen...',
    resetDefaults: 'Standard wiederherstellen',
    toggleTheme: 'Design umschalten',
    sectionGeneral: 'Allgemein',
    sectionAdBlocking: 'Werbeblocker',
    sectionDislikes: 'Dislike-Zähler',
    sectionProductivity: 'Produktivität & Feed',
    sectionPlayer: 'Player',
    sectionMedia: 'Medien & Tastenkürzel',
    sectionAdvanced: 'Erweitert',
    sectionData: 'Datenverwaltung',
    labelLanguage: 'Sprache',
    optAuto: 'Automatisch',
    adBlockEnabled: 'Alle Werbung blockieren',
    adBlockDesc: 'Werbeentfernung ohne Verzögerung',
    deepWork: 'Fokus-Modus',
    deepWorkDesc: 'Aktiviere den Fokus-Modus, um alle Ablenkungen zu entfernen',
    hideHome: 'Startseiten-Feed ausblenden',
    hideHomeDesc: 'Nur sehen, was du suchst',
    hideShorts: 'Shorts ausblenden',
    cleanFeed: 'Endloses Scrollen stoppen',
    hideShortsSearch: 'Shorts in der Suche ausblenden',
    focusSearch: 'Suchergebnisse sauber halten',
    hideSidebar: 'Seitenleiste ausblenden',
    hideSidebarDesc: 'Seitenleisten-Empfehlungen entfernen',
    hideEndscreen: 'Endbildschirm ausblenden',
    removeEndscreenDesc: 'Empfohlene Videos am Ende blockieren',
    showDislikes: 'Dislikes anzeigen',
    showLoading: 'Lade-Platzhalter (--)',
    showRetry: 'Wiederholungstext bei API-Fehler',
    qualityLock: 'Qualitätssperre',
    optAutoQuality: 'Auto',
    cinemaMode: 'Kinomodus',
    loopDefault: 'Autom. Wiederholung',
    loopVideos: 'Autom. Video-Wiederholung',
    loopShorts: 'Autom. Shorts-Wiederholung',
    hideComments: 'Kommentare ausblenden',
    focusVideo: 'Nur auf das Video konzentrieren',
    playbackSpeed: 'Wiedergabegeschwindigkeit',
    resetSpeedHint: 'Geschwindigkeit zurücksetzen',
    playlistMode: 'Playlist-Modus',
    playlistDesc: 'Ganze Playlist herunterladen, falls gefunden',
    downloadHotkey: 'Download-Taste',
    defaultDownloadQuality: 'Download-Qualität',
    highestQuality: 'Höchste Videoqualität',
    change: 'Ändern',
    restore: 'Reset',
    optionsHotkey: 'Einstellungs-Taste',
    pipHotkey: 'Floating Player-Taste',
    screenshotHotkey: 'Screenshot-Taste',
    screenshotSound: 'Screenshot-Ton',
    exportSettings: 'Einstellungen exportieren',
    importSettings: 'Einstellungen importieren',
    debugLogs: 'Debug-Protokolle aktivieren',
    saved: 'Gespeichert.',
    saveFailed: 'Speichern fehlgeschlagen.',
    loadFailed: 'Laden fehlgeschlagen.',
    exportReady: 'Einstellungen exportiert.',
    importDone: 'Einstellungen importiert.',
    importFailed: 'Ungültige Datei.',
    resetDone: 'Standards wiederhergestellt.',
    noResults: 'Keine Einstellungen gefunden',
    pressKey: 'Taste drücken...',
    conflict: 'Konflikt mit YouTube-Taste',
    otherConflict: 'Konflikt mit anderem Tastenkürzel',
    invalidKey: 'Ungültige Taste',
    audioOnly: 'Nur Audio',
    thumbnails: 'Vorschaubild',
    toggleSidebarHint: 'Seitenleiste umschalten',
    githubHint: 'GitHub-Repository',
    reportIssueHint: 'Ein Problem melden',
    clearSearchHint: 'Suche löschen',
    themeHint: 'Design umschalten',
    exportHint: 'Einstellungen in Datei exportieren',
    importHint: 'Einstellungen aus Datei importieren',
    resetDefaultsHint: 'Alle Standardeinstellungen wiederherstellen',
    quickAccess: 'Schnellzugriff',
    upToDate: 'Aktuell',
    downloadAppHint: 'Laden Sie Tubeless für PC herunter, um Downloads zu aktivieren'
  },
  es: {
    navGeneral: 'General',
    navAdBlocking: 'Bloqueo de anuncios',
    navDislikes: 'Dislikes',
    navProductivity: 'Productividad',
    navPlayer: 'Reproductor',
    navMedia: 'Medios',
    navAdvanced: 'Avanzado',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'Configuración',
    pageSubtitle: 'Personaliza tu experiencia en YouTube.',
    searchPlaceholder: 'Buscar ajustes...',
    resetDefaults: 'Restaurar valores',
    toggleTheme: 'Cambiar tema',
    sectionGeneral: 'General',
    sectionAdBlocking: 'Bloqueo de Publicidad',
    sectionDislikes: 'Contador de Dislikes',
    sectionProductivity: 'Productividad y Feed',
    sectionPlayer: 'Reproductor',
    sectionMedia: 'Medios y Atajos',
    sectionAdvanced: 'Avanzado',
    sectionData: 'Gestión de Datos',
    labelLanguage: 'Idioma',
    optAuto: 'Automático',
    adBlockEnabled: 'Bloquear todos los anuncios',
    adBlockDesc: 'Eliminación de anuncios sin latencia',
    deepWork: 'Modo Concentración',
    deepWorkDesc: 'Activa el Modo Concentración para eliminar distracciones',
    hideHome: 'Ocultar Feed de Inicio',
    hideHomeDesc: 'Mira solo lo que buscas',
    hideShorts: 'Ocultar Shorts',
    cleanFeed: 'Detener el desplazamiento infinito',
    hideShortsSearch: 'Ocultar Shorts en búsquedas',
    focusSearch: 'Mantener resultados limpios',
    hideSidebar: 'Ocultar barra lateral',
    hideSidebarDesc: 'Quitar recomendaciones laterales',
    hideEndscreen: 'Ocultar pantalla final',
    removeEndscreenDesc: 'Bloquear videos recomendados al final',
    showDislikes: 'Mostrar Dislikes',
    showLoading: 'Marcador de carga (--)',
    showRetry: 'Texto de reintento en fallo de API',
    qualityLock: 'Bloqueo de Calidad',
    optAutoQuality: 'Auto',
    cinemaMode: 'Modo Cine',
    loopDefault: 'Repetición Automática',
    loopVideos: 'Repetición auto de vídeos',
    loopShorts: 'Repetición auto de Shorts',
    hideComments: 'Ocultar Comentarios',
    focusVideo: 'Enfocarse solo en el video',
    playbackSpeed: 'Velocidad de reproducción',
    resetSpeedHint: 'Reiniciar velocidad',
    playlistMode: 'Modo Playlist',
    playlistDesc: 'Descargar lista completa si se encuentra',
    downloadHotkey: 'Atajo de Descarga',
    defaultDownloadQuality: 'Calidad de descarga',
    highestQuality: 'Máxima Calidad de Video',
    change: 'Cambiar',
    restore: 'Reset',
    optionsHotkey: 'Atajo de Ajustes',
    pipHotkey: 'Atajo Reproductor Flotante',
    screenshotHotkey: 'Atajo de Captura',
    screenshotSound: 'Sonido de captura',
    exportSettings: 'Exportar Ajustes',
    importSettings: 'Importar Ajustes',
    debugLogs: 'Activar registros de depuración',
    saved: 'Guardado.',
    saveFailed: 'Error al guardar.',
    loadFailed: 'Error al cargar.',
    exportReady: 'Ajustes exportados.',
    importDone: 'Ajustes importados.',
    importFailed: 'Archivo inválido.',
    resetDone: 'Valores restaurados.',
    noResults: 'No se encontraron ajustes',
    pressKey: 'Presiona una tecla...',
    conflict: 'Conflicto con tecla de YouTube',
    otherConflict: 'Conflicto con otro atajo',
    invalidKey: 'Tecla no válida',
    audioOnly: 'Solo Audio',
    thumbnails: 'Miniatura',
    quickAccess: 'Acceso Rápido',
    upToDate: 'Al día',
    downloadAppHint: 'Descarga Tubeless para PC para activar las descargas'
  },
  ja: {
    navGeneral: '一般',
    navAdBlocking: '広告ブロック',
    navDislikes: '低評価',
    navProductivity: '生産性',
    navPlayer: 'プレイヤー',
    navMedia: 'メディア',
    navAdvanced: '高度な設定',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: '設定',
    pageSubtitle: 'YouTubeの体験をカスタマイズしましょう。',
    searchPlaceholder: '設定を検索...',
    resetDefaults: 'デフォルトに戻す',
    toggleTheme: 'テーマを切り替え',
    sectionGeneral: '一般',
    sectionAdBlocking: '広告ブロック',
    sectionDislikes: '低評価カウンター',
    sectionProductivity: '生産性とフィード',
    sectionPlayer: 'プレイヤー',
    sectionMedia: 'メディアとショートカット',
    sectionAdvanced: '高度な設定',
    sectionData: 'データ管理',
    labelLanguage: '言語',
    optAuto: '自動',
    adBlockEnabled: 'すべての広告をブロック',
    adBlockDesc: '遅延なしの広告削除',
    deepWork: 'ディープワークモード',
    deepWorkDesc: 'すべての気を散らす要素を取り除きます',
    hideHome: 'ホームフィードを非表示',
    hideHomeDesc: '検索したものだけを表示',
    hideShorts: 'Shortsを非表示',
    cleanFeed: '無限スクロールを停止',
    hideShortsSearch: '検索からShortsを非表示',
    focusSearch: '検索結果をクリーンに保つ',
    hideSidebar: 'サイドバーを非表示',
    hideSidebarDesc: 'サイドバーの推奨を削除',
    hideEndscreen: '終了画面を非表示',
    removeEndscreenDesc: '終了時の推奨動画をブロック',
    showDislikes: '低評価を表示',
    showLoading: '読み込み中の表示 (--)',
    showRetry: 'APIエラー時の再試行テキスト',
    qualityLock: '画質固定',
    optAutoQuality: '自動',
    cinemaMode: 'シアターモード',
    loopDefault: '自動リピート',
    loopVideos: '動画の自動リピート',
    loopShorts: 'Shortsの自動リピート',
    hideComments: 'コメントを非表示',
    focusVideo: '動画だけに集中する',
    playbackSpeed: '再生速度',
    resetSpeedHint: '速度をリセット',
    playlistMode: 'プレイリストモード',
    playlistDesc: 'プレイリストが見つかった場合は全件保存',
    downloadHotkey: 'ダウンロードのショートカット',
    defaultDownloadQuality: '保存画質',
    highestQuality: '最高画質',
    change: '変更',
    restore: 'リセット',
    optionsHotkey: '設定のショートカット',
    pipHotkey: 'ミニプレイヤーのショートカット',
    screenshotHotkey: 'スクリーンショットのショートカット',
    screenshotSound: 'シャッター音',
    exportSettings: '設定を書き出す',
    importSettings: '設定を読み込む',
    debugLogs: 'デバッグログを有効にする',
    saved: '保存されました。',
    saveFailed: '保存に失敗しました。',
    loadFailed: '読み込みに失敗しました。',
    exportReady: '設定が書き出されました。',
    importDone: '設定が読み込まれました。',
    importFailed: '無効なファイルです。',
    resetDone: 'デフォルトに戻されました。',
    noResults: '設定が見つかりません',
    pressKey: 'キーを押してください...',
    conflict: 'YouTubeのキーと衝突しています',
    otherConflict: '他のショートカットと衝突しています',
    invalidKey: '無効なキーです',
    audioOnly: '音声のみ',
    thumbnails: 'サムネイル',
    toggleSidebarHint: 'サイドバーを切り替え',
    githubHint: 'GitHubリポジトリ',
    reportIssueHint: '問題を報告',
    clearSearchHint: '検索をクリア',
    themeHint: 'テーマを切り替え',
    exportHint: '設定をファイルに書き出す',
    importHint: 'ファイルから設定を読み込む',
    resetDefaultsHint: 'すべての設定をデフォルトに戻す',
    quickAccess: 'クイックアクセス',
    upToDate: '最新の状態',
    downloadAppHint: 'PC版Tubelessをダウンロードしてダウンロードを有効にする'
  },
  zh: {
    navGeneral: '常规',
    navAdBlocking: '广告拦截',
    navDislikes: '不喜欢',
    navProductivity: '生产力',
    navPlayer: '播放器',
    navMedia: '媒体',
    navAdvanced: '高级',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: '设置',
    pageSubtitle: '个性化您的 YouTube 体验。',
    searchPlaceholder: '搜索设置...',
    resetDefaults: '恢复默认',
    toggleTheme: '切换主题',
    sectionGeneral: '常规',
    sectionAdBlocking: '广告拦截',
    sectionDislikes: '不喜欢计数器',
    sectionProductivity: '生产力与动态',
    sectionPlayer: '播放器',
    sectionMedia: '媒体与快捷键',
    sectionAdvanced: '高级设置',
    sectionData: '数据管理',
    labelLanguage: '语言',
    optAuto: '自动',
    adBlockEnabled: '拦截所有广告',
    adBlockDesc: '零延迟广告移除',
    deepWork: '深度专注模式',
    deepWorkDesc: '开启深度专注模式以移除所有干扰',
    hideHome: '隐藏首页动态',
    hideHomeDesc: '只看你搜索的内容',
    hideShorts: '隐藏 Shorts',
    cleanFeed: '停止无限滚动',
    hideShortsSearch: '从搜索中隐藏 Shorts',
    focusSearch: '保持搜索结果整洁',
    hideSidebar: '隐藏侧边栏',
    hideSidebarDesc: '移除侧边栏推荐',
    hideEndscreen: '隐藏片尾画面',
    removeEndscreenDesc: '拦截片尾推荐视频',
    showDislikes: '显示不喜欢',
    showLoading: '加载占位符 (--)',
    showRetry: 'API 失败时的重试文字',
    qualityLock: '画质锁定',
    optAutoQuality: '自动',
    cinemaMode: '影院模式',
    loopDefault: '自动重播',
    loopVideos: '视频自动重播',
    loopShorts: 'Shorts自动重播',
    hideComments: '隐藏评论',
    focusVideo: '仅专注于视频',
    playbackSpeed: '播放速度',
    resetSpeedHint: '重置速度',
    playlistMode: '播放列表模式',
    playlistDesc: '如果发现播放列表则下载全部',
    downloadHotkey: '下载快捷键',
    defaultDownloadQuality: '下载画质',
    highestQuality: '最高视频画质',
    change: '更改',
    restore: '重置',
    optionsHotkey: '设置快捷键',
    pipHotkey: '悬浮播放器快捷键',
    screenshotHotkey: '截图快捷键',
    screenshotSound: '截图音效',
    exportSettings: '导出设置',
    importSettings: '导入设置',
    debugLogs: '启用调试日志',
    saved: '已保存。',
    saveFailed: '保存失败。',
    loadFailed: '加载失败。',
    exportReady: '设置已导出。',
    importDone: '设置已导入。',
    importFailed: '无效的文件。',
    resetDone: '已恢复默认设置。',
    noResults: '未找到相关设置',
    pressKey: '按下一个键...',
    conflict: '与 YouTube 快捷键冲突',
    otherConflict: '与其他快捷键冲突',
    invalidKey: '无效的键',
    audioOnly: '仅音频',
    thumbnails: '缩略图',
    toggleSidebarHint: '切换侧边栏',
    githubHint: 'GitHub 仓库',
    reportIssueHint: '报告问题',
    clearSearchHint: '清除搜索',
    themeHint: '切换主题',
    exportHint: '导出设置到文件',
    importHint: '从文件导入设置',
    resetDefaultsHint: '恢复所有默认设置',
    quickAccess: '快速访问',
    upToDate: '已是最新',
    downloadAppHint: '下载 PC 版 Tubeless 以启用下载'
  },
  pt: {
    navGeneral: 'Geral',
    navAdBlocking: 'Bloqueio de Anúncios',
    navDislikes: 'Dislikes',
    navProductivity: 'Produtividade',
    navPlayer: 'Player',
    navMedia: 'Mídia',
    navAdvanced: 'Avançado',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'Configurações',
    pageSubtitle: 'Personalize sua experiência no YouTube.',
    searchPlaceholder: 'Buscar ajustes...',
    resetDefaults: 'Restaurar padrões',
    toggleTheme: 'Alternar tema',
    sectionGeneral: 'Geral',
    sectionAdBlocking: 'Bloqueio de Anúncios',
    sectionDislikes: 'Contador de Dislikes',
    sectionProductivity: 'Produtividade e Feed',
    sectionPlayer: 'Player',
    sectionMedia: 'Mídia e Atalhos',
    sectionAdvanced: 'Avançado',
    sectionData: 'Gestão de Dados',
    labelLanguage: 'Idioma',
    optAuto: 'Automático',
    adBlockEnabled: 'Bloquear todos os anúncios',
    adBlockDesc: 'Remoção de anúncios sem latência',
    deepWork: 'Modo Foco',
    deepWorkDesc: 'Ative o Modo Foco para remover distrações',
    hideHome: 'Ocultar Feed Inicial',
    hideHomeDesc: 'Veja apenas o que você pesquisa',
    hideShorts: 'Ocultar Shorts',
    cleanFeed: 'Parar rolagem infinita',
    hideShortsSearch: 'Ocultar Shorts na busca',
    focusSearch: 'Manter resultados limpos',
    hideSidebar: 'Ocultar barra lateral',
    hideSidebarDesc: 'Remover recomendações laterais',
    hideEndscreen: 'Ocultar tela final',
    removeEndscreenDesc: 'Bloquear vídeos recomendados no final',
    showDislikes: 'Mostrar Dislikes',
    showLoading: 'Espaço de carregamento (--)',
    showRetry: 'Texto de repetição em erro de API',
    qualityLock: 'Bloqueio de Qualidade',
    optAutoQuality: 'Auto',
    cinemaMode: 'Modo Cinema',
    loopDefault: 'Repetição Automática',
    loopVideos: 'Repetição auto de vídeos',
    loopShorts: 'Repetição auto de Shorts',
    hideComments: 'Ocultar Comentários',
    focusVideo: 'Focar apenas no vídeo',
    playbackSpeed: 'Velocidade de reprodução',
    resetSpeedHint: 'Resetar velocidade',
    playlistMode: 'Modo Playlist',
    playlistDesc: 'Baixar playlist completa se encontrada',
    downloadHotkey: 'Atalho de Download',
    defaultDownloadQuality: 'Qualidade de download',
    highestQuality: 'Máxima Qualidade de Vídeo',
    change: 'Alterar',
    restore: 'Reset',
    optionsHotkey: 'Atalho de Configurações',
    pipHotkey: 'Atalho Player Flutuante',
    screenshotHotkey: 'Atalho de Captura',
    screenshotSound: 'Som de captura',
    exportSettings: 'Exportar Configurações',
    importSettings: 'Importar Configurações',
    debugLogs: 'Ativar logs de depuração',
    saved: 'Salvo.',
    saveFailed: 'Erro ao salvar.',
    loadFailed: 'Erro ao carregar.',
    exportReady: 'Configurações exportadas.',
    importDone: 'Configurações importadas.',
    importFailed: 'Arquivo inválido.',
    resetDone: 'Padrões restaurados.',
    noResults: 'Nenhuma configuração encontrada',
    pressKey: 'Pressione uma tecla...',
    conflict: 'Conflito com tecla do YouTube',
    otherConflict: 'Conflito com outro atalho',
    invalidKey: 'Tecla inválida',
    audioOnly: 'Apenas Áudio',
    thumbnails: 'Miniatura',
    quickAccess: 'Acesso Rápido',
    upToDate: 'Atualizado',
    downloadAppHint: 'Baixe o Tubeless para PC para ativar downloads'
  },
  ru: {
    navGeneral: 'Общие',
    navAdBlocking: 'Блокировка рекламы',
    navDislikes: 'Дизлайки',
    navProductivity: 'Продуктивность',
    navPlayer: 'Плеер',
    navMedia: 'Медиа',
    navAdvanced: 'Дополнительно',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'Настройки',
    pageSubtitle: 'Настройте YouTube под себя.',
    searchPlaceholder: 'Поиск настроек...',
    resetDefaults: 'Сбросить настройки',
    toggleTheme: 'Сменить тему',
    sectionGeneral: 'Общие',
    sectionAdBlocking: 'Блокировка рекламы',
    sectionDislikes: 'Счетчик дизлайков',
    sectionProductivity: 'Продуктивность и лента',
    sectionPlayer: 'Плеер',
    sectionMedia: 'Медиа и горячие клавиши',
    sectionAdvanced: 'Дополнительно',
    sectionData: 'Управление данными',
    labelLanguage: 'Язык',
    optAuto: 'Автоматически',
    adBlockEnabled: 'Блокировать всю рекламу',
    adBlockDesc: 'Мгновенное удаление рекламы',
    deepWork: 'Режим глубокой концентрации',
    deepWorkDesc: 'Включите режим концентрации, чтобы убрать всё лишнее',
    hideHome: 'Скрыть главную ленту',
    hideHomeDesc: 'Видеть только результаты поиска',
    hideShorts: 'Скрыть Shorts',
    cleanFeed: 'Остановить бесконечную прокрутку',
    hideShortsSearch: 'Скрыть Shorts из поиска',
    focusSearch: 'Чистые результаты поиска',
    hideSidebar: 'Скрыть боковую панель',
    hideSidebarDesc: 'Убрать рекомендации сбоку',
    hideEndscreen: 'Скрыть заставку в конце',
    removeEndscreenDesc: 'Блокировать рекомендации в конце видео',
    showDislikes: 'Вернуть дизлайки',
    showLoading: 'Индикатор загрузки (--)',
    showRetry: 'Текст при ошибке API',
    qualityLock: 'Фиксация качества',
    optAutoQuality: 'Авто',
    cinemaMode: 'Режим кино',
    loopDefault: 'Автоповтор',
    loopVideos: 'Автоповтор видео',
    loopShorts: 'Автоповтор Shorts',
    hideComments: 'Скрыть комментарии',
    focusVideo: 'Фокус только на видео',
    playbackSpeed: 'Скорость воспроизведения',
    resetSpeedHint: 'Сбросить скорость',
    playlistMode: 'Режим плейлиста',
    playlistDesc: 'Скачать весь плейлист, если найден',
    downloadHotkey: 'Клавиша скачивания',
    defaultDownloadQuality: 'Качество скачивания',
    highestQuality: 'Максимальное качество',
    change: 'Изменить',
    restore: 'Сброс',
    optionsHotkey: 'Клавиша настроек',
    pipHotkey: 'Клавиша плавающего плеера',
    screenshotHotkey: 'Клавиша скриншота',
    screenshotSound: 'Звук скриншота',
    exportSettings: 'Экспорт настроек',
    importSettings: 'Импорт настроек',
    debugLogs: 'Включить логи отладки',
    saved: 'Сохранено.',
    saveFailed: 'Ошибка сохранения.',
    loadFailed: 'Ошибка загрузки.',
    exportReady: 'Настройки экспортированы.',
    importDone: 'Настройки импортированы.',
    importFailed: 'Неверный файл.',
    resetDone: 'Настройки сброшены.',
    noResults: 'Настройки не найдены',
    pressKey: 'Нажмите клавишу...',
    conflict: 'Конфликт с клавишей YouTube',
    otherConflict: 'Конфликт с другим сочетанием',
    invalidKey: 'Недопустимая клавиша',
    audioOnly: 'Только аудио',
    thumbnails: 'Миниатюра',
    toggleSidebarHint: 'Скрыть/показать боковую панель',
    githubHint: 'Репозиторий GitHub',
    reportIssueHint: 'Сообщить об ошибке',
    clearSearchHint: 'Очистить поиск',
    themeHint: 'Сменить тему',
    exportHint: 'Экспортировать настройки в файл',
    importHint: 'Импортировать настройки из файла',
    resetDefaultsHint: 'Восстановить все настройки по умолчанию',
    quickAccess: 'Быстрый доступ',
    upToDate: 'Актуально',
    downloadAppHint: 'Скачайте Tubeless для ПК, чтобы включить загрузки'
  },
  ko: {
    navGeneral: '일반',
    navAdBlocking: '광고 차단',
    navDislikes: '싫어요',
    navProductivity: '생산성',
    navPlayer: '플레이어',
    navMedia: '미디어',
    navAdvanced: '고급 설정',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: '설정',
    pageSubtitle: 'YouTube 경험을 맞춤 설정하세요.',
    searchPlaceholder: '설정 검색...',
    resetDefaults: '기본값 복원',
    toggleTheme: '테마 전환',
    sectionGeneral: '일반',
    sectionAdBlocking: '광고 차단 설정',
    sectionDislikes: '싫어요 카운터',
    sectionProductivity: '생산성 및 피드',
    sectionPlayer: '플레이어',
    sectionMedia: '미디어 및 단축키',
    sectionAdvanced: '고급 설정',
    sectionData: '데이터 관리',
    labelLanguage: '언어',
    optAuto: '자동',
    adBlockEnabled: '모든 광고 차단',
    adBlockDesc: '지연 없는 광고 제거',
    deepWork: '딥 워크 모드',
    deepWorkDesc: '딥 워크 모드를 활성화하여 모든 방해 요소를 제거합니다',
    hideHome: '홈 피드 숨기기',
    hideHomeDesc: '검색한 내용만 표시',
    hideShorts: 'Shorts 숨기기',
    cleanFeed: '무한 스크롤 중지',
    hideShortsSearch: '검색에서 Shorts 숨기기',
    focusSearch: '검색 결과 깔끔하게 유지',
    hideSidebar: '사이드바 숨기기',
    hideSidebarDesc: '사이드바 추천 제거',
    hideEndscreen: '최종 화면 숨기기',
    removeEndscreenDesc: '동영상 끝 추천 영상 차단',
    showDislikes: '싫어요 표시',
    showLoading: '로딩 중 표시 (--)',
    showRetry: 'API 오류 시 재시도 텍스트',
    qualityLock: '화질 고정',
    optAutoQuality: '자동',
    cinemaMode: '영화관 모드',
    loopDefault: '자동 재생',
    loopVideos: '동영상 자동 재생',
    loopShorts: 'Shorts 자동 재생',
    hideComments: '댓글 숨기기',
    focusVideo: '동영상에만 집중',
    playbackSpeed: '재생 속도',
    resetSpeedHint: '속도 초기화',
    playlistMode: '재생목록 모드',
    playlistDesc: '재생목록 발견 시 전체 다운로드',
    downloadHotkey: '다운로드 단축키',
    defaultDownloadQuality: '다운로드 화질',
    highestQuality: '최고 비디오 화질',
    change: '변경',
    restore: '초기화',
    optionsHotkey: '설정 단축키',
    pipHotkey: '플로팅 플레이어 단축키',
    screenshotHotkey: '스크린샷 단축키',
    screenshotSound: '스크린샷 소리',
    exportSettings: '설정 내보내기',
    importSettings: '설정 가져오기',
    debugLogs: '디버그 로그 활성화',
    saved: '저장되었습니다.',
    saveFailed: '저장에 실패했습니다.',
    loadFailed: '로드에 실패했습니다.',
    exportReady: '설정을 내보냈습니다.',
    importDone: '설정을 가져왔습니다.',
    importFailed: '유효하지 않은 파일입니다.',
    resetDone: '기본값으로 복원되었습니다.',
    noResults: '설정을 찾을 수 없습니다',
    pressKey: '키를 누르세요...',
    conflict: 'YouTube 단축키와 충돌합니다',
    otherConflict: '다른 단축키와 충돌합니다',
    invalidKey: '유효하지 않은 키',
    audioOnly: '오디오 전용',
    thumbnails: '썸네일',
    toggleSidebarHint: '사이드바 전환',
    githubHint: 'GitHub 저장소',
    reportIssueHint: '문제 보고',
    clearSearchHint: '검색 지우기',
    themeHint: '테마 전환',
    exportHint: '설정을 파일로 내보내기',
    importHint: '파일에서 설정 가져오기',
    resetDefaultsHint: '모든 기본 설정 복원',
    quickAccess: '빠른 액세스',
    upToDate: '최신 상태',
    downloadAppHint: '다운로드를 활성화하려면 PC용 Tubeless를 다운로드하세요'
  },
  tr: {
    navGeneral: 'Genel',
    navAdBlocking: 'Reklam Engelleme',
    navDislikes: 'Beğenmeme',
    navProductivity: 'Verimlilik',
    navPlayer: 'Oynatıcı',
    navMedia: 'Medya',
    navAdvanced: 'Gelişmiş',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'Ayarlar',
    pageSubtitle: 'YouTube deneyiminizi kişiselleştirin.',
    searchPlaceholder: 'Ayarları ara...',
    resetDefaults: 'Varsayılana Dön',
    toggleTheme: 'Temayı Değiştir',
    sectionGeneral: 'Genel',
    sectionAdBlocking: 'Reklam Engelleme',
    sectionDislikes: 'Beğenmeme Sayacı',
    sectionProductivity: 'Verimlilik ve Akış',
    sectionPlayer: 'Oynatıcı',
    sectionMedia: 'Medya ve Kısayollar',
    sectionAdvanced: 'Gelişmiş',
    sectionData: 'Veri Yönetimi',
    labelLanguage: 'Dil',
    optAuto: 'Otomatik',
    adBlockEnabled: 'Tüm Reklamları Engelle',
    adBlockDesc: 'Gecikmesiz reklam kaldırma',
    deepWork: 'Derin Odak Modu',
    deepWorkDesc: 'Tüm dikkat dağıtıcıları kaldırmak için Derin Odak Modunu etkinleştirin',
    hideHome: 'Ana Sayfa Akışını Gizle',
    hideHomeDesc: 'Sadece aradıklarınızı görün',
    hideShorts: 'Shorts\'ları Gizle',
    cleanFeed: 'Sonsuz kaydırmayı durdur',
    hideShortsSearch: 'Aramada Shorts\'ları Gizle',
    focusSearch: 'Arama sonuçlarını temiz tut',
    hideSidebar: 'Yan Paneli Gizle',
    hideSidebarDesc: 'Yan panel önerilerini kaldır',
    hideEndscreen: 'Bitiş Ekranını Gizle',
    removeEndscreenDesc: 'Video sonundaki önerileri engelle',
    showDislikes: 'Beğenmemeleri Göster',
    showLoading: 'Yükleniyor göstergesi (--)',
    showRetry: 'API hatasında yeniden deneme metni',
    qualityLock: 'Kalite Kilidi',
    optAutoQuality: 'Otomatik',
    cinemaMode: 'Sinema Modu',
    loopDefault: 'Otomatik Tekrar',
    loopVideos: 'Videoları otomatik tekrarla',
    loopShorts: 'Shorts\'ları otomatik tekrarla',
    hideComments: 'Yorumları Gizle',
    focusVideo: 'Sadece videoya odaklan',
    playbackSpeed: 'Oynatma Hızı',
    resetSpeedHint: 'Hızı Sıfırla',
    playlistMode: 'Oynatma Listesi Modu',
    playlistDesc: 'Bulunursa tam oynatma listesini indir',
    downloadHotkey: 'İndirme Kısayolu',
    defaultDownloadQuality: 'İndirme Kalitesi',
    highestQuality: 'En Yüksek Video Kalitesi',
    change: 'Değiştir',
    restore: 'Sıfırla',
    optionsHotkey: 'Ayarlar Kısayolu',
    pipHotkey: 'Yüzen Oynatıcı Kısayolu',
    screenshotHotkey: 'Ekran Görüntüsü Kısayolu',
    screenshotSound: 'Ekran görüntüsü sesi',
    exportSettings: 'Ayarları Dışa Aktar',
    importSettings: 'Ayarları İçe Aktar',
    debugLogs: 'Hata ayıklama günlüklerini etkinleştir',
    saved: 'Kaydedildi.',
    saveFailed: 'Kaydetme başarısız.',
    loadFailed: 'Yükleme başarısız.',
    exportReady: 'Ayarlar dışa aktarıldı.',
    importDone: 'Ayarlar içe aktarıldı.',
    importFailed: 'Geçersiz dosya.',
    resetDone: 'Varsayılanlar geri yüklendi.',
    noResults: 'Ayar bulunamadı',
    pressKey: 'Bir tuşa basın...',
    conflict: 'YouTube tuşu ile çakışma',
    otherConflict: 'Başka bir kısayol ile çakışma',
    invalidKey: 'Geçersiz tuş',
    audioOnly: 'Sadece Ses',
    thumbnails: 'Küçük Resim',
    toggleSidebarHint: 'Yan paneli aç/kapat',
    githubHint: 'GitHub Deposu',
    reportIssueHint: 'Sorun bildir',
    clearSearchHint: 'Aramayı temizle',
    themeHint: 'Temayı değiştir',
    exportHint: 'Ayarları dosyaya dışa aktar',
    importHint: 'Ayarları dosyadan içe aktar',
    resetDefaultsHint: 'Tüm varsayılan ayarları geri yükle',
    quickAccess: 'Hızlı Erişim',
    upToDate: 'Güncel',
    downloadAppHint: 'İndirmeleri etkinleştirmek için PC için Tubeless\'ı indirin'
  },
  hi: {
    navGeneral: 'सामान्य',
    navAdBlocking: 'विज्ञापन अवरोधन',
    navDislikes: 'नापसंद',
    navProductivity: 'उत्पादकता',
    navPlayer: 'प्लेयर',
    navMedia: 'मीडिया',
    navAdvanced: 'उन्नत',
    brandName: 'Tubeless',
    brandHint: 'qalva',
    pageTitle: 'सेटिंग्स',
    pageSubtitle: 'अपने YouTube अनुभव को निजीकृत करें।',
    searchPlaceholder: 'सेटिंग्स खोजें...',
    resetDefaults: 'डिफ़ॉल्ट पुनर्स्थापित करें',
    toggleTheme: 'थीम बदलें',
    sectionGeneral: 'सामान्य',
    sectionAdBlocking: 'विज्ञापन अवरोधन',
    sectionDislikes: 'नापसंद काउंटर',
    sectionProductivity: 'उत्पादकता और फ़ीड',
    sectionPlayer: 'प्लेयर',
    sectionMedia: 'मीडिया और शॉर्टकट',
    sectionAdvanced: 'उन्नत',
    sectionData: 'डेटा प्रबंधन',
    labelLanguage: 'भाषा',
    optAuto: 'स्वचालित',
    adBlockEnabled: 'सभी विज्ञापनों को ब्लॉक करें',
    adBlockDesc: 'बिना किसी देरी के विज्ञापन हटाना',
    deepWork: 'गहन कार्य मोड',
    deepWorkDesc: 'सभी विकर्षणों को हटाने के लिए गहन कार्य मोड सक्रिय करें',
    hideHome: 'होम फ़ीड छुपाएं',
    hideHomeDesc: 'केवल वही देखें जो आप खोजते हैं',
    hideShorts: 'Shorts छुपाएं',
    cleanFeed: 'अंतहीन स्क्रॉलिंग रोकें',
    hideShortsSearch: 'खोज से Shorts छुपाएं',
    focusSearch: 'खोज परिणामों को साफ़ रखें',
    hideSidebar: 'साइडबार छुपाएं',
    hideSidebarDesc: 'साइडबार सिफारिशें हटाएं',
    hideEndscreen: 'एंडस्क्रीन छुपाएं',
    removeEndscreenDesc: 'अंत में अनुशंसित वीडियो ब्लॉक करें',
    showDislikes: 'नापसंद दिखाएं',
    showLoading: 'लोडिंग प्लेसहोल्डर (--)',
    showRetry: 'API विफलता पर पुन: प्रयास टेक्स्ट',
    qualityLock: 'गुणवत्ता लॉक',
    optAutoQuality: 'ऑटो',
    cinemaMode: 'सिनेमा मोड',
    loopDefault: 'ऑटो रिप्ले',
    loopVideos: 'वीडियो ऑटो रिप्ले',
    loopShorts: 'Shorts ऑटो रिप्ले',
    hideComments: 'कमेंट छुपाएं',
    focusVideo: 'केवल वीडियो पर ध्यान दें',
    playbackSpeed: 'प्लेबैक गति',
    resetSpeedHint: 'गति रीसेट करें',
    playlistMode: 'प्लेलिस्ट मोड',
    playlistDesc: 'मिलने पर पूरी प्लेलिस्ट डाउनलोड करें',
    downloadHotkey: 'डाउनलोड शॉर्टकट',
    defaultDownloadQuality: 'डाउनलोड गुणवत्ता',
    highestQuality: 'उच्चतम वीडियो गुणवत्ता',
    change: 'बदलें',
    restore: 'रीसेट',
    optionsHotkey: 'सेटिंग्स शॉर्टकट',
    pipHotkey: 'फ्लोटिंग प्लेयर शॉर्टकट',
    screenshotHotkey: 'स्क्रीनशॉट शॉर्टकट',
    screenshotSound: 'स्क्रीनशॉट ध्वनि',
    exportSettings: 'सेटिंग्स निर्यात करें',
    importSettings: 'सेटिंग्स आयात करें',
    debugLogs: 'डिबग लॉग सक्षम करें',
    saved: 'सहेजा गया।',
    saveFailed: 'सहेजना विफल रहा।',
    loadFailed: 'लोड करना विफल रहा।',
    exportReady: 'सेटिंग्स निर्यात की गईं।',
    importDone: 'सेटिंग्स आयात की गईं।',
    importFailed: 'अमान्य फ़ाइल।',
    resetDone: 'डिफ़ॉルト पुनर्स्थापित किया गया।',
    noResults: 'कोई सेटिंग्स नहीं मिलीं',
    pressKey: 'एक कुंजी दबाएं...',
    conflict: 'YouTube कुंजी के साथ संघर्ष',
    otherConflict: 'अन्य शॉर्टकट के साथ संघर्ष',
    invalidKey: 'अमान्य कुंजी',
    audioOnly: 'केवल ऑडियो',
    thumbnails: 'थंबनेल',
    quickAccess: 'त्वरित पहुंच',
    upToDate: 'अप टू डेट',
    downloadAppHint: 'डाउनलोड सक्षम करने के लिए पीसी के लिए Tubeless डाउनलोड करें'
  }
};

let currentLang = 'en';

function getLang(settingsLang) {
  if (settingsLang && settingsLang !== 'auto') return settingsLang;
  const lang = (navigator.language || 'en').toLowerCase();
  const supported = ['ar', 'fr', 'de', 'es', 'ja', 'zh', 'pt', 'ru', 'ko', 'tr', 'hi'];
  for (const s of supported) {
    if (lang.startsWith(s)) return s;
  }
  return 'en';
}

function t(key) {
  return UI_TEXT[currentLang][key] || UI_TEXT.en[key] || key;
}

function localize(langCode) {
  currentLang = getLang(langCode);
  const isRtl = currentLang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const text = (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) || UI_TEXT.en[key];
    if (text) el.textContent = text;
  });

  document.querySelectorAll('[data-t-placeholder]').forEach(el => {
    const key = el.getAttribute('data-t-placeholder');
    const text = (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) || UI_TEXT.en[key];
    if (text) el.placeholder = text;
  });

  document.querySelectorAll('[data-t-title]').forEach(el => {
    const key = el.getAttribute('data-t-title');
    const text = (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) || UI_TEXT.en[key];
    if (text) el.title = text;
  });
}

function getEl(id) {
  return document.getElementById(id);
}

function applyTheme(isDarkMode) {
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
}

function setStatus(key) {
  const status = getEl('status');
  if (!status) return;
  status.textContent = t(key);
  if (key === 'saved' || key === 'exportReady' || key === 'importDone' || key === 'resetDone') {
    setTimeout(() => { status.textContent = t('upToDate'); }, 2000);
  }
}

async function loadSettings() {
  try {
    const stored = await chrome.storage.local.get(settingKeys);
    const values = { ...DEFAULT_SETTINGS, ...stored };

    if (values.sidebarCollapsed) {
      document.querySelector('.sidebar')?.classList.add('collapsed');
    }

    localize(values.language);

    for (const key of settingKeys) {
      if (key === 'darkMode') {
        currentDarkMode = Boolean(values.darkMode);
        continue;
      }
      const el = getEl(key);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = Boolean(values[key]);
        } else if (el.tagName === 'SELECT') {
          el.value = values[key];
        } else if (el.type === 'range') {
          el.value = values[key];
          const valDisplay = getEl('speedVal');
          if (valDisplay) valDisplay.textContent = values[key] + 'x';
          updateActiveSpeedBtn(values[key]);
        } else if (el.type === 'text') {
          el.value = values[key];
        }
      }
    }
    applyTheme(currentDarkMode);
    updateThemeToggle(currentDarkMode);
    updateDislikeOptionsState(Boolean(values.showDislikes));
    updateShortsOptionsState(Boolean(values.hideShorts));
    initHotkeyRecorder('downloadHotkey', 'recordHotkeyBtn', 'hotkeyStatus', 'restoreHotkeyBtn');
    initHotkeyRecorder('optionsHotkey', 'recordOptionsHotkeyBtn', 'optionsHotkeyStatus', 'restoreOptionsHotkeyBtn');
    initHotkeyRecorder('pipHotkey', 'recordPipHotkeyBtn', 'pipHotkeyStatus', 'restorePipHotkeyBtn');
    initHotkeyRecorder('screenshotHotkey', 'recordScreenshotHotkeyBtn', 'screenshotHotkeyStatus', 'restoreScreenshotHotkeyBtn');
    updateScreenshotOptionsState(Boolean(values.screenshotSoundEnabled));
    initQuickAccess();
  } catch (err) {
    setStatus('loadFailed');
    console.error('[Tubeless Settings] load failed:', err);
  }
}



function updateActiveSpeedBtn(speed) {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    const btnSpeed = parseFloat(btn.dataset.speed);
    if (btnSpeed === parseFloat(speed)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    
    if (btnSpeed === 1) {
      btn.classList.add('default-speed');
    }
  });
}

function syncSliderRange() {
  const speedButtons = Array.from(document.querySelectorAll('.speed-btn'));
  if (speedButtons.length === 0) return;

  const speeds = speedButtons.map(btn => parseFloat(btn.dataset.speed)).sort((a, b) => a - b);
  const min = speeds[0];
  const max = speeds[speeds.length - 1];

  const slider = getEl('playbackSpeed');
  if (slider) {
    slider.min = min;
    slider.max = max;

    
    const percent = ((1 - min) / (max - min)) * 100;
    slider.style.setProperty('--tick-pos', `${percent}%`);
  }
}

function updateThemeToggle(isDarkMode) {
  const sunIcon = getEl('sunIcon');
  const moonIcon = getEl('moonIcon');
  if (sunIcon && moonIcon) {
    sunIcon.style.display = isDarkMode ? 'none' : 'block';
    moonIcon.style.display = isDarkMode ? 'block' : 'none';
  }
}

async function setTheme(isDarkMode) {
  currentDarkMode = isDarkMode;
  applyTheme(currentDarkMode);
  updateThemeToggle(currentDarkMode);
  try {
    await chrome.storage.local.set({ darkMode: currentDarkMode });
  } catch (err) {
    console.error('[Tubeless Settings] theme save failed:', err);
  }
}

function toggleTheme() {
  setTheme(!currentDarkMode);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportSettings() {
  const stored = await chrome.storage.local.get(settingKeys);
  const payload = {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    settings: { ...DEFAULT_SETTINGS, ...stored }
  };
  downloadJson('tubeless-settings.json', payload);
  setStatus('exportReady');
}

async function importSettingsFile(file) {
  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const incoming = parsed && parsed.settings ? parsed.settings : parsed;
    const merged = {};
    for (const key of settingKeys) {
      if (key in incoming) {
        merged[key] = incoming[key];
      } else {
        merged[key] = DEFAULT_SETTINGS[key];
      }
    }
    await chrome.storage.local.set(merged);
    await loadSettings();
    setStatus('importDone');
  } catch (err) {
    setStatus('importFailed');
    console.error('[Tubeless Settings] import failed:', err);
  }
}



async function resetDefaults() {
  const current = await chrome.storage.local.get(['darkMode', 'language']);
  await chrome.storage.local.set({ ...DEFAULT_SETTINGS, ...current });
  await loadSettings();
  setStatus('resetDone');
}

async function saveSetting(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    incrementSettingStat(key);
    if (key === 'showDislikes') {
      updateDislikeOptionsState(value);
    }

    
    const deepWorkOptions = ['hideShorts', 'hideComments', 'hideSidebarRecommendations', 'hideShortsSearch', 'hideHomeFeed', 'hideEndscreenRecommendations'];
    if (deepWorkOptions.includes(key) && value === false) {
      const stored = await chrome.storage.local.get(['deepWorkMode']);
      if (stored.deepWorkMode) {
        await chrome.storage.local.set({ deepWorkMode: false });
      }
    }

    if (key === 'hideShorts') {
      updateShortsOptionsState(value);
    }
  } catch (err) {
    setStatus('saveFailed');
    console.error('[Tubeless Settings] save failed:', err);
  }
}

function updateScreenshotOptionsState(isEnabled) {
  const el = getEl('screenshotSoundEnabled');
  if (el) {
    const label = el.closest('.setting');
    if (label) {
      
    }
  }
}

function updateDislikeOptionsState(isEnabled) {
  const subOptions = ['showLoadingState', 'showRetryState'];
  subOptions.forEach(id => {
    const el = getEl(id);
    if (el) {
      el.disabled = !isEnabled;
      const label = el.closest('.setting');
      if (label) {
        if (!isEnabled) {
          label.classList.add('disabled');
        } else {
          label.classList.remove('disabled');
        }
      }
    }
  });
}

function updateShortsOptionsState(isEnabled) {
  const shortsSearch = getEl('hideShortsSearch');
  if (!shortsSearch) return;

  chrome.storage.local.get(['hideShortsSearchManual'], (stored) => {
    const manualPref = stored.hideShortsSearchManual || false;

    if (isEnabled) {
      if (!shortsSearch.checked) {
        shortsSearch.checked = true;
        saveSetting('hideShortsSearch', true);
      }
      shortsSearch.disabled = true;
      shortsSearch.closest('.setting')?.classList.add('disabled');
    } else {
      shortsSearch.disabled = false;
      shortsSearch.closest('.setting')?.classList.remove('disabled');

      if (shortsSearch.checked !== manualPref) {
        shortsSearch.checked = manualPref;
        saveSetting('hideShortsSearch', manualPref);
      }
    }
  });
}

function setHotkeyStatus(key, statusId) {
  const status = getEl(statusId);
  if (!status) return;
  status.textContent = t(key);
  setTimeout(() => {
    if (status.textContent === t(key)) status.textContent = '';
  }, 2000);
}

function initHotkeyRecorder(inputId, btnId, statusId, restoreBtnId) {
  const input = getEl(inputId);
  const btn = getEl(btnId);
  const restoreBtn = getEl(restoreBtnId);
  if (!input || !btn) return;

  const forbidden = ['k', 'j', 'l', 'f', 'c', 'm', 'i', 't', 's', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', ',', '.', 'n', 'p', '<', '>', '?'];

  let isRecording = false;

  btn.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    startRecording();
  });

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      stopRecording();
      const defaultKey = DEFAULT_SETTINGS[inputId];
      input.value = defaultKey;
      saveSetting(inputId, defaultKey);
    });
  }

  function startRecording() {
    
    if (window._activeHotkeyStopFunc) window._activeHotkeyStopFunc();

    isRecording = true;
    btn.textContent = t('pressKey');
    input.classList.add('recording');
    window.addEventListener('keydown', handleKeyDown, true);
    window._activeHotkeyStopFunc = stopRecording;
  }

  function stopRecording() {
    isRecording = false;
    btn.textContent = t('change');
    input.classList.remove('recording');
    window.removeEventListener('keydown', handleKeyDown, true);
    window._activeHotkeyStopFunc = null;
  }

  function handleKeyDown(e) {
    e.preventDefault();
    e.stopPropagation();

    const key = e.key.toLowerCase();

    
    if (['control', 'shift', 'alt', 'meta', 'escape'].includes(key)) {
      if (key === 'escape') stopRecording();
      return;
    }

    if (forbidden.includes(key)) {
      setHotkeyStatus('conflict', statusId);
      return;
    }

    if (key.length > 1) {
      setHotkeyStatus('invalidKey', statusId);
      return;
    }

    
    const otherKeyIds = ['downloadHotkey', 'optionsHotkey', 'pipHotkey', 'screenshotHotkey'].filter(id => id !== inputId);
    for (const otherId of otherKeyIds) {
      const otherVal = getEl(otherId)?.value?.toLowerCase();
      if (key && key === otherVal) {
        setHotkeyStatus('otherConflict', statusId);
        return;
      }
    }

    input.value = key;
    saveSetting(inputId, key);
    stopRecording();
  }
}

async function incrementSettingStat(key) {
  const candidates = [
    'adBlockEnabled', 'showDislikes', 'deepWorkMode', 'hideShorts',
    'hideHomeFeed', 'cinemaMode', 'forceCinemaMode', 'loopDefault', 'autoReplayVideos', 'autoReplayShorts',
    'hideComments', 'hideSidebarRecommendations', 'hideEndscreenRecommendations'
  ];
  if (!candidates.includes(key)) return;

  const data = await chrome.storage.local.get('settingStats');
  const stats = data.settingStats || {};
  stats[key] = (stats[key] || 0) + 1;
  await chrome.storage.local.set({ settingStats: stats });
}

const SETTING_ICONS = {
  adBlockEnabled: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>',
  showDislikes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.33 2.33 0 0 1 22 4.33V9a2.33 2.33 0 0 1-2.33 2.33H17Z" /></svg>',
  deepWorkMode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>',
  hideShorts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></svg>',
  hideHomeFeed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>',
  cinemaMode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="15" rx="2" /><path d="M7 18h10" /></svg>',
  forceCinemaMode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="15" rx="2" /><path d="M7 18h10" /></svg>',
  loopDefault: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>',
  autoReplayVideos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>',
  autoReplayShorts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>',
  hideComments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="3" y1="3" x2="21" y2="21" /></svg>',
  hideSidebarRecommendations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>',
  hideEndscreenRecommendations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /></svg>',
  screenshotSoundEnabled: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>'
};

async function initQuickAccess() {
  const grid = document.querySelector('.quick-access-grid');
  if (!grid) return;

  const data = await chrome.storage.local.get(['settingStats', ...Object.keys(DEFAULT_SETTINGS)]);
  const stats = data.settingStats || {};
  const candidates = [
    'adBlockEnabled', 'showDislikes', 'deepWorkMode', 'hideShorts',
    'hideHomeFeed', 'cinemaMode', 'forceCinemaMode', 'loopDefault', 'autoReplayVideos', 'autoReplayShorts',
    'hideComments', 'hideSidebarRecommendations', 'hideEndscreenRecommendations'
  ];

  
  const sortedKeys = candidates.sort((a, b) => (stats[b] || 0) - (stats[a] || 0)).slice(0, 4);

  
  const firstPositions = new Map();
  Array.from(grid.children).forEach(btn => {
    firstPositions.set(btn.dataset.setting, btn.getBoundingClientRect());
  });

  
  const currentBtns = new Map();
  Array.from(grid.children).forEach(btn => currentBtns.set(btn.dataset.setting, btn));

  grid.innerHTML = '';
  sortedKeys.forEach(key => {
    let btn = currentBtns.get(key);
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'quick-btn';
      btn.dataset.setting = key;
      btn.innerHTML = SETTING_ICONS[key] || '';
      const tooltipKey = key === 'deepWorkMode' ? 'deepWork' :
        (key === 'forceCinemaMode' ? 'cinemaMode' :
          (key === 'autoReplayVideos' ? 'loopVideos' : 
            (key === 'autoReplayShorts' ? 'loopShorts' : 
              (key === 'loopVideo' ? 'loopDefault' : key))));
      btn.title = t(tooltipKey);

      btn.addEventListener('click', async () => {
        const d = await chrome.storage.local.get(key);
        const newVal = !d[key];
        await saveSetting(key, newVal);
        if (key === 'deepWorkMode') {
          const updates = {
            deepWorkMode: newVal,
            hideHomeFeed: newVal,
            hideSidebarRecommendations: newVal,
            hideShorts: newVal,
            hideShortsSearch: newVal,
            hideShortsSearchManual: newVal,
            hideEndscreenRecommendations: newVal,
            hideComments: newVal
          };
          await chrome.storage.local.set(updates);
          await loadSettings();
        }
      });
    }
    btn.classList.toggle('active', !!data[key]);
    grid.appendChild(btn);
  });

  
  Array.from(grid.children).forEach(btn => {
    const firstPos = firstPositions.get(btn.dataset.setting);
    if (firstPos) {
      const lastPos = btn.getBoundingClientRect();
      const dx = firstPos.left - lastPos.left;
      const dy = firstPos.top - lastPos.top;
      if (dx || dy) {
        btn.style.transition = 'none';
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
        btn.offsetHeight; 
        btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.transform = '';
      }
    } else {
      
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.8)';
      btn.offsetHeight;
      btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      btn.style.opacity = '1';
      btn.style.transform = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  syncSliderRange();

  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('loading');
      });
    });
  });

  getEl('exportBtn').addEventListener('click', exportSettings);
  getEl('importBtn').addEventListener('click', () => getEl('importFile').click());

  const themeToggle = getEl('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => toggleTheme());
  }

  const resetSettingsBtn = getEl('resetSettingsBtn');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetDefaults);
  }

  
  for (const key of settingKeys) {
    if (key === 'darkMode') continue;
    const el = getEl(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.addEventListener('change', async (e) => {
          const val = e.target.checked;
          await saveSetting(key, val);
          if (key === 'deepWorkMode') {
            const updates = {
              deepWorkMode: val,
              hideHomeFeed: val,
              hideSidebarRecommendations: val,
              hideShorts: val,
              hideShortsSearch: val,
              hideShortsSearchManual: val,
              hideEndscreenRecommendations: val,
              hideComments: val
            };
            await chrome.storage.local.set(updates);
            await loadSettings(); 
          }
          if (key === 'hideShortsSearch') {
            await saveSetting('hideShortsSearchManual', val);
          }
          if (key === 'hideShorts') updateShortsOptionsState(val);
        });
      } else if (el.tagName === 'SELECT') {
        el.addEventListener('change', (e) => {
          saveSetting(key, e.target.value);
          if (key === 'language') {
            localize(e.target.value);
            initQuickAccess();
          }
        });
      } else if (el.type === 'range') {
        el.addEventListener('input', (e) => {
          const valDisplay = getEl('speedVal');
          if (valDisplay) valDisplay.textContent = e.target.value + 'x';
          updateActiveSpeedBtn(e.target.value);
        });
        el.addEventListener('change', (e) => saveSetting(key, parseFloat(e.target.value)));
      }
    }
  }

  getEl('resetSpeedBtn')?.addEventListener('click', () => {
    const speed = 1;
    const slider = getEl('playbackSpeed');
    if (slider) slider.value = speed;
    const value = getEl('speedVal');
    if (value) value.textContent = '1x';
    updateActiveSpeedBtn(speed);
    saveSetting('playbackSpeed', speed);
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.dataset.speed);
      const speedSlider = getEl('playbackSpeed');
      if (speedSlider) {
        speedSlider.value = speed;
        const valDisplay = getEl('speedVal');
        if (valDisplay) valDisplay.textContent = speed + 'x';
        updateActiveSpeedBtn(speed);
        saveSetting('playbackSpeed', speed);
      }
    });
  });

  getEl('importFile').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (file) await importSettingsFile(file);
    event.target.value = '';
  });

  
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      for (const [key, change] of Object.entries(changes)) {
        const el = getEl(key);
        if (el && el.type === 'checkbox') {
          el.checked = change.newValue;
        } else if (el && el.tagName === 'SELECT') {
          el.value = change.newValue;
        }
        if (key === 'playbackSpeed') {
          const speed = parseFloat(change.newValue);
          const slider = getEl('playbackSpeed');
          if (slider) {
            slider.value = speed;
            const valDisplay = getEl('speedVal');
            if (valDisplay) valDisplay.textContent = speed + 'x';
            updateActiveSpeedBtn(speed);
            
            const min = parseFloat(slider.min) || 0.1;
            const max = parseFloat(slider.max) || 16;
            const percent = ((1 - min) / (max - min)) * 100;
            slider.style.setProperty('--tick-pos', percent + '%');
          }
        }
        if (key === 'hideShorts') {
          updateShortsOptionsState(change.newValue);
        }
        if (key === 'showDislikes') {
          updateDislikeOptionsState(change.newValue);
        }
        if (key === 'language') {
          localize(change.newValue);
          initQuickAccess();
        }
        if (key === 'downloadHotkey' || key === 'optionsHotkey') {
          if (el) el.value = change.newValue;
        }

        
        if (key === 'settingStats') {
          initQuickAccess();
        } else {
          const quickBtn = document.querySelector(`.quick-btn[data-setting="${key}"]`);
          if (quickBtn) {
            quickBtn.classList.toggle('active', !!change.newValue);
          }
        }
      }
    }
  });

  

  
  getEl('toggleSidebarBtn')?.addEventListener('click', () => {
    const sidebar = getEl('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
    chrome.storage.local.set({ sidebarCollapsed: sidebar.classList.contains('collapsed') });
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.settings-section');
  const contentArea = getEl('mainContent');

  function updateActiveLink() {
    if (!contentArea) return;
    let currentSection = '';
    const scrollPos = contentArea.scrollTop + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  }

  contentArea?.addEventListener('scroll', () => {
    updateActiveLink();
    const header = getEl('pageHeader');
    if (header) {
      header.classList.toggle('scrolled', contentArea.scrollTop > 20);
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = getEl(targetId);
      if (targetSection && contentArea) {
        contentArea.scrollTo({
          top: targetSection.offsetTop - 130,
          behavior: 'smooth'
        });
      }
    });
  });
  
  const searchInput = document.getElementById('settingsSearch');
  const clearBtn = document.getElementById('clearSearch');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearBtn.style.display = query ? 'block' : 'none';

    document.querySelectorAll('.settings-section').forEach(section => {
      let sectionHasMatch = false;

      
      const titleEl = section.querySelector('.section-title [data-t]');
      if (titleEl) {
        const titleKey = titleEl.getAttribute('data-t');
        for (const lang in UI_TEXT) {
          const translation = UI_TEXT[lang][titleKey];
          if (translation && translation.toLowerCase().includes(query)) {
            sectionHasMatch = true;
            break;
          }
        }
      }

      
      section.querySelectorAll('.setting').forEach(setting => {
        const visibleText = setting.innerText.toLowerCase();
        let isMatch = visibleText.includes(query);

        if (!isMatch) {
          const transElements = setting.querySelectorAll('[data-t]');
          for (const el of transElements) {
            const key = el.getAttribute('data-t');
            for (const lang in UI_TEXT) {
              const translation = UI_TEXT[lang][key];
              if (translation && translation.toLowerCase().includes(query)) {
                isMatch = true;
                break;
              }
            }
            if (isMatch) break;
          }
        }

        setting.style.display = isMatch || (sectionHasMatch && query.length > 2) ? 'flex' : 'none';
        if (isMatch) sectionHasMatch = true;
      });

      
      const speedSetting = section.querySelector('.setting [data-t="playbackSpeed"]')?.closest('.setting');
      if (speedSetting) {
        const isSpeedMatch = speedSetting.style.display === 'flex';
        const speedControls = section.querySelectorAll('.speed-btn-group, .custom-speed');
        speedControls.forEach(ctrl => ctrl.style.display = isSpeedMatch ? 'flex' : 'none');
      }

      
      section.querySelectorAll('.setting-group').forEach(group => {
        const visibleSettings = group.querySelectorAll('.setting[style*="display: flex"]');
        group.style.display = visibleSettings.length > 0 ? 'block' : 'none';
      });

      section.style.display = sectionHasMatch ? 'block' : 'none';
    });

    const noResults = document.getElementById('noResults');
    if (noResults) {
      const anyVisible = Array.from(document.querySelectorAll('.settings-section')).some(s => s.style.display !== 'none');
      noResults.style.display = anyVisible ? 'none' : 'flex';
    }

    
    updateActiveLink();
  });

  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
    updateActiveLink();
  });
});
