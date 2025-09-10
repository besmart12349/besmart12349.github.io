import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { ProxyConfig } from '../types';

export type VpnStatus = 'Disconnected' | 'Connecting' | 'Connected';
export type FirewallLevel = 'Low' | 'Medium' | 'High' | 'Maximum';
export type EncryptionLevel = 'Standard' | 'Enhanced' | 'Quantum';

export const PROXIES: Record<string, ProxyConfig> = {
    default: { name: 'Default Proxy', url: 'https://api.allorigins.win/raw?url=' },
    vpn: { name: 'Secure VPN Proxy (DE)', url: 'https://cors.eu.org/' }
};

interface SecurityContextType {
  vpnStatus: VpnStatus;
  setVpnStatus: (status: VpnStatus) => void;
  vpnServer: string;
  setVpnServer: (server: string) => void;
  firewallLevel: FirewallLevel;
  setFirewallLevel: (level: FirewallLevel) => void;
  scamProtection: boolean;
  setScamProtection: (enabled: boolean) => void;
  encryptionLevel: EncryptionLevel;
  setEncryptionLevel: (level: EncryptionLevel) => void;
  securityScore: number;
  setSecurityScore: (score: number | ((prev: number) => number)) => void;
  proxy: ProxyConfig;
  setProxy: (proxy: ProxyConfig) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vpnStatus, setVpnStatus] = useState<VpnStatus>('Disconnected');
  const [vpnServer, setVpnServer] = useState('us-east');
  const [firewallLevel, setFirewallLevel] = useState<FirewallLevel>('Medium');
  const [scamProtection, setScamProtection] = useState(true);
  const [encryptionLevel, setEncryptionLevel] = useState<EncryptionLevel>('Enhanced');
  const [securityScore, setSecurityScore] = useState(750); // Start with a base score
  const [proxy, setProxy] = useState<ProxyConfig>(PROXIES.default);

  const value = {
    vpnStatus, setVpnStatus,
    vpnServer, setVpnServer,
    firewallLevel, setFirewallLevel,
    scamProtection, setScamProtection,
    encryptionLevel, setEncryptionLevel,
    securityScore, setSecurityScore,
    proxy, setProxy,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};