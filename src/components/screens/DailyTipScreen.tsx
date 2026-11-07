import React, { useState } from 'react';
import { Lightbulb, Bookmark, BookmarkCheck, ArrowRight, ArrowLeft, Shuffle, Share2, Check } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { CyberTip } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

const ALL_TIPS: CyberTip[] = [
  {
    id: 1,
    title: 'Beware of "Juice Jacking" at Public Charging Kiosks',
    category: 'Hardware',
    tip: 'USB charging cables carry both power and data lines. Malicious charging stations at airports or hotels can silently extract photos, contacts, or inject malware while your device charges.',
    actionableStep: 'Always use a USB Data Blocker ("USB Condom") or plug directly into a standard AC wall outlet using your own power brick.',
  },
  {
    id: 2,
    title: 'Hardware Security Keys (FIDO2 / YubiKey) Stop 100% of Phishing',
    category: 'Passwords',
    tip: 'SMS codes and authenticator apps can still be relayed through adversary-in-the-middle phishing proxy kits (like Evilginx). Only cryptographic WebAuthn/FIDO2 keys bind mathematically to the exact browser domain.',
    actionableStep: 'Enable hardware security keys or Passkeys on your Google, GitHub, and primary banking accounts.',
  },
  {
    id: 3,
    title: 'Defend Against SIM Swapping Attacks',
    category: 'Mobile',
    tip: 'Attackers impersonate you at carrier stores to transfer your phone number to their SIM card, instantly intercepting SMS verification codes and resetting your accounts.',
    actionableStep: 'Call your mobile carrier today and set a strict "Carrier PIN / Port Freeze" on your cellular account.',
  },
  {
    id: 4,
    title: 'Strip EXIF Geolocation Metadata Before Sharing Photos',
    category: 'Privacy',
    tip: 'Photos taken with smartphones contain exact GPS coordinates, camera model, and timestamp embedded in the EXIF header. Posting them reveals your home, office, and daily routine.',
    actionableStep: 'Disable location tagging in your camera settings or use a privacy scrubber before uploading photos online.',
  },
  {
    id: 5,
    title: 'Beware of Quishing (Malicious QR Code Traps)',
    category: 'Phishing',
    tip: 'Attackers stick fake QR code stickers over legitimate parking meters, restaurant menus, or transit kiosks, routing victims to credential harvesting portals.',
    actionableStep: 'Always preview the resolved destination URL in your camera scanner before proceeding to open the website.',
  },
  {
    id: 6,
    title: 'Isolate Your Smart Home Devices (IoT VLAN)',
    category: 'Network',
    tip: 'Smart bulbs, cheap IP cameras, and robot vacuums rarely receive security firmware updates and frequently get recruited into Mirai botnet swarms.',
    actionableStep: 'Configure a segregated Guest Wi-Fi network or separate VLAN exclusively for all smart home IoT appliances.',
  },
  {
    id: 7,
    title: 'Disable Automatic Wi-Fi & Bluetooth Reconnecting',
    category: 'OPSEC',
    tip: 'When your device searches for saved networks, it broadcasts probe requests containing SSIDs of your home and workplace. Threat actors use "WiFi Pineapples" to impersonate those networks.',
    actionableStep: 'Turn off "Auto-connect to open Wi-Fi" and keep Bluetooth disabled when passing through crowded transit hubs.',
  },
  {
    id: 8,
    title: 'Check URL Hostname Left-to-Right Hierarchy',
    category: 'Phishing',
    tip: 'Phishers craft deceptive links like "paypal.com.account-verification-login.tk". The actual domain being visited is ALWAYS the one immediately preceding the first single slash.',
    actionableStep: 'Look closely at the root domain before the first slash, ignoring subdomains designed to deceive your eyes.',
  },
];

interface DailyTipScreenProps {
  onBack: () => void;
  currentLang?: Language;
}

