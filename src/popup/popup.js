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
  loopVideo: false,
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

async function incrementSettingStat(key) {
  const candidates = [
    'adBlockEnabled', 'showDislikes', 'deepWorkMode', 'hideShorts',
    'hideHomeFeed', 'cinemaMode', 'forceCinemaMode', 'loopDefault', 'loopVideo',
    'hideComments', 'hideSidebarRecommendations', 'hideEndscreenRecommendations'
  ];
  if (!candidates.includes(key)) return;

  const data = await chrome.storage.local.get('settingStats');
  const stats = data.settingStats || {};
  stats[key] = (stats[key] || 0) + 1;
  await chrome.storage.local.set({ settingStats: stats });
}

const UI_TEXT = {
  en: {
    brandName: 'Tubeless',
    settings: 'Settings',
    deepWork: 'Deep Work Mode',
    more: 'More',
    visualsLayout: 'Interface Cleanup',
    adBlocking: 'Content Filtering',
    adBlockEnabled: 'Blocks All Ads',
    adBlockDesc: 'Zero-latency ad removal',
    hideComments: 'Hide Comments',
    focusVideo: 'Focus on the video only',
    hideShorts: 'Hide Shorts',
    hideShortsSearch: 'Hide Shorts from Search',
    cleanFeed: 'Stop the unlimited scrolling',
    hideHome: 'Hide Home Feed',
    hideHomeDesc: 'See only what you search',
    playbackSpeed: 'Playback Speed',
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    language: 'Language',
    resetDefaults: 'Restore Defaults',
    resetSpeedHint: 'Reset Speed',
    showDislikesGrid: 'Show Dislikes',
    cinemaModeGrid: 'Cinema Mode',
    autoReplayGrid: 'Auto Replay',
    hideSidebarGrid: 'Hide Sidebar',
    restored: 'Restored',
    deepWorkOn: 'Deep Work ON',
    deepWorkOff: 'Deep Work OFF',
    focusSearch: 'Keep search results clean',
    downloadStarted: 'Downloading',
    downloadError: 'Server Error',
    loading: 'Loading...',
    noVideo: 'No Video',
    notAvailable: 'Not Available',
    download: 'Download',
    error: 'Error',
    videoQualities: 'Video Qualities',
    audioOptions: 'Audio Options',
    subtitles: 'Subtitles',
    thumbnails: 'Thumbnail',
    audioOnly: 'Audio Only',
    noSubtitles: 'No Subtitles',
    hd: 'HD',
    hideEndscreen: 'Hide Endscreen Wall',
    removeEndscreenDesc: 'Block recommended videos at the end',
    playlist: 'Playlist',
    playlistOptions: 'Playlist Options',
    downloadPlaylist: 'Download Full Playlist',
    playlistMode: 'Playlist Mode',
    brandHint: 'qalva',
    smartQualityLock: 'Quality Lock',
    preferredQuality: 'Preferred Quality',
    autoQuality: 'Auto',
    deepWorkHint: 'Activate Deep Work Mode to remove all distractions',
    moreHint: 'More options and settings',
    optionsHint: 'Open full settings page',
    resetDefaultsHint: 'Restore all default settings',
    themeHint: 'Switch between light and dark mode',
    langs: {
      en: 'English',
      ar: 'Arabic',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
      it: 'Italian',
      ja: 'Japanese',
      ko: 'Korean',
      pt: 'Portuguese',
      ru: 'Russian',
      zh: 'Chinese',
      tr: 'Turkish',
      hi: 'Hindi',
      vi: 'Vietnamese',
      th: 'Thai',
      id: 'Indonesian',
      pl: 'Polish',
      nl: 'Dutch',
      iw: 'Hebrew',
      he: 'Hebrew',
      bn: 'Bangla',
      ml: 'Malayalam',
      mr: 'Marathi',
      pa: 'Punjabi',
      ta: 'Tamil',
      te: 'Telugu',
      sv: 'Swedish',
      no: 'Norwegian',
      da: 'Danish',
      fi: 'Finnish',
      el: 'Greek',
      ro: 'Romanian',
      hu: 'Hungarian',
      cs: 'Czech',
      sk: 'Slovak',
      uk: 'Ukrainian',
      bg: 'Bulgarian',
      fa: 'Persian',
      ur: 'Urdu'
    },
    downloadApp: 'Download Tubeless for PC to enable downloads'
  },
  ar: {
    brandName: 'تيوب لِس',
    settings: 'الإعدادات',
    deepWork: 'وضع التركيز العميق',
    more: 'المزيد',
    visualsLayout: 'تنظيف الواجهة',
    adBlocking: 'تصفية المحتوى',
    adBlockEnabled: 'منع جميع الإعلانات',
    adBlockDesc: 'إزالة الإعلانات بدون تأخير',
    hideComments: 'إخفاء التعليقات',
    focusVideo: 'التركيز على الفيديو فقط',
    hideShorts: 'إخفاء الفيديوهات القصيرة',
    hideShortsSearch: 'إخفاء Shorts من البحث',
    cleanFeed: 'توقف عن التمرير غير المحدود',
    hideHome: 'إخفاء الصفحة الرئيسية',
    hideHomeDesc: 'شاهد فقط ما تبحث عنه',
    playbackSpeed: 'سرعة التشغيل',
    theme: 'المظهر',
    lightMode: 'فاتح',
    darkMode: 'داكن',
    language: 'اللغة',
    resetDefaults: 'استعادة الإعدادات الافتراضية',
    resetSpeedHint: 'إعادة ضبط السرعة',
    showDislikesGrid: 'عدد عدم الإعجاب',
    cinemaModeGrid: 'الوضع السينمائي',
    autoReplayGrid: 'تكرار تلقائي',
    hideSidebarGrid: 'إخفاء الشريط الجانبي',
    restored: 'تمت الاستعادة',
    deepWorkOn: 'وضع التركيز مفعّل',
    deepWorkOff: 'وضع التركيز معطّل',
    focusSearch: 'حافظ على نتائج البحث نظيفة',
    downloadStarted: 'جاري التحميل',
    downloadError: 'خطأ في الخادم',
    loading: 'جاري التحميل...',
    noVideo: 'لا يوجد فيديو',
    notAvailable: 'غير متاح',
    download: 'تحميل',
    error: 'خطأ',
    videoQualities: 'جودة الفيديو',
    audioOptions: 'خيارات الصوت',
    subtitles: 'الترجمة',
    thumbnails: 'صورة الفيديو',
    audioOnly: 'صوت فقط',
    noSubtitles: 'لا توجد ترجمة',
    hd: 'جودة عالية',
    hideEndscreen: 'إخفاء شاشة النهاية',
    removeEndscreenDesc: 'منع مقترحات الفيديو في النهاية',
    playlist: 'قائمة تشغيل',
    playlistOptions: 'خيارات قائمة التشغيل',
    downloadPlaylist: 'تحميل قائمة التشغيل بالكامل',
    playlistMode: 'وضع قائمة التشغيل',
    brandHint: 'qalva',
    smartQualityLock: 'قفل الجودة',
    preferredQuality: 'الجودة المفضلة',
    autoQuality: 'تلقائي',
    deepWorkHint: 'تفعيل وضع التركيز العميق لإزالة جميع المشتتات',
    moreHint: 'المزيد من الخيارات والإعدادات',
    optionsHint: 'فتح صفحة الإعدادات الكاملة',
    resetDefaultsHint: 'استعادة جميع الإعدادات الافتراضية',
    themeHint: 'التبديل بين المظهر الفاتح والداكن',
    langs: {
      en: 'الإنجليزية',
      ar: 'العربية',
      fr: 'الفرنسية',
      es: 'الإسبانية',
      de: 'الألمانية',
      it: 'الإيطالية',
      ja: 'اليابانية',
      ko: 'الكورية',
      pt: 'البرتغالية',
      ru: 'الروسية',
      zh: 'الصينية',
      tr: 'التركية',
      hi: 'الهندية',
      vi: 'الفيتنامية',
      th: 'التايلاندية',
      id: 'الإندونيسية',
      pl: 'البولندية',
      nl: 'الهولندية',
      iw: 'العبرية',
      he: 'العبرية',
      bn: 'البنغالية',
      ml: 'المالايالامية',
      mr: 'الماراثية',
      pa: 'البنجابية',
      ta: 'التاميلية',
      te: 'التيلوغوية',
      sv: 'السويدية',
      no: 'النرويجية',
      da: 'الدنماركية',
      fi: 'الفنلندية',
      el: 'اليونانية',
      ro: 'الرومانية',
      hu: 'المجرية',
      cs: 'التشيكية',
      sk: 'السلوفاكية',
      uk: 'الأوكرانية',
      bg: 'البلغارية',
      fa: 'الفارسية',
      ur: 'الأردية'
    },
    downloadApp: 'حمّل Tubeless للكمبيوتر لتفعيل التحميل'
  },
  fr: {
    brandName: 'Tubeless',
    settings: 'Paramètres',
    deepWork: 'Mode Concentration',
    more: 'Plus',
    visualsLayout: 'Nettoyage de l\'interface',
    adBlocking: 'Filtrage du contenu',
    adBlockEnabled: 'Bloque toutes les publicités',
    adBlockDesc: 'Suppression instantanée',
    hideComments: 'Masquer commentaires',
    focusVideo: 'Focus sur la vidéo',
    hideShorts: 'Masquer Shorts',
    hideShortsSearch: 'Masquer Shorts recherche',
    cleanFeed: 'Arrêtez le défilement illimité',
    hideHome: 'Masquer accueil',
    hideHomeDesc: 'Voyez seulement ce que vous cherchez',
    playbackSpeed: 'Vitesse de lecture',
    theme: 'Thème',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    language: 'Langue',
    resetDefaults: 'Restaurer défauts',
    resetSpeedHint: 'Réinitialiser la vitesse',
    showDislikesGrid: 'Afficher les dislikes',
    cinemaModeGrid: 'Mode Cinéma',
    autoReplayGrid: 'Relecture auto',
    hideSidebarGrid: 'Masquer barre latérale',
    restored: 'Restauré',
    deepWorkOn: 'Concentration ACTIVÉE',
    deepWorkOff: 'Concentration DÉSACTIVÉE',
    focusSearch: 'Recherche propre',
    downloadStarted: 'Téléchargement',
    downloadError: 'Erreur du Serveur',
    loading: 'Chargement...',
    noVideo: 'Aucune vidéo',
    notAvailable: 'Indisponible',
    download: 'Télécharger',
    error: 'Erreur',
    videoQualities: 'Qualités Vidéo',
    audioOptions: 'Options Audio',
    subtitles: 'Sous-titres',
    thumbnails: 'Miniature',
    audioOnly: 'Audio Uniquement',
    noSubtitles: 'Aucun sous-titre',
    hd: 'HD',
    hideEndscreen: 'Masquer Écran de Fin',
    removeEndscreenDesc: 'Bloquer les recommandations de fin',
    playlist: 'Playlist',
    playlistOptions: 'Options de Playlist',
    downloadPlaylist: 'Télécharger la Playlist complète',
    playlistMode: 'Mode Playlist',
    brandHint: 'qalva',
    smartQualityLock: 'Verrou de Qualité',
    preferredQuality: 'Qualité préférée',
    autoQuality: 'Auto',
    deepWorkHint: 'Activer le mode concentration pour supprimer les distractions',
    moreHint: 'Plus d\'options et de paramètres',
    optionsHint: 'Ouvrir la page des paramètres complets',
    resetDefaultsHint: 'Restaurer tous les paramètres par défaut',
    themeHint: 'Basculer entre le mode clair et sombre',
    langs: {
      en: 'Anglais',
      ar: 'Arabe',
      fr: 'Français',
      de: 'Allemand',
      es: 'Espagnol',
      ja: 'Japonais',
      zh: 'Chinois',
      pt: 'Portugais',
      ru: 'Russe',
      ko: 'Coréen',
      tr: 'Turc',
      hi: 'Hindi'
    },
    downloadApp: 'Téléchargez Tubeless pour PC pour activer les téléchargements'
  },
  de: {
    brandName: 'Tubeless',
    settings: 'Einstellungen',
    deepWork: 'Fokus-Modus',
    more: 'Mehr',
    visualsLayout: 'Oberfläche bereinigen',
    adBlocking: 'Inhaltsfilterung',
    adBlockEnabled: 'Alle Werbung blockieren',
    adBlockDesc: 'Werbeentfernung ohne Verzögerung',
    hideComments: 'Kommentare ausblenden',
    focusVideo: 'Nur auf das Video konzentrieren',
    hideShorts: 'Shorts ausblenden',
    hideShortsSearch: 'Shorts in der Suche ausblenden',
    cleanFeed: 'Endloses Scrollen stoppen',
    hideHome: 'Startseiten-Feed ausblenden',
    hideHomeDesc: 'Nur sehen, was du suchst',
    playbackSpeed: 'Wiedergabegeschwindigkeit',
    theme: 'Design',
    lightMode: 'Hell',
    darkMode: 'Dunkel',
    language: 'Sprache',
    resetDefaults: 'Standard wiederherstellen',
    resetSpeedHint: 'Geschwindigkeit zurücksetzen',
    showDislikesGrid: 'Dislikes anzeigen',
    cinemaModeGrid: 'Kinomodus',
    autoReplayGrid: 'Autom. Wiederholung',
    hideSidebarGrid: 'Seitenleiste ausblenden',
    restored: 'Wiederhergestellt',
    deepWorkOn: 'Fokus-Modus AN',
    deepWorkOff: 'Fokus-Modus AUS',
    focusSearch: 'Suche sauber halten',
    downloadStarted: 'Wird heruntergeladen',
    downloadError: 'Server-Fehler',
    loading: 'Lädt...',
    noVideo: 'Kein Video',
    notAvailable: 'Nicht verfügbar',
    download: 'Download',
    error: 'Fehler',
    videoQualities: 'Video-Qualitäten',
    audioOptions: 'Audio-Optionen',
    subtitles: 'Untertitel',
    thumbnails: 'Vorschaubild',
    audioOnly: 'Nur Audio',
    noSubtitles: 'Keine Untertitel',
    hd: 'HD',
    hideEndscreen: 'Endbildschirm ausblenden',
    removeEndscreenDesc: 'Empfohlene Videos am Ende blockieren',
    playlist: 'Playlist',
    playlistOptions: 'Playlist-Optionen',
    downloadPlaylist: 'Ganze Playlist laden',
    playlistMode: 'Playlist-Modus',
    brandHint: 'qalva',
    smartQualityLock: 'Qualitätssperre',
    preferredQuality: 'Bevorzugte Qualität',
    autoQuality: 'Auto',
    deepWorkHint: 'Aktiviere den Fokus-Modus, um alle Ablenkungen zu entfernen',
    moreHint: 'Weitere Optionen und Einstellungen',
    optionsHint: 'Vollständige Einstellungsseite öffnen',
    resetDefaultsHint: 'Alle Standardeinstellungen wiederherstellen',
    themeHint: 'Zwischen hellem und dunklem Modus wechseln',
    langs: {
      en: 'English',
      ar: 'Arabisch',
      fr: 'Französisch',
      de: 'Deutsch',
      es: 'Spanisch',
      ja: 'Japanisch',
      zh: 'Chinesisch',
      pt: 'Portugiesisch',
      ru: 'Russisch',
      ko: 'Koreanisch',
      tr: 'Türkisch',
      hi: 'Hindi'
    },
    downloadApp: 'Laden Sie Tubeless für PC herunter, um Downloads zu aktivieren'
  },
  es: {
    brandName: 'Tubeless',
    settings: 'Configuración',
    deepWork: 'Modo Concentración',
    more: 'Más',
    visualsLayout: 'Limpieza de Interfaz',
    adBlocking: 'Filtrado de Contenido',
    adBlockEnabled: 'Bloquea todos los anuncios',
    adBlockDesc: 'Eliminación sin latencia',
    hideComments: 'Ocultar Comentarios',
    focusVideo: 'Enfocarse solo en el video',
    hideShorts: 'Ocultar Shorts',
    hideShortsSearch: 'Ocultar Shorts en búsquedas',
    cleanFeed: 'Detener desplazamiento infinito',
    hideHome: 'Ocultar Feed de Inicio',
    hideHomeDesc: 'Mira solo lo que buscas',
    playbackSpeed: 'Velocidad de reproducción',
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    language: 'Idioma',
    resetDefaults: 'Restaurar Valores',
    resetSpeedHint: 'Reiniciar velocidad',
    showDislikesGrid: 'Mostrar Dislikes',
    cinemaModeGrid: 'Modo Cine',
    autoReplayGrid: 'Repetición Automática',
    hideSidebarGrid: 'Ocultar barra lateral',
    restored: 'Restaurado',
    deepWorkOn: 'Concentración ACTIVADA',
    deepWorkOff: 'Concentración DESACTIVADA',
    focusSearch: 'Búsqueda limpia',
    downloadStarted: 'Descargando',
    downloadError: 'Error de servidor',
    loading: 'Cargando...',
    noVideo: 'Sin Video',
    notAvailable: 'No disponible',
    download: 'Descargar',
    error: 'Error',
    videoQualities: 'Calidades de Video',
    audioOptions: 'Opciones de Audio',
    subtitles: 'Subtítulos',
    thumbnails: 'Miniatura',
    audioOnly: 'Solo Audio',
    noSubtitles: 'Sin subtítulos',
    hd: 'HD',
    hideEndscreen: 'Ocultar Pantalla Final',
    removeEndscreenDesc: 'Bloquear videos recomendados al final',
    playlist: 'Lista de reproducción',
    playlistOptions: 'Opciones de lista',
    downloadPlaylist: 'Descargar lista completa',
    playlistMode: 'Modo Lista',
    brandHint: 'qalva',
    smartQualityLock: 'Bloqueo de Calidad',
    preferredQuality: 'Calidad preferida',
    autoQuality: 'Auto',
    deepWorkHint: 'Activa el modo concentración para eliminar distracciones',
    moreHint: 'Más opciones y ajustes',
    optionsHint: 'Abrir página de ajustes completa',
    resetDefaultsHint: 'Restaurar todos los valores por defecto',
    themeHint: 'Cambiar entre modo claro y oscuro',
    langs: {
      en: 'Inglés',
      ar: 'Árabe',
      fr: 'Francés',
      de: 'Alemán',
      es: 'Español',
      ja: 'Japonés',
      zh: 'Chino',
      pt: 'Portugués',
      ru: 'Ruso',
      ko: 'Coreano',
      tr: 'Turco',
      hi: 'Hindi'
    },
    downloadApp: 'Descarga Tubeless para PC para activar las descargas'
  },
  ja: {
    brandName: 'Tubeless',
    settings: '設定',
    deepWork: 'ディープワークモード',
    more: 'もっと見る',
    visualsLayout: 'インターフェースの整理',
    adBlocking: 'コンテンツフィルタリング',
    adBlockEnabled: 'すべての広告をブロック',
    adBlockDesc: '遅延なしの広告削除',
    hideComments: 'コメントを非表示',
    focusVideo: '動画だけに集中する',
    hideShorts: 'Shortsを非表示',
    hideShortsSearch: '検索からShortsを非表示',
    cleanFeed: '無限スクロールを停止',
    hideHome: 'ホームフィードを非表示',
    hideHomeDesc: '検索したものだけを表示',
    playbackSpeed: '再生速度',
    theme: 'テーマ',
    lightMode: 'ライト',
    darkMode: 'ダーク',
    language: '言語',
    resetDefaults: 'デフォルトに戻す',
    resetSpeedHint: '速度をリセット',
    showDislikesGrid: '低評価を表示',
    cinemaModeGrid: 'シアターモード',
    autoReplayGrid: '自動リピート',
    hideSidebarGrid: 'サイドバーを非表示',
    restored: '復元されました',
    deepWorkOn: '集中モード ON',
    deepWorkOff: '集中モード OFF',
    focusSearch: '検索結果をクリーンに',
    downloadStarted: 'ダウンロード中',
    downloadError: 'サーバーエラー',
    loading: '読み込み中...',
    noVideo: '動画なし',
    notAvailable: '利用不可',
    download: '保存',
    error: 'エラー',
    videoQualities: '保存画質',
    audioOptions: '音声オプション',
    subtitles: '字幕',
    thumbnails: 'サムネイル',
    audioOnly: '音声のみ',
    noSubtitles: '字幕なし',
    hd: 'HD',
    hideEndscreen: '終了画面を非表示',
    removeEndscreenDesc: '終了時の推奨動画をブロック',
    playlist: 'プレイリスト',
    playlistOptions: 'リストのオプション',
    downloadPlaylist: '全件保存',
    playlistMode: 'リストモード',
    brandHint: 'qalva',
    smartQualityLock: '画質固定',
    preferredQuality: '優先画質',
    autoQuality: '自動',
    deepWorkHint: 'ディープワークモードを有効にして、すべての気を散らす要素を取り除きます',
    moreHint: 'その他のオプションと設定',
    optionsHint: '詳細設定ページを開く',
    resetDefaultsHint: 'すべての設定をデフォルトに戻す',
    themeHint: 'ライトモードとダークモードを切り替え',
    langs: {
      en: '英語',
      ar: 'アラビア語',
      fr: 'フランス語',
      de: 'ドイツ語',
      es: 'スペイン語',
      ja: '日本語',
      zh: '中国語',
      pt: 'ポルトガル語',
      ru: 'ロシア語',
      ko: '韓国語',
      tr: 'トルコ語',
      hi: 'ヒンディー語'
    },
    downloadApp: 'PC版Tubelessをダウンロードしてダウンロードを有効にする'
  },
  zh: {
    brandName: 'Tubeless',
    settings: '设置',
    deepWork: '深度专注模式',
    more: '更多',
    visualsLayout: '界面整理',
    adBlocking: '内容过滤',
    adBlockEnabled: '拦截所有广告',
    adBlockDesc: '零延迟广告移除',
    hideComments: '隐藏评论',
    focusVideo: '仅专注于视频',
    hideShorts: '隐藏 Shorts',
    hideShortsSearch: '从搜索中隐藏 Shorts',
    cleanFeed: '停止无限滚动',
    hideHome: '隐藏首页动态',
    hideHomeDesc: '只看你搜索的内容',
    playbackSpeed: '播放速度',
    theme: '主题',
    lightMode: '浅色',
    darkMode: '深色',
    language: '语言',
    resetDefaults: '恢复默认设置',
    resetSpeedHint: '重置速度',
    showDislikesGrid: '显示不喜欢',
    cinemaModeGrid: '影院模式',
    autoReplayGrid: '自动重播',
    hideSidebarGrid: '隐藏侧边栏',
    restored: '已恢复',
    deepWorkOn: '专注模式已开启',
    deepWorkOff: '专注模式已关闭',
    focusSearch: '保持搜索整洁',
    downloadStarted: '正在下载',
    downloadError: '服务器错误',
    loading: '加载中...',
    noVideo: '无视频',
    notAvailable: '不可用',
    download: '下载',
    error: '错误',
    videoQualities: '视频画质',
    audioOptions: '音频选项',
    subtitles: '字幕',
    thumbnails: '缩略图',
    audioOnly: '仅音频',
    noSubtitles: '无字幕',
    hd: 'HD',
    hideEndscreen: '隐藏片尾画面',
    removeEndscreenDesc: '拦截片尾推荐视频',
    playlist: '播放列表',
    playlistOptions: '列表选项',
    downloadPlaylist: '下载全部',
    playlistMode: '列表模式',
    brandHint: 'qalva',
    smartQualityLock: '画质锁定',
    preferredQuality: '首选画质',
    autoQuality: '自动',
    deepWorkHint: '开启深度专注模式以移除所有干扰',
    moreHint: '更多选项和设置',
    optionsHint: '打开完整设置页面',
    resetDefaultsHint: '恢复所有默认设置',
    themeHint: '在浅色和深色模式之间切换',
    langs: {
      en: '英语',
      ar: '阿拉伯语',
      fr: '法语',
      de: '德语',
      es: '西班牙语',
      ja: '日语',
      zh: '中文',
      pt: '葡萄牙语',
      ru: '俄语',
      ko: '韩语',
      tr: '土耳其语',
      hi: '印地语'
    },
    downloadApp: '下载 PC 版 Tubeless 以启用下载'
  },
  pt: {
    brandName: 'Tubeless',
    settings: 'Configurações',
    deepWork: 'Modo Foco',
    more: 'Mais',
    visualsLayout: 'Limpeza de Interface',
    adBlocking: 'Filtragem de Conteúdo',
    adBlockEnabled: 'Bloqueia todos os anúncios',
    adBlockDesc: 'Remoção sem latência',
    hideComments: 'Ocultar Comentários',
    focusVideo: 'Focar apenas no vídeo',
    hideShorts: 'Ocultar Shorts',
    hideShortsSearch: 'Ocultar Shorts na busca',
    cleanFeed: 'Parar rolagem infinita',
    hideHome: 'Ocultar Feed Inicial',
    hideHomeDesc: 'Veja apenas o que você pesquisa',
    playbackSpeed: 'Velocidade de reprodução',
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Escuro',
    language: 'Idioma',
    resetDefaults: 'Restaurar Padrões',
    resetSpeedHint: 'Resetar velocidade',
    showDislikesGrid: 'Mostrar Dislikes',
    cinemaModeGrid: 'Modo Cinema',
    autoReplayGrid: 'Repetição Automática',
    hideSidebarGrid: 'Ocultar barra lateral',
    restored: 'Restaurado',
    deepWorkOn: 'Foco ATIVADO',
    deepWorkOff: 'Foco DESATIVADO',
    focusSearch: 'Busca limpa',
    downloadStarted: 'Baixando',
    downloadError: 'Erro no servidor',
    loading: 'Carregando...',
    noVideo: 'Sem Vídeo',
    notAvailable: 'Indisponível',
    download: 'Download',
    error: 'Erro',
    videoQualities: 'Qualidades de Vídeo',
    audioOptions: 'Opções de Áudio',
    subtitles: 'Legendas',
    thumbnails: 'Miniatura',
    audioOnly: 'Apenas Áudio',
    noSubtitles: 'Sem legendas',
    hd: 'HD',
    hideEndscreen: 'Ocultar Tela Final',
    removeEndscreenDesc: 'Bloquear vídeos recomendados no final',
    playlist: 'Playlist',
    playlistOptions: 'Opções de lista',
    downloadPlaylist: 'Baixar completa',
    playlistMode: 'Modo Lista',
    brandHint: 'qalva',
    smartQualityLock: 'Bloqueio de Qualidade',
    preferredQuality: 'Qualidade preferida',
    autoQuality: 'Auto',
    deepWorkHint: 'Ative o modo foco para remover todas as distrações',
    moreHint: 'Mais opções e configurações',
    optionsHint: 'Abrir página de configurações completa',
    resetDefaultsHint: 'Restaurar todas as configurações padrão',
    themeHint: 'Alternar entre modo claro e escuro',
    langs: {
      en: 'Inglês',
      ar: 'Árabe',
      fr: 'Francês',
      de: 'Alemão',
      es: 'Espanhol',
      ja: 'Japonês',
      zh: 'Chinês',
      pt: 'Português',
      ru: 'Russo',
      ko: 'Coreano',
      tr: 'Turco',
      hi: 'Hindi'
    },
    downloadApp: 'Baixe o Tubeless para PC para ativar downloads'
  },
  ru: {
    brandName: 'Tubeless',
    settings: 'Настройки',
    deepWork: 'Режим концентрации',
    more: 'Еще',
    visualsLayout: 'Очистка интерфейса',
    adBlocking: 'Фильтрация контента',
    adBlockEnabled: 'Блокирует всю рекламу',
    adBlockDesc: 'Мгновенное удаление',
    hideComments: 'Скрыть комментарии',
    focusVideo: 'Фокус только на видео',
    hideShorts: 'Скрыть Shorts',
    hideShortsSearch: 'Скрыть Shorts из поиска',
    cleanFeed: 'Остановить бесконечную ленту',
    hideHome: 'Скрыть главную ленту',
    hideHomeDesc: 'Видеть только результаты поиска',
    playbackSpeed: 'Скорость воспроизведения',
    theme: 'Тема',
    lightMode: 'Светлая',
    darkMode: 'Темная',
    language: 'Язык',
    resetDefaults: 'Сбросить настройки',
    resetSpeedHint: 'Сбросить скорость',
    showDislikesGrid: 'Дизлайки',
    cinemaModeGrid: 'Режим кино',
    autoReplayGrid: 'Автоповтор',
    hideSidebarGrid: 'Скрыть панель',
    restored: 'Восстановлено',
    deepWorkOn: 'Концентрация ВКЛ',
    deepWorkOff: 'Концентрация ВЫКЛ',
    focusSearch: 'Чистый поиск',
    downloadStarted: 'Загрузка',
    downloadError: 'Ошибка сервера',
    loading: 'Загрузка...',
    noVideo: 'Нет видео',
    notAvailable: 'Недоступно',
    download: 'Скачать',
    error: 'Ошибка',
    videoQualities: 'Качество видео',
    audioOptions: 'Опции аудио',
    subtitles: 'Субтитры',
    thumbnails: 'Миниатюра',
    audioOnly: 'Только аудио',
    noSubtitles: 'Нет субтитров',
    hd: 'HD',
    hideEndscreen: 'Скрыть заставку',
    removeEndscreenDesc: 'Блокировать рекомендации в конце',
    playlist: 'Плейлист',
    playlistOptions: 'Опции списка',
    downloadPlaylist: 'Скачать весь плейлист',
    playlistMode: 'Режим списка',
    brandHint: 'qalva',
    smartQualityLock: 'Фиксация качества',
    preferredQuality: 'Приоритет качества',
    autoQuality: 'Авто',
    deepWorkHint: 'Включите режим глубокой концентрации, чтобы убрать всё лишнее',
    moreHint: 'Больше опций и настроек',
    optionsHint: 'Открыть полную страницу настроек',
    resetDefaultsHint: 'Восстановить все настройки по умолчанию',
    themeHint: 'Переключение между светлой и темной темой',
    langs: {
      en: 'Английский',
      ar: 'Арабский',
      fr: 'Французский',
      de: 'Немецкий',
      es: 'Испанский',
      ja: 'Японский',
      zh: 'Китайский',
      pt: 'Португальский',
      ru: 'Русский',
      ko: 'Корейский',
      tr: 'Турецкий',
      hi: 'Хинди'
    },
    downloadApp: 'Скачайте Tubeless для ПК, чтобы включить загрузки'
  },
  ko: {
    brandName: 'Tubeless',
    settings: '설정',
    deepWork: '딥 워크 모드',
    more: '더 보기',
    visualsLayout: '인터페이스 정리',
    adBlocking: '콘텐츠 차단',
    adBlockEnabled: '모든 광고 차단',
    adBlockDesc: '지연 없는 광고 제거',
    hideComments: '댓글 숨기기',
    focusVideo: '동영상에만 집중',
    hideShorts: 'Shorts 숨기기',
    hideShortsSearch: '검색에서 Shorts 숨기기',
    cleanFeed: '무한 스크롤 중지',
    hideHome: '홈 피드 숨기기',
    hideHomeDesc: '검색한 내용만 표시',
    playbackSpeed: '재생 속도',
    theme: '테마',
    lightMode: '라이트',
    darkMode: '다크',
    language: '언어',
    resetDefaults: '기본값 복원',
    resetSpeedHint: '속도 초기화',
    showDislikesGrid: '싫어요 표시',
    cinemaModeGrid: '영화관 모드',
    autoReplayGrid: '자동 재생',
    hideSidebarGrid: '사이드바 숨기기',
    restored: '복원됨',
    deepWorkOn: '집중 모드 켜짐',
    deepWorkOff: '집중 모드 꺼짐',
    focusSearch: '검색 결과 정리',
    downloadStarted: '다운로드 중',
    downloadError: '서버 오류',
    loading: '로딩 중...',
    noVideo: '동영상 없음',
    notAvailable: '사용 불가',
    download: '다운로드',
    error: '오류',
    videoQualities: '비디오 화질',
    audioOptions: '오디오 옵션',
    subtitles: '자막',
    thumbnails: '썸네일',
    audioOnly: '오디오 전용',
    noSubtitles: '자막 없음',
    hd: 'HD',
    hideEndscreen: '최종 화면 숨기기',
    removeEndscreenDesc: '동영상 끝 추천 영상 차단',
    playlist: '재생목록',
    playlistOptions: '목록 옵션',
    downloadPlaylist: '전체 다운로드',
    playlistMode: '목록 모드',
    brandHint: 'qalva',
    smartQualityLock: '화질 고정',
    preferredQuality: '선호 화질',
    autoQuality: '자동',
    deepWorkHint: '딥 워크 모드를 활성화하여 모든 방해 요소를 제거합니다',
    moreHint: '추가 옵션 및 설정',
    optionsHint: '전체 설정 페이지 열기',
    resetDefaultsHint: '모든 기본 설정 복원',
    themeHint: '라이트 모드와 다크 모드 간 전환',
    langs: {
      en: '영어',
      ar: '아랍어',
      fr: '프랑스어',
      de: '독일어',
      es: '스페인어',
      ja: '일본어',
      zh: '중국어',
      pt: '포르투갈어',
      ru: '러시아어',
      ko: '한국어',
      tr: '터키어',
      hi: '힌디어'
    },
    downloadApp: '다운로드를 활성화하려면 PC용 Tubeless를 다운로드하세요'
  },
  tr: {
    brandName: 'Tubeless',
    settings: 'Ayarlar',
    deepWork: 'Derin Odak Modu',
    more: 'Daha Fazla',
    visualsLayout: 'Arayüz Temizliği',
    adBlocking: 'İçerik Filtreleme',
    adBlockEnabled: 'Tüm reklamları engelle',
    adBlockDesc: 'Gecikmesiz kaldırma',
    hideComments: 'Yorumları Gizle',
    focusVideo: 'Sadece videoya odaklan',
    hideShorts: 'Shorts\'ları Gizle',
    hideShortsSearch: 'Aramada Shorts gizle',
    cleanFeed: 'Sonsuz kaydırmayı durdur',
    hideHome: 'Ana Sayfayı Gizle',
    hideHomeDesc: 'Sadece aradıklarını gör',
    playbackSpeed: 'Oynatma Hızı',
    theme: 'Tema',
    lightMode: 'Açık',
    darkMode: 'Koyu',
    language: 'Dil',
    resetDefaults: 'Varsayılana Dön',
    resetSpeedHint: 'Hızı Sıfırla',
    showDislikesGrid: 'Beğenmemeleri Göster',
    cinemaModeGrid: 'Sinema Modu',
    autoReplayGrid: 'Otomatik Tekrar',
    hideSidebarGrid: 'Yan Paneli Gizle',
    restored: 'Geri Yüklendi',
    deepWorkOn: 'Odak Modu AÇIK',
    deepWorkOff: 'Odak Modu KAPALI',
    focusSearch: 'Temiz arama',
    downloadStarted: 'İndiriliyor',
    downloadError: 'Sunucu hatası',
    loading: 'Yükleniyor...',
    noVideo: 'Video Yok',
    notAvailable: 'Mevcut Değil',
    download: 'İndir',
    error: 'Hata',
    videoQualities: 'Video Kaliteleri',
    audioOptions: 'Ses Seçenekleri',
    subtitles: 'Altyazılar',
    thumbnails: 'Küçük Resim',
    audioOnly: 'Sadece Ses',
    noSubtitles: 'Altyazı yok',
    hd: 'HD',
    hideEndscreen: 'Bitiş Ekranını Gizle',
    removeEndscreenDesc: 'Video sonu önerileri engelle',
    playlist: 'Oynatma Listesi',
    playlistOptions: 'Liste seçenekleri',
    downloadPlaylist: 'Tamamını indir',
    playlistMode: 'Liste Modu',
    brandHint: 'qalva',
    smartQualityLock: 'Kalite Kilidi',
    preferredQuality: 'Tercih edilen kalite',
    autoQuality: 'Otomatik',
    deepWorkHint: 'Tüm dikkat dağıtıcıları kaldırmak için derin odak modunu etkinleştirin',
    moreHint: 'Daha fazla seçenek ve ayar',
    optionsHint: 'Tam ayarlar sayfasını aç',
    resetDefaultsHint: 'Tüm varsayılan ayarları geri yükle',
    themeHint: 'Açık ve koyu mod arasında geçiş yap',
    langs: {
      en: 'İngilizce',
      ar: 'Arapça',
      fr: 'Fransızca',
      de: 'Almanca',
      es: 'İspanyolca',
      ja: 'Japonca',
      zh: 'Çince',
      pt: 'Portekizce',
      ru: 'Rusça',
      ko: 'Korece',
      tr: 'Türkçe',
      hi: 'Hintçe'
    },
    downloadApp: 'İndirmeleri etkinleştirmek için PC için Tubeless\'ı indirin'
  },
  hi: {
    brandName: 'Tubeless',
    settings: 'सेटिंग्स',
    deepWork: 'गहन कार्य मोड',
    more: 'अधिक',
    visualsLayout: 'इंटरफ़ेस सफ़ाई',
    adBlocking: 'सामग्री फ़िल्टरिंग',
    adBlockEnabled: 'सभी विज्ञापनों को ब्लॉक करें',
    adBlockDesc: 'बिना किसी देरी के हटाना',
    hideComments: 'कमेंट छुपाएं',
    focusVideo: 'केवल वीडियो पर ध्यान दें',
    hideShorts: 'Shorts छुपाएं',
    hideShortsSearch: 'खोज से Shorts छुपाएं',
    cleanFeed: 'अनंत स्क्रॉलिंग रोकें',
    hideHome: 'होम फ़ीड छुपाएं',
    hideHomeDesc: 'केवल वही देखें जो आप खोजते हैं',
    playbackSpeed: 'प्लेबैक गति',
    theme: 'थीम',
    lightMode: 'हल्का',
    darkMode: 'डार्क',
    language: 'भाषा',
    resetDefaults: 'डिफ़ॉल्ट पुनर्स्थापित करें',
    resetSpeedHint: 'गति रीसेट करें',
    showDislikesGrid: 'नापसंद दिखाएं',
    cinemaModeGrid: 'सिनेमा मोड',
    autoReplayGrid: 'ऑटो रिप्ले',
    hideSidebarGrid: 'साइडबार छुपाएं',
    restored: 'पुनर्स्थापित',
    deepWorkOn: 'गहन कार्य चालू',
    deepWorkOff: 'गहन कार्य बंद',
    focusSearch: 'सफ़ाई से खोजें',
    downloadStarted: 'डाउनलोड हो रहा है',
    downloadError: 'सर्वर त्रुटि',
    loading: 'लोड हो रहा है...',
    noVideo: 'कोई वीडियो नहीं',
    notAvailable: 'उपलब्ध नहीं',
    download: 'डाउनलोड',
    error: 'त्रुटि',
    videoQualities: 'वीडियो गुणवत्ता',
    audioOptions: 'ऑडियो विकल्प',
    subtitles: 'सबटाइटल्स',
    thumbnails: 'थंबनेल',
    audioOnly: 'केवल ऑडियो',
    noSubtitles: 'कोई सबटाइटल्स नहीं',
    hd: 'HD',
    hideEndscreen: 'एंडस्क्रीन छुपाएं',
    removeEndscreenDesc: 'अंत में सिफारिशें ब्लॉक करें',
    playlist: 'प्लेलिस्ट',
    playlistOptions: 'प्लेलिस्ट विकल्प',
    downloadPlaylist: 'पूरी प्लेलिस्ट डाउनलोड करें',
    playlistMode: 'प्लेलिस्ट मोड',
    brandHint: 'qalva',
    smartQualityLock: 'गुणवत्ता लॉक',
    preferredQuality: 'पसंदीदा गुणवत्ता',
    autoQuality: 'ऑटो',
    deepWorkHint: 'सभी विकर्षणों को हटाने के लिए गहन कार्य मोड सक्रिय करें',
    moreHint: 'अधिक विकल्प और सेटिंग्स',
    optionsHint: 'पूर्ण सेटिंग्स पेज खोलें',
    resetDefaultsHint: 'सभी डिफ़ॉルト सेटिंग्स पुनर्स्थापित करें',
    themeHint: 'हल्के और डार्क मोड के बीच स्विच करें',
    langs: {
      en: 'अंग्रेज़ी',
      ar: 'अरबी',
      fr: 'फ़्रेंच',
      de: 'जर्मन',
      es: 'स्पेनिश',
      ja: 'जापानी',
      zh: 'चीनी',
      pt: 'पुर्तगाली',
      ru: 'रूसी',
      ko: 'कोरियाई',
      tr: 'तुर्की',
      hi: 'हिंदी'
    },
    downloadApp: 'डाउनलोड सक्षम करने के लिए पीसी के लिए Tubeless डाउनलोड करें'
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
    if (UI_TEXT[currentLang][key]) {
      el.textContent = UI_TEXT[currentLang][key];
    }
  });

  
  if (typeof ytPlusDownload !== 'undefined') {
    ytPlusDownload.refreshLocalization();
  }

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

