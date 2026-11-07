import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, HelpCircle, Check, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { cyberAudio } from '../../utils/audio';

interface AppLockScreenProps {
  onUnlock: () => void;
}

const DEFAULT_QUESTIONS = [
  'What is your secret cyber alias?',
  'What was the model of your first computer?',
  'What is your favorite cryptographic algorithm?',
  'What city was your first cybersecurity convention in?',
  'What was your first phone model?',
];

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ onUnlock }) => {
  // Check if PIN exists in localStorage
  const savedPin = localStorage.getItem('himaya_lock_pin');
  const savedQuestion = localStorage.getItem('himaya_lock_question');
  const savedAnswer = localStorage.getItem('himaya_lock_answer');

  // Modes: 'create-pin' | 'confirm-pin' | 'setup-question' | 'enter-pin' | 'forgot-reset'
  const isFirstLaunch = !savedPin;
  const [mode, setMode] = useState<
    'create-pin' | 'confirm-pin' | 'setup-question' | 'enter-pin' | 'forgot-reset'
  >(isFirstLaunch ? 'create-pin' : 'enter-pin');

  // Input states
  const [pinInput, setPinInput] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  // Security question states
  const [selectedQuestion, setSelectedQuestion] = useState(DEFAULT_QUESTIONS[0]);
  const [answerInput, setAnswerInput] = useState('');
  const [newPinAfterReset, setNewPinAfterReset] = useState('');

  const triggerError = (msg: string) => {
    cyberAudio.playAlert();
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigitPress = (digit: string) => {
    cyberAudio.playClick();
    setErrorMsg('');
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handleDeleteDigit = () => {
    cyberAudio.playClick();
    setErrorMsg('');
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    cyberAudio.playClick();
    setErrorMsg('');
    setPinInput('');
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'setup-question' || mode === 'forgot-reset') return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Enter') {
        handlePinSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinInput, mode, firstPin]);

  const handlePinSubmit = () => {
    if (mode === 'create-pin') {
      if (pinInput.length < 4) {
        triggerError('PIN must be at least 4 digits');
        return;
      }
      cyberAudio.playSuccess();
      setFirstPin(pinInput);
      setPinInput('');
      setMode('confirm-pin');
      setErrorMsg('');
    } else if (mode === 'confirm-pin') {
      if (pinInput !== firstPin) {
        triggerError('PINs do not match. Try again.');
        setPinInput('');
        return;
      }
      cyberAudio.playSuccess();
      setMode('setup-question');
      setErrorMsg('');
    } else if (mode === 'enter-pin') {
      if (pinInput === savedPin) {
        cyberAudio.playSuccess();
        onUnlock();
      } else {
        triggerError('ACCESS DENIED: INCORRECT PIN');
        setPinInput('');
      }
    }
  };

  const handleFinishSetup = () => {
    if (!answerInput.trim()) {
      triggerError('Please provide a security answer for recovery');
      return;
    }
    cyberAudio.playSuccess();
    localStorage.setItem('himaya_lock_pin', firstPin);
    localStorage.setItem('himaya_lock_question', selectedQuestion);
    localStorage.setItem('himaya_lock_answer', answerInput.trim().toLowerCase());
    localStorage.setItem('himaya_lock_enabled', 'true');
    onUnlock();
  };

  const handleVerifyAnswerForReset = () => {
    if (answerInput.trim().toLowerCase() === (savedAnswer || '').trim().toLowerCase()) {
      cyberAudio.playSuccess();
      if (newPinAfterReset.length < 4) {
        triggerError('Enter a valid new PIN (at least 4 digits)');
        return;
      }
      localStorage.setItem('himaya_lock_pin', newPinAfterReset);
      onUnlock();
    } else {
      triggerError('INCORRECT ANSWER: Identity verification failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 select-none">
      {/* Background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#00FF41]/10 blur-3xl pointer-events-none" />

      <div className={`w-full max-w-sm rounded-3xl bg-zinc-950/95 border border-[#00FF41]/40 p-6 backdrop-blur-xl relative box-neon-green flex flex-col items-center transition-transform ${shake ? 'translate-x-2' : ''}`}>
        
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-black border-2 border-[#00FF41] flex items-center justify-center text-[#00FF41] mb-4 box-neon-green">
          {mode === 'enter-pin' ? (
            <Lock className="w-8 h-8 animate-pulse" />
          ) : mode === 'forgot-reset' ? (
            <HelpCircle className="w-8 h-8 text-amber-400" />
          ) : (
            <KeyRound className="w-8 h-8 text-[#00FF41]" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black font-orbitron tracking-widest text-[#00FF41] neon-glow-green text-center">
          {mode === 'enter-pin'
            ? 'HIMAYA LOCK'
            : mode === 'create-pin'
            ? 'CREATE PIN'
            : mode === 'confirm-pin'
            ? 'CONFIRM PIN'
            : mode === 'setup-question'
            ? 'RECOVERY INTEL'
            : 'RESET PIN'}
        </h2>

        <p className="text-xs font-mono text-zinc-400 text-center mt-1 mb-5">
          {mode === 'enter-pin'
            ? 'Enter your security PIN to access enclave'
            : mode === 'create-pin'
            ? 'Set a 4-6 digit passcode (no default password)'
            : mode === 'confirm-pin'
            ? 'Re-enter your passcode to verify match'
            : mode === 'setup-question'
            ? 'Security question for password recovery'
            : 'Answer security question to reset passcode'}
        </p>

        {/* Error Notification */}
        {errorMsg && (
          <div className="w-full mb-4 p-2.5 rounded-xl bg-[#FF0055]/15 border border-[#FF0055]/50 flex items-center gap-2 text-xs font-mono text-[#FF0055]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* PIN DISPLAY / BULLETS */}
        {(mode === 'enter-pin' || mode === 'create-pin' || mode === 'confirm-pin') && (
          <>
            <div className="flex items-center justify-center gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isFilled = idx < pinInput.length;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      isFilled
                        ? 'bg-[#00FF41] border-[#00FF41] shadow-[0_0_8px_#00FF41]'
                        : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((key) => {
                const isAction = key === 'CLR' || key === 'DEL';
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === 'CLR') handleClear();
                      else if (key === 'DEL') handleDeleteDigit();
                      else handleDigitPress(key);
                    }}
                    className={`h-14 rounded-2xl font-orbitron font-bold text-base transition-all active:scale-90 flex items-center justify-center ${
                      isAction
                        ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
                        : 'bg-black/80 border border-[#00FF41]/30 hover:border-[#00FF41] text-white hover:text-[#00FF41] shadow-sm'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Submit / Proceed Button */}
            <button
              onClick={handlePinSubmit}
              disabled={pinInput.length < 4}
              className={`w-full h-12 rounded-xl font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all mt-2 ${
                pinInput.length >= 4
                  ? 'bg-[#00FF41] text-black shadow-[0_0_20px_rgba(0,255,65,0.4)] active:scale-95'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
            >
              <span>{mode === 'enter-pin' ? 'UNLOCK ENCLAVE' : 'CONTINUE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Forgot PIN Option (Only in Enter PIN mode) */}
            {mode === 'enter-pin' && (
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setMode('forgot-reset');
                  setErrorMsg('');
                  setAnswerInput('');
                  setNewPinAfterReset('');
                }}
                className="mt-4 text-xs font-mono text-zinc-500 hover:text-[#00FF41] underline transition-colors"
              >
                Forgot PIN? Reset with Security Question
              </button>
            )}
          </>
        )}

        {/* SETUP SECURITY QUESTION VIEW */}
        {mode === 'setup-question' && (
          <div className="w-full space-y-4">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                SELECT RECOVERY QUESTION:
              </label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none"
              >
                {DEFAULT_QUESTIONS.map((q, idx) => (
                  <option key={idx} value={q} className="bg-zinc-950 text-white">
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                YOUR SECRET ANSWER:
              </label>
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="e.g. quantum-matrix or commodore"
                className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
                autoFocus
              />
            </div>

            <button
              onClick={handleFinishSetup}
              disabled={!answerInput.trim()}
              className="w-full h-12 rounded-xl bg-[#00FF41] text-black font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            >
              <Check className="w-4 h-4" />
              <span>SAVE &amp; ENTER HIMAYA</span>
            </button>
          </div>
        )}

        {/* FORGOT PIN / RESET VIEW */}
        {mode === 'forgot-reset' && (
          <div className="w-full space-y-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">RECOVERY QUESTION:</span>
              <p className="text-white font-semibold">
                {savedQuestion || 'What is your secret cyber alias?'}
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                ENTER YOUR ANSWER:
              </label>
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your security answer..."
                className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                SET NEW PIN (4-6 DIGITS):
              </label>
              <input
                type="password"
                maxLength={6}
                value={newPinAfterReset}
                onChange={(e) => setNewPinAfterReset(e.target.value.replace(/\D/g, ''))}
                placeholder="New 4-6 digit PIN"
                className="w-full bg-black border border-zinc-800 focus:border-[#00FF41] rounded-xl p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setMode('enter-pin');
                  setErrorMsg('');
                }}
                className="flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono"
              >
                CANCEL
              </button>
              <button
                onClick={handleVerifyAnswerForReset}
                className="flex-1 h-11 rounded-xl bg-[#00FF41] text-black font-orbitron font-bold text-xs"
              >
                RESET &amp; UNLOCK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
