import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Trash2, CornerDownLeft, Sparkles } from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { CommandOutput } from '../../types';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';

const NEOFETCH_ART = `
      ___          ___
     /\\  \\        /\\  \\
    /::\\  \\      /::\\  \\      HIMAYA CYBER OS v2.4 (arm64-v8a)
   /:/\\:\\  \\    /:/\\:\\  \\     --------------------------------
  /::\\~\\:\\  \\  /:/  \\:\\  \\    OS: Himaya Hardened Android Linux
 /:/\\:\\ \\:\\__\\/:/__/ \\:\\__\\   Kernel: Linux 6.6.21-himaya-sec+
 \\:\\~\\:\\ \\/__/\\:\\  \\ /:/  /   Uptime: 14 days, 3 hours, 22 mins
  \\:\\ \\:\\__\\   \\:\\  /:/  /    Packages: 412 (dpkg), 18 (himaya-pkg)
   \\:\\ \\/__/    \\:\\/:/  /     Shell: himaya-bash 5.2.26(1)-release
    \\:\\__\\       \\::/  /      Terminal: Himaya-Mobile-TTY1
     \\/__/        \\/__/       CPU: Kryo 680 (8) @ 2.84 GHz
                              Memory: 3,420 MiB / 12,288 MiB (27%)
                              Security Score: 98% (ENCRYPTED)
`;

interface TerminalScreenProps {
  onBack: () => void;
  currentLang?: Language;
}

export const TerminalScreen: React.FC<TerminalScreenProps> = ({ onBack, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Himaya Terminal Environment Initialized [Termux Engine v2.4]',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" for a list of tactical cybersecurity commands.',
    },
  ]);

  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    cyberAudio.playTerminalTick();

    // Add command echo to history
    const cmdId = Date.now().toString();
    const newItems: CommandOutput[] = [
      { id: `${cmdId}-cmd`, type: 'command', text: `himaya@android:~$ ${raw}` },
    ];

    setCommandHistory((prev) => [raw, ...prev]);
    setHistoryPointer(-1);

    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help       - Print this command reference manual
  neofetch   - Display system hardware & OS cyber information
  clear      - Clear terminal buffer
  ls [path]  - List directory payload files & modules
  pwd        - Print current working directory
  whoami     - Print active operator credentials & privileges
  ping <ip>  - Send ICMP echo requests to target host
  echo <txt> - Output specified text string
  score      - Query core security threat index
  date       - Output synchronized UTC/Local timestamp
  nmap <ip>  - Execute rapid TCP port audit simulation`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'neofetch':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'ascii',
          text: NEOFETCH_ART,
        });
        break;

      case 'ls':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: `drwxr-xr-x 2 himaya himaya 4096 Nov 06 15:30 exploits/
