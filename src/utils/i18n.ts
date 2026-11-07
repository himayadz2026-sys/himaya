export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  // Navigation & General
  appName: string;
  appSubtitle: string;
  home: string;
  scan: string;
  alerts: string;
  profile: string;
  settings: string;
  systemShielded: string;
  threatDetected: string;
  secureScore: string;
  securityScore: string;
  systemOptimal: string;
  riskAlert: string;
  tapToScan: string;
  tacticalArsenal: string;
  modulesActive: string;
  language: string;
  selectLanguage: string;
  arabic: string;
  french: string;
  english: string;

  // The 8 Tactical Features
  linkScannerTitle: string;
  linkScannerSubtitle: string;
  passwordGenTitle: string;
  passwordGenSubtitle: string;
  wifiScannerTitle: string;
  wifiScannerSubtitle: string;
  dailyTipTitle: string;
  dailyTipSubtitle: string;
  antivirusTitle: string;
  antivirusSubtitle: string;
  internetBlockerTitle: string;
  internetBlockerSubtitle: string;
  terminalTitle: string;
  terminalSubtitle: string;
  mapCoordsTitle: string;
  mapCoordsSubtitle: string;

  // Link Scanner
  targetUrlLabel: string;
  urlPlaceholder: string;
  paste: string;
  scanUrl: string;
  scanningUrl: string;
  verifiedSafe: string;
  dangerousThreat: string;
  riskIndex: string;
  safeIndicators: string;
  threatIndicators: string;
  recentScans: string;
  safe: string;
  threat: string;

  // Password Generator
  cipherDisplayTitle: string;
  characters: string;
  reRoll: string;
  copy: string;
  copied: string;
  saveKey: string;
  entropyStrength: string;
  bruteForceTime: string;
  keyLength: string;
  characterMatrix: string;
  uppercase: string;
  lowercase: string;
  numbers: string;
  symbols: string;
  excludeAmbiguous: string;
  presetsTitle: string;

  // WiFi Scanner
  airwaveMonitor: string;
  detectedCount: string;
  highRiskWarning: string;
  openWifiAlert: string;
  scanRf: string;
  scanningRf: string;
  connected: string;
  dismissAudit: string;

  // Daily Tip
  savedBookmarks: string;
  backToFeed: string;
  tipCounter: string;
  countermeasure: string;
  previous: string;
  random: string;
  nextTip: string;

  // Antivirus Deep Scan
  testThreatDemo: string;
  threatDemoOn: string;
  cleanScanOn: string;
  startScan: string;
  reScan: string;
  scanningFiles: string;
  filesScanned: string;
  threatsFound: string;
  status: string;
  systemSecure: string;
  threatsIdentified: string;
  scanAuditHistory: string;
  clearHistory: string;
  quarantine: string;
  deleteThreat: string;

  // Internet Blocker
  totalApps: string;
  blocked: string;
  allowed: string;
  firewallControls: string;
  blockAll: string;
  unblockAll: string;
  searchAppsPlaceholder: string;
  all: string;
  test: string;
  trafficBlockedBadge: string;
  onlineBadge: string;
  blockedPopupTitle: string;
  blockedPopupMsg: string;
  onlinePopupTitle: string;
  onlinePopupMsg: string;

  // Terminal
  terminalTitleDesc: string;
  clearTerminal: string;
  quickCommands: string;

  // Coordinates to Map
  geoCoordsTitle: string;
  myLocation: string;
  latitude: string;
  longitude: string;
  showOnMap: string;
  copyCoords: string;
  resolvedAddress: string;
  clickOrDrag: string;

  // Settings & App Lock
  changePassword: string;
  disableLock: string;
  enableLock: string;
  appLockStartup: string;
  appLockStartupDesc: string;
  resetSecurityQuestion: string;
  resetSecurityQuestionDesc: string;
  darkModeTitle: string;
  darkModeDesc: string;
  cyberAudioTitle: string;
  cyberAudioDesc: string;
  resetSessionData: string;

  // Online Virus Database
  virusDbTitle: string;
  dbVersionLabel: string;
  totalVirusesLabel: string;
  lastUpdatedLabel: string;
  newDbAvailable: string;
  newDbPopupMsg: string;
  syncedGithub: string;
  offlineCache: string;
  syncingDb: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Navigation & General
    appName: 'حماية',
    appSubtitle: 'أدوات الأمان والسايبر الشاملة',
    home: 'الرئيسية',
    scan: 'فحص',
    alerts: 'التنبيهات',
    profile: 'الإعدادات',
    settings: 'الإعدادات',
    systemShielded: 'النظام محمي ومشفّر',
    threatDetected: 'تم رصد تهديد أمني',
    secureScore: 'نسبة الأمان',
    securityScore: 'نسبة الأمان',
    systemOptimal: 'الحماية مفعلة ونشطة',
    riskAlert: 'تحذير خطر أمني',
    tapToScan: 'اضغط لبدء الفحص',
    tacticalArsenal: 'ترسانة أدوات الأمان التكتيكية',
    modulesActive: '8 وحدات أمنية مفعلة',
    language: 'اللغة',
    selectLanguage: 'اختر لغة التطبيق',
    arabic: 'العربية (Arabic)',
    french: 'Français (French)',
    english: 'English (English)',

    // The 8 Tactical Features
    linkScannerTitle: 'فحص الروابط',
    linkScannerSubtitle: 'كشف التصيد الاحتيالي والروابط المشبوهة',
    passwordGenTitle: 'مولد كلمات السر',
    passwordGenSubtitle: 'توليد مفاتيح تشفير عشوائية قوية',
    wifiScannerTitle: 'فحص الواي فاي',
    wifiScannerSubtitle: 'تدقيق أمان شبكات الاتصال اللاسلكي',
    dailyTipTitle: 'نصيحة اليوم',
    dailyTipSubtitle: 'نصائح أمن المعلومات وحماية الخصوصية',
    antivirusTitle: 'انتي فيروس فحص شامل',
    antivirusSubtitle: 'فحص شامل للملفات واكتشاف التهديدات',
    internetBlockerTitle: 'قاطع الانترنت',
    internetBlockerSubtitle: 'جدار حماية لقطع الإنترنت عن التطبيقات',
    terminalTitle: 'تيرمينال',
    terminalSubtitle: 'سطر أوامر لينكس والأدوات التكتيكية',
    mapCoordsTitle: 'الاحداثيات للخريطة',
    mapCoordsSubtitle: 'تحديد المواقع الجغرافية وإسقاط الإحداثيات',

    // Link Scanner
    targetUrlLabel: 'فحص الرابط المستهدف',
    urlPlaceholder: 'مثال: https://example-login.xyz/verify',
    paste: 'لصق',
    scanUrl: 'فحص الرابط',
    scanningUrl: 'جاري تحليل مسارات التهديد...',
    verifiedSafe: 'رابط آمن وموثوق',
    dangerousThreat: 'رابط خطير مشبوه',
    riskIndex: 'مؤشر الخطر',
    safeIndicators: 'مؤشرات الأمان المكتشفة:',
    threatIndicators: 'مؤشرات التهديد المرصودة:',
    recentScans: 'عمليات الفحص الأخيرة',
    safe: 'آمن',
    threat: 'خطر',

    // Password Generator
    cipherDisplayTitle: 'مفتاح التشفير المُوَلَّد',
    characters: 'أحرف',
    reRoll: 'إعادة التوليد',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    saveKey: 'حفظ',
    entropyStrength: 'مستوى التعقيد والأمان',
    bruteForceTime: 'زمن الكسر التقريبي:',
    keyLength: 'طول كلمة السر',
    characterMatrix: 'مصفوفة الرموز والأحرف:',
    uppercase: 'أحرف كبيرة (A-Z)',
    lowercase: 'أحرف صغيرة (a-z)',
    numbers: 'أرقام (0-9)',
    symbols: 'رموز خاصة (!@#$%)',
    excludeAmbiguous: 'استبعاد الأحرف المتشابهة (0, O, l, 1)',
    presetsTitle: 'الإعدادات المسبقة السريعة:',

    // WiFi Scanner
    airwaveMonitor: 'مراقب الترددات اللاسلكية',
    detectedCount: 'شبكة مرصودة',
    highRiskWarning: 'شبكات عالية الخطورة في النطاق',
    openWifiAlert: 'تحذير: لا تدخل بيانات مصرفية على شبكات واي فاي مفتوحة غير مشفرة!',
    scanRf: 'إعادة الفحص',
    scanningRf: 'جاري فحص النطاق...',
    connected: 'متصل',
    dismissAudit: 'إغلاق تقرير الفحص',

    // Daily Tip
    savedBookmarks: 'النصائح المحفوظة',
    backToFeed: 'العودة للخلاصة',
    tipCounter: 'نصيحة رقم',
    countermeasure: 'الإجراء الوقائي المضاد:',
    previous: 'السابق',
    random: 'عشوائي',
    nextTip: 'النصيحة التالية',

    // Antivirus Deep Scan
    testThreatDemo: 'اختبار تجربة التهديد:',
    threatDemoOn: 'وضع التهديد (مفعل)',
    cleanScanOn: 'فحص نظيف (مفعل)',
    startScan: 'بدء الفحص الشامل',
    reScan: 'إعادة الفحص',
    scanningFiles: 'جاري الفحص المتقدم...',
    filesScanned: 'الملفات المفحوصة',
    threatsFound: 'التهديدات المكتشفة',
    status: 'الحالة',
    systemSecure: 'النظام آمن بالكامل',
    threatsIdentified: 'تم رصد تهديدات خبيثة',
    scanAuditHistory: 'سجل عمليات الفحص السابقة',
    clearHistory: 'مسح السجل',
    quarantine: 'عزل في الحجر',
    deleteThreat: 'حذف التهديد',

    // Internet Blocker
    totalApps: 'إجمالي التطبيقات',
    blocked: 'المحظورة',
    allowed: 'المسموحة',
    firewallControls: 'تحكم جدار الحماية',
    blockAll: 'حظر الكل',
    unblockAll: 'إلغاء حظر الكل',
    searchAppsPlaceholder: 'ابحث عن تطبيق بالاسم أو الحزمة...',
    all: 'الكل',
    test: 'اختبار',
    trafficBlockedBadge: 'محظور',
    onlineBadge: 'متصل',
    blockedPopupTitle: 'تم قطع الاتصال بالإنترنت',
    blockedPopupMsg: 'هذا التطبيق محظور من استخدام الإنترنت بواسطة تطبيق حماية.',
    onlinePopupTitle: 'الاتصال بالإنترنت مسموح',
    onlinePopupMsg: 'يُسمح لهذا التطبيق بالوصول إلى شبكة الإنترنت وحركة البيانات بحرية.',

    // Terminal
    terminalTitleDesc: 'بيئة لينكس الطرفية والأوامر التكتيكية',
    clearTerminal: 'مسح الشاشة',
    quickCommands: 'أوامر سريعة بنقرة واحدة:',

    // Coordinates to Map
    geoCoordsTitle: 'إحداثيات الموقع الجغرافي',
    myLocation: 'موقعي الحالي',
    latitude: 'دائرة العرض (Latitude)',
    longitude: 'خط الطول (Longitude)',
    showOnMap: 'عرض على الخريطة',
    copyCoords: 'نسخ الإحداثيات',
    resolvedAddress: 'العنوان الجغرافي المحدد:',
    clickOrDrag: 'انقر أو اسحب الدبوس لتغيير الموقع',

    // Settings & App Lock
    changePassword: 'تغيير كلمة السر',
    disableLock: 'تعطيل القفل',
    enableLock: 'تفعيل القفل',
    appLockStartup: 'قفل التطبيق برمز PIN عند الفتح',
    appLockStartupDesc: 'طلب رمز الأمان عند كل فتح للتطبيق لحماية البيانات',
    resetSecurityQuestion: 'تعديل سؤال الأمان والاسترجاع',
    resetSecurityQuestionDesc: 'يُستخدم لاستعادة رمز PIN في حال نسيانه',
    darkModeTitle: 'الوضع الليلي (الأسود والأخضر النيوني)',
    darkModeDesc: 'المظهر السيبراني الداكن الافتراضي أو الوضع الفاتح',
    cyberAudioTitle: 'التأثيرات الصوتية الإلكترونية',
    cyberAudioDesc: 'أصوات النقر وأصوات رادار الفحص والتنبيهات',
    resetSessionData: 'إعادة ضبط الجلسة ومسح البيانات المؤقتة',

    // Online Virus Database
    virusDbTitle: 'قاعدة بيانات الفيروسات السحابية',
    dbVersionLabel: 'إصدار القاعدة',
    totalVirusesLabel: 'إجمالي الفيروسات',
    lastUpdatedLabel: 'آخر تحديث',
    newDbAvailable: 'تحديث جديد لقاعدة بيانات الفيروسات',
    newDbPopupMsg: 'تم اكتشاف وتحميل إصدار أحدث لقاعدة بيانات الفيروسات بنجاح من خادم GitHub.',
    syncedGithub: 'متزامن (GitHub)',
    offlineCache: 'ذاكرة محلية (غير متصل)',
    syncingDb: 'جاري فحص التحديثات...',
  },

  fr: {
    // Navigation & General
    appName: 'Himaya',
    appSubtitle: 'Outils de Sécurité & Hacker Tout-en-Un',
    home: 'Accueil',
    scan: 'Scan',
    alerts: 'Alertes',
    profile: 'Paramètres',
    settings: 'Paramètres',
    systemShielded: 'Système Chiffré & Protégé',
    threatDetected: 'Menace de Sécurité Détectée',
    secureScore: 'Score de Sécurité',
    securityScore: 'Score de Sécurité',
    systemOptimal: 'Protection Optimale Active',
    riskAlert: 'Alerte Risque Élevé',
    tapToScan: 'Appuyez pour Analyser',
    tacticalArsenal: 'Arsenal d\'Outils Tactiques',
    modulesActive: '8 Modules de Défense Actifs',
    language: 'Langue',
    selectLanguage: 'Sélectionner la Langue',
    arabic: 'العربية (Arabe)',
    french: 'Français (French)',
    english: 'English (Anglais)',

    // The 8 Tactical Features
    linkScannerTitle: 'Scanner de Liens',
    linkScannerSubtitle: 'Détection d\'URL Suspectes et Phishing',
    passwordGenTitle: 'Générateur de Mots de Passe',
    passwordGenSubtitle: 'Synthèse de Clés Cryptographiques Robustes',
    wifiScannerTitle: 'Scanner Wi-Fi',
    wifiScannerSubtitle: 'Audit de Spectre RF et Réseaux Vulnérables',
    dailyTipTitle: 'Astuce du Jour',
    dailyTipSubtitle: 'Conseils Tactiques en Cybersécurité & OPSEC',
    antivirusTitle: 'Antivirus Analyse Approfondie',
    antivirusSubtitle: 'Analyse Heuristique Complète des Fichiers',
    internetBlockerTitle: 'Bloqueur Internet',
    internetBlockerSubtitle: 'Pare-feu par Application & Filtrage de Paquets',
    terminalTitle: 'Terminal Hacker',
    terminalSubtitle: 'Console Linux Embarquée & Outils Réseau',
    mapCoordsTitle: 'Coordonnées sur Carte',
    mapCoordsSubtitle: 'Traceur Géospatial et Pointeur Satellite',

    // Link Scanner
    targetUrlLabel: 'INSPECTION DE L\'URL CIBLE',
    urlPlaceholder: 'ex: https://exemple-banque.xyz/verify',
    paste: 'COLLER',
    scanUrl: 'SCANNER L\'URL',
    scanningUrl: 'Analyse des vecteurs d\'attaque...',
    verifiedSafe: 'URL VÉRIFIÉE & SÛRE',
    dangerousThreat: 'MENACE DANGEREUSE DÉTECTÉE',
    riskIndex: 'Indice de Risque',
    safeIndicators: 'Indicateurs de Sécurité :',
    threatIndicators: 'Indicateurs de Menace Détectés :',
    recentScans: 'Analyses Récentes',
    safe: 'SÛR',
    threat: 'MENACE',

    // Password Generator
    cipherDisplayTitle: 'CLÉ CRYPTOGRAPHIQUE GÉNÉRÉE',
    characters: 'caractères',
    reRoll: 'Régénérer',
    copy: 'Copier',
    copied: 'Copié !',
    saveKey: 'Enregistrer',
    entropyStrength: 'Force d\'Entropie',
    bruteForceTime: 'Temps estimé de force brute :',
    keyLength: 'Longueur de Clé',
    characterMatrix: 'Matrice de Caractères :',
    uppercase: 'Majuscules (A-Z)',
    lowercase: 'Minuscules (a-z)',
    numbers: 'Chiffres (0-9)',
    symbols: 'Symboles (!@#$%)',
    excludeAmbiguous: 'Exclure les Caractères Ambigus (0, O, l, 1)',
    presetsTitle: 'Profils Prédéfinis :',

    // WiFi Scanner
    airwaveMonitor: 'MONITEUR D\'ONDES RF',
    detectedCount: 'réseaux détectés',
    highRiskWarning: 'réseaux à haut risque à portée',
    openWifiAlert: 'ATTENTION : Ne transmettez jamais d\'identifiants bancaires sur un Wi-Fi ouvert !',
    scanRf: 'Scanner RF',
    scanningRf: 'Scan en cours...',
    connected: 'CONNECTÉ',
    dismissAudit: 'Fermer le Rapport',

    // Daily Tip
    savedBookmarks: 'Astuces Enregistrées',
    backToFeed: 'Retour aux Astuces',
    tipCounter: 'Astuce n°',
    countermeasure: 'CONTRE-MESURE TACTIQUE :',
    previous: 'Précédent',
    random: 'Aléatoire',
    nextTip: 'Astuce Suivante',

    // Antivirus Deep Scan
    testThreatDemo: 'Test Simulation de Menace :',
    threatDemoOn: 'Simulation Menace (Actif)',
    cleanScanOn: 'Scan Propre (Actif)',
    startScan: 'Lancer l\'Analyse Complète',
    reScan: 'Réanalyser',
    scanningFiles: 'Inspection heuristique...',
    filesScanned: 'Fichiers Analysés',
    threatsFound: 'Menaces Détectées',
    status: 'Statut',
    systemSecure: 'SYSTÈME TOTALEMENT SÉCURISÉ',
    threatsIdentified: 'MENACES IDENTIFIÉES',
    scanAuditHistory: 'HISTORIQUE DES ANALYSES',
    clearHistory: 'Effacer l\'Historique',
    quarantine: 'Mettre en Quarantaine',
    deleteThreat: 'Supprimer la Menace',

    // Internet Blocker
    totalApps: 'Total Applis',
    blocked: 'Bloquées',
    allowed: 'Autorisées',
    firewallControls: 'CONTRÔLES PARE-FEU',
    blockAll: 'BLOQUER TOUT',
    unblockAll: 'DÉBLOQUER TOUT',
    searchAppsPlaceholder: 'Rechercher par nom ou paquet...',
    all: 'Tous',
    test: 'TESTER',
    trafficBlockedBadge: 'BLOQUÉ',
    onlineBadge: 'EN LIGNE',
    blockedPopupTitle: 'ACCÈS RÉSEAU BLOQUÉ',
    blockedPopupMsg: 'Cette application est bloquée d\'Internet par Himaya.',
    onlinePopupTitle: 'CONNEXION AUTORISÉE',
    onlinePopupMsg: 'Cette application est autorisée à accéder au réseau et aux données.',

    // Terminal
    terminalTitleDesc: 'Sous-système Linux & Shell Cyber',
    clearTerminal: 'Effacer',
    quickCommands: 'Commandes Rapides :',

    // Coordinates to Map
    geoCoordsTitle: 'COORDONNÉES GÉOGRAPHIQUES',
    myLocation: 'MA POSITION',
    latitude: 'Latitude (ex: 36.7372)',
    longitude: 'Longitude (ex: 3.0865)',
    showOnMap: 'AFFICHER SUR LA CARTE',
    copyCoords: 'COPIER COORDONNÉES',
    resolvedAddress: 'ADRESSE GÉOGRAPHIQUE :',
    clickOrDrag: 'Cliquez ou déplacez le repère pour ajuster',

    // Settings & App Lock
    changePassword: 'Changer le Mot de Passe',
    disableLock: 'Désactiver le Verrouillage',
    enableLock: 'Activer le Verrouillage',
    appLockStartup: 'Verrouillage de l\'Application (Code PIN)',
    appLockStartupDesc: 'Exiger le code PIN à chaque ouverture',
    resetSecurityQuestion: 'Modifier la Question Secrète',
    resetSecurityQuestionDesc: 'Utilisée pour récupérer le code PIN en cas d\'oubli',
    darkModeTitle: 'Mode Sombre (Cyberpunk Noir & Vert Néon)',
    darkModeDesc: 'Thème sombre par défaut ou thème clair moderne',
    cyberAudioTitle: 'Effets Sonores Électroniques',
    cyberAudioDesc: 'Sons de clics, bips radar et alertes sonores',
    resetSessionData: 'Réinitialiser la Session & le Cache',

    // Online Virus Database
    virusDbTitle: 'Base de Données Virale en Ligne',
    dbVersionLabel: 'Version Base',
    totalVirusesLabel: 'Total Virus',
    lastUpdatedLabel: 'Dernière Mise à Jour',
    newDbAvailable: 'Nouvelle base virale disponible',
    newDbPopupMsg: 'Une version plus récente de la base de données virale a été synchronisée depuis GitHub.',
    syncedGithub: 'Synchronisé (GitHub)',
    offlineCache: 'Cache Hors-Ligne',
    syncingDb: 'Synchronisation...',
  },

  en: {
    // Navigation & General
    appName: 'HIMAYA',
    appSubtitle: 'All-in-One Security & Hacker Tools',
    home: 'Home',
    scan: 'Scan',
    alerts: 'Alerts',
    profile: 'Profile',
    settings: 'Settings',
    systemShielded: 'System Shielded & Encrypted',
    threatDetected: 'Security Threat Detected',
    secureScore: 'Security Score',
    securityScore: 'Security Score',
    systemOptimal: 'System Optimal & Shielded',
    riskAlert: 'Critical Risk Alert',
    tapToScan: 'Tap to Scan',
    tacticalArsenal: 'Tactical Tool Arsenal',
    modulesActive: '8 Modules Active',
    language: 'Language',
    selectLanguage: 'Select Application Language',
    arabic: 'العربية (Arabic)',
    french: 'Français (French)',
    english: 'English (English)',

    // The 8 Tactical Features
    linkScannerTitle: 'Link Scanner',
    linkScannerSubtitle: 'Inspect URLs for phishing, HTTP, IPs & hidden redirects',
    passwordGenTitle: 'Password Generator',
    passwordGenSubtitle: 'Cryptographic entropy keys, strength meter & slider',
    wifiScannerTitle: 'WiFi Scanner',
    wifiScannerSubtitle: 'Audit nearby airwaves, signal dBm, WPA3 & open risks',
    dailyTipTitle: 'Daily Cyber Tip',
    dailyTipSubtitle: 'Tactical defense intel, OPSEC guides & bookmark vault',
    antivirusTitle: 'Antivirus Deep Scan',
    antivirusSubtitle: 'Radar file scanner, behavioral heuristics & mitigation',
    internetBlockerTitle: 'Internet Blocker',
    internetBlockerSubtitle: 'Per-app firewall switch & background socket dropper',
    terminalTitle: 'Fancy Terminal',
    terminalSubtitle: 'Live cyber shell with neofetch, ping, ls & commands',
    mapCoordsTitle: 'Coordinates to Map',
    mapCoordsSubtitle: 'Lat/Long geo plotter with pin marker & preset cities',

    // Link Scanner
    targetUrlLabel: 'TARGET URL INSPECTION',
    urlPlaceholder: 'e.g. https://example-login.xyz/verify',
    paste: 'PASTE',
    scanUrl: 'SCAN URL',
    scanningUrl: 'ANALYZING THREAT VECTORS...',
    verifiedSafe: 'VERIFIED SAFE',
    dangerousThreat: 'DANGEROUS THREAT',
    riskIndex: 'Risk Index',
    safeIndicators: 'SAFETY INDICATORS:',
    threatIndicators: 'DETECTED THREAT INDICATORS:',
    recentScans: 'RECENT SCANS',
    safe: 'SAFE',
    threat: 'THREAT',

    // Password Generator
    cipherDisplayTitle: 'GENERATED SECURE CIPHER',
    characters: 'CHARACTERS',
    reRoll: 'RE-ROLL',
    copy: 'COPY',
    copied: 'COPIED!',
    saveKey: 'SAVE',
    entropyStrength: 'ENTROPY STRENGTH',
    bruteForceTime: 'BRUTE-FORCE TIME:',
    keyLength: 'KEY LENGTH',
    characterMatrix: 'CHARACTER MATRIX:',
    uppercase: 'Uppercase (A-Z)',
    lowercase: 'Lowercase (a-z)',
    numbers: 'Numbers (0-9)',
    symbols: 'Symbols (!@#$%)',
    excludeAmbiguous: 'Exclude Ambiguous Chars (0, O, l, 1)',
    presetsTitle: 'SECURITY PRESETS:',

    // WiFi Scanner
    airwaveMonitor: 'AIRWAVE MONITOR',
    detectedCount: 'DETECTED',
    highRiskWarning: 'High-Risk Networks in Range',
    openWifiAlert: 'NEVER submit banking passwords on OPEN unencrypted Wi-Fi hotspots!',
    scanRf: 'SCAN RF',
    scanningRf: 'SCANNING...',
    connected: 'CONNECTED',
    dismissAudit: 'DISMISS AUDIT',

    // Daily Tip
    savedBookmarks: 'SAVED BOOKMARKS',
    backToFeed: 'BACK TO FEED',
    tipCounter: 'TIP #',
    countermeasure: 'TACTICAL COUNTERMEASURE:',
    previous: 'PREVIOUS',
    random: 'RANDOM',
    nextTip: 'NEXT TIP',

    // Antivirus Deep Scan
    testThreatDemo: 'DEMO THREAT DETECTION TEST:',
    threatDemoOn: 'THREAT DEMO (ON)',
    cleanScanOn: 'CLEAN SCAN (ON)',
    startScan: 'START DEEP SCAN',
    reScan: 'RUN SCAN AGAIN',
    scanningFiles: 'SYSTEM INTEGRITY DEEP AUDIT...',
    filesScanned: 'FILES SCANNED',
    threatsFound: 'THREATS FOUND',
    status: 'STATUS',
    systemSecure: 'SYSTEM FULLY SECURE',
    threatsIdentified: 'THREATS IDENTIFIED',
    scanAuditHistory: 'SCAN AUDIT HISTORY',
    clearHistory: 'CLEAR HISTORY',
    quarantine: 'QUARANTINE',
    deleteThreat: 'DELETE THREAT',

    // Internet Blocker
    totalApps: 'TOTAL APPS',
    blocked: 'BLOCKED',
    allowed: 'ALLOWED',
    firewallControls: 'FIREWALL CONTROLS',
    blockAll: 'BLOCK ALL',
    unblockAll: 'UNBLOCK ALL',
    searchAppsPlaceholder: 'Search by app name, package, or category...',
    all: 'ALL',
    test: 'TEST',
    trafficBlockedBadge: 'BLOCKED',
    onlineBadge: 'ONLINE',
    blockedPopupTitle: 'ACCESS TERMINATED',
    blockedPopupMsg: 'This app is blocked from internet by Himaya.',
    onlinePopupTitle: 'CONNECTION VERIFIED',
    onlinePopupMsg: 'Internet access is permitted for this application.',

    // Terminal
    terminalTitleDesc: 'Termux Linux Subsystem & Cyber Shell',
    clearTerminal: 'Clear',
    quickCommands: 'QUICK DISPATCH (THUMB TAP):',

    // Coordinates to Map
    geoCoordsTitle: 'GEODETIC COORDINATE INPUT',
    myLocation: 'MY LOCATION',
    latitude: 'LATITUDE (-90 to +90)',
    longitude: 'LONGITUDE (-180 to +180)',
    showOnMap: 'SHOW ON MAP',
    copyCoords: 'COPY COORDS',
    resolvedAddress: 'RESOLVED ADDRESS:',
    clickOrDrag: 'Click or drag marker to reposition',

    // Settings & App Lock
    changePassword: 'Change Password / PIN',
    disableLock: 'Disable Lock',
    enableLock: 'Enable Lock',
    appLockStartup: 'App Lock on Startup (PIN Protection)',
    appLockStartupDesc: 'Require Master PIN every time the app launches',
    resetSecurityQuestion: 'Reset Security Question',
    resetSecurityQuestionDesc: 'Used to reset your passcode if forgotten',
    darkModeTitle: 'Dark Mode (Cyberpunk Black & Neon Green)',
    darkModeDesc: 'Active cyberpunk theme or clean modern light theme',
    cyberAudioTitle: 'Synthesized Cyber Audio',
    cyberAudioDesc: 'Auditory clicks, laser pings, and scan chimes',
    resetSessionData: 'RESET SESSION / CLEAR SAVED CACHE',

    // Online Virus Database
    virusDbTitle: 'Online Virus Database',
    dbVersionLabel: 'Database Version',
    totalVirusesLabel: 'Total Viruses',
    lastUpdatedLabel: 'Last Updated',
    newDbAvailable: 'New virus database available',
    newDbPopupMsg: 'A newer virus database version has been fetched and updated from GitHub.',
    syncedGithub: 'Synced (GitHub)',
    offlineCache: 'Offline Cache',
    syncingDb: 'Syncing with GitHub...',
  },
};

// Helper function to get current language
export const getSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('himaya_language');
    if (saved === 'ar' || saved === 'fr' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore
  }
  // User Requirement: "4. Make Arabic the default language on first launch, with option to change."
  return 'ar';
};

export const setSavedLanguage = (lang: Language): void => {
  try {
    localStorage.setItem('himaya_language', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      if (lang === 'ar') {
        document.body.style.fontFamily = "'Cairo', 'Rajdhani', -apple-system, sans-serif";
      } else {
        document.body.style.fontFamily = "'Rajdhani', -apple-system, sans-serif";
      }
    }
  } catch {
    // Ignore
  }
};