export const DailyTipScreen: React.FC<DailyTipScreenProps> = ({ onBack, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];

  // Determine daily tip index based on calendar day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const initialIndex = dayOfYear % ALL_TIPS.length;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [favorites, setFavorites] = useState<number[]>([1, 2]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentTip = ALL_TIPS[currentIndex];
  const isFav = favorites.includes(currentTip.id);

  const handleNext = () => {
    cyberAudio.playClick();
    setCurrentIndex((prev) => (prev + 1) % ALL_TIPS.length);
  };

  const handlePrev = () => {
    cyberAudio.playClick();
    setCurrentIndex((prev) => (prev - 1 + ALL_TIPS.length) % ALL_TIPS.length);
  };

  const handleRandom = () => {
    cyberAudio.playClick();
    let rand = Math.floor(Math.random() * ALL_TIPS.length);
    if (rand === currentIndex) rand = (rand + 1) % ALL_TIPS.length;
    setCurrentIndex(rand);
  };

  const toggleFavorite = () => {
    cyberAudio.playSuccess();
    setFavorites((prev) =>
      prev.includes(currentTip.id) ? prev.filter((id) => id !== currentTip.id) : [...prev, currentTip.id]
    );
  };

  const handleCopy = () => {
    const text = `Cybersecurity Tip: ${currentTip.title}\n\n${currentTip.tip}\n\nAction: ${currentTip.actionableStep}`;
    navigator.clipboard.writeText(text);
    cyberAudio.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={t.dailyTipTitle}
        subtitle={t.dailyTipSubtitle}
        onBack={onBack}
        rightAction={
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`min-h-[44px] px-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              showFavoritesOnly
                ? 'border-[#00FF41] bg-[#00FF41]/20 text-[#00FF41]'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>SAVED ({favorites.length})</span>
          </button>
        }
      />

      {showFavoritesOnly ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>SAVED BOOKMARKS</span>
            <button onClick={() => setShowFavoritesOnly(false)} className="text-[#00FF41] hover:underline">
              BACK TO FEED
            </button>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs">
              No saved tips yet. Bookmark tips to review them here anytime!
            </div>
          ) : (
            ALL_TIPS.filter((t) => favorites.includes(t.id)).map((tip) => (
              <div
                key={tip.id}
                onClick={() => {
                  setCurrentIndex(ALL_TIPS.findIndex((t) => t.id === tip.id));
                  setShowFavoritesOnly(false);
                }}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#00FF41]/40 cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-mono text-[#00FF41] mb-1">
                  <span>{tip.category.toUpperCase()}</span>
                  <span>TIP #{tip.id}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{tip.title}</h4>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Main Tip Card */}
          <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-[#00FF41]/40 p-6 backdrop-blur-md relative overflow-hidden box-neon-green space-y-4 shadow-sm">
            {/* Top metadata row */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#00FF41] shadow-[0_0_8px_#00FF41]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#00FF41]">
                  {currentTip.category} INTEL
                </span>
                <span className="text-slate-300 dark:text-zinc-600 font-mono text-xs">·</span>
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-semibold">
                  #{currentIndex + 1} OF {ALL_TIPS.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isFav
                      ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/20 text-emerald-600 dark:text-[#00FF41]'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-black/60 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isFav ? 'Remove Bookmark' : 'Save to Bookmarks'}
                >
                  {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-black/60 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                  title="Copy Tip"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tip Title */}
            <h3 className="text-lg sm:text-xl font-bold font-orbitron text-slate-900 dark:text-white leading-snug">
              {currentTip.title}
            </h3>

            {/* Tip Body */}
            <p className="text-sm font-sans text-slate-700 dark:text-zinc-300 leading-relaxed">
              {currentTip.tip}
            </p>

            {/* Actionable Tactical Step */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/80 border border-emerald-300/60 dark:border-[#00FF41]/30 space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-[#00FF41] tracking-wider uppercase block">
                TACTICAL COUNTERMEASURE:
              </span>
              <p className="text-xs font-mono text-slate-800 dark:text-zinc-200">
                {currentTip.actionableStep}
              </p>
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handlePrev}
              className="min-h-[46px] rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#00FF41]/40 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#00FF41]" />
              <span>PREVIOUS</span>
            </button>

            <button
              onClick={handleRandom}
              className="min-h-[46px] rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#00FF41]/40 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>RANDOM</span>
            </button>

            <button
              onClick={handleNext}
              className="min-h-[46px] rounded-xl bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-orbitron font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.3)]"
            >
              <span>NEXT TIP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
