import React from 'react';
import { Volume2, VolumeX, ShieldAlert, ShieldCheck, Globe } from 'lucide-react';
import { cyberAudio } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface TopHeaderProps {
  threatMode: boolean;
  onToggleThreatMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  currentLang: Language;
  onOpenLanguageModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  threatMode,
  onToggleThreatMode,
  soundEnabled,
  onToggleSound,
  onOpenAlerts,
  unreadAlertsCount,
  currentLang,
  onOpenLanguageModal,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-black/85 backdrop-blur-md border-b border-emerald-300/40 dark:border-[#00FF41]/25 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              threatMode
                ? 'border-[#FF0055] bg-[#FF0055]/10 box-neon-red text-[#FF0055]'
                : 'border-emerald-500 dark:border-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/10 box-neon-green text-emerald-600 dark:text-[#00FF41]'
            }`}
          >
            {threatMode ? (
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-black tracking-widest font-orbitron ${
                  threatMode
                    ? 'text-[#FF0055] neon-glow-red'
                    : 'text-emerald-700 dark:text-[#00FF41] neon-glow-green'
                }`}
              >
                {t.appName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/40 dark:border-[#00FF41]/30 text-emerald-700 dark:text-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/5 font-bold">
                v2.4
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              <span className="uppercase tracking-wider font-semibold">
                {threatMode ? t.threatDetected : t.systemShielded}
              </span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-[#00FF41] font-semibold">256-BIT</span>
            </div>
          </div>
        </div>

        {/* Right HUD controls: Language, Sound, Threat toggle, Alerts */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Button (🌐 icon as requested) */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenLanguageModal();
            }}
            title={t.selectLanguage}
            aria-label="Language Switcher"
            className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-emerald-500/40 dark:border-[#00FF41]/40 bg-emerald-50/70 dark:bg-[#00FF41]/10 text-emerald-700 dark:text-[#00FF41] hover:bg-emerald-100 dark:hover:bg-[#00FF41]/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer box-neon-green"
          >
            <Globe className="w-4 h-4 animate-spin-slow" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {currentLang.toUpperCase()}
            </span>
          </button>
          {/* Threat Mode Toggle (Interactive for user to test red vs green HUD!) */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onToggleThreatMode();
            }}
            title={threatMode ? 'Switch to Safe Mode' : 'Simulate Threat Mode'}
            className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              threatMode
                ? 'border-[#FF0055] bg-[#FF0055]/20 text-[#FF0055] box-neon-red font-bold'
                : 'border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-[#00FF41]'
            }`}
          >
            {threatMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#FF0055] animate-ping" />
                <span className="font-bold">THREAT</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF41]" />
                <span className="font-semibold">SECURE</span>
              </>
            )}
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onToggleSound();
            }}
            className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            )}
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenAlerts();
            }}
            className="relative min-h-[40px] min-w-[40px] rounded-xl border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            title="Security Alerts"
            aria-label="Security Alerts"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF0055] text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
