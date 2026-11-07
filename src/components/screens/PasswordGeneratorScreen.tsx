import React, { useState, useEffect, useCallback } from 'react';
import { KeyRound, Copy, Check, RefreshCw, Bookmark, Sparkles } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

interface PasswordGeneratorScreenProps {
  onBack: () => void;
  currentLang?: Language;
}

export const PasswordGeneratorScreen: React.FC<PasswordGeneratorScreenProps> = ({ onBack, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedVault, setSavedVault] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      uppercaseChars = uppercaseChars.replace(/[OI]/g, '');
      lowercaseChars = lowercaseChars.replace(/[l]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
    }

    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (!charPool) {
      charPool = lowercaseChars;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charPool[array[i] % charPool.length];
    }

    setPassword(result);
    cyberAudio.playClick();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Calculate Entropy and Crack Time
  const calculateStrength = () => {
    let poolSize = 0;
    if (includeUppercase) poolSize += 26;
    if (includeLowercase) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;
    if (poolSize === 0) poolSize = 26;

    const entropy = Math.round(length * Math.log2(poolSize));

    let label = 'WEAK';
    let color = '#FF0055';
    let crackTime = 'A few seconds';
    let percent = 20;

    if (entropy < 40) {
      label = 'CRITICAL / WEAK';
      color = '#FF0055';
      crackTime = 'Under 3 minutes';
      percent = 25;
    } else if (entropy < 60) {
      label = 'MODERATE';
      color = '#F59E0B';
      crackTime = 'Several months';
      percent = 50;
    } else if (entropy < 80) {
      label = 'STRONG';
      color = '#00FF41';
      crackTime = '240,000 years';
      percent = 80;
    } else {
      label = 'QUANTUM-RESISTANT';
      color = '#00FF41';
      crackTime = '100+ Quintillion years';
      percent = 100;
    }

    return { entropy, label, color, crackTime, percent };
  };

  const strength = calculateStrength();

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    cyberAudio.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToVault = () => {
    if (!password || savedVault.includes(password)) return;
    setSavedVault((prev) => [password, ...prev.slice(0, 4)]);
    cyberAudio.playSuccess();
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={t.passwordGenTitle}
        subtitle={t.passwordGenSubtitle}
        onBack={onBack}
      />

      {/* Generated Output Display */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-[#00FF41]/40 p-5 backdrop-blur-md relative overflow-hidden box-neon-green shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 mb-2 font-semibold">
          <span>{t.cipherDisplayTitle}</span>
          <span>{length} {t.characters}</span>
        </div>

        <div className="p-3.5 bg-slate-100 dark:bg-black/90 rounded-2xl border border-slate-300 dark:border-zinc-800 text-base sm:text-lg font-mono text-emerald-700 dark:text-[#00FF41] break-all select-all flex items-center justify-between gap-3">
          <span className="tracking-wider font-bold">{password}</span>
        </div>

        {/* Action Buttons for Display */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={generatePassword}
            className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/60 dark:hover:border-[#00FF41]/60 text-slate-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-[#00FF41] font-mono text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.reRoll}</span>
          </button>

          <button
            onClick={handleCopy}
            className="min-h-[44px] rounded-xl bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-orbitron font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.3)] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copied : t.copy}</span>
          </button>

          <button
            onClick={handleSaveToVault}
            className="min-h-[44px] rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#00FF41]/60 text-zinc-200 hover:text-[#00FF41] font-mono text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t.saveKey}</span>
          </button>
        </div>

        {/* Strength Meter */}
        <div className="mt-4 pt-3 border-t border-zinc-900 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400">ENTROPY STRENGTH</span>
            <span className="font-bold tracking-wider" style={{ color: strength.color }}>
              {strength.label} ({strength.entropy} bits)
            </span>
          </div>

          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${strength.percent}%`,
                backgroundColor: strength.color,
                boxShadow: `0 0 8px ${strength.color}`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>BRUTE-FORCE TIME:</span>
            <span className="text-zinc-200 font-semibold">{strength.crackTime}</span>
          </div>
        </div>
      </div>

      {/* Controls & Configuration */}
      <div className="rounded-2xl bg-zinc-950/80 border border-[#00FF41]/25 p-4 space-y-4">
        {/* Slider for Length 8-32 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="key-length-slider" className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
              KEY LENGTH: {length}
            </label>
            <span className="text-xs font-mono text-[#00FF41] px-2 py-0.5 rounded bg-[#00FF41]/10 border border-[#00FF41]/30">
              {length} bytes
            </span>
          </div>
          <input
            id="key-length-slider"
            type="range"
            min={8}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#00FF41]"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
            <span>8 (MIN)</span>
            <span>16 (REC)</span>
            <span>24</span>
            <span>32 (ULTRA)</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            CHARACTER MATRIX:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Uppercase (A-Z)', val: includeUppercase, set: setIncludeUppercase },
              { label: 'Lowercase (a-z)', val: includeLowercase, set: setIncludeLowercase },
              { label: 'Numbers (0-9)', val: includeNumbers, set: setIncludeNumbers },
              { label: 'Symbols (!@#$%)', val: includeSymbols, set: setIncludeSymbols },
            ].map((toggle, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cyberAudio.playClick();
                  toggle.set(!toggle.val);
                }}
                className={`min-h-[44px] px-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                  toggle.val
                    ? 'border-[#00FF41] bg-[#00FF41]/10 text-white'
                    : 'border-zinc-800 bg-black/60 text-zinc-500'
                }`}
              >
                <span>{toggle.label}</span>
                <span className={`w-2 h-2 rounded-full ${toggle.val ? 'bg-[#00FF41] shadow-[0_0_6px_#00FF41]' : 'bg-zinc-700'}`} />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setExcludeAmbiguous(!excludeAmbiguous);
            }}
            className={`w-full min-h-[44px] px-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all mt-2 ${
              excludeAmbiguous
                ? 'border-[#00FF41] bg-[#00FF41]/10 text-white'
                : 'border-zinc-800 bg-black/60 text-zinc-500'
            }`}
          >
            <span>Exclude Ambiguous Chars (0, O, l, 1)</span>
            <span className={`w-2 h-2 rounded-full ${excludeAmbiguous ? 'bg-[#00FF41] shadow-[0_0_6px_#00FF41]' : 'bg-zinc-700'}`} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="pt-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
            SECURITY PRESETS:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setLength(32);
                setIncludeUppercase(true);
                setIncludeLowercase(true);
                setIncludeNumbers(true);
                setIncludeSymbols(true);
                cyberAudio.playClick();
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00FF41]/40 text-xs font-mono text-zinc-300 flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#00FF41]" />
              <span>Max Cyber</span>
            </button>

            <button
              onClick={() => {
                setLength(16);
                setIncludeUppercase(true);
                setIncludeLowercase(true);
                setIncludeNumbers(true);
                setIncludeSymbols(false);
                cyberAudio.playClick();
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00FF41]/40 text-xs font-mono text-zinc-300 flex items-center justify-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-[#00FF41]" />
              <span>Alphanumeric</span>
            </button>

            <button
              onClick={() => {
                setLength(8);
                setIncludeUppercase(false);
                setIncludeLowercase(false);
                setIncludeNumbers(true);
                setIncludeSymbols(false);
                cyberAudio.playClick();
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00FF41]/40 text-xs font-mono text-zinc-300 flex items-center justify-center gap-1"
            >
              <span>8-Digit PIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Session Vault */}
      {savedVault.length > 0 && (
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 p-4 space-y-2">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            SAVED SESSION KEYS ({savedVault.length})
          </div>
          <div className="space-y-2">
            {savedVault.map((pass, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-black/80 border border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-300"
              >
                <span className="truncate mr-2 font-mono text-[#00FF41]/90">{pass}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pass);
                    cyberAudio.playSuccess();
                  }}
                  className="px-2 py-1 bg-zinc-800 hover:bg-[#00FF41]/20 rounded text-[11px] text-[#00FF41] border border-zinc-700"
                >
                  COPY
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
