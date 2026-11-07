import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldBan,
  Search,
  Globe,
  Radio,
  Wifi,
  WifiOff,
  Check,
  X,
  AlertTriangle,
  Zap,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: 'Social' | 'Media' | 'Browsing' | 'Tools' | 'System';
  brandColor: string;
  dataUsage: string;
  defaultBlocked?: boolean;
}

// 22 real installed apps requested by user (WhatsApp, Facebook, Instagram, TikTok, YouTube, Chrome, etc.)
const ALL_INSTALLED_APPS: AppItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Messenger',
    packageName: 'com.whatsapp',
    category: 'Social',
    brandColor: '#25D366',
    dataUsage: '420 MB',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    packageName: 'com.facebook.katana',
    category: 'Social',
    brandColor: '#1877F2',
    dataUsage: '890 MB',
    defaultBlocked: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    category: 'Social',
    brandColor: '#E4405F',
    dataUsage: '1.2 GB',
    defaultBlocked: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    category: 'Media',
    brandColor: '#00F2FE',
    dataUsage: '1.8 GB',
    defaultBlocked: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    category: 'Media',
    brandColor: '#FF0000',
    dataUsage: '2.4 GB',
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    packageName: 'com.android.chrome',
    category: 'Browsing',
    brandColor: '#4285F4',
    dataUsage: '650 MB',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    packageName: 'org.telegram.messenger',
    category: 'Social',
    brandColor: '#229ED9',
    dataUsage: '310 MB',
  },
  {
    id: 'spotify',
    name: 'Spotify Music',
    packageName: 'com.spotify.music',
    category: 'Media',
    brandColor: '#1DB954',
    dataUsage: '540 MB',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    packageName: 'com.netflix.mediaclient',
    category: 'Media',
    brandColor: '#E50914',
    dataUsage: '3.1 GB',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    packageName: 'com.twitter.android',
    category: 'Social',
    brandColor: '#1DA1F2',
    dataUsage: '710 MB',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    packageName: 'com.snapchat.android',
    category: 'Social',
    brandColor: '#FFFC00',
    dataUsage: '880 MB',
    defaultBlocked: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    packageName: 'com.google.android.gm',
    category: 'Tools',
    brandColor: '#EA4335',
    dataUsage: '145 MB',
  },
  {
    id: 'maps',
    name: 'Google Maps',
    packageName: 'com.google.android.apps.maps',
    category: 'Tools',
    brandColor: '#34A853',
    dataUsage: '290 MB',
  },
  {
    id: 'discord',
    name: 'Discord',
    packageName: 'com.discord',
    category: 'Social',
    brandColor: '#5865F2',
    dataUsage: '460 MB',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    packageName: 'com.reddit.frontpage',
    category: 'Social',
    brandColor: '#FF4500',
    dataUsage: '620 MB',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    packageName: 'com.openai.chatgpt',
    category: 'Tools',
    brandColor: '#10A37F',
    dataUsage: '85 MB',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    packageName: 'com.pinterest',
    category: 'Social',
    brandColor: '#BD081C',
    dataUsage: '340 MB',
  },
  {
    id: 'zoom',
    name: 'Zoom Workplace',
    packageName: 'us.zoom.videomeetings',
    category: 'Tools',
    brandColor: '#2D8CFF',
    dataUsage: '950 MB',
  },
  {
    id: 'uber',
    name: 'Uber Rides & Delivery',
    packageName: 'com.ubercab',
    category: 'Tools',
    brandColor: '#000000',
    dataUsage: '110 MB',
  },
  {
    id: 'amazon',
    name: 'Amazon Shopping',
    packageName: 'com.amazon.mShop.android.shopping',
    category: 'Tools',
    brandColor: '#FF9900',
    dataUsage: '380 MB',
  },
  {
    id: 'playstore',
    name: 'Google Play Store',
    packageName: 'com.android.vending',
    category: 'System',
    brandColor: '#01875F',
    dataUsage: '220 MB',
  },
  {
    id: 'webview',
    name: 'Android System WebView',
    packageName: 'com.google.android.webview',
    category: 'System',
    brandColor: '#607D8B',
    dataUsage: '45 MB',
  },
];

interface InternetBlockerScreenProps {
  onBack: () => void;
  currentLang?: Language;
}