drwxr-xr-x 4 himaya himaya 4096 Nov 06 15:32 tools/
-rw------- 1 himaya himaya 2048 Nov 06 14:10 id_ed25519.key
-rwxr-xr-x 1 himaya himaya 1420 Nov 06 15:02 link_scanner.py
-rwxr-xr-x 1 himaya himaya 3840 Nov 06 15:20 wifi_deauth_probe.sh
-rw-r--r-- 1 himaya himaya  512 Nov 06 15:25 shadow_backup.bak
-rw-r--r-- 1 himaya himaya 8192 Nov 06 15:29 network_dump.pcap`,
        });
        break;

      case 'pwd':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: '/data/data/com.himaya.app/home',
        });
        break;

      case 'whoami':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'success',
          text: 'uid=0(root) gid=0(root) groups=0(root),1004(cyber-operator),3003(inet)',
        });
        break;

      case 'echo':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: args.join(' '),
        });
        break;

      case 'ping': {
        const target = args[0] || '8.8.8.8';
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=117 time=14.2 ms
64 bytes from ${target}: icmp_seq=2 ttl=117 time=13.8 ms
64 bytes from ${target}: icmp_seq=3 ttl=117 time=14.1 ms
64 bytes from ${target}: icmp_seq=4 ttl=117 time=13.9 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.8/14.0/14.2/0.16 ms`,
        });
        break;
      }

      case 'date':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: new Date().toUTCString(),
        });
        break;

      case 'score':
        newItems.push({
          id: `${cmdId}-out`,
          type: 'success',
          text: '[+] CORE DEFENSE SCORE: 98% [SYSTEM ENCRYPTED & SHIELDED]',
        });
        break;

      case 'nmap': {
        const host = args[0] || '127.0.0.1';
        newItems.push({
          id: `${cmdId}-out`,
          type: 'output',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-06 15:45 UTC
Nmap scan report for ${host}
Host is up (0.00042s latency).
PORT     STATE SERVICE
22/tcp   open  ssh (OpenSSH 9.3p1)
80/tcp   open  http (Himaya-Secure-Gateway)
443/tcp  open  https (TLS 1.3 ChaCha20-Poly1305)
8080/tcp open  http-proxy (Sandbox-Monitor)

Nmap done: 1 IP address (1 host up) scanned in 0.18 seconds`,
        });
        break;
      }

      default:
        newItems.push({
          id: `${cmdId}-out`,
          type: 'error',
          text: `bash: command not found: ${command}. Type "help" for list of commands.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...newItems]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextPointer = Math.min(commandHistory.length - 1, historyPointer + 1);
        setHistoryPointer(nextPointer);
        setInput(commandHistory[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setInput(commandHistory[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInput('');
      }
    }
  };

  const quickCommands = ['help', 'neofetch', 'ls', 'whoami', 'ping 8.8.8.8', 'score', 'clear'];

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t.terminalTitle}
        subtitle={t.terminalSubtitle}
        onBack={onBack}
        rightAction={
          <button
            onClick={() => {
              cyberAudio.playClick();
              setHistory([]);
            }}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white cursor-pointer"
            title={t.clearTerminal}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        }
      />

      {/* Terminal Container */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="rounded-2xl bg-black border border-[#00FF41]/40 p-4 font-mono text-xs sm:text-sm text-[#00FF41] shadow-[0_0_25px_rgba(0,0,0,0.9)] box-neon-green min-h-[380px] max-h-[500px] flex flex-col justify-between overflow-hidden cursor-text"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#00FF41]/25 text-[11px] text-zinc-500 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF0055]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF41]" />
            <span className="ml-2 text-zinc-400 font-mono">tty1 (himaya-android)</span>
          </div>
          <span className="text-[#00FF41]/80 font-mono">BASH 5.2.26</span>
        </div>

        {/* Scrollable Buffer */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 select-text">
          {history.map((item) => {
            if (item.type === 'command') {
              return (
                <div key={item.id} className="text-[#00FF41] font-bold">
                  {item.text}
                </div>
              );
            }
            if (item.type === 'error') {
              return (
                <div key={item.id} className="text-[#FF0055] whitespace-pre-wrap">
                  {item.text}
                </div>
              );
            }
            if (item.type === 'success') {
              return (
                <div key={item.id} className="text-emerald-400 font-semibold whitespace-pre-wrap">
                  {item.text}
                </div>
              );
            }
            if (item.type === 'ascii') {
              return (
                <pre key={item.id} className="text-[#00FF41] font-mono text-[10px] sm:text-xs leading-none overflow-x-auto">
                  {item.text}
                </pre>
              );
            }
            return (
              <div key={item.id} className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {item.text}
              </div>
            );
          })}

          {/* Active Prompt & Blinking Cursor */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[#00FF41] font-bold shrink-0">himaya@android:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none text-[#00FF41] font-mono focus:outline-none p-0 text-xs sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {/* Blinking Block Cursor */}
            <span className="w-2 h-4 bg-[#00FF41] animate-pulse inline-block" />
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Touch Quick Actions Toolbar */}
        <div className="pt-2 border-t border-zinc-900 select-none">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>QUICK DISPATCH (THUMB TAP):</span>
            <button
              onClick={() => executeCommand(input)}
              className="text-[#00FF41] flex items-center gap-1"
            >
              <span>EXEC</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  executeCommand(cmd);
                }}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#00FF41]/20 border border-zinc-800 hover:border-[#00FF41]/40 text-[#00FF41] text-xs font-mono shrink-0 active:scale-95 transition-all"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
