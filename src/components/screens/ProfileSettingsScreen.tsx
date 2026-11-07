import React, { useState } from 'react';
import {
  UserCheck,
  Moon,
  Sun,
  Volume2,
  Sparkles,
  Sliders,
  Shield,
  RotateCcw,
  Cpu,
  Lock,
  KeyRound,
  HelpCircle,
  Check,
  AlertTriangle,
  X,
  Globe,
} from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { AppSettings } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface ProfileSettingsScreenProps {
  onBack: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetApp: () => void;
  currentLang?: Language;
  onOpenLanguageModal?: () => void;
}

const DEFAULT_QUESTIONS = [
  'What is your secret cyber alias?',
  'What was the model of your first computer?',
  'What is your favorite cryptographic algorithm?',
  'What city was your first cybersecurity convention in?',
  'What was your first phone model?',
];

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onBack,
  settings,
  onUpdateSettings,
  onResetApp,
  currentLang = 'ar',
  onOpenLanguageModal,
}) => {
  const t = translations[currentLang];
  const [operatorName, setOperatorName] = useState('Ghost-Operator');
  const [isEditingName, setIsEditingName] = useState(false);

  // App Lock settings
  const [isLockEnabled, setIsLockEnabled] = useState(
    () => localStorage.getItem('himaya_lock_enabled') !== 'false'
  );
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] = useState(false);

  // Change PIN modal state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [pinModalError, setPinModalError] = useState('');
  const [pinModalSuccess, setPinModalSuccess] = useState('');

  // Security Question modal state
  const [selectedQuestion, setSelectedQuestion] = useState(
    localStorage.getItem('himaya_lock_question') || DEFAULT_QUESTIONS[0]
  );
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [questionModalError, setQuestionModalError] = useState('');
  const [questionModalSuccess, setQuestionModalSuccess] = useState('');

  const handleToggleLock = () => {
    cyberAudio.playClick();
    const nextState = !isLockEnabled;
    setIsLockEnabled(nextState);
    localStorage.setItem('himaya_lock_enabled', nextState ? 'true' : 'false');
  };

  const handleChangePin = () => {
    const savedPin = localStorage.getItem('himaya_lock_pin');
    setPinModalError('');
    setPinModalSuccess('');

    // If pin exists, require current pin match
    if (savedPin && currentPinInput !== savedPin) {
      cyberAudio.playAlert();
      setPinModalError('Current PIN is incorrect');
      return;
    }

    if (newPinInput.length < 4) {
      cyberAudio.playAlert();
      setPinModalError('New PIN must be at least 4 digits');
      return;
    }

    if (newPinInput !== confirmNewPinInput) {
      cyberAudio.playAlert();
      setPinModalError('New PIN and confirmation do not match');
      return;
    }

    cyberAudio.playSuccess();
    localStorage.setItem('himaya_lock_pin', newPinInput);
    setPinModalSuccess('PIN changed successfully!');
    setTimeout(() => {
      setShowChangePinModal(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      setPinModalSuccess('');
    }, 1200);
  };

  const handleSaveSecurityQuestion = () => {
    setQuestionModalError('');
    setQuestionModalSuccess('');

    if (!securityAnswer.trim()) {
      cyberAudio.playAlert();
      setQuestionModalError('Security answer cannot be empty');
      return;
    }

    cyberAudio.playSuccess();
    localStorage.setItem('himaya_lock_question', selectedQuestion);
    localStorage.setItem('himaya_lock_answer', securityAnswer.trim().toLowerCase());
    setQuestionModalSuccess('Security question updated!');
    setTimeout(() => {
      setShowSecurityQuestionModal(false);
      setSecurityAnswer('');
      setQuestionModalSuccess('');
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={t.settings}
        subtitle={t.appSubtitle}
        onBack={onBack}
      />

      {/* LANGUAGE PREFERENCES SECTION (User Requirement: 1. Add language button in Settings) */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/25 p-5 space-y-4 shadow-sm box-neon-green">
        <h3 className="text-xs font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
          <span>{t.language}</span>
          <span className="text-slate-400">/ LANGUAGE</span>
        </h3>

        <div className="flex items-center justify-between py-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#00FF41]/10 border border-emerald-400 dark:border-[#00FF41]/40 flex items-center justify-center text-emerald-600 dark:text-[#00FF41]">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                {currentLang === 'ar' ? t.arabic : currentLang === 'fr' ? t.french : t.english}
              </span>
              <span className="text-slate-500 dark:text-zinc-500 text-[11px]">
                {currentLang === 'ar' ? 'اللغة الافتراضية للتطبيق (RTL)' : currentLang === 'fr' ? 'Français' : 'English Cyber Standard'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              if (onOpenLanguageModal) onOpenLanguageModal();
            }}
            className="px-3.5 py-2 rounded-xl border border-emerald-500/50 dark:border-[#00FF41]/50 bg-emerald-50 dark:bg-[#00FF41]/15 text-emerald-700 dark:text-[#00FF41] hover:bg-emerald-100 dark:hover:bg-[#00FF41]/25 font-bold transition-all text-xs box-neon-green flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLang === 'ar' ? 'تغيير' : currentLang === 'fr' ? 'CHANGER' : 'CHANGE'}</span>
          </button>
        </div>
      </div>

      {/* APP LOCK SECURITY SECTION (User Requirement #1) */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/25 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
          {t.appLockStartup}
        </h3>

        {/* Enable / Disable Lock Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900 text-xs font-mono">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{t.appLockStartup}</span>
            <span className="text-slate-500 dark:text-zinc-500 text-[11px]">{t.appLockStartupDesc}</span>
          </div>
          <button
            onClick={handleToggleLock}
            className={`w-12 h-7 rounded-full border p-1 transition-all flex items-center cursor-pointer ${
              isLockEnabled
                ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-100 dark:bg-[#00FF41]/20 justify-end'
                : 'border-slate-300 dark:border-zinc-800 bg-slate-200 dark:bg-zinc-900 justify-start'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full ${
                isLockEnabled ? 'bg-emerald-600 dark:bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-slate-400 dark:bg-zinc-600'
              }`}
            />
          </button>
        </div>

        {/* Change Password / PIN button */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900 text-xs font-mono">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{t.changePassword}</span>
            <span className="text-slate-500 dark:text-zinc-500 text-[11px]">
              {currentLang === 'ar' ? 'تحديث رمز PIN لقفل التطبيق' : 'Update your 4-6 digit startup lock PIN'}
            </span>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              setShowChangePinModal(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-emerald-500/40 dark:border-[#00FF41]/40 bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-600 dark:text-[#00FF41] hover:bg-emerald-100 font-bold transition-all text-xs"
          >
            {currentLang === 'ar' ? 'تغيير' : currentLang === 'fr' ? 'CHANGER' : 'CHANGE'}
          </button>
        </div>

        {/* Security Question update button */}
        <div className="flex items-center justify-between py-2 text-xs font-mono">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{t.resetSecurityQuestion}</span>
            <span className="text-slate-500 dark:text-zinc-500 text-[11px]">{t.resetSecurityQuestionDesc}</span>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              setShowSecurityQuestionModal(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] font-bold transition-all text-xs"
          >
            {currentLang === 'ar' ? 'تعديل' : currentLang === 'fr' ? 'MODIFIER' : 'UPDATE'}
          </button>
        </div>
      </div>

      {/* Operator Identity Badge */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-emerald-300/60 dark:border-[#00FF41]/40 p-5 backdrop-blur-md relative overflow-hidden box-neon-green">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-black border-2 border-emerald-500 dark:border-[#00FF41] flex items-center justify-center text-emerald-600 dark:text-[#00FF41] shrink-0 box-neon-green">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              {isEditingName ? (
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="bg-transparent border border-emerald-500 dark:border-[#00FF41] rounded px-2 py-0.5 text-sm font-orbitron text-slate-900 dark:text-white"
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="text-base sm:text-lg font-black font-orbitron text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-600 dark:hover:text-[#00FF41]"
                  title="Click to edit handle"
                >
                  {operatorName}
                </div>
              )}

              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 dark:border-[#00FF41]/40 text-emerald-600 dark:text-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/10 uppercase font-bold">
                TIER-1 CYBER
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 mt-0.5">
              <span>NODE-ID: 0x9F42..88A</span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-[#00FF41] font-semibold">AIR-GAPPED ENCLAVE</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900">
            <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">STATUS</span>
            <span className="text-emerald-600 dark:text-[#00FF41] font-bold">ACTIVE</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900">
            <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">CIPHER</span>
            <span className="text-slate-900 dark:text-white font-bold">AES-256</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900">
            <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">LOCK</span>
            <span className={`font-bold ${isLockEnabled ? 'text-emerald-600 dark:text-[#00FF41]' : 'text-slate-400'}`}>
              {isLockEnabled ? 'ENABLED' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* THEME & HARDWARE SETTINGS */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/25 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Sliders className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
          THEME &amp; AUDIO PREFERENCES
        </h3>

        {/* DARK MODE TOGGLE (User Requirement: default dark cyberpunk black + neon green, clean light mode when toggled off) */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            {settings.darkMode ? (
              <Moon className="w-4 h-4 text-[#00FF41]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {t.darkModeTitle}
              </span>
              <span className="text-slate-500 dark:text-zinc-500 text-[11px]">
                {settings.darkMode
                  ? 'Active: Black #000000 + Neon Green #00FF41'
                  : 'Active: Clean modern high-contrast Light Theme'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              const next = !settings.darkMode;
              onUpdateSettings({ darkMode: next });
              document.documentElement.classList.toggle('dark', next);
            }}
            className={`w-12 h-7 rounded-full border p-1 transition-all flex items-center cursor-pointer ${
              settings.darkMode
                ? 'border-[#00FF41] bg-[#00FF41]/20 justify-end'
                : 'border-slate-300 bg-slate-200 justify-start'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full ${
                settings.darkMode ? 'bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-amber-500'
              }`}
            />
          </button>
        </div>

        {/* Synthesized Cyber Audio FX */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{t.cyberAudioTitle}</span>
              <span className="text-slate-500 dark:text-zinc-500 text-[11px]">{t.cyberAudioDesc}</span>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !settings.soundEnabled;
              cyberAudio.enabled = next;
              cyberAudio.playClick();
              onUpdateSettings({ soundEnabled: next });
            }}
            className={`w-12 h-7 rounded-full border p-1 transition-all flex items-center cursor-pointer ${
              settings.soundEnabled
                ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-100 dark:bg-[#00FF41]/20 justify-end'
                : 'border-slate-300 dark:border-zinc-800 bg-slate-200 dark:bg-zinc-900 justify-start'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full ${
                settings.soundEnabled ? 'bg-emerald-600 dark:bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-slate-400 dark:bg-zinc-600'
              }`}
            />
          </button>
        </div>

        {/* Matrix Rain Speed */}
        <div className="py-2 border-b border-slate-100 dark:border-zinc-900 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">Matrix Rain Speed</span>
            <span className="text-emerald-600 dark:text-[#00FF41] uppercase font-bold">{settings.matrixRainSpeed}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['slow', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  cyberAudio.playClick();
                  onUpdateSettings({ matrixRainSpeed: spd });
                }}
                className={`py-1.5 rounded-xl border text-xs font-mono uppercase transition-all ${
                  settings.matrixRainSpeed === spd
                    ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/20 text-emerald-600 dark:text-[#00FF41] font-bold'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black/60 text-slate-600 dark:text-zinc-400'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>

        {/* Reset App Data */}
        <div className="pt-2">
          <button
            onClick={() => {
              cyberAudio.playAlert();
              onResetApp();
            }}
            className="w-full h-11 rounded-2xl bg-slate-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-rose-400 dark:hover:border-[#FF0055]/50 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-[#FF0055] font-mono text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetSessionData}</span>
          </button>
        </div>
      </div>

      {/* CHANGE PIN MODAL */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-[#00FF41]/50 p-6 space-y-4 box-neon-green relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#00FF41]" />
                <h4 className="font-orbitron font-bold text-white text-base">CHANGE PIN</h4>
              </div>
              <button
                onClick={() => setShowChangePinModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinModalError && (
              <div className="p-2.5 rounded-xl bg-[#FF0055]/20 border border-[#FF0055]/50 text-[#FF0055] text-xs font-mono">
                {pinModalError}
              </div>
            )}

            {pinModalSuccess && (
              <div className="p-2.5 rounded-xl bg-[#00FF41]/20 border border-[#00FF41]/50 text-[#00FF41] text-xs font-mono">
                {pinModalSuccess}
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              {localStorage.getItem('himaya_lock_pin') && (
                <div>
                  <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                    CURRENT PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter current PIN"
                    className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-white focus:outline-none"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  NEW PIN (4-6 DIGITS):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter new PIN"
                  className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  CONFIRM NEW PIN:
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter new PIN"
                  className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowChangePinModal(false)}
                className="flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleChangePin}
                className="flex-1 h-11 rounded-xl bg-[#00FF41] text-black font-orbitron font-bold text-xs"
              >
                SAVE PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY QUESTION MODAL */}
      {showSecurityQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-[#00FF41]/50 p-6 space-y-4 box-neon-green relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00FF41]" />
                <h4 className="font-orbitron font-bold text-white text-base">SECURITY QUESTION</h4>
              </div>
              <button
                onClick={() => setShowSecurityQuestionModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {questionModalError && (
              <div className="p-2.5 rounded-xl bg-[#FF0055]/20 border border-[#FF0055]/50 text-[#FF0055] text-xs font-mono">
                {questionModalError}
              </div>
            )}

            {questionModalSuccess && (
              <div className="p-2.5 rounded-xl bg-[#00FF41]/20 border border-[#00FF41]/50 text-[#00FF41] text-xs font-mono">
                {questionModalSuccess}
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  CHOOSE QUESTION:
                </label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-2.5 text-white focus:outline-none"
                >
                  {DEFAULT_QUESTIONS.map((q, idx) => (
                    <option key={idx} value={q} className="bg-zinc-950 text-white">
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  SECURITY ANSWER:
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Enter secret answer..."
                  className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-white focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSecurityQuestionModal(false)}
                className="flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveSecurityQuestion}
                className="flex-1 h-11 rounded-xl bg-[#00FF41] text-black font-orbitron font-bold text-xs"
              >
                SAVE QUESTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