export const InternetBlockerScreen: React.FC<InternetBlockerScreenProps> = ({ onBack, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  // Load blocked apps from LocalStorage (Persistence requirement)
  const [blockedAppIds, setBlockedAppIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('himaya_blocked_apps');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    // Default initial blocked apps if first time
    return ['facebook', 'instagram', 'tiktok', 'snapchat'];
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Blocked' | 'Allowed'>('All');

  // Popup test mode state
  const [testModalApp, setTestModalApp] = useState<{
    app: AppItem;
    isBlocked: boolean;
  } | null>(null);

  // Sync to LocalStorage whenever blockedAppIds changes
  useEffect(() => {
    try {
      localStorage.setItem('himaya_blocked_apps', JSON.stringify(blockedAppIds));
    } catch {
      // Ignore
    }
  }, [blockedAppIds]);

  const toggleAppBlocking = (appId: string) => {
    cyberAudio.playClick();
    setBlockedAppIds((prev) => {
      const isCurrentlyBlocked = prev.includes(appId);
      if (isCurrentlyBlocked) {
        // Unblock
        return prev.filter((id) => id !== appId);
      } else {
        // Block
        return [...prev, appId];
      }
    });
  };

  const handleBlockAll = () => {
    cyberAudio.playAlert();
    setBlockedAppIds(ALL_INSTALLED_APPS.map((a) => a.id));
  };

  const handleUnblockAll = () => {
    cyberAudio.playSuccess();
    setBlockedAppIds([]);
  };

  const handleTestConnection = (app: AppItem) => {
    const isBlocked = blockedAppIds.includes(app.id);
    if (isBlocked) {
      cyberAudio.playAlert();
    } else {
      cyberAudio.playSuccess();
    }
    setTestModalApp({ app, isBlocked });
  };

  // Counts
  const totalAppsCount = ALL_INSTALLED_APPS.length;
  const blockedCount = blockedAppIds.length;
  const allowedCount = totalAppsCount - blockedCount;

  // Filtered Apps
  const filteredApps = ALL_INSTALLED_APPS.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.packageName.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase());

    const isBlocked = blockedAppIds.includes(app.id);

    if (filter === 'Blocked') return matchesSearch && isBlocked;
    if (filter === 'Allowed') return matchesSearch && !isBlocked;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t.internetBlockerTitle}
        subtitle={t.internetBlockerSubtitle}
        onBack={onBack}
      />

      {/* Counter Banner on Top: Total Apps: X, Blocked: Y, Allowed: Z */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/30 p-3.5 backdrop-blur-md shadow-sm text-center">
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-semibold">
            {t.totalApps}
          </span>
          <span className="text-2xl font-black font-orbitron text-slate-900 dark:text-white tabular-nums">
            {totalAppsCount}
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 block mt-0.5">
            Installed
          </span>
        </div>

        <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-rose-200 dark:border-[#FF0055]/40 p-3.5 backdrop-blur-md shadow-sm text-center">
          <span className="text-[10px] font-mono text-rose-600 dark:text-[#FF0055] uppercase tracking-wider block font-bold">
            {t.blocked}
          </span>
          <span className="text-2xl font-black font-orbitron text-[#FF0055] tabular-nums">
            {blockedCount}
          </span>
          <span className="text-[10px] font-mono text-rose-500/80 dark:text-rose-400/80 block mt-0.5">
            Traffic Cut
          </span>
        </div>

        <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-emerald-200 dark:border-[#00FF41]/40 p-3.5 backdrop-blur-md shadow-sm text-center">
          <span className="text-[10px] font-mono text-emerald-600 dark:text-[#00FF41] uppercase tracking-wider block font-bold">
            {t.allowed}
          </span>
          <span className="text-2xl font-black font-orbitron text-emerald-600 dark:text-[#00FF41] tabular-nums">
            {allowedCount}
          </span>
          <span className="text-[10px] font-mono text-emerald-500/80 dark:text-emerald-400/80 block mt-0.5">
            Online
          </span>
        </div>
      </div>

      {/* Global Actions Bar: Block All / Unblock All + Search */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/30 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            {t.firewallControls}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBlockAll}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-[#FF0055]/50 bg-rose-50 dark:bg-[#FF0055]/15 text-[#FF0055] font-orbitron font-bold text-xs hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
            >
              {t.blockAll}
            </button>
            <button
              onClick={handleUnblockAll}
              className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-[#00FF41]/50 bg-emerald-50 dark:bg-[#00FF41]/15 text-emerald-700 dark:text-[#00FF41] font-orbitron font-bold text-xs hover:bg-emerald-100 transition-all cursor-pointer active:scale-95"
            >
              {t.unblockAll}
            </button>
          </div>
        </div>

        {/* Search Bar to filter apps by name */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchAppsPlaceholder}
            className="w-full bg-slate-50 dark:bg-black/90 border border-slate-300 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-[#00FF41] rounded-2xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Segmented Control: All / Blocked / Allowed */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
            {(['All', 'Blocked', 'Allowed'] as const).map((tab) => {
              const count =
                tab === 'All'
                  ? totalAppsCount
                  : tab === 'Blocked'
                  ? blockedCount
                  : allowedCount;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    cyberAudio.playClick();
                    setFilter(tab);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-xl transition-all uppercase cursor-pointer ${
                    filter === tab
                      ? 'bg-emerald-500 dark:bg-[#00FF41] text-black font-extrabold shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            Showing {filteredApps.length} apps
          </span>
        </div>
      </div>

      {/* ALL INSTALLED APPS LIST */}
      <div className="space-y-2.5">
        {filteredApps.length === 0 ? (
          <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 p-8 text-center text-slate-500 dark:text-zinc-500 font-mono text-xs">
            No applications found matching "{search}".
          </div>
        ) : (
          filteredApps.map((app) => {
            const isBlocked = blockedAppIds.includes(app.id);

            return (
              <div
                key={app.id}
                className={`rounded-3xl border p-3.5 backdrop-blur-md flex items-center justify-between gap-3 transition-all shadow-xs ${
                  isBlocked
                    ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-300 dark:border-[#FF0055]/60 box-neon-red'
                    : 'bg-white/95 dark:bg-zinc-950/80 border-slate-200 dark:border-zinc-800/80 hover:border-emerald-400 dark:hover:border-[#00FF41]/40'
                }`}
              >
                {/* Left: App Brand Badge + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Distinct Brand Icon Box */}
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: app.brandColor }}
                  >
                    <span className="font-orbitron text-xs drop-shadow">
                      {app.name.substring(0, 2).toUpperCase()}
                    </span>

                    {/* Blocked mini indicator */}
                    {isBlocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <WifiOff className="w-5 h-5 text-[#FF0055] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white font-mono truncate">
                        {app.name}
                      </span>
                      {/* Red BLOCKED Badge */}
                      {isBlocked ? (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-100 dark:bg-[#FF0055]/20 text-rose-700 dark:text-[#FF0055] border border-rose-300 dark:border-[#FF0055]/50">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-700 dark:text-[#00FF41] border border-emerald-300 dark:border-[#00FF41]/30">
                          ONLINE
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                      {app.packageName}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                      <span>{app.category}</span>
                      <span>·</span>
                      <span>Usage: {app.dataUsage}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Test Connection & Toggle Switch */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Test Mode Button */}
                  <button
                    onClick={() => handleTestConnection(app)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] text-[10px] font-mono font-semibold transition-all cursor-pointer active:scale-95"
                    title="Test App Internet Connection"
                  >
                    TEST
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleAppBlocking(app.id)}
                    className={`relative w-14 h-8 rounded-full border p-1 transition-all flex items-center cursor-pointer ${
                      isBlocked
                        ? 'border-rose-400 dark:border-[#FF0055] bg-rose-100 dark:bg-[#FF0055]/20 justify-start'
                        : 'border-emerald-400 dark:border-[#00FF41] bg-emerald-100 dark:bg-[#00FF41]/20 justify-end'
                    }`}
                    title={
                      isBlocked
                        ? 'Internet Blocked - Tap to Allow'
                        : 'Internet Allowed - Tap to Block'
                    }
                    aria-label={`Toggle internet access for ${app.name}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-transform ${
                        isBlocked
                          ? 'bg-[#FF0055] text-white shadow-[0_0_8px_#FF0055]'
                          : 'bg-emerald-600 dark:bg-[#00FF41] text-white dark:text-black shadow-[0_0_8px_#00FF41]'
                      }`}
                    >
                      {isBlocked ? '✕' : 'ON'}
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* POPUP TEST DIALOG (Requirement 2: Show popup "This app is blocked from internet by Himaya") */}
      {testModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
              testModalApp.isBlocked
                ? 'bg-zinc-950 border-[#FF0055] box-neon-red'
                : 'bg-zinc-950 border-[#00FF41] box-neon-green'
            }`}
          >
            {/* Top Close */}
            <button
              onClick={() => setTestModalApp(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border-2 ${
                testModalApp.isBlocked
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055]'
                  : 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41]'
              }`}
            >
              {testModalApp.isBlocked ? (
                <ShieldBan className="w-8 h-8 animate-bounce" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            {/* Title & Message */}
            <div className="text-center space-y-1">
              <h3
                className={`text-lg font-black font-orbitron tracking-wider ${
                  testModalApp.isBlocked ? 'text-[#FF0055]' : 'text-[#00FF41]'
                }`}
              >
                {testModalApp.isBlocked ? t.blockedPopupTitle : t.onlinePopupTitle}
              </h3>
              <p className="text-sm font-bold text-white font-mono">
                {testModalApp.app.name}
              </p>
            </div>

            {/* Popup explanation text as requested */}
            <div className="p-3.5 rounded-2xl bg-black/80 border border-zinc-800 text-xs font-mono space-y-2 text-zinc-300">
              {testModalApp.isBlocked ? (
                <>
                  <p className="text-[#FF0055] font-bold">
                    {t.blockedPopupMsg}
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    All outbound TCP &amp; UDP socket packets for{' '}
                    <span className="text-white">{testModalApp.app.packageName}</span> are
                    intercepted and dropped by the local firewall rules.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[#00FF41] font-bold">
                    {t.onlinePopupMsg}
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Traffic is flowing freely across Wi-Fi and mobile cellular interfaces
                    (Latency: 14ms).
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setTestModalApp(null)}
              className={`w-full h-11 rounded-2xl font-orbitron font-bold text-xs tracking-wider ${
                testModalApp.isBlocked
                  ? 'bg-[#FF0055] text-white shadow-[0_0_15px_#FF0055]'
                  : 'bg-[#00FF41] text-black shadow-[0_0_15px_#00FF41]'
              }`}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
