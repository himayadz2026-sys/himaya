import React, { useEffect, useState } from 'react';
import { Shield, Terminal, Zap, Lock } from 'lucide-react';
import { cyberAudio } from '../../utils/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('BOOTING ENCRYPTED SUBSYSTEM...');

  useEffect(() => {
    cyberAudio.playScanBeep();

    const stages = [
      { at: 15, msg: 'INITIALIZING ZERO-DAY HEURISTIC ENGINE...' },
      { at: 35, msg: 'LOADING MALWARE SIGNATURE REPOSITORY (v4.9)...' },
      { at: 60, msg: 'ENGAGING FIREWALL PACKET FILTER...' },
      { at: 85, msg: 'ESTABLISHING SECURE MEMORY ENCLAVE...' },
      { at: 100, msg: 'HIMAYA CYBER DEFENSE ONLINE' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        const stage = stages.find((s) => s.at <= next && s.at > prev);
        if (stage) {
          setStatusText(stage.msg);
          cyberAudio.playClick();
        }
        if (next >= 100) {
          clearInterval(timer);
          cyberAudio.playSuccess();
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 cursor-pointer select-none"
    >
      {/* Background radial glow */}
      <div className="absolute w-80 h-80 rounded-full bg-[#00FF41]/10 blur-3xl pointer-events-none" />

      {/* Cyber Hex Badge */}
      <div className="relative mb-8 group">
        <div className="w-28 h-28 relative flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00FF41]/40 animate-spin-slow" />
          {/* Inner counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-dotted border-[#00FF41]/70 animate-spin-reverse-slow" />
          
          {/* Glowing central icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#00FF41]/10 border border-[#00FF41] flex items-center justify-center box-neon-green">
            <Shield className="w-10 h-10 text-[#00FF41] animate-pulse" />
          </div>
        </div>

        {/* Corner tech marks */}
        <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-[#00FF41]" />
        <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-[#00FF41]" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-[#00FF41]" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-[#00FF41]" />
      </div>

      {/* Brand Title */}
      <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-[#00FF41] font-orbitron neon-glow-green text-center">
        HIMAYA
      </h1>
      <p className="text-xs sm:text-sm tracking-[0.3em] text-[#00FF41]/80 font-mono uppercase mt-2 mb-8 text-center">
        ALL-IN-ONE SECURITY &amp; HACKER TOOLS
      </p>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-[#00FF41]/90">
          <span className="flex items-center gap-1.5 truncate">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{statusText}</span>
          </span>
          <span className="font-bold tabular-nums ml-2">{progress}%</span>
        </div>

        <div className="h-2 w-full bg-slate-950 border border-[#00FF41]/40 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#00FF41]/70 via-[#00FF41] to-emerald-300 rounded-full transition-all duration-75 relative shadow-[0_0_10px_#00FF41]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-[10px] text-[#00FF41]/60 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> SECURE SANDBOX
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" /> TAP TO SKIP
          </span>
        </div>
      </div>
    </div>
  );
};
