import React from 'react';
import { Database, ShieldCheck, X, Sparkles, ArrowRight, Check } from 'lucide-react';
import { VirusDatabasePayload } from '../../types';
import { Language, translations } from '../../utils/i18n';
import { cyberAudio } from '../../utils/audio';

interface VirusDatabaseUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: VirusDatabasePayload;
  oldVersion: number | null;
  currentLang?: Language;
}

export const VirusDatabaseUpdateModal: React.FC<VirusDatabaseUpdateModalProps> = ({
  isOpen,
  onClose,
  database,
  oldVersion,
  currentLang = 'ar',
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];

  const handleAcknowledge = () => {
    cyberAudio.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-zinc-950 border-2 border-emerald-500 dark:border-[#00FF41] p-6 space-y-5 box-neon-green relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            cyberAudio.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Glowing Shield Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-[#00FF41]/10 border-2 border-emerald-500 dark:border-[#00FF41] flex items-center justify-center text-emerald-600 dark:text-[#00FF41] box-neon-green">
              <Database className="w-8 h-8 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 dark:bg-[#00FF41] text-black flex items-center justify-center text-xs font-bold shadow-[0_0_8px_#00FF41]">
              <Sparkles className="w-3 h-3" />
            </span>
          </div>

          <div>
            {/* Requirement #4 exact title: "New virus database available" */}
            <h3 className="text-xl font-black font-orbitron tracking-wide text-slate-900 dark:text-white">
              {t.newDbAvailable}
            </h3>
            <p className="text-xs font-mono text-emerald-600 dark:text-[#00FF41] font-semibold mt-0.5">
              New virus database available
            </p>
          </div>
        </div>

        {/* Version Upgrade Banner */}
        <div className="rounded-2xl bg-slate-50 dark:bg-black/80 border border-slate-200 dark:border-zinc-800 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 pb-2.5">
            <span className="font-semibold uppercase tracking-wider">VERSION UPGRADE</span>
            <div className="flex items-center gap-2 font-bold font-orbitron">
              <span className="text-slate-400 dark:text-zinc-500">
                v{oldVersion !== null ? oldVersion : '0'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 dark:text-[#00FF41] rtl:rotate-180" />
              <span className="text-emerald-600 dark:text-[#00FF41] text-sm neon-glow-green">
                v{database.version}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block uppercase">
                {t.totalVirusesLabel}
              </span>
              <span className="text-base font-bold font-orbitron text-slate-900 dark:text-white">
                {database.viruses.length}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block uppercase">
                {t.lastUpdatedLabel}
              </span>
              <span className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate block mt-0.5">
                {database.updated}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed text-center pt-1">
            {t.newDbPopupMsg}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAcknowledge}
          className="w-full h-12 rounded-2xl bg-emerald-500 dark:bg-[#00FF41] text-black font-orbitron font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,65,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{currentLang === 'ar' ? 'تأكيد واستمرار' : currentLang === 'fr' ? 'ACCEPTER & CONTINUER' : 'ACKNOWLEDGE & APPLY'}</span>
        </button>
      </div>
    </div>
  );
};