async function loadSettings() {
  try {
    const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    const values = { ...DEFAULT_SETTINGS, ...stored };
    localize(values.language);
    const checkboxes = ['showDislikes', 'hideShorts', 'forceCinemaMode', 'hideComments', 'loopVideo', 'hideSidebarRecommendations', 'hideShortsSearch', 'adBlockEnabled', 'hideEndscreenRecommendations', 'hideHomeFeed'];
    checkboxes.forEach(id => {
      const el = getEl(id);
      if (el) el.checked = Boolean(values[id]);
    });

    
    const qualityLock = values.smartQualityLock || 'auto';
    const lockText = getEl('smartQualityLockText');
    if (lockText) {
      if (qualityLock === 'auto') {
        lockText.setAttribute('data-t', 'autoQuality');
        lockText.textContent = t('autoQuality');
      } else {
        lockText.removeAttribute('data-t');
        lockText.textContent = qualityLock;
      }
    }
    updateActiveQualityLock(qualityLock);

    const speed = values.playbackSpeed || 1;
    getEl('speedSlider').value = speed;
    getEl('speedValue').textContent = speed + 'x';
    updateActiveSpeedBtn(speed);
    updateShortsDependency();
    applyTheme(Boolean(values.darkMode));
    const deepWorkBtn = getEl('deepWorkBtn');
    if (deepWorkBtn) {
      if (values.deepWorkMode) deepWorkBtn.classList.add('active');
      else deepWorkBtn.classList.remove('active');
    }
    setTimeout(() => { document.body.classList.remove('loading'); }, 100);
  } catch (err) { console.error('[Tubeless] load failed:', err); }
}

