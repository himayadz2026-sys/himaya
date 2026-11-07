import React from 'react';
import { BellRing, ShieldAlert, ShieldCheck, Wifi, ExternalLink, Trash2, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { cyberAudio } from '../../utils/audio';

interface AlertsScreenProps {
  onBack: () => void;
  threats: string[];
  onClearAlerts: () => void;
  onNavigateTo: (screen: any) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  onBack,
  threats,
  onClearAlerts,
  onNavigateTo,
}) => {
  const defaultAlerts = [
    {
      id: 'al-1',
      title: 'Open Wi-Fi Interception Hazard',
      desc: 'Airport_Guest_Free_WiFi is broadcasting without WPA encryption. Potential rogue AP sniffing.',
      type: 'critical',
      targetScreen: 'wifi-scanner',
      time: '12m ago',
    },
    {
      id: 'al-2',
      title: 'Background Network Socket Blocked',
      desc: 'TikTok attempted unauthorized DNS resolution while in background. Socket dropped.',
      type: 'warning',
      targetScreen: 'internet-blocker',
      time: '34m ago',
    },
    {
      id: 'al-3',
      title: 'System Firmware Hash Verified',
      desc: 'SHA-256 boot partition integrity verified with zero tampering.',
      type: 'safe',
      targetScreen: 'antivirus-scan',
      time: '2h ago',
    },
  ];

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="Security Alerts"
        subtitle="Live Threat Intelligence & Firewall Feed"
        onBack={onBack}
        rightAction={
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClearAlerts();
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DISMISS</span>
          </button>
        }
      />

      {/* Dynamic Alerts */}
      {threats.length > 0 && (
        <div className="p-4 rounded-3xl bg-rose-950/20 border border-[#FF0055] space-y-2 box-neon-red">
          <div className="flex items-center gap-2 text-[#FF0055] font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>CRITICAL RECENT DETECTIONS</span>
          </div>
          {threats.map((t, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-[#FF0055]/30 text-xs font-mono text-zinc-200">
              <span className="text-[#FF0055] mr-2">»</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* Default Feed */}
      <div className="space-y-3">
        {defaultAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => {
              cyberAudio.playClick();
              onNavigateTo(alert.targetScreen);
            }}
            className={`p-4 rounded-3xl border cursor-pointer backdrop-blur-md transition-all active:scale-[0.99] shadow-xs ${
              alert.type === 'critical'
                ? 'bg-rose-950/15 border-[#FF0055]/50 hover:border-[#FF0055]'
                : alert.type === 'warning'
                ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-500'
                : 'bg-white/95 dark:bg-zinc-950/80 border-slate-200 dark:border-zinc-800/80 hover:border-emerald-500/50 dark:hover:border-[#00FF41]/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                    alert.type === 'critical'
                      ? 'border-[#FF0055] bg-[#FF0055]/20 text-[#FF0055]'
                      : alert.type === 'warning'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                      : 'border-emerald-500/50 dark:border-[#00FF41]/50 bg-emerald-50 dark:bg-[#00FF41]/10 text-emerald-600 dark:text-[#00FF41]'
                  }`}
                >
                  {alert.type === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : alert.type === 'warning' ? (
                    <Wifi className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-white leading-tight">
                    {alert.title}
                  </h4>
                  <p className="text-xs font-sans text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {alert.desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">{alert.time}</span>
                <span className="text-xs text-emerald-600 dark:text-[#00FF41] hover:underline flex items-center gap-0.5 font-mono font-semibold">
                  <span>FIX</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
