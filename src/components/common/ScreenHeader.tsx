import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cyberAudio } from '../../utils/audio';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-[#00FF41]/20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            cyberAudio.playClick();
            onBack();
          }}
          className="min-h-[44px] min-w-[44px] rounded-xl border border-emerald-400/50 dark:border-[#00FF41]/40 bg-white dark:bg-zinc-950/80 hover:border-emerald-500 dark:hover:border-[#00FF41] hover:bg-emerald-50 dark:hover:bg-[#00FF41]/10 flex items-center justify-center text-emerald-600 dark:text-[#00FF41] transition-all active:scale-90 cursor-pointer shadow-xs"
          aria-label="Back to main menu"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-orbitron tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <span>{title}</span>
          </h2>
          <p className="text-xs font-mono text-emerald-700 dark:text-[#00FF41]/80 tracking-wider uppercase font-semibold">
            {subtitle}
          </p>
        </div>
      </div>

      {rightAction && <div>{rightAction}</div>}
    </div>
  );
};