async function saveSetting(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    incrementSettingStat(key);

    
    const deepWorkOptions = ['hideShorts', 'hideComments', 'hideSidebarRecommendations', 'hideShortsSearch', 'hideHomeFeed', 'hideEndscreenRecommendations'];
    if (deepWorkOptions.includes(key) && value === false) {
      const stored = await chrome.storage.local.get(['deepWorkMode']);
      if (stored.deepWorkMode) {
        await chrome.storage.local.set({ deepWorkMode: false });
        
        showStatus('deepWorkOff');
      }
    }
  }
  catch (err) { console.error('[Tubeless] save failed:', err); }
}

function showStatus(key) {
  const status = getEl('status');
  if (!status) return;
  status.textContent = t(key);
  setTimeout(() => { status.textContent = ''; }, 1000);
}

function updateActiveSpeedBtn(speed) {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    const btnSpeed = parseFloat(btn.dataset.speed);
    if (btnSpeed === parseFloat(speed)) btn.classList.add('active');
    else btn.classList.remove('active');

    if (btnSpeed === 1) btn.classList.add('default-speed');
  });

  const slider = getEl('speedSlider');
  if (slider) {
    const min = parseFloat(slider.min) || 0.1;
    const max = parseFloat(slider.max) || 16;
    const percent = ((1 - min) / (max - min)) * 100;
    slider.style.setProperty('--tick-pos', `${percent}%`);
  }
}

