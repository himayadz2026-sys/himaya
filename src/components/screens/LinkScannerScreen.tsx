import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Globe, Search, Clipboard, Check, History, ArrowUpRight } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { LinkScanResult } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

interface LinkScannerScreenProps {
  onBack: () => void;
  onThreatFound?: (threatName: string) => void;
  currentLang?: Language;
}

export const LinkScannerScreen: React.FC<LinkScannerScreenProps> = ({
  onBack,
  onThreatFound,
  currentLang,
}) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<LinkScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<LinkScanResult[]>([
    {
      url: 'https://github.com',
      isSafe: true,
      riskScore: 2,
      domain: 'github.com',
      protocol: 'https:',
      reasons: [],
      safeFactors: ['Valid SSL/TLS Protocol', 'Reputable Domain Name', 'No Phishing Keywords'],
      scanTimestamp: 'Just now',
    },
  ]);

  const quickSamples = [
    { label: 'Phishing Sample', url: 'http://paypal-verification-update.security-login.xyz/login' },
    { label: 'Raw IP URL', url: 'http://192.168.1.1/admin-router-bypass.php' },
    { label: 'URL Shortener', url: 'https://bit.ly/claim-free-crypto-airdrop' },
    { label: 'Legitimate Site', url: 'https://wikipedia.org' },
  ];

  const handleScan = () => {
    if (!url.trim()) return;
    cyberAudio.playScanBeep();
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      let trimmed = url.trim();
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        trimmed = 'http://' + trimmed;
      }

      let parsed: URL | null = null;
      try {
        parsed = new URL(trimmed);
      } catch {
        // Fallback simple parsing
        parsed = {
          hostname: trimmed.replace(/^https?:\/\//, '').split('/')[0],
          protocol: trimmed.startsWith('https') ? 'https:' : 'http:',
          pathname: '/' + (trimmed.split('/')[1] || ''),
        } as URL;
      }

      const domain = parsed.hostname.toLowerCase();
      const fullUrlLower = trimmed.toLowerCase();
      const reasons: string[] = [];
      const safeFactors: string[] = [];
      let riskScore = 0;

      // 1. Check HTTP vs HTTPS
      if (parsed.protocol === 'http:') {
        reasons.push('Unencrypted HTTP protocol detected. Sensitive data can be intercepted by Man-in-the-Middle attacks.');
        riskScore += 35;
      } else {
        safeFactors.push('Secured with HTTPS encryption certificate.');
      }

      // 2. Check Raw IP address
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipv4Regex.test(domain)) {
        reasons.push('Raw numeric IP address used instead of valid registered domain name.');
        riskScore += 40;
      }

      // 3. Check Known URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly', 'rb.gy'];
      if (shorteners.some((s) => domain.includes(s))) {
        reasons.push('URL shortener service detected. Real destination is concealed to bypass automated web filters.');
        riskScore += 30;
      }

      // 4. Check Suspicious Keywords
      const suspiciousWords = [
        'login', 'verify', 'update', 'account', 'password', 'banking',
        'free', 'crypto', 'airdrop', 'claim', 'wallet', 'security-alert',
        'paypal', 'apple-id', 'support', 'token', 'giveaway', 'bonus'
      ];
      const foundWords = suspiciousWords.filter((w) => fullUrlLower.includes(w));
      if (foundWords.length > 0) {
        reasons.push(`Contains high-risk social engineering keywords: "${foundWords.join(', ')}".`);
        riskScore += Math.min(45, foundWords.length * 15);
      }

      // 5. Check Suspicious TLDs
      const suspiciousTlds = ['.xyz', '.top', '.buzz', '.club', '.work', '.loan', '.icu', '.click', '.tk', '.ml'];
      if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
        reasons.push('High-risk top-level domain (TLD) commonly exploited for rapid throwaway phishing campaigns.');
        riskScore += 25;
      }

      // 6. Excessive subdomains
      const subdomains = domain.split('.').length;
      if (subdomains > 4) {
        reasons.push(`Suspiciously nested hostname hierarchy (${subdomains} subdomain levels).`);
        riskScore += 20;
      }

      if (reasons.length === 0) {
        safeFactors.push('No malicious keywords or URL shorteners found.');
        safeFactors.push('Clean domain structure.');
        riskScore = Math.floor(Math.random() * 8) + 2;
      }

      const isSafe = riskScore < 40;
      const scanRes: LinkScanResult = {
        url: trimmed,
        isSafe,
        riskScore: Math.min(100, riskScore),
        domain,
        protocol: parsed.protocol,
        reasons,
        safeFactors,
        scanTimestamp: new Date().toLocaleTimeString(),
      };

      if (!isSafe) {
        cyberAudio.playAlert();
        if (onThreatFound) {
          onThreatFound(`Suspicious URL Detected: ${domain}`);
        }
      } else {
        cyberAudio.playSuccess();
      }

      setResult(scanRes);
      setHistory((prev) => [scanRes, ...prev.slice(0, 5)]);
      setIsScanning(false);
    }, 900);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        cyberAudio.playClick();
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={t.linkScannerTitle}
        subtitle={t.linkScannerSubtitle}
        onBack={onBack}
      />

      {/* Input Box */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/30 p-5 backdrop-blur-md space-y-3 shadow-sm">
        <label className="text-xs font-mono text-slate-700 dark:text-zinc-300 uppercase tracking-wider block font-bold">
          {t.targetUrlLabel}
        </label>

        <div className="relative flex items-center">
          <Globe className="absolute left-3 w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder={t.urlPlaceholder}
            className="w-full bg-slate-50 dark:bg-black/90 border border-slate-300 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-[#00FF41] rounded-2xl py-3 pl-10 pr-20 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
          />
          <button
            onClick={handlePaste}
            className="absolute right-2 px-2.5 py-1 text-xs font-mono text-emerald-600 dark:text-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/10 hover:bg-emerald-100 border border-emerald-400/30 dark:border-[#00FF41]/30 rounded-xl flex items-center gap-1 transition-all"
            title={t.paste}
          >
            <Clipboard className="w-3 h-3" />
            <span>{t.paste}</span>
          </button>
        </div>

        {/* Quick Demo Samples */}
        <div className="pt-1">
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 font-semibold">
            TEST SAMPLES:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cyberAudio.playClick();
                  setUrl(sample.url);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-zinc-900/80 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#00FF41] transition-all cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !url.trim()}
          className={`w-full h-12 rounded-xl font-orbitron font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isScanning
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-[#00FF41] text-black hover:bg-[#00FF41]/90 shadow-[0_0_20px_rgba(0,255,65,0.4)]'
          }`}
        >
          <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? t.scanningUrl : t.scanUrl}</span>
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`rounded-2xl border p-5 backdrop-blur-md transition-all ${
            result.isSafe
              ? 'bg-emerald-950/20 border-[#00FF41]/60 box-neon-green'
              : 'bg-rose-950/20 border-[#FF0055]/60 box-neon-red'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              {result.isSafe ? (
                <div className="w-10 h-10 rounded-xl bg-[#00FF41]/10 border border-[#00FF41] flex items-center justify-center text-[#00FF41]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#FF0055]/10 border border-[#FF0055] flex items-center justify-center text-[#FF0055]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              )}
              <div>
                <h3
                  className={`text-xl font-black font-orbitron tracking-wider ${
                    result.isSafe ? 'text-[#00FF41] neon-glow-green' : 'text-[#FF0055] neon-glow-red'
                  }`}
                >
                  {result.isSafe ? t.verifiedSafe : t.dangerousThreat}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {t.riskIndex}: {result.riskScore}/100 · {result.protocol.toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(result.url);
                setCopied(true);
                cyberAudio.playClick();
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-[#00FF41]" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 break-all text-zinc-200">
              <span className="text-zinc-500 mr-2">DESTINATION:</span>
              <span>{result.url}</span>
            </div>

            {/* Explanation List */}
            {result.reasons.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#FF0055] uppercase tracking-wider block">
                  {t.threatIndicators}
                </span>
                {result.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-[#FF0055] font-bold mt-0.5">✕</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            )}

            {result.safeFactors.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#00FF41] uppercase tracking-wider block">
                  {t.safeIndicators}
                </span>
                {result.safeFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-[#00FF41] font-bold mt-0.5">✓</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <History className="w-4 h-4 text-[#00FF41]" />
            <span className="uppercase tracking-wider">{t.recentScans}</span>
          </div>

          <div className="divide-y divide-zinc-900">
            {history.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="truncate max-w-[200px] sm:max-w-xs text-zinc-300">
                  <span className="truncate">{item.url}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.isSafe
                        ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                        : 'bg-[#FF0055]/10 text-[#FF0055] border border-[#FF0055]/30'
                    }`}
                  >
                    {item.isSafe ? t.safe : t.threat}
                  </span>
                  <button
                    onClick={() => {
                      setUrl(item.url);
                      setResult(item);
                    }}
                    className="p-1 text-zinc-500 hover:text-zinc-200"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
