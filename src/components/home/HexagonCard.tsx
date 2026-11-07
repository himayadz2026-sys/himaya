import React from 'react';
import { cyberAudio } from '../../utils/audio';

interface HexagonCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  tag?: string;
  onClick: () => void;
  accentColor?: string;
}

export const HexagonCard: React.FC<HexagonCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  tag,
  onClick,
  accentColor = '#00FF41',
}) => {
  const handleClick = () => {
    cyberAudio.playClick();
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="relative group cursor-pointer focus:outline-none transition-all duration-300 transform active:scale-95 hover:-translate-y-1"
    >
      {/* Outer Card with Cyber Chamfered Hexagonal Silhouette */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-white/95 dark:bg-gradient-to-b dark:from-zinc-900/90 dark:via-black/90 dark:to-zinc-950/95 border border-emerald-300/50 dark:border-[#00FF41]/35 backdrop-blur-md p-4 flex flex-col justify-between min-h-[148px] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:border-emerald-500 dark:group-hover:border-[#00FF41] group-hover:shadow-md dark:group-hover:shadow-[0_0_25px_rgba(0,255,65,0.35)] transition-all">
        
        {/* Animated Light Trail moving along the borders */}
        <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          {/* Top light beam */}
          <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 dark:via-[#00FF41] to-transparent animate-pulse" />
          {/* Bottom subtle glow */}
          <div className="absolute -bottom-[2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 dark:via-[#00FF41]/60 to-transparent" />
        </div>

        {/* Ambient interior radial glow on hover */}
        <div 
          className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-xl opacity-10 dark:opacity-20 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Top bar inside card: Icon + Status Tag */}
        <div className="flex items-start justify-between relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-black/80 border border-emerald-300 dark:border-[#00FF41]/40 flex items-center justify-center text-emerald-600 dark:text-[#00FF41] group-hover:border-emerald-500 dark:group-hover:border-[#00FF41] group-hover:box-neon-green transition-all shadow-xs">
            <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>

          {tag && (
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-lg border border-emerald-400/40 dark:border-[#00FF41]/30 bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-700 dark:text-[#00FF41]">
              {tag}
            </span>
          )}
        </div>

        {/* Bottom text info */}
        <div className="relative z-10 mt-3">
          <h3 className="text-base font-bold font-orbitron tracking-wide text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00FF41] transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-xs font-mono text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-300 transition-colors mt-0.5 line-clamp-2">
            {subtitle}
          </p>
        </div>

        {/* Subtle corner tech tick */}
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-emerald-400/50 dark:border-[#00FF41]/50 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-emerald-400/50 dark:border-[#00FF41]/50 pointer-events-none" />
      </div>
    </div>
  );
};