function updateActiveQualityLock(quality) {
  document.querySelectorAll('.quality-lock-opt').forEach(btn => {
    if (btn.dataset.quality === quality) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
}

function updateShortsDependency() {
  const hideShorts = getEl('hideShorts');
  const hideShortsSearch = getEl('hideShortsSearch');
  if (!hideShorts || !hideShortsSearch) return;

  chrome.storage.local.get(['hideShortsSearchManual'], (stored) => {
    const manualPref = stored.hideShortsSearchManual || false;

    if (hideShorts.checked) {
      
      if (!hideShortsSearch.checked) {
        hideShortsSearch.checked = true;
        saveSetting('hideShortsSearch', true);
      }
      hideShortsSearch.disabled = true;
      hideShortsSearch.closest('.setting-item')?.classList.add('disabled');
    } else {
      
      hideShortsSearch.disabled = false;
      hideShortsSearch.closest('.setting-item')?.classList.remove('disabled');

      if (hideShortsSearch.checked !== manualPref) {
        hideShortsSearch.checked = manualPref;
        saveSetting('hideShortsSearch', manualPref);
      }
    }
  });
}

async function toggleDeepWork() {
  const stored = await chrome.storage.local.get(['deepWorkMode']);
  const newMode = !stored.deepWorkMode;
  const updates = {
    deepWorkMode: newMode,
    hideHomeFeed: newMode,
    hideSidebarRecommendations: newMode,
    hideShorts: newMode,
    hideShortsSearch: newMode,
    hideShortsSearchManual: newMode, 
    hideEndscreenRecommendations: newMode,
    hideComments: newMode
  };
  await chrome.storage.local.set(updates);
  incrementSettingStat('deepWorkMode');

  
  const deepWorkBtn = getEl('deepWorkBtn');
  if (deepWorkBtn) {
    if (newMode) deepWorkBtn.classList.add('active');
    else deepWorkBtn.classList.remove('active');
  }

  const checkboxes = ['hideShorts', 'hideComments', 'hideSidebarRecommendations', 'hideShortsSearch', 'hideEndscreenRecommendations', 'hideHomeFeed'];
  checkboxes.forEach(id => {
    const el = getEl(id);
    if (el) el.checked = newMode;
  });

  showStatus(newMode ? 'deepWorkOn' : 'deepWorkOff');
}


document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  getEl('themeMenuBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    getEl('moreMenuDropdown').classList.remove('show');
    const themeMenu = getEl('themeMenuDropdown');
    themeMenu.classList.add('show');
    
    themeMenu.querySelectorAll('.theme-opt').forEach(opt => {
      const isDark = opt.dataset.themeVal === 'dark';
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if ((isDark && currentTheme === 'dark') || (!isDark && currentTheme !== 'dark')) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  });

  getEl('themeBackBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    getEl('themeMenuDropdown').classList.remove('show');
    getEl('moreMenuDropdown').classList.add('show');
  });

  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isDark = btn.dataset.themeVal === 'dark';
      applyTheme(isDark);
      await saveSetting('darkMode', isDark);
      closeAllDropdowns();
    });
  });

  getEl('languageToggle').addEventListener('click', async (e) => {
    e.stopPropagation();
    const moreMenuDropdown = getEl('moreMenuDropdown');
    const langDropdown = getEl('languageMenuDropdown');

    if (moreMenuDropdown) moreMenuDropdown.classList.remove('show');
    if (langDropdown) {
      langDropdown.classList.add('show');
      
      langDropdown.querySelectorAll('.lang-opt').forEach(opt => {
        if (opt.dataset.lang === currentLang) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });
    }
  });

  getEl('langBackBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    getEl('languageMenuDropdown').classList.remove('show');
    getEl('moreMenuDropdown').classList.add('show');
  });

  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const newLang = btn.dataset.lang;
      localize(newLang);
      await saveSetting('language', newLang);
      closeAllDropdowns();
    });
  });

  const moreMenuBtn = getEl('moreMenuBtn');
  const moreMenuDropdown = getEl('moreMenuDropdown');

  if (moreMenuBtn && moreMenuDropdown) {
    moreMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = moreMenuDropdown.classList.contains('show');
      closeAllDropdowns();
      if (!isShowing) {
        moreMenuDropdown.classList.add('show');
        getEl('menuBackdrop')?.classList.add('show');
        setTimeout(() => {
          const selected = moreMenuDropdown.querySelector('.selected');
          const first = moreMenuDropdown.querySelector('button, .menu-item');
          const target = selected || first;
          if (target) {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: 'nearest' });
          }
        }, 350);
      }
    });
  }

  document.addEventListener('click', closeAllDropdowns);
  getEl('menuBackdrop')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns();
  });

  function closeAllDropdowns() {
    if (moreMenuDropdown) moreMenuDropdown.classList.remove('show');
    const qContent = getEl('qualityDropdownContent');
    if (qContent) qContent.classList.remove('show');
    const lContent = getEl('languageMenuDropdown');
    if (lContent) lContent.classList.remove('show');
    const tContent = getEl('themeMenuDropdown');
    if (tContent) tContent.classList.remove('show');
    const qLockContent = getEl('smartQualityLockDropdown');
    if (qLockContent) qLockContent.classList.remove('show');
    getEl('menuBackdrop')?.classList.remove('show');
  }
  window.YTPlus_closeAllDropdowns = closeAllDropdowns;

  getEl('deepWorkBtn')?.addEventListener('click', toggleDeepWork);
  getEl('resetSettingsBtn')?.addEventListener('click', async () => {
    const current = await chrome.storage.local.get(['darkMode', 'language']);
    await chrome.storage.local.set({ ...DEFAULT_SETTINGS, ...current });
    await loadSettings();
    showStatus('restored');
    closeAllDropdowns();
  });

  getEl('smartQualityLockBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns();
    getEl('smartQualityLockDropdown').classList.add('show');
    getEl('menuBackdrop').classList.add('show');
  });

  document.querySelectorAll('.quality-lock-opt').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const quality = btn.dataset.quality;
      const lockText = getEl('smartQualityLockText');
      if (lockText) {
        if (quality === 'auto') {
          lockText.setAttribute('data-t', 'autoQuality');
          lockText.textContent = t('autoQuality');
        } else {
          lockText.removeAttribute('data-t');
          lockText.textContent = quality;
        }
      }
      updateActiveQualityLock(quality);
      await saveSetting('smartQualityLock', quality);
      closeAllDropdowns();
    });
  });

  ['showDislikes', 'hideShorts', 'forceCinemaMode', 'hideComments', 'loopVideo', 'hideSidebarRecommendations', 'hideShortsSearch', 'adBlockEnabled', 'hideEndscreenRecommendations', 'hideHomeFeed'].forEach(id => {
    getEl(id)?.addEventListener('change', async (e) => {
      const val = e.target.checked;
      await saveSetting(id, val);
      if (id === 'hideShortsSearch') {
        await saveSetting('hideShortsSearchManual', val);
      }
      if (id === 'hideShorts') updateShortsDependency();
    });
  });

  
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      for (const [key, change] of Object.entries(changes)) {
        const el = getEl(key);
        if (el && el.type === 'checkbox') {
          el.checked = change.newValue;
        }
        if (key === 'deepWorkMode') {
          const deepWorkBtn = getEl('deepWorkBtn');
          if (deepWorkBtn) {
            if (change.newValue) deepWorkBtn.classList.add('active');
            else deepWorkBtn.classList.remove('active');
          }
        }
        if (key === 'hideShorts') {
          updateShortsDependency();
        }
        if (key === 'playbackSpeed') {
          const speed = parseFloat(change.newValue);
          const slider = getEl('speedSlider');
          if (slider) {
            slider.value = speed;
            const value = getEl('speedValue');
            if (value) value.textContent = speed + 'x';
            updateActiveSpeedBtn(speed);
          }
        }
        if (key === 'language') {
          localize(change.newValue);
        }
        if (key === 'darkMode') {
          applyTheme(change.newValue);
        }
      }
    }
  });

  getEl('resetSpeedBtn')?.addEventListener('click', () => {
    const speed = 1;
    const slider = getEl('speedSlider');
    if (slider) slider.value = speed;
    const value = getEl('speedValue');
    if (value) value.textContent = '1x';
    updateActiveSpeedBtn(speed);
    saveSetting('playbackSpeed', speed);
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.dataset.speed);
      getEl('speedSlider').value = speed;
      getEl('speedValue').textContent = speed + 'x';
      updateActiveSpeedBtn(speed);
      saveSetting('playbackSpeed', speed);
    });
  });

  getEl('speedSlider').addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    getEl('speedValue').textContent = speed + 'x';
    updateActiveSpeedBtn(speed);
    saveSetting('playbackSpeed', speed);
  });

  getEl('openOptionsBtn').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    closeAllDropdowns();
  });

  ytPlusDownload.init();
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'YTPLUS_VIDEO_CHANGED') ytPlusDownload.init();
  });

  
  document.addEventListener('keydown', (e) => {
    const activeDropdown = document.querySelector('.dropdown-content.show');

    
    if (e.key === 'Enter') {
      if (activeDropdown) {
        const items = Array.from(activeDropdown.querySelectorAll('button:not([disabled]), .menu-item:not([disabled])'))
          .filter(el => el.offsetParent !== null);
        const currentIndex = items.indexOf(document.activeElement);
        if (currentIndex !== -1) {
          e.preventDefault();
          items[currentIndex].click();
          return;
        }
      } else {
        
        const activeEl = document.activeElement;
        const isTextInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;

        if (!isTextInput) {
          const downloadBtn = getEl('ytPlusDownloadBtn');
          if (downloadBtn && !downloadBtn.disabled && downloadBtn.style.display !== 'none') {
            e.preventDefault();
            ytPlusDownload.startDownload();
          }
        }
      }
      return;
    }

    if (!activeDropdown) return;

    const items = Array.from(activeDropdown.querySelectorAll('button:not([disabled]), .menu-item:not([disabled])'))
      .filter(el => el.offsetParent !== null);

    if (items.length === 0) return;

    let currentIndex = items.indexOf(document.activeElement);

    
    if (currentIndex === -1) {
      currentIndex = items.findIndex(item => item.classList.contains('selected'));
    }

    let nextIndex = currentIndex;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex === -1) nextIndex = 0;
      else nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex === -1) nextIndex = items.length - 1;
      else nextIndex = (currentIndex - 1 + items.length) % items.length;
    }

    if (nextIndex !== currentIndex || (currentIndex === -1 && items.length > 0)) {
      const targetItem = items[nextIndex];
      if (targetItem) {
        targetItem.focus({ preventScroll: true });
        
        targetItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    } else if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
});

