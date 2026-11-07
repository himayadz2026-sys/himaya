import React from 'react';
import { Database, RefreshCw, CheckCircle2, Cloud, WifiOff, ShieldCheck, ExternalLink } from 'lucide-react';
import { VirusDatabasePayload } from '../../types';
import { Language, translations } from '../../utils/i18n';
import { cyberAudio } from '../../utils/audio';

interface VirusDatabaseHUDProps {
  database: VirusDatabasePayload | null;
  isLoading: boolean;
  source: 'network' | 'cache' | 'idle';
  onRefresh: () => void;
  currentLang?: Language;
  onOpenDetails?: () => void;
}

export const VirusDatabaseHUD: React.FC<VirusDatabaseHUDProps> = ({
  database,
  isLoading,
  source,
  onRefresh,
  currentLang = 'ar',
  onOpenDetails,
}) => {
  const t = translations[currentLang];

  const version = database?.version ?? 1;
  const totalViruses = database?.viruses?.length ?? 0;
  const lastUpdated = database?.updated || '2026-11-07';

  return (
    <div className="relative rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-[#00FF41]/40 p-4 sm:p-5 backdrop-blur-md relative overflow-hidden box-neon-green shadow-sm">
      {/* Subtle background glow */}
      <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-emerald-500/10 dark:bg-[#00FF41]/10 blur-2xl pointer-events-none" />

      {/* Header bar: Title, Sync Badge & Refresh Button */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#00FF41]/10 border border-emerald-500/40 dark:border-[#00FF41]/40 flex items-center justify-center text-emerald-600 dark:text-[#00FF41] shrink-0">
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-slate-900 dark:text-white truncate">
                {t.virusDbTitle}
              </h3>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-[#00FF41]/15 text-emerald-800 dark:text-[#00FF41] border border-emerald-400/30 dark:border-[#00FF41]/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">
              GitHub: himayadz2026-sys/himaya-database
            </p>
          </div>
        </div>

        {/* Sync Status Badge & Refresh Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold ${
              source === 'network'
                ? 'border-emerald-500/50 dark:border-[#00FF41]/50 bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-700 dark:text-[#00FF41]'
                : 'border-amber-400/50 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span className="hidden sm:inline">{t.syncingDb}</span>
              </>
            ) : source === 'network' ? (
              <>
                <Cloud className="w-2.5 h-2.5" />
                <span>{t.syncedGithub}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-2.5 h-2.5" />
                <span>{t.offlineCache}</span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              cyberAudio.playScanBeep();
              onRefresh();
            }}
            disabled={isLoading}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/80 hover:border-emerald-500 dark:hover:border-[#00FF41] text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] flex items-center justify-center transition-all active:scale-90 cursor-pointer disabled:opacity-50"
            title="Refresh from GitHub"
            aria-label="Refresh database from GitHub"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* The 3 Core Required Telemetry Fields:
          Requirement 2: Show in Home screen: "Database Version: X" and "Total Viruses: X" and "Last Updated: date" */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center font-mono">
        {/* Metric 1: Database Version */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-black/70 border border-slate-200 dark:border-zinc-900 flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">
            {t.dbVersionLabel}
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-sm sm:text-base font-black font-orbitron text-emerald-600 dark:text-[#00FF41] tabular-nums neon-glow-green">
              v{version}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
            Database Version: {version}
          </span>
        </div>

        {/* Metric 2: Total Viruses */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-black/70 border border-slate-200 dark:border-zinc-900 flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">
            {t.totalVirusesLabel}
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-sm sm:text-base font-black font-orbitron text-slate-900 dark:text-white tabular-nums">
              {totalViruses}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
            Total Viruses: {totalViruses}
          </span>
        </div>

        {/* Metric 3: Last Updated */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-black/70 border border-slate-200 dark:border-zinc-900 flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">
            {t.lastUpdatedLabel}
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-zinc-200 truncate">
              {lastUpdated}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5 truncate">
            Last Updated: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Optional details trigger if signatures exist */}
      {onOpenDetails && totalViruses > 0 && (
        <button
          onClick={() => {
            cyberAudio.playClick();
            onOpenDetails();
          }}
          className="w-full mt-3 py-1.5 px-3 rounded-xl bg-emerald-50/60 dark:bg-[#00FF41]/10 border border-emerald-500/30 dark:border-[#00FF41]/30 hover:border-emerald-500 dark:hover:border-[#00FF41] text-emerald-700 dark:text-[#00FF41] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>View {totalViruses} Remote Signatures</span>
        </button>
      )}
    </div>
  );
};
