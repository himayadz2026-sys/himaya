import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import { Language, translations } from '../../utils/i18n';
import { cyberAudio } from '../../utils/audio';

interface LanguageModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const languages: { id: Language; label: string; nativeName: string; region: string }[] = [
    { id: 'ar', label: 'العربية', nativeName: 'Arabic', region: 'الشرق الأوسط وشمال أفريقيا' },
    { id: 'fr', label: 'Français', nativeName: 'French', region: 'France & International' },
    { id: 'en', label: 'English', nativeName: 'English', region: 'Global Cyber Standard' },
  ];

  const handleSelect = (lang: Language) => {
    cyberAudio.playSuccess();
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-zinc-950 border border-slate-200 dark:border-[#00FF41]/50 p-6 space-y-4 box-neon-green relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#00FF41]/10 border border-emerald-400 dark:border-[#00FF41]/40 flex items-center justify-center text-emerald-600 dark:text-[#00FF41]">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-slate-900 dark:text-white text-base">
                {currentLang === 'ar' ? 'اختر لغة التطبيق' : currentLang === 'fr' ? 'Choisir la Langue' : 'Select Language'}
              </h4>
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                Arabic / French / English
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="space-y-2.5 font-mono">
          {languages.map((lang) => {
            const isSelected = currentLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/15 text-slate-900 dark:text-white font-bold box-neon-green'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black/60 text-slate-700 dark:text-zinc-300 hover:border-emerald-400 dark:hover:border-[#00FF41]/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-sans">
                      {lang.label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                      ({lang.nativeName})
                    </span>
                    {lang.id === 'ar' && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-[#00FF41]/20 text-emerald-800 dark:text-[#00FF41]">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">
                    {lang.region}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-500 dark:bg-[#00FF41] text-black shadow-[0_0_8px_#00FF41]'
                      : 'border-slate-300 dark:border-zinc-700 bg-transparent text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white font-mono text-xs font-bold transition-all"
        >
          {currentLang === 'ar' ? 'إغلاق' : currentLang === 'fr' ? 'Fermer' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};
