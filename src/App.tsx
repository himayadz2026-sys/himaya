/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  KeyRound,
  Wifi,
  Lightbulb,
  Radar,
  ShieldBan,
  Terminal as TerminalIcon,
  MapPin,
} from 'lucide-react';

import { ScreenId, BottomNavTab, AppSettings } from './types';
import { MatrixRain } from './components/background/MatrixRain';
import { CyberFog } from './components/background/CyberFog';
import { SplashScreen } from './components/common/SplashScreen';
import { AppLockScreen } from './components/auth/AppLockScreen';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { SecurityScoreWheel } from './components/home/SecurityScoreWheel';
import { HexagonCard } from './components/home/HexagonCard';

// Feature Screens
import { LinkScannerScreen } from './components/screens/LinkScannerScreen';
import { PasswordGeneratorScreen } from './components/screens/PasswordGeneratorScreen';
import { WifiScannerScreen } from './components/screens/WifiScannerScreen';
import { DailyTipScreen } from './components/screens/DailyTipScreen';
import { AntivirusScanScreen } from './components/screens/AntivirusScanScreen';
import { InternetBlockerScreen } from './components/screens/InternetBlockerScreen';
import { TerminalScreen } from './components/screens/TerminalScreen';
import { CoordinatesMapScreen } from './components/screens/CoordinatesMapScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';
import { LanguageModal } from './components/common/LanguageModal';
import { VirusDatabaseHUD } from './components/home/VirusDatabaseHUD';
import { VirusDatabaseUpdateModal } from './components/home/VirusDatabaseUpdateModal';
import { fetchVirusDatabase, getLocalVirusDatabase } from './services/virusDatabaseService';
import { VirusDatabasePayload } from './types';
import { Language, getSavedLanguage, setSavedLanguage, translations } from './utils/i18n';
import { cyberAudio } from './utils/audio';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<Language>(getSavedLanguage);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Online Virus Database State (Requirements 1, 2, 3, 4)
  const [virusDb, setVirusDb] = useState<VirusDatabasePayload>(() => {
    const cached = getLocalVirusDatabase();
    return cached || { version: 1, updated: '2026-11-07', viruses: [] };
  });
  const [isVirusDbLoading, setIsVirusDbLoading] = useState(false);
  const [virusDbSource, setVirusDbSource] = useState<'network' | 'cache' | 'idle'>('idle');
  const [showNewDbPopup, setShowNewDbPopup] = useState(false);
  const [oldDbVersion, setOldDbVersion] = useState<number | null>(null);
  
  // App Lock State (User Requirement 1)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Check if AppLock is disabled in settings
    const lockEnabled = localStorage.getItem('himaya_lock_enabled');
    const hasPin = localStorage.getItem('himaya_lock_pin');
    if (lockEnabled === 'false') return true;
    return false; // Requires unlock or first-launch PIN creation
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [currentTab, setCurrentTab] = useState<BottomNavTab>('home');
  const [threatMode, setThreatMode] = useState(false);
  const [recentThreats, setRecentThreats] = useState<string[]>([
    'Unencrypted Public Wi-Fi in range',
  ]);

  // App Settings: Default is cyberpunk dark mode (black + neon green)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedDarkMode = localStorage.getItem('himaya_dark_mode');
    return {
      darkMode: savedDarkMode !== null ? savedDarkMode === 'true' : true,
      soundEnabled: true,
      matrixRainSpeed: 'normal',
      matrixDensity: 'medium',
      amoledPitchBlack: true,
      hapticFeedback: true,
      threatSimulation: false,
    };
  });

  // Sync dark class on document element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('himaya_dark_mode', settings.darkMode ? 'true' : 'false');
  }, [settings.darkMode]);

  // Sync language selection, direction (RTL for Arabic), and document attributes
  useEffect(() => {
    setSavedLanguage(lang);
  }, [lang]);

  // Requirement #1: When app opens, fetch the JSON from GitHub
  const loadVirusDatabase = useCallback(async () => {
    setIsVirusDbLoading(true);
    try {
      const res = await fetchVirusDatabase();
      setVirusDb(res.data);
      setVirusDbSource(res.source);

      // Requirement #4: If version number increases, show a popup "New virus database available"
      if (res.isNewVersion) {
        setOldDbVersion(res.oldVersion);
        setShowNewDbPopup(true);
        cyberAudio.playSuccess();
      }
    } catch (err) {
      console.warn('[Himaya] Error loading virus database:', err);
    } finally {
      setIsVirusDbLoading(false);
    }
  }, []);

  // Trigger fetch every time the app opens
  useEffect(() => {
    loadVirusDatabase();
  }, [loadVirusDatabase]);

  const t = translations[lang];

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.darkMode !== undefined) {
        localStorage.setItem('himaya_dark_mode', newSettings.darkMode ? 'true' : 'false');
        if (newSettings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return updated;
    });
  };

  const handleResetApp = () => {
    setThreatMode(false);
    setRecentThreats([]);
    setCurrentScreen('home');
    setCurrentTab('home');
  };

  const handleThreatFound = (threat: string) => {
    setThreatMode(true);
    setRecentThreats((prev) => [threat, ...prev.slice(0, 4)]);
  };

  const handleScanComplete = (threatsFound: number) => {
    if (threatsFound > 0) {
      setThreatMode(true);
      setRecentThreats((prev) => [
        `Antivirus: ${threatsFound} Malicious Payload detected`,
        ...prev,
      ]);
    } else {
      setThreatMode(false);
      setRecentThreats((prev) => prev.filter((t) => !t.startsWith('Antivirus')));
    }
  };

  const handleTabSelect = (tab: BottomNavTab) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'scan') {
      setCurrentScreen('antivirus-scan');
    } else if (tab === 'alerts') {
      setCurrentScreen('alerts');
    } else if (tab === 'profile') {
      setCurrentScreen('profile-settings');
    }
  };

  const toolCards = [
    {
      id: 'link-scanner',
      title: t.linkScannerTitle,
      subtitle: t.linkScannerSubtitle,
      icon: Globe,
      tag: 'HEURISTIC',
      accentColor: '#00FF41',
      screen: 'link-scanner' as ScreenId,
    },
    {
      id: 'password-generator',
      title: t.passwordGenTitle,
      subtitle: t.passwordGenSubtitle,
      icon: KeyRound,
      tag: 'ENTROPY',
      accentColor: '#00FF41',
      screen: 'password-generator' as ScreenId,
    },
    {
      id: 'wifi-scanner',
      title: t.wifiScannerTitle,
      subtitle: t.wifiScannerSubtitle,
      icon: Wifi,
      tag: 'RF AUDIT',
      accentColor: '#00FF41',
      screen: 'wifi-scanner' as ScreenId,
    },
    {
      id: 'daily-tip',
      title: t.dailyTipTitle,
      subtitle: t.dailyTipSubtitle,
      icon: Lightbulb,
      tag: 'INTEL',
      accentColor: '#00FF41',
      screen: 'daily-tip' as ScreenId,
    },
    {
      id: 'antivirus-scan',
      title: t.antivirusTitle,
      subtitle: t.antivirusSubtitle,
      icon: Radar,
      tag: 'DEFENSE',
      accentColor: '#00FF41',
      screen: 'antivirus-scan' as ScreenId,
    },
    {
      id: 'internet-blocker',
      title: t.internetBlockerTitle,
      subtitle: t.internetBlockerSubtitle,
      icon: ShieldBan,
      tag: 'FIREWALL',
      accentColor: '#00FF41',
      screen: 'internet-blocker' as ScreenId,
    },
    {
      id: 'terminal',
      title: t.terminalTitle,
      subtitle: t.terminalSubtitle,
      icon: TerminalIcon,
      tag: 'SHELL',
      accentColor: '#00FF41',
      screen: 'terminal' as ScreenId,
    },
    {
      id: 'map-coords',
      title: t.mapCoordsTitle,
      subtitle: t.mapCoordsSubtitle,
      icon: MapPin,
      tag: 'GEOLOC',
      accentColor: '#00FF41',
      screen: 'map-coords' as ScreenId,
    },
  ];

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. App Lock Screen (User Requirement 1: First launch requires PIN creation, no default password)
  if (!isUnlocked) {
    return <AppLockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div
      className={`min-h-screen relative flex flex-col transition-colors duration-300 pb-24 ${
        settings.darkMode
          ? settings.amoledPitchBlack
            ? 'bg-black text-[#e5ffe8]'
            : 'bg-[#040806] text-[#e5ffe8]'
          : 'bg-[#F4F7F5] text-slate-900'
      }`}
    >
      {/* Dynamic Animated Matrix Code Rain Background */}
      <MatrixRain
        speed={settings.matrixRainSpeed}
        density={settings.matrixDensity}
      />

      {/* Moving Green Fog and Ambient Light Particles */}
      <CyberFog />

      {/* Top HUD Header */}
      <TopHeader
        threatMode={threatMode}
        onToggleThreatMode={() => setThreatMode(!threatMode)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
        }
        onOpenAlerts={() => {
          setCurrentScreen('alerts');
          setCurrentTab('alerts');
        }}
        unreadAlertsCount={recentThreats.length}
        currentLang={lang}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 relative z-10">
        {currentScreen === 'home' && (
          <div className="space-y-6">
            {/* Center Big Circular Security Score */}
            <SecurityScoreWheel
              score={threatMode ? 32 : 98}
              isThreat={threatMode}
              onScanClick={() => {
                setCurrentScreen('antivirus-scan');
                setCurrentTab('scan');
              }}
              currentLang={lang}
              statusLabel={
                threatMode
                  ? t.riskAlert
                  : t.systemOptimal
              }
            />

            {/* Online Virus Database Live Telemetry (Requirements #1, #2, #3, #5) */}
            <VirusDatabaseHUD
              database={virusDb}
              isLoading={isVirusDbLoading}
              source={virusDbSource}
              onRefresh={loadVirusDatabase}
              currentLang={lang}
            />

            {/* Section Title */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#00FF41]/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#00FF41] shadow-[0_0_8px_#00FF41]" />
                <h2 className="text-sm sm:text-base font-orbitron font-bold tracking-wider text-slate-900 dark:text-white uppercase">
                  {t.tacticalArsenal}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-semibold">
                {t.modulesActive}
              </span>
            </div>

            {/* 8 Glass Hexagonal Cards with glowing borders and light trails */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {toolCards.map((tool) => (
                <HexagonCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  subtitle={tool.subtitle}
                  icon={tool.icon}
                  tag={tool.tag}
                  accentColor={tool.accentColor}
                  onClick={() => {
                    setCurrentScreen(tool.screen);
                  }}
                />
              ))}
            </div>

            {/* Live Threat Banner if Threat Mode active */}
            {threatMode && (
              <div className="p-4 rounded-3xl bg-rose-950/30 border border-[#FF0055] flex items-center justify-between gap-3 box-neon-red animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF0055]/20 border border-[#FF0055] flex items-center justify-center text-[#FF0055] shrink-0">
                    <Radar className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-orbitron text-[#FF0055]">
                      THREAT SIMULATION ACTIVE
                    </h4>
                    <p className="text-xs font-mono text-slate-300">
                      Security score dropped to 32%. Outer ring rotating at high velocity.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setThreatMode(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-orbitron font-bold text-xs shrink-0 cursor-pointer"
                >
                  RESOLVE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feature Screen 1: Link Scanner */}
        {currentScreen === 'link-scanner' && (
          <LinkScannerScreen
            onBack={() => setCurrentScreen('home')}
            onThreatFound={handleThreatFound}
            currentLang={lang}
          />
        )}

        {/* Feature Screen 2: Password Generator */}
        {currentScreen === 'password-generator' && (
          <PasswordGeneratorScreen
            onBack={() => setCurrentScreen('home')}
            currentLang={lang}
          />
        )}

        {/* Feature Screen 3: WiFi Scanner */}
        {currentScreen === 'wifi-scanner' && (
          <WifiScannerScreen
            onBack={() => setCurrentScreen('home')}
            onThreatFound={handleThreatFound}
            currentLang={lang}
          />
        )}

        {/* Feature Screen 4: Daily Tip */}
        {currentScreen === 'daily-tip' && (
          <DailyTipScreen onBack={() => setCurrentScreen('home')} />
        )}

        {/* Feature Screen 5: Antivirus Deep Scan (Fixed & Functional with History) */}
        {currentScreen === 'antivirus-scan' && (
          <AntivirusScanScreen
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            onScanComplete={handleScanComplete}
            currentLang={lang}
            virusDatabase={virusDb}
          />
        )}

        {/* Feature Screen 6: Internet Blocker */}
        {currentScreen === 'internet-blocker' && (
          <InternetBlockerScreen
            onBack={() => setCurrentScreen('home')}
            currentLang={lang}
          />
        )}

        {/* Feature Screen 7: Fancy Terminal */}
        {currentScreen === 'terminal' && (
          <TerminalScreen
            onBack={() => setCurrentScreen('home')}
            currentLang={lang}
          />
        )}

        {/* Feature Screen 8: Coordinates to Map */}
        {currentScreen === 'map-coords' && (
          <CoordinatesMapScreen
            onBack={() => setCurrentScreen('home')}
            currentLang={lang}
          />
        )}

        {/* Alerts Screen */}
        {currentScreen === 'alerts' && (
          <AlertsScreen
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            threats={recentThreats}
            onClearAlerts={() => setRecentThreats([])}
            onNavigateTo={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* Profile & Settings Screen */}
        {currentScreen === 'profile-settings' && (
          <ProfileSettingsScreen
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetApp={handleResetApp}
            currentLang={lang}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
          />
        )}
      </main>

      {/* Glassmorphic Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        alertsCount={recentThreats.length}
        currentLang={lang}
      />

      {/* Cyber Language Switcher Modal */}
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLang={lang}
        onSelectLanguage={(newLang) => {
          setLang(newLang);
          setSavedLanguage(newLang);
        }}
      />

      {/* New Virus Database Available Popup (Requirement #4) */}
      <VirusDatabaseUpdateModal
        isOpen={showNewDbPopup}
        onClose={() => setShowNewDbPopup(false)}
        database={virusDb}
        oldVersion={oldDbVersion}
        currentLang={lang}
      />
    </div>
  );
}
