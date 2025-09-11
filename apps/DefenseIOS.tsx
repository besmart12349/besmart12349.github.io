import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSecurity, VpnStatus, FirewallLevel, EncryptionLevel, PROXIES } from '../contexts/SecurityContext';
import type { Notification } from '../types';
import { DefenseIOSIcon, HoustonIcon } from '../components/Icons';
import { API_KEY } from '../config';

interface DefenseIOSProps {
  addNotification?: (notification: Omit<Notification, 'id' | 'icon'>) => void;
  onApiCall?: () => void;
}

const VPN_SERVERS = {
  'us-east': 'USA (East)',
  'eu-central': 'Germany',
  'asia-east': 'Japan',
};

const FIREWALL_LEVELS: FirewallLevel[] = ['Low', 'Medium', 'High', 'Maximum'];
const ENCRYPTION_LEVELS: EncryptionLevel[] = ['Standard', 'Enhanced', 'Quantum'];

const DefenseIOS: React.FC<DefenseIOSProps> = ({ addNotification, onApiCall }) => {
  const {
    vpnStatus, setVpnStatus,
    vpnServer, setVpnServer,
    firewallLevel, setFirewallLevel,
    scamProtection, setScamProtection,
    encryptionLevel, setEncryptionLevel,
    securityScore, setSecurityScore,
    setProxy,
  } = useSecurity();

  const [aiStatusText, setAiStatusText] = useState('Monitoring...');
  const [isGettingTip, setIsGettingTip] = useState(false);

  useEffect(() => {
    const aiStatuses = ['Analyzing network traffic...', 'Optimizing firewall rules...', 'Scanning for threats...', 'Learning user patterns...', 'Strengthening encryption...'];
    const interval = setInterval(() => {
        setSecurityScore(prev => Math.min(1000, prev + 1));
        if (Math.random() < 0.2) {
            setAiStatusText(aiStatuses[Math.floor(Math.random() * aiStatuses.length)]);
        }
    }, 2000);

    return () => clearInterval(interval);
  }, [setSecurityScore]);

  const handleVpnToggle = () => {
    if (vpnStatus === 'Connecting') return;

    if (vpnStatus === 'Disconnected') {
      setVpnStatus('Connecting');
      setTimeout(() => {
        setVpnStatus('Connected');
        setProxy(PROXIES.vpn);
        addNotification?.({ appId: 'defense-ios', title: 'VPN Connected', message: `Secure connection via ${VPN_SERVERS[vpnServer as keyof typeof VPN_SERVERS]}.` });
      }, 2000);
    } else {
      setVpnStatus('Disconnected');
      setProxy(PROXIES.default);
      addNotification?.({ appId: 'defense-ios', title: 'VPN Disconnected', message: 'Your connection is no longer secure.' });
    }
  };

  const handleFirewallChange = (level: FirewallLevel) => {
    setFirewallLevel(level);
    addNotification?.({ appId: 'defense-ios', title: 'Firewall Updated', message: `Strictness level set to ${level}.` });
  };

  const handleScamProtectionToggle = () => {
    const newState = !scamProtection;
    setScamProtection(newState);
    addNotification?.({ appId: 'defense-ios', title: 'Web Protection Updated', message: `Fraud & Scam prevention is now ${newState ? 'ON' : 'OFF'}.` });
  };
  
  const handleEncryptionChange = (level: EncryptionLevel) => {
    setEncryptionLevel(level);
    addNotification?.({ appId: 'defense-ios', title: 'Encryption Level Changed', message: `Protocol updated to ${level}.` });
  };

  const getSecurityTip = async () => {
    setIsGettingTip(true);
    onApiCall?.();
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: "Provide a single, concise cybersecurity tip for a personal computer user. Start the sentence with 'DefenseAI recommends:'"
      });
      addNotification?.({
          appId: 'defense-ios',
          title: 'DefenseAI Security Tip',
          message: response.text,
      });
    } catch (e) {
        console.error("DefenseAI tip error:", e);
        addNotification?.({
            appId: 'defense-ios',
            title: 'DefenseAI Error',
            message: 'Could not retrieve a tip at this time.',
        });
    } finally {
        setIsGettingTip(false);
    }
  }

  const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">{children}</div>
  );
  
  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void, disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <button
      role="switch" aria-checked={checked} onClick={onChange} disabled={disabled}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${checked ? 'bg-green-500' : 'bg-gray-600'}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const getScoreColor = (score: number) => {
    if (score < 500) return 'bg-red-500';
    if (score < 800) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  return (
    <div className="w-full h-full bg-gray-800 text-white p-4 overflow-y-auto space-y-4 font-sans">
      <header className="flex items-center space-x-3 pb-2 border-b border-gray-700">
        <DefenseIOSIcon className="w-10 h-10" />
        <div>
            <h1 className="text-2xl font-bold">Defense Center</h1>
            <p className="text-sm text-gray-400">Manage your system's security.</p>
        </div>
      </header>
      
      <Section title="DefenseAI Status">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Security Score: {securityScore}/1000</span>
            <span className="text-sm text-gray-400 italic">{aiStatusText}</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className={`${getScoreColor(securityScore)} h-2.5 rounded-full transition-all duration-500`} style={{width: `${(securityScore/1000)*100}%`}}></div>
          </div>
          <button onClick={getSecurityTip} disabled={isGettingTip} className="mt-3 w-full flex items-center justify-center space-x-2 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50">
            <HoustonIcon className="w-4 h-4" />
            <span>{isGettingTip ? 'Thinking...' : 'Get Security Tip'}</span>
          </button>
      </Section>

      <Section title="Virtual Private Network (VPN)">
        <div className="flex justify-between items-center mb-3">
          <label className="font-medium">VPN Status</label>
          <ToggleSwitch checked={vpnStatus !== 'Disconnected'} onChange={handleVpnToggle} disabled={vpnStatus === 'Connecting'} />
        </div>
        <div className={`p-3 rounded-md bg-black/20 text-sm ${vpnStatus === 'Connected' ? 'text-green-400' : vpnStatus === 'Connecting' ? 'text-yellow-400' : 'text-red-400'}`}>
            Status: <span className="font-semibold">{vpnStatus}</span>
            {vpnStatus === 'Connecting' && <span className="animate-pulse">...</span>}
        </div>
        <div className="mt-3">
            <label htmlFor="vpn-server" className="block text-sm font-medium text-gray-300 mb-1">Server Location</label>
            <select
                id="vpn-server" value={vpnServer} onChange={(e) => setVpnServer(e.target.value)} disabled={vpnStatus !== 'Disconnected'}
                className="w-full p-2 bg-gray-600 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
               {Object.entries(VPN_SERVERS).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
            </select>
        </div>
      </Section>
      
      <Section title="Firewall">
        <label className="block text-sm font-medium text-gray-300 mb-2">Strictness Level</label>
        <div className="flex space-x-2 bg-gray-800/60 p-1 rounded-md">
            {FIREWALL_LEVELS.map(level => (
                <button
                    key={level} onClick={() => handleFirewallChange(level)}
                    className={`flex-1 py-1.5 text-sm rounded transition-colors ${firewallLevel === level ? 'bg-blue-600 font-semibold' : 'hover:bg-gray-700'}`}>{level}</button>
            ))}
        </div>
      </Section>

      <Section title="Web Protection">
        <div className="flex justify-between items-center">
            <div>
                <label className="font-medium">Fraud & Scam Prevention</label>
                <p className="text-xs text-gray-400">Block known malicious websites.</p>
            </div>
            <ToggleSwitch checked={scamProtection} onChange={handleScamProtectionToggle} />
        </div>
      </Section>
      
      <Section title="Data Encryption">
        <label className="block text-sm font-medium text-gray-300 mb-2">Protocol</label>
         <div className="space-y-2">
          {ENCRYPTION_LEVELS.map(level => (
            <label key={level} className="flex items-center p-2 bg-gray-800/60 rounded-md cursor-pointer hover:bg-gray-700">
              <input type="radio" name="encryption" value={level} checked={encryptionLevel === level} onChange={() => handleEncryptionChange(level)}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-500" />
              <span className="ml-3 text-sm">{level}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default DefenseIOS;