const ytPlusDownload = {
  currentVideo: null,
  playlistId: null,
  playlistMode: false,
  selectedQuality: 'best',
  lastStateText: 'loading',
  lastStateDisabled: true,
  listenersAttached: false,

  async init() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    const qualityMenuBtn = getEl('qualityMenuBtn');
    const downloadBtn = getEl('ytPlusDownloadBtn');
    if (!qualityMenuBtn || !downloadBtn) {
      this.isInitializing = false;
      return;
    }
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      const isWatch = tab.url?.includes('youtube.com/watch');
      const isShorts = tab.url?.includes('youtube.com/shorts/');
      const isPlaylist = tab.url?.includes('youtube.com/playlist');

      if (!isWatch && !isShorts && !isPlaylist) {
        this.updateState('noVideo', true);
        return;
      }

      
      const urlObj = new URL(tab.url);
      this.playlistId = urlObj.searchParams.get('list');

      if (isPlaylist && !isWatch) {
        this.currentVideo = { url: tab.url, title: 'Playlist', qualities: [] };
        this.setupPlaylistToggle(true);
        this.populateQualities({ qualities: [] });
        this.updateState('download', false);
        return;
      }

      const metadata = await chrome.tabs.sendMessage(tab.id, { action: 'YTPLUS_GET_METADATA' })
        .catch(() => null);

      if (metadata && metadata.qualities && metadata.qualities.length > 0) {
        this.initRetryCount = 0; 
        this.currentVideo = { ...metadata, url: tab.url };
        this.setupPlaylistToggle();
        this.populateQualities(metadata);
        this.updateState('download', false);
      } else if (metadata) {
        
        this.updateState('notAvailable', true);
      } else {
        
        this.updateState('loading', true);
        
        const retryCount = (this.initRetryCount || 0) + 1;
        if (retryCount <= 5) {
          this.initRetryCount = retryCount;
          
          this.isInitializing = false;
          setTimeout(() => this.init(), 600 * retryCount);
          return; 
        } else {
          this.initRetryCount = 0;
          this.updateState('notAvailable', true);
        }
      }
    } catch (err) {
      console.error('[Tubeless] Init download failed:', err);
      this.updateState('error', true);
    } finally {
      this.isInitializing = false;
    }

    if (!this.listenersAttached) {
      const qBtn = getEl('qualityMenuBtn');
      if (qBtn) {
        qBtn.addEventListener('click', (e) => {
          if (e.target.closest('#playlistToggleBtn')) return;
          e.stopPropagation();
          this.openQualityMenu();
        });
      }

      const toggleBtn = getEl('playlistToggleBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.playlistMode = !this.playlistMode;
          toggleBtn.classList.toggle('active', this.playlistMode);
          chrome.storage.local.set({ playlistMode: this.playlistMode });

          if (this.playlistMode) {
            this.openQualityMenu();
          }
        });
      }

      downloadBtn.addEventListener('click', () => this.startDownload(false));
      this.listenersAttached = true;
    }
  },

  async setupPlaylistToggle(forceShow = false) {
    const toggleBtn = getEl('playlistToggleBtn');
    if (!toggleBtn) return;

    toggleBtn.style.display = (forceShow || this.playlistId) ? 'flex' : 'none';
    const stored = await chrome.storage.local.get(['playlistMode']);
    this.playlistMode = !!stored.playlistMode;
    toggleBtn.classList.toggle('active', this.playlistMode);
  },

  refreshLocalization() {
    if (this.lastStateDisabled) {
      this.updateState(this.lastStateText, true);
    } else if (this.currentVideo) {
      this.populateQualities(this.currentVideo);
    }
  },

  async populateQualities(metadata) {
    const videoList = getEl('videoQualitiesList');
    const audioList = getEl('audioQualitiesList');
    const subtitleList = getEl('subtitlesList');
    const thumbList = getEl('thumbnailsList');
    const qualityText = getEl('qualityText');

    if (!videoList || !audioList || !subtitleList || !thumbList || !qualityText) return;

    const qualities = metadata.qualities || [];
    const activeEl = document.activeElement;
    const activeLabel = activeEl?.innerText;
    const activeId = activeEl?.id;
    const wasFocused = activeEl && (videoList.contains(activeEl) || audioList.contains(activeEl) || subtitleList.contains(activeEl) || thumbList.contains(activeEl));

    videoList.innerHTML = '';
    audioList.innerHTML = '';
    subtitleList.innerHTML = '';
    thumbList.innerHTML = '';

    
    const audioBtn = document.createElement('button');
    audioBtn.className = 'menu-item audio-option';
    audioBtn.innerHTML = `<span>${t('audioOnly')}</span> <span class="badge">HQ</span>`;
    audioBtn.onclick = (e) => {
      e.stopPropagation();
      this.selectedQuality = 'audio';
      qualityText.textContent = t('audioOnly').split(' ')[0];
      this.updateSelectionUI(audioBtn);
      window.YTPlus_closeAllDropdowns();
      this.startDownload(this.playlistId && this.playlistMode);
    };
    if (this.selectedQuality === 'audio') audioBtn.classList.add('selected');
    audioList.appendChild(audioBtn);

    
    if (metadata.subtitles && metadata.subtitles.length > 0) {
      const langMap = UI_TEXT[currentLang]?.langs || UI_TEXT.en.langs;
      const subs = metadata.subtitles;
      const MAX_VISIBLE = 4;

      const renderSub = (sub) => {
        const btn = document.createElement('button');
        btn.className = 'menu-item subtitle-option';
        const cleanLang = sub.lang?.split('-')[0]?.toLowerCase();
        const displayLabel = langMap[cleanLang] || sub.label;
        btn.innerHTML = `<span>${displayLabel}</span>${sub.isAuto ? '<span class="badge" style="background:var(--secondary-text); margin-left:4px;">AUTO</span>' : ''}`;
        btn.onclick = (e) => {
          e.stopPropagation();
          this.selectedQuality = `sub_${sub.lang}`;
          qualityText.textContent = `SUB (${sub.lang.toUpperCase()})`;
          this.updateSelectionUI(btn);
          window.YTPlus_closeAllDropdowns();
          this.startDownload(this.playlistId && this.playlistMode);
        };
        if (this.selectedQuality === `sub_${sub.lang}`) btn.classList.add('selected');
        subtitleList.appendChild(btn);
      };

      if (subs.length > MAX_VISIBLE) {
        subs.slice(0, MAX_VISIBLE).forEach(renderSub);
        const moreBtn = document.createElement('button');
        moreBtn.className = 'menu-item more-subs-btn';
        moreBtn.innerHTML = `<span>${t('more')}</span><svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
        moreBtn.onclick = (e) => {
          e.stopPropagation();
          moreBtn.remove();
          subs.slice(MAX_VISIBLE).forEach(renderSub);
        };
        subtitleList.appendChild(moreBtn);
      } else {
        subs.forEach(renderSub);
      }
    } else {
      const empty = document.createElement('div');
      empty.className = 'menu-info';
      empty.style.opacity = '0.5';
      empty.style.cursor = 'default';
      empty.textContent = t('noSubtitles');
      subtitleList.appendChild(empty);
    }

    
    const thumbBtn = document.createElement('button');
    thumbBtn.className = 'menu-item';
    thumbBtn.innerHTML = `<span>${t('hd')}</span> <span class="badge" style="background:var(--accent-color)">IMG</span>`;
    thumbBtn.onclick = (e) => {
      e.stopPropagation();
      this.selectedQuality = 'thumbnail';
      qualityText.textContent = t('thumbnails').split(' ')[0];
      this.updateSelectionUI(thumbBtn);
      window.YTPlus_closeAllDropdowns();
      this.startDownload(this.playlistId && this.playlistMode);
    };
    if (this.selectedQuality === 'thumbnail') thumbBtn.classList.add('selected');
    thumbList.appendChild(thumbBtn);

    const sorted = qualities.sort((a, b) => {
      const resA = parseInt(a.label) || 0;
      const resB = parseInt(b.label) || 0;
      return resB - resA;
    });

    
    if (sorted.length > 0) {
      if (this.selectedQuality === 'best') {
        const best = sorted[0];
        this.selectedQuality = best.label;
        this.setBtnLabel(qualityText, best, false);
      } else {
        const currentQ = sorted.find(q => q.label === this.selectedQuality);
        this.setBtnLabel(qualityText, currentQ || this.selectedQuality, false);
      }
    }

    sorted.forEach((q, index) => {
      const btn = document.createElement('button');
      btn.className = 'menu-item quality-option-item';
      if (this.selectedQuality === q.label) btn.classList.add('selected');

      const resInt = parseInt(q.label) || 0;
      
      const hideHDR = false;
      this.setBtnLabel(btn, q, hideHDR);

      btn.onclick = (e) => {
        e.stopPropagation();
        this.selectedQuality = q.label;
        this.setBtnLabel(qualityText, q, false);
        this.updateSelectionUI(btn);
        window.YTPlus_closeAllDropdowns();
        this.startDownload(this.playlistId && this.playlistMode);
      };
      videoList.appendChild(btn);
    });

    
    if (wasFocused && activeLabel) {
      setTimeout(() => {
        const newItems = Array.from(getEl('qualityDropdownContent').querySelectorAll('button, .menu-item'));
        const restored = newItems.find(it => it.innerText === activeLabel) || (activeId && getEl(activeId));
        if (restored) {
          restored.focus({ preventScroll: true });
          restored.scrollIntoView({ block: 'nearest' });
        }
      }, 0);
    }
  },

  setBtnLabel(el, q, hideHDR = false) {
    if (!q || !el) return;
    if (typeof q === 'string') {
      if (q === 'audio') el.textContent = t('audioOnly').split(' ')[0];
      else if (q === 'thumbnail') el.textContent = t('thumbnails').split(' ')[0];
      else if (q.startsWith('sub_')) el.textContent = `SUB (${q.replace('sub_', '').toUpperCase()})`;
      else el.textContent = this.prettyRes(q);
      return;
    }
    const res = this.prettyRes(q.res);
    const resInt = parseInt(q.res) || 0;
    const showHDR = q.isHDR && !hideHDR && resInt >= 720;
    
    const show60 = q.is60 && resInt >= 720;
    el.innerHTML = `${res}${show60 ? ' <span class="fps-badge">60</span>' : ''}${showHDR ? ' <span class="hdr-badge">HDR</span>' : ''}`;
  },

  prettyRes(res) {
    if (!res) return '';
    return res.replace('2160p', '4K').replace('1440p', '2K');
  },

  openQualityMenu() {
    const qContent = getEl('qualityDropdownContent');
    if (!qContent) return;

    const isShowing = qContent.classList.contains('show');
    if (typeof window.YTPlus_closeAllDropdowns === 'function') window.YTPlus_closeAllDropdowns();

    if (!isShowing) {
      qContent.classList.add('show');
      getEl('menuBackdrop')?.classList.add('show');
      setTimeout(() => {
        const selected = qContent.querySelector('.selected');
        const first = qContent.querySelector('button, .menu-item');
        const target = selected || first;
        if (target) {
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'nearest' });
        }
      }, 350);
    }
  },

  updateSelectionUI(selectedBtn) {
    const videoList = getEl('videoQualitiesList');
    const audioList = getEl('audioQualitiesList');
    const subtitleList = getEl('subtitlesList');
    const thumbList = getEl('thumbnailsList');
    [videoList, audioList, subtitleList, thumbList].forEach(list => {
      if (list) list.querySelectorAll('.menu-item').forEach(b => b.classList.remove('selected'));
    });
    selectedBtn.classList.add('selected');
  },

  updateState(text, disabled) {
    const btn = getEl('ytPlusDownloadBtn');
    const menuContainer = getEl('qualityMenuBtn');
    const qualityText = getEl('qualityText');
    const toggleBtn = getEl('playlistToggleBtn');

    if (btn) {
      btn.disabled = disabled;
      btn.style.display = disabled ? 'none' : 'flex';
    }
    if (menuContainer && qualityText) {
      if (disabled) {
        menuContainer.setAttribute('disabled', '');
      } else {
        menuContainer.removeAttribute('disabled');
      }

      this.lastStateDisabled = disabled;
      this.lastStateText = text;

      if (disabled) {
        qualityText.textContent = t(text);
        if (toggleBtn) toggleBtn.style.display = 'none';
      } else {
        if (toggleBtn && this.playlistId) toggleBtn.style.display = 'flex';

        if (qualityText.textContent === t('loading') || qualityText.textContent === 'Loading...') {
          const label = this.selectedQuality;
          const qObj = this.currentVideo?.qualities?.find(q => q.label === label);
          this.setBtnLabel(qualityText, qObj || label, false);
        }
      }
    }
  },

  async startDownload(isPlaylist = false) {
    if (!this.currentVideo) return;

    let qualityValue = this.selectedQuality;
    let type = 'video';

    if (qualityValue === 'audio') {
      type = 'audio';
    } else if (qualityValue === 'thumbnail') {
      type = 'thumbnail';
      qualityValue = 'best';
    } else if (qualityValue.startsWith('sub_')) {
      type = 'subtitle';
      qualityValue = qualityValue.replace('sub_', '');
    } else {
      const match = qualityValue.match(/(\d+)/);
      if (match) qualityValue = match[1];
    }

    const btn = getEl('ytPlusDownloadBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>';

    try {
      const urlObj = new URL(this.currentVideo.url);
      let videoId = urlObj.searchParams.get('v');

      if (!videoId) {
        const shortsMatch = urlObj.pathname.match(/^\/shorts\/([^/?#]+)/);
        if (shortsMatch) videoId = shortsMatch[1];
      }

      if (!videoId && !isPlaylist) throw new Error('Could not extract Video ID');

      const response = await chrome.runtime.sendMessage({
        action: 'YTPLUS_START_DOWNLOAD',
        payload: {
          v: videoId,
          list: isPlaylist ? this.playlistId : null,
          quality: qualityValue,
          type: type
        }
      });

      if (!response || !response.success) {
        throw new Error(response?.error || 'Download failed to start');
      }

      btn.disabled = false;
      btn.innerHTML = originalContent;
      showStatus('downloadStarted');
    } catch (err) {
      console.error('[Tubeless] Download request failed:', err);
      btn.disabled = false;
      btn.innerHTML = originalContent;
      showStatus('downloadError');
    }
  }
};


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    for (const [key, change] of Object.entries(changes)) {
      const val = change.newValue;

      
      const el = getEl(key);
      if (el && el.type === 'checkbox') {
        el.checked = Boolean(val);
      }

      
      if (key === 'playbackSpeed') {
        const speed = parseFloat(val);
        const slider = getEl('speedSlider');
        if (slider) {
          slider.value = speed;
          getEl('speedValue').textContent = speed + 'x';
          updateActiveSpeedBtn(speed);
        }
      }

      
      if (key === 'darkMode') {
        applyTheme(Boolean(val));
      }

      
      if (key === 'language') {
        localize(val);
      }

      
      if (key === 'deepWorkMode') {
        const deepWorkBtn = getEl('deepWorkBtn');
        if (deepWorkBtn) {
          if (val) deepWorkBtn.classList.add('active');
          else deepWorkBtn.classList.remove('active');
        }
      }

      
      if (key === 'smartQualityLock') {
        const lockText = getEl('smartQualityLockText');
        if (lockText) {
          if (val === 'auto') {
            lockText.setAttribute('data-t', 'autoQuality');
            lockText.textContent = t('autoQuality');
          } else {
            lockText.removeAttribute('data-t');
            lockText.textContent = val;
          }
        }
        updateActiveQualityLock(val);
      }

      
      if (key === 'hideShorts') {
        updateShortsDependency();
      }
    }
  }
});