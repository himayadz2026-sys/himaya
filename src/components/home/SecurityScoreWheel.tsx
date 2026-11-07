import React from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { cyberAudio } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface SecurityScoreWheelProps {
  score: number; // e.g. 98
  isThreat: boolean;
  onScanClick: () => void;
  statusLabel?: string;
  currentLang?: Language;
}

export const SecurityScoreWheel: React.FC<SecurityScoreWheelProps> = ({
  score,
  isThreat,
  onScanClick,
  statusLabel,
  currentLang = 'ar',
}) => {
  const t = translations[currentLang];
  const activeStatusLabel = statusLabel || (isThreat ? t.riskAlert : t.systemOptimal);
  const currentScore = isThreat ? Math.min(score, 38) : score;
  const primaryColor = isThreat ? '#FF0055' : '#00FF41';
  const glowClass = isThreat ? 'neon-glow-red' : 'neon-glow-green';
  const boxGlowClass = isThreat ? 'box-neon-red' : 'box-neon-green';

  return (
    <div className="relative flex flex-col items-center justify-center my-4 py-2 select-none">
      {/* Background ambient radial glow */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor: isThreat ? 'rgba(255, 0, 85, 0.15)' : 'rgba(0, 255, 65, 0.15)',
        }}
      />

      {/* Circular Wheel Container */}
      <div 
        onClick={() => {
          cyberAudio.playScanBeep();
          onScanClick();
        }}
        className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
      >
        {/* Layer 1: Outermost Ring with light ticks (Rotates continuously: slow if secure, fast if threat) */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-500 ${
            isThreat ? 'animate-spin-fast border-[#FF0055]/70' : 'animate-spin-slow border-[#00FF41]/40'
          }`}
        />

        {/* Layer 2: Rotating Light Streaks (Conic Gradient sweeping highlight) */}
        <div
          className={`absolute inset-1 rounded-full opacity-60 pointer-events-none transition-all duration-500 ${
            isThreat ? 'animate-spin-fast' : 'animate-spin-slow'
          }`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${primaryColor} 40deg, transparent 60deg)`,
            maskImage: 'radial-gradient(circle, transparent 65%, black 67%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 65%, black 67%)',
          }}
        />

        {/* Layer 3: Middle counter-rotating segment ring */}
        <div
          className={`absolute inset-4 rounded-full border border-dotted transition-all duration-500 ${
            isThreat ? 'animate-spin-reverse-slow border-[#FF0055]/50' : 'animate-spin-reverse-slow border-[#00FF41]/30'
          }`}
          style={{ borderWidth: '1.5px' }}
        />

        {/* Layer 4: SVG Circular Progress arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            className="stroke-zinc-900 fill-none"
            strokeWidth="5"
          />
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            className="fill-none transition-all duration-1000"
            stroke={primaryColor}
            strokeWidth="5"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * currentScore) / 100}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${primaryColor})`,
            }}
          />
        </svg>

        {/* Layer 5: Inner Glass HUD core */}
        <div className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white/95 dark:bg-black/85 backdrop-blur-md border flex flex-col items-center justify-center p-2 text-center shadow-lg dark:shadow-none transition-all ${
          isThreat ? 'border-[#FF0055]/60 ' + boxGlowClass : 'border-emerald-500/50 dark:border-[#00FF41]/50 ' + boxGlowClass
        }`}>
          {/* Top Status Icon */}
          <div className="flex items-center gap-1 mb-1">
            {isThreat ? (
              <AlertTriangle className="w-4 h-4 text-[#FF0055] animate-pulse" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            )}
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-zinc-400 font-bold">
              {isThreat ? 'RISK ALERT' : 'CORE SHIELD'}
            </span>
          </div>

          {/* Big Circular Score */}
          <div className="flex items-baseline justify-center">
            <span
              className={`text-4xl sm:text-5xl font-black font-orbitron tabular-nums tracking-tighter ${glowClass}`}
              style={{ color: primaryColor }}
            >
              {currentScore}
            </span>
            <span
              className="text-lg sm:text-xl font-bold font-mono ml-0.5"
              style={{ color: primaryColor }}
            >
              %
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider uppercase mt-0.5 font-bold">
            {t.securityScore}
          </span>

          {/* Interactive Tap Hint */}
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 dark:text-zinc-500 mt-1 group-hover:text-slate-800 dark:group-hover:text-zinc-300 transition-colors font-semibold">
            <RefreshCw className="w-2.5 h-2.5 group-hover:rotate-180 transition-transform" />
            <span>{t.tapToScan}</span>
          </div>
        </div>

        {/* Outer Orbit Dots */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
      </div>

      {/* Sub-label banner */}
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${isThreat ? 'bg-[#FF0055] animate-ping' : 'bg-[#00FF41]'}`} />
        <span className={`text-xs font-mono font-bold tracking-widest uppercase ${
          isThreat ? 'text-[#FF0055] neon-glow-red' : 'text-[#00FF41]'
        }`}>
          {activeStatusLabel}
        </span>
      </div>
    </div>
  );
};
