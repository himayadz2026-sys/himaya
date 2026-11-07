export type ScreenId = 
  | 'home'
  | 'link-scanner'
  | 'password-generator'
  | 'wifi-scanner'
  | 'daily-tip'
  | 'antivirus-scan'
  | 'internet-blocker'
  | 'terminal'
  | 'map-coords'
  | 'alerts'
  | 'profile-settings';

export type BottomNavTab = 'home' | 'scan' | 'alerts' | 'profile';

export interface ThreatItem {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fileLocation: string;
  description: string;
  detectedAt: string;
  status: 'active' | 'quarantined' | 'deleted';
}

export interface ScanHistoryRecord {
  id: string;
  timestamp: string;
  filesScanned: number;
  threatsFound: number;
  status: 'SECURE' | 'THREATS_DETECTED';
  durationSec: number;
}

export interface WifiNetwork {
  id: string;
  ssid: string;
  bssid: string;
  signalDbm: number;
  frequency: '2.4 GHz' | '5 GHz';
  channel: number;
  security: 'WPA3' | 'WPA2' | 'WEP' | 'Open';
  isDangerous: boolean;
  warning?: string;
  connected?: boolean;
}

export interface CyberTip {
  id: number;
  title: string;
  category: 'Phishing' | 'Passwords' | 'Network' | 'Malware' | 'OPSEC' | 'Privacy' | 'Mobile' | 'Hardware';
  tip: string;
  actionableStep: string;
}

export interface InstalledApp {
  id: string;
  name: string;
  packageName: string;
  iconName: string;
  category: 'social' | 'system' | 'browsing' | 'finance' | 'tools';
  isInternetAllowed: boolean;
  dataUsedMb: number;
  blockedPackets: number;
  isSystem: boolean;
}

export interface LinkScanResult {
  url: string;
  isSafe: boolean;
  riskScore: number; // 0-100
  domain: string;
  protocol: string;
  reasons: string[];
  safeFactors: string[];
  scanTimestamp: string;
}

export interface CommandOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'ascii';
  text: string;
}

export interface AppSettings {
  darkMode: boolean; // default: true (cyberpunk black + neon green)
  soundEnabled: boolean;
  matrixRainSpeed: 'slow' | 'normal' | 'fast';
  matrixDensity: 'low' | 'medium' | 'high';
  amoledPitchBlack: boolean;
  hapticFeedback: boolean;
  threatSimulation: boolean;
}

export interface AppLockConfig {
  isEnabled: boolean;
  pin: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface VirusDatabasePayload {
  version: number;
  updated: string;
  viruses: any[];
}
