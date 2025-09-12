import React from 'react';

export const MacetaraLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Arsis OS Logo">
        <defs>
            <linearGradient id="arsisLogoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#AEAEAE' }} />
                <stop offset="100%" style={{ stopColor: '#787878' }} />
            </linearGradient>
        </defs>
        <text 
            x="50%" 
            y="50%" 
            dy=".3em" 
            textAnchor="middle" 
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            fontSize="32" 
            fontWeight="500" 
            fill="url(#arsisLogoGradient)"
            letterSpacing="-1.5"
        >
            arsis
        </text>
    </svg>
);


export const SleepIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);


const PlaceholderAppIcon: React.FC<{ className?: string, color?: string, letter?: string }> = ({ className, color = '#6c6c6c', letter = 'A' }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill={color} rx="12"/>
        <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="32" fill="white" fontFamily="sans-serif" fontWeight="bold">{letter}</text>
    </svg>
);

// --- REVERTED/ORIGINAL ICONS ---
export const PagesIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff9500" letter="P" />;
export const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#1E1E1E" letter=">" />;
export const WeatherIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#5ac8fa" letter="W" />;
export const FinderIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#007aff" letter="F" />;
export const CalculatorIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#8e8e93" letter="C" />;
export const OzarkIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#34c759" letter="O" />;
export const StocksIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#2E2E2E" letter="$" />;
export const HoustonIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#5856d6" letter="H" />;

// --- OTHER APP ICONS (MOSTLY UNCHANGED) ---
export const AboutIcon: React.FC<{ className?: string }> = ({ className }) => <MacetaraLogo className={className} />;
export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#8e8e93" letter="S" />;
export const ImaginariumIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#a259ff" letter="I" />;
export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff3b30" letter="C" />;
export const MusicIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff2d55" letter="M" />;
export const PhotoBoothIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff9500" letter="P" />;
export const LaunchpadIcon: React.FC<{ className?: string }> = ({ className }) => <GridIcon className={className} />;
export const ArsisIdIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#007aff" letter="ID" />;
export const DefenseIOSIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#34c759" letter="D" />;
export const NetworkInfoIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#5856d6" letter="N" />;
export const InstallerIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#5ac8fa" letter="I" />;
export const AppStoreIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#007aff" letter="A" />;
export const ChromeIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ea4335" letter="C" />;
export const SteamIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#1b2838" letter="S" />;
export const GameIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ffcc00" letter="G" />;
export const SpotifyIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#1db954" letter="S" />;
export const PhotopeaIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#00a9f0" letter="P" />;
export const BbcNewsIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#bb1919" letter="N" />;
export const ShortcutsIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff69b4" letter="S" />;
export const VscodeIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#007acc" letter="V" />;
export const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#5865f2" letter="D" />;
export const SystemMonitorIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#4b5563" letter="S" />;
export const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff0000" letter="Y" />;
export const TrelloIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#0079bf" letter="T" />;
export const ContactsIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#ff9500" letter="C" />;
export const NewsIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#50e3c2" letter="N" />;
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#f56565" letter="C" />;
export const CodexIcon: React.FC<{ className?: string }> = ({ className }) => <PlaceholderAppIcon className={className} color="#4a5568" letter=">" />;


// UTILITY ICONS
export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
export const ControlCenterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
export const BoldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M8 5h5a3 3 0 013 3v2.5a3 3 0 01-3 3H8M8 11h6a3 3 0 013 3V19a3 3 0 01-3 3H8" /></svg>
);
export const ItalicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8m-6 16h8M10 4l4 16" /></svg>
);
export const ListUlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M4 6a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2z" /></svg>
);
export const ListOlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h12M8 12h12M8 18h12M4 6h1v1H4V6zm0 5h1v1H4v-1zm0 5h1v1H4v-1z" /></svg>
);
export const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
);
export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
);
export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 15l-4 6 6-4 6.293-6.293a1 1 0 011.414 0L21 12m-3-9l2 2" /></svg>
);
export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" /></svg>
);
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);
export const BrightnessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
export const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.555a5.5 5.5 0 018.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008zM4.444 12.889a10 10 0 0115.112 0" /></svg>
);
export const BluetoothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 6.75l10.5 10.5-5.25 5.25v-21l5.25 5.25-10.5 10.5" /></svg>
);