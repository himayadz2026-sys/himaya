import React, { useState } from 'react';
import { Wifi, AlertTriangle, ShieldCheck, RefreshCw, Signal, Lock, Unlock, Radio } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { WifiNetwork } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

interface WifiScannerScreenProps {
  onBack: () => void;
  onThreatFound?: (threat: string) => void;
  currentLang?: Language;
}

export const WifiScannerScreen: React.FC<WifiScannerScreenProps> = ({ onBack, onThreatFound, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);

  const [networks, setNetworks] = useState<WifiNetwork[]>([
    {
      id: 'net-1',
      ssid: 'CyberVault-5G_SEC',
      bssid: 'E4:95:6E:41:A2:80',
      signalDbm: -42,
      frequency: '5 GHz',
      channel: 36,
      security: 'WPA3',
      isDangerous: false,
      connected: true,
    },
    {
      id: 'net-2',
      ssid: 'Airport_Guest_Free_WiFi',
      bssid: '00:1A:2B:3C:4D:5E',
      signalDbm: -58,
      frequency: '2.4 GHz',
      channel: 6,
      security: 'Open',
      isDangerous: true,
      warning: 'CRITICAL: Open unencrypted Wi-Fi. Vulnerable to Evil-Twin AP, Packet Sniffing, and SSL Stripping.',
    },
    {
      id: 'net-3',
      ssid: 'Starbucks_Customer_WiFi',
      bssid: '68:D7:9A:12:F4:09',
      signalDbm: -67,
      frequency: '2.4 GHz',
      channel: 11,
      security: 'Open',
      isDangerous: true,
      warning: 'HIGH RISK: Unencrypted broadcast. Anyone nearby can observe plain text traffic & DNS requests.',
    },
    {
      id: 'net-4',
      ssid: 'Office_Matrix_Network',
      bssid: 'A0:B1:C2:D3:E4:F5',
      signalDbm: -51,
      frequency: '5 GHz',
      channel: 149,
      security: 'WPA2',
      isDangerous: false,
    },
    {
      id: 'net-5',
      ssid: 'Legacy_Router_IoT',
      bssid: '24:A4:3C:99:11:22',
      signalDbm: -82,
      frequency: '2.4 GHz',
      channel: 1,
      security: 'WEP',
      isDangerous: true,
      warning: 'OBSOLETE CIPHER: WEP encryption cracked in under 60 seconds with modern tools.',
    },
    {
      id: 'net-6',
      ssid: 'StealthNode_Hidden',
      bssid: '70:89:12:B4:EF:AA',
      signalDbm: -74,
      frequency: '5 GHz',
      channel: 44,
      security: 'WPA2',
      isDangerous: false,
    },
  ]);

  const handleRescan = () => {
    setIsScanning(true);
    cyberAudio.playScanBeep();

    setTimeout(() => {
      // Slightly fluctuate signal strength for realism
      setNetworks((prev) =>
        prev.map((n) => ({
          ...n,
          signalDbm: Math.min(-38, Math.max(-88, n.signalDbm + Math.floor(Math.random() * 7 - 3))),
        }))
      );
      setIsScanning(false);
      cyberAudio.playSuccess();
      if (onThreatFound) {
        onThreatFound('Unprotected Open Wi-Fi detected nearby');
      }
    }, 1200);
  };

  const getSignalLevel = (dbm: number) => {
    if (dbm >= -50) return { bars: 4, label: 'EXCELLENT', color: '#00FF41' };
    if (dbm >= -65) return { bars: 3, label: 'GOOD', color: '#00FF41' };
    if (dbm >= -75) return { bars: 2, label: 'FAIR', color: '#F59E0B' };
    return { bars: 1, label: 'WEAK', color: '#FF0055' };
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={t.wifiScannerTitle}
        subtitle={t.wifiScannerSubtitle}
        onBack={onBack}
        rightAction={
          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-xl border border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41] font-mono text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t.scanningRf : t.scanRf}</span>
          </button>
        }
      />

      {/* Radar Scan Banner */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/30 p-5 overflow-hidden backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-black border border-emerald-400 dark:border-[#00FF41]/40 flex items-center justify-center overflow-hidden">
              <Radio className="w-6 h-6 text-emerald-600 dark:text-[#00FF41]" />
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00FF41]/30 to-transparent animate-radar" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-orbitron text-slate-900 dark:text-white">
                  {t.airwaveMonitor}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-700 dark:text-[#00FF41] border border-emerald-400/40 dark:border-[#00FF41]/30 font-bold">
                  {networks.length} {t.detectedCount}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                {networks.filter((n) => n.isDangerous).length} {t.highRiskWarning}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mt-3 p-3 rounded-2xl bg-[#FF0055]/10 border border-[#FF0055]/30 flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 text-[#FF0055] shrink-0" />
          <span>NEVER submit banking passwords on OPEN unencrypted Wi-Fi hotspots!</span>
        </div>
      </div>

      {/* Networks List */}
      <div className="space-y-3">
        {networks.map((net) => {
          const sig = getSignalLevel(net.signalDbm);
          const isDanger = net.isDangerous;

          return (
            <div
              key={net.id}
              onClick={() => {
                cyberAudio.playClick();
                setSelectedNetwork(net);
              }}
              className={`rounded-3xl border p-4 cursor-pointer transition-all duration-200 active:scale-[0.99] shadow-xs ${
                isDanger
                  ? 'bg-rose-50/80 dark:bg-rose-950/15 border-rose-300 dark:border-[#FF0055]/50 hover:border-rose-500 dark:hover:border-[#FF0055] box-neon-red'
                  : 'bg-white/95 dark:bg-zinc-950/80 border-slate-200 dark:border-[#00FF41]/25 hover:border-emerald-500/50 dark:hover:border-[#00FF41]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                      isDanger
                        ? 'border-[#FF0055] bg-[#FF0055]/15 text-[#FF0055]'
                        : 'border-emerald-500/50 dark:border-[#00FF41]/50 bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-600 dark:text-[#00FF41]'
                    }`}
                  >
                    {isDanger ? <Unlock className="w-5 h-5 animate-pulse" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                        {net.ssid}
                      </span>
                      {net.connected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40">
                          CONNECTED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>{net.frequency}</span>
                      <span>·</span>
                      <span>Ch {net.channel}</span>
                      <span>·</span>
                      <span className="text-zinc-500">{net.bssid}</span>
                    </div>
                  </div>
                </div>

                {/* Right Badge: Security Type & Signal */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isDanger
                        ? 'bg-[#FF0055]/20 text-[#FF0055] border-[#FF0055]/60'
                        : 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30'
                    }`}
                  >
                    {net.security}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-mono" style={{ color: sig.color }}>
                    <Signal className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{net.signalDbm} dBm</span>
                  </div>
                </div>
              </div>

              {/* Explicit Threat Warning Callout if Open or WEP */}
              {isDanger && net.warning && (
                <div className="mt-3 pt-2.5 border-t border-[#FF0055]/30 flex items-start gap-2 text-xs font-mono text-[#FF0055]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
                  <p className="leading-tight font-medium">{net.warning}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Network Audit Modal */}
      {selectedNetwork && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-[#00FF41]/50 p-5 space-y-4 box-neon-green">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-orbitron text-white">
                  {selectedNetwork.ssid}
                </h3>
                <p className="text-xs font-mono text-[#00FF41]">AIRWAVE SECURITY AUDIT</p>
              </div>
              <button
                onClick={() => setSelectedNetwork(null)}
                className="text-zinc-400 hover:text-white font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500">BSSID (MAC):</span>
                <span className="text-zinc-200">{selectedNetwork.bssid}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500">CIPHER STANDARD:</span>
                <span className={selectedNetwork.isDangerous ? 'text-[#FF0055] font-bold' : 'text-[#00FF41]'}>
                  {selectedNetwork.security}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500">WPS PIN VULNERABILITY:</span>
                <span className="text-zinc-200">
                  {selectedNetwork.security === 'Open' ? 'N/A (No Encryption)' : 'LOCKED (Safe)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500">PACKET INTERCEPTION RISK:</span>
                <span className={selectedNetwork.isDangerous ? 'text-[#FF0055] font-bold' : 'text-[#00FF41]'}>
                  {selectedNetwork.isDangerous ? 'CRITICAL (High)' : 'LOW (Protected)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedNetwork(null)}
              className="w-full h-11 rounded-xl bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-orbitron font-bold text-xs"
            >
              DISMISS AUDIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
