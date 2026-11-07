import React from 'react';
import { Shield, Radar, BellRing, UserCheck } from 'lucide-react';
import { BottomNavTab } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface BottomNavProps {
  currentTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  alertsCount?: number;
  currentLang?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  alertsCount = 0,
  currentLang = 'ar',
}) => {
  const t = translations[currentLang];

  const tabs: { id: BottomNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Shield },
    { id: 'scan', label: t.scan, icon: Radar },
    { id: 'alerts', label: t.alerts, icon: BellRing },
    { id: 'profile', label: t.profile, icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-[#00FF41]/30 pb-safe shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                cyberAudio.playClick();
                onSelectTab(tab.id);
              }}
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all group focus:outline-none cursor-pointer"
            >
              {/* Active top indicator bar */}
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-emerald-500 dark:bg-[#00FF41] rounded-full shadow-[0_0_8px_#00FF41]" />
              )}

              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-[#00FF41] transform -translate-y-0.5'
                    : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'filter drop-shadow-[0_0_6px_rgba(0,255,65,0.7)]' : ''
                  }`}
                />

                {tab.id === 'alerts' && alertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF0055] ring-2 ring-white dark:ring-black" />
                )}
              </div>

              <span
                className={`text-[11px] font-mono tracking-wider transition-colors uppercase ${
                  isActive
                    ? 'text-emerald-700 dark:text-[#00FF41] font-bold'
                    : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
