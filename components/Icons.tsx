
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

export const PagesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#ffffff" rx="12" />
        <path d="M16 16h32" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 24h32" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 32h20" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42.5,27.5 L25,45 L20,49 L15,44 L19,39 Z" fill="#363636"/>
        <path d="M39.5,30.5 L46,24" stroke="#FDB92E" strokeWidth="5" strokeLinecap="round"/>
    </svg>
);

export const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#1E1E1E" rx="12" />
        <path d="M16 24 L24 32 L16 40" stroke="#00FF41" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 40 H42" stroke="#00FF41" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

export const WeatherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f0f0f0"/>
                <stop offset="100%" stopColor="#d4d4d4"/>
            </linearGradient>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD700"/>
                <stop offset="100%" stopColor="#FFA500"/>
            </linearGradient>
        </defs>
        <circle cx="26" cy="24" r="12" fill="url(#sunGrad)" />
        <path d="M22 48 C12 48 10 40 16 36 C12 30 18 24 28 26 C32 20 44 20 48 28 C56 28 58 38 50 42 C52 48 44 52 40 48 C38 50 30 52 28 48 Z" fill="url(#cloudGrad)" stroke="#c0c0c0" strokeWidth="1"/>
    </svg>
);

export const MyDocsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 7C4 5.89543 4.89543 5 6 5H9.41421C9.94484 5 10.4556 5.21071 10.8284 5.58579L12.4142 7.17157C12.7869 7.54438 13.2978 7.7551 13.8284 7.7551H18C19.1046 7.7551 20 8.65053 20 9.7551V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" fill="#4285F4"/>
        <path d="M2 11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V11Z" fill="#1A73E8"/>
    </svg>
);

export const FinderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="finderFace" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#55DDFF" />
        <stop offset="1" stopColor="#0088CC" />
      </linearGradient>
      <linearGradient id="finderSmile" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#003344" />
        <stop offset="1" stopColor="#001122" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" x="4" y="4" fill="url(#finderFace)" rx="12" />
    <path d="M20 32 C20 40, 44 40, 44 32" stroke="url(#finderSmile)" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="22" cy="26" r="4" fill="url(#finderSmile)" />
    <circle cx="42" cy="26" r="4" fill="url(#finderSmile)" />
  </svg>
);


export const CalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#4a4a4a" rx="12" />
        <circle cx="18" cy="24" r="5" fill="#6b6b6b" />
        <circle cx="32" cy="24" r="5" fill="#6b6b6b" />
        <circle cx="46" cy="24" r="5" fill="#6b6b6b" />
        <circle cx="18" cy="38" r="5" fill="#6b6b6b" />
        <circle cx="32" cy="38" r="5" fill="#6b6b6b" />
        <circle cx="46" cy="38" r="5" fill="#FF9500" />
        <circle cx="18" cy="52" r="5" fill="#6b6b6b" />
        <circle cx="32" cy="52" r="5" fill="#6b6b6b" />
        <circle cx="46" cy="52" r="5" fill="#FF9500" />
    </svg>
);

export const MaverickIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <radialGradient id="compass-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="100%" stopColor="#1A73E8" />
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#compass-grad)" />
        <circle cx="32" cy="32" r="22" fill="#FFFFFF" />
        <path d="M32 12 L36 30 L32 42 L28 30 Z" fill="#F44336" />
        <path d="M32 12 L36 30 L32 42 L28 30 Z" transform="rotate(45 32 32)" fill="#FFFFFF" opacity="0.5"/>
        <path d="M32 12 L36 30 L32 42 L28 30 Z" transform="rotate(-45 32 32)" fill="#FFFFFF" opacity="0.5"/>
        <circle cx="32" cy="32" r="4" fill="#4285F4" />
    </svg>
);


export const AboutIcon: React.FC<{ className?: string }> = ({ className }) => (
   <MacetaraLogo className={className} />
);

export const StocksIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#2E2E2E" rx="12"/>
        <path d="M12 48 L22 32 L34 40 L48 20 L52 24" stroke="#34C759" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M44 20 L52 20 L52 28" stroke="#34C759" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const HoustonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
         <defs>
            <linearGradient id="houston-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8A2BE2"/>
                <stop offset="100%" stopColor="#4169E1"/>
            </linearGradient>
        </defs>
        <circle cx="32" cy="24" r="10" fill="url(#houston-grad)" />
        <path d="M16 54 C16 44 48 44 48 54 Z" fill="url(#houston-grad)" />
    </svg>
);

// FIX: Added the missing PlusIcon component required by the Shortcuts app.
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const BoldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.25 12.5a.75.75 0 000-1.5H8.75a.75.75 0 000 1.5h4.5z" />
        <path fillRule="evenodd" d="M19.5 4.5a3 3 0 00-3-3H8.25a3 3 0 00-3 3v15a3 3 0 003 3h8.25a3 3 0 003-3v-15zm-4.25 5a2.25 2.25 0 00-2.25-2.25H8.75a2.25 2.25 0 000 4.5h4.25a2.25 2.25 0 002.25-2.25zm-2.25 4a2.25 2.25 0 012.25 2.25 2.25 2.25 0 01-2.25 2.25H8.75a2.25 2.25 0 010-4.5h6.5z" clipRule="evenodd" />
    </svg>
);

export const ItalicIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.75 4.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" />
        <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0112 1.5zM12.75 18a.75.75 0 000 1.5h-2.5a.75.75 0 000-1.5h2.5z" />
        <path fillRule="evenodd" d="M12 16.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
        <path d="M14.06 5.03a.75.75 0 00-1.06-1.06l-6.5 6.5a.75.75 0 001.06 1.06l6.5-6.5z" />
        <path d="M15.12 12.03a.75.75 0 00-1.06-1.06l-6.5 6.5a.75.75 0 001.06 1.06l6.5-6.5z" />
    </svg>
);

export const ListUlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h14.25a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm0 4.5A.75.75 0 013 12.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 17.25h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);

export const ListOlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 4.5c0-.414.336-.75.75-.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm15 3.75a.75.75 0 000 1.5h-14.25a.75.75 0 000-1.5H17.25zm0 3.75a.75.75 0 000 1.5h-14.25a.75.75 0 000-1.5H17.25zm0 3.75a.75.75 0 000 1.5h-14.25a.75.75 0 000-1.5H17.25z" clipRule="evenodd" />
    </svg>
);


export const FontSizeIncreaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75h15" />
    </svg>
);

export const FontSizeDecreaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.25h15" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="gear-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C0C0C0"/>
                <stop offset="100%" stopColor="#808080"/>
            </linearGradient>
        </defs>
        <path d="M52.4,35.5l-6.2-3.6c-0.5-0.3-0.8-0.8-0.8-1.4 s0.3-1.1,0.8-1.4l6.2-3.6c0.5-0.3,1.2-0.2,1.6,0.2l4.4,4.4c0.4,0.4,0.5,1.1,0.2,1.6l-3.6,6.2C54.8,36.4,53.2,36.4,52.4,35.5z M11.6,28.5l6.2,3.6c0.5,0.3,0.8,0.8,0.8,1.4s-0.3,1.1-0.8,1.4l-6.2,3.6c-0.5,0.3-1.2,0.2-1.6-0.2l-4.4-4.4c-0.4-0.4-0.5-1.1-0.2-1.6 l3.6-6.2C9.2,27.6,10.8,27.6,11.6,28.5z M35.5,11.6l-3.6-6.2c-0.3-0.5-0.8-0.8-1.4-0.8s-1.1,0.3-1.4,0.8l-3.6,6.2 c-0.3,0.5-0.2,1.2,0.2,1.6l4.4,4.4c0.4,0.4,1.1,0.5,1.6,0.2l6.2-3.6C36.4,12.8,36.4,11.9,35.5,11.6z M28.5,52.4l3.6,6.2 c0.3,0.5,0.8,0.8,1.4,0.8s1.1-0.3,1.4-0.8l3.6-6.2c0.3-0.5,0.2-1.2-0.2-1.6l-4.4-4.4c-0.4-0.4-1.1-0.5-1.6-0.2l-6.2,3.6 C27.6,49.2,27.6,50.8,28.5,52.4z" fill="url(#gear-grad)" />
        <circle cx="32" cy="32" r="10" fill="#A9A9A9"/>
        <circle cx="32" cy="32" r="6" fill="#D3D3D3"/>
    </svg>
);

export const ImaginariumIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <radialGradient id="imaginarium-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff00ff" />
                <stop offset="50%" stopColor="#8A2BE2" />
                <stop offset="100%" stopColor="#4169E1" />
            </radialGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="#000" rx="12"/>
        <circle cx="32" cy="32" r="20" fill="url(#imaginarium-grad)" />
        <circle cx="24" cy="24" r="3" fill="#FFF" opacity="0.8"/>
        <circle cx="42" cy="38" r="2" fill="#FFF" opacity="0.8"/>
        <circle cx="38" cy="20" r="1.5" fill="#FFF" opacity="0.8"/>
    </svg>
);


export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="cal-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e1e1e1"/>
                <stop offset="100%" stopColor="#f8f8f8"/>
            </linearGradient>
            <linearGradient id="cal-header" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b6b"/>
                <stop offset="100%" stopColor="#ff4757"/>
            </linearGradient>
        </defs>
        <rect width="56" height="52" x="4" y="8" fill="url(#cal-grad)" rx="8"/>
        <rect width="56" height="14" x="4" y="8" fill="url(#cal-header)" rx="8" ry="8"/>
        <circle cx="16" cy="15" r="3" fill="#FFF"/>
        <circle cx="48" cy="15" r="3" fill="#FFF"/>
        <rect x="14" y="28" width="8" height="6" fill="#b0b0b0" rx="2"/>
        <rect x="28" y="28" width="8" height="6" fill="#b0b0b0" rx="2"/>
        <rect x="42" y="28" width="8" height="6" fill="#b0b0b0" rx="2"/>
        <rect x="14" y="40" width="8" height="6" fill="#b0b0b0" rx="2"/>
        <rect x="28" y="40" width="8" height="6" fill="#ff6b6b" rx="2"/>
        <rect x="42" y="40" width="8" height="6" fill="#b0b0b0" rx="2"/>
    </svg>
);

export const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <radialGradient id="music-grad-new" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#FA5562"/>
                <stop offset="100%" stopColor="#F52536"/>
            </radialGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="url(#music-grad-new)" rx="12" />
        <path d="M26 18 L26 40 C26 44.4183 22.4183 48 18 48 C13.5817 48 10 44.4183 10 40 C10 35.5817 13.5817 32 18 32 C19.5 32 21 32.5 22 33" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 14 L50 36 C50 40.4183 46.4183 44 42 44 C37.5817 44 34 40.4183 34 36 C34 31.5817 37.5817 28 42 28 C43.5 28 45 28.5 46 29" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="26" y1="18" x2="50" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);


export const PhotoBoothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="pb-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#55EFCB"/>
                <stop offset="100%" stopColor="#5B7BE5"/>
            </linearGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="#333" rx="12" />
        <rect width="40" height="40" x="12" y="8" fill="url(#pb-grad)" rx="6" />
        <circle cx="32" cy="28" r="12" fill="#FFF" />
        <circle cx="32" cy="28" r="6" fill="#333" />
        <circle cx="40" cy="16" r="3" fill="red" />
    </svg>
);

export const LaunchpadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#222" rx="12" />
        <circle cx="18" cy="18" r="6" fill="#FF6B6B" />
        <circle cx="32" cy="18" r="6" fill="#4ECDC4" />
        <circle cx="46" cy="18" r="6" fill="#45B7D1" />
        <circle cx="18" cy="32" r="6" fill="#F9A825" />
        <circle cx="32" cy="32" r="6" fill="#AC45D1" />
        <circle cx="46" cy="32" r="6" fill="#34C759" />
        <circle cx="18" cy="46" r="6" fill="#007AFF" />
        <circle cx="32" cy="46" r="6" fill="#FF9500" />
        <circle cx="46" cy="46" r="6" fill="#FF2D55" />
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const ContactsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="contacts-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34C759" />
        <stop offset="100%" stopColor="#2E8B57" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" x="4" y="4" fill="url(#contacts-grad)" rx="12" />
    <path d="M48,46 C48,40 40,36 32,36 C24,36 16,40 16,46" fill="#FFF" />
    <circle cx="32" cy="27" r="8" fill="#FFF" />
    <path d="M52 18L44 24L52 30" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ControlCenterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.586A2 2 0 1014 16v-1.414A2 2 0 1011 10.586zM4 7a2 2 0 104 0v1.414A2 2 0 104 7zm10.586 4A2 2 0 1016 8.414V7a2 2 0 10-1.414 4z" clipRule="evenodd" />
    </svg>
);

export const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886c3.18-3.18 8.352-3.18 11.532 0M2 8.734c5.087-5.087 13.36-5.087 18.448 0" />
    </svg>
);

export const BluetoothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25l9 7.5-9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75L6.75.75l9 7.5-9 7.5" />
    </svg>
);

export const BrightnessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01M6.364 6.364l.01.01M3 12h.01M6.364 17.636l.01.01M12 21v-.01M17.636 17.636l-.01.01M21 12h-.01M17.636 6.364l-.01.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
);

export const ArsisIdIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="id-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4169E1"/>
                <stop offset="100%" stopColor="#8A2BE2"/>
            </linearGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="#333" rx="12"/>
        <rect width="48" height="36" x="8" y="14" fill="url(#id-grad)" rx="8"/>
        <circle cx="22" cy="32" r="8" fill="#FFF"/>
        <path d="M16 42 C16 38 28 38 28 42 Z" fill="#FFF" />
        <rect x="34" y="24" width="16" height="4" fill="#FFF" rx="2"/>
        <rect x="34" y="34" width="10" height="4" fill="#FFF" rx="2"/>
    </svg>
);

export const DefenseIOSIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="defense-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#005BEA" />
                <stop offset="100%" stopColor="#00C6FB" />
            </linearGradient>
             <linearGradient id="defense-check-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#43e97b" />
                <stop offset="100%" stopColor="#38f9d7" />
            </linearGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="#2E2E2E" rx="12"/>
        <path d="M32,8 L52,18 L52,32 C52,45.25 43.25,55 32,56 C20.75,55 12,45.25 12,32 L12,18 Z" fill="url(#defense-grad)" />
        <path d="M24 34 L30 40 L42 28" stroke="url(#defense-check-grad)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const NetworkInfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#2E2E2E" rx="12"/>
        <circle cx="32" cy="32" r="18" stroke="#34C759" fill="none" strokeWidth="3" />
        <path d="M14 32 C 22 20, 42 20, 50 32" stroke="#34C759" fill="none" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M14 32 C 22 44, 42 44, 50 32" stroke="#34C759" fill="none" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="14" y1="32" x2="50" y2="32" stroke="#34C759" strokeWidth="2" />
    </svg>
);

export const InstallerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="installer-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#808080" />
                <stop offset="100%" stopColor="#A9A9A9" />
            </linearGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="url(#installer-grad)" rx="12"/>
        <path d="M32 16 L32 40 M22 30 L32 40 L42 30" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 48 H48" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
);

export const AppStoreIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="appstore-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#007AFF"/>
                <stop offset="100%" stopColor="#00A2FF"/>
            </linearGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="url(#appstore-grad)" rx="12"/>
        <path d="M24 20 L40 20 M32 20 L32 44 M24 32 L40 32" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="18" stroke="white" strokeWidth="4" fill="none"/>
    </svg>
);

export const ChromeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="32" cy="32" r="28" fill="#FFFFFF"/>
        <path d="M32,6 A26,26 0 0,1 58,32 L32,32 Z" fill="#EA4335"/>
        <path d="M6,32 A26,26 0 0,1 18.2,9.7 L32,32 Z" fill="#FBBC05"/>
        <path d="M32,58 A26,26 0 0,1 18.2,54.3 L32,32 Z" fill="#34A853"/>
        <circle cx="32" cy="32" r="12" fill="#4285F4"/>
    </svg>
);

export const SteamIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <radialGradient id="steam-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2a475e"/>
                <stop offset="100%" stopColor="#1b2838"/>
            </radialGradient>
        </defs>
        <rect width="56" height="56" x="4" y="4" fill="url(#steam-grad)" rx="12"/>
        <circle cx="42" cy="22" r="10" stroke="white" strokeWidth="4" fill="none"/>
        <circle cx="42" cy="22" r="3" fill="white"/>
        <line x1="24" y1="40" x2="36" y2="28" stroke="white" strokeWidth="5" strokeLinecap="round"/>
    </svg>
);

export const GameIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#333" rx="12"/>
        <rect x="12" y="24" width="16" height="16" fill="#555" rx="2"/>
        <line x1="16" y1="32" x2="24" y2="32" stroke="white" strokeWidth="2"/>
        <line x1="20" y1="28" x2="20" y2="36" stroke="white" strokeWidth="2"/>
        <circle cx="44" cy="28" r="4" fill="#FF5555"/>
        <circle cx="50" cy="36" r="4" fill="#55A5FF"/>
    </svg>
);

export const SpotifyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#1DB954" rx="12"/>
        <circle cx="32" cy="32" r="18" fill="#191414"/>
        <path d="M22 30 C 28 26, 40 28, 46 34" stroke="#1DB954" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M24 36 C 29 33, 38 34, 43 38" stroke="#1DB954" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M26 42 C 30 40, 36 41, 40 43" stroke="#1DB954" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
);

export const PhotopeaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#181818" rx="12"/>
        <path d="M16,16 L16,48 L48,48 L48,16 Z" fill="#2E92F2"/>
        <path d="M20,20 L20,44 L32,44 A12,12 0 0,0 32,20 Z" fill="#FFFFFF"/>
        <text x="38" y="42" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#FFFFFF">P</text>
    </svg>
);

export const BbcNewsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#BB1919" rx="12"/>
        <rect width="12" height="32" x="14" y="16" fill="white"/>
        <rect width="12" height="32" x="28" y="16" fill="white"/>
        <rect width="12" height="32" x="42" y="16" fill="white"/>
    </svg>
);

export const ShortcutsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sc-grad-1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F97794" /><stop offset="100%" stopColor="#623AA2" /></linearGradient>
      <linearGradient id="sc-grad-2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2CD8D5" /><stop offset="100%" stopColor="#6B8DD6" /></linearGradient>
    </defs>
    <rect width="56" height="56" x="4" y="4" fill="#1E1E1E" rx="12" />
    <circle cx="22" cy="22" r="12" fill="url(#sc-grad-1)" />
    <circle cx="42" cy="42" r="12" fill="url(#sc-grad-2)" />
    <path d="M22,34 L30,42" stroke="white" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const VscodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#007ACC" rx="12"/>
        <path d="M48 12 L24 32 L48 52 L52 48 L32 32 L52 16 Z" fill="#FFF"/>
        <path d="M16 16 L12 20 L24 32 L12 44 L16 48 L32 32 Z" fill="#FFF" opacity="0.6"/>
    </svg>
);

export const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#5865F2" rx="12"/>
        <path d="M45.7,16.8c-2.4-1.4-5-2.6-7.7-3.4C37.3,14,36.5,15,35.9,15.9c-4.4-0.8-8.9-0.8-13.3,0C22,15,21.2,14,20.5,13.4 c-2.7,0.8-5.3,2-7.7,3.4C5.2,25.3,4,36.3,12.2,45c2.4,2.6,5.3,4.2,8.4,5.2c1.3,0.4,2.6,0.2,3.8-0.4c-0.6-0.5-1.2-1.1-1.7-1.7 c-0.2-0.2-0.3-0.5-0.2-0.7c0.1-0.3,0.4-0.5,0.7-0.6c3.2-0.9,6-2.5,8.3-4.5c0.3-0.2,0.6-0.2,0.9,0c2.3,2,5.1,3.6,8.3,4.5 c0.3,0.1,0.6,0.3,0.7,0.6c0.1,0.2,0,0.5-0.2,0.7c-0.5,0.6-1.1,1.2-1.7,1.7c1.2,0.6,2.5,0.8,3.8,0.4c3.1-1,6-2.6,8.4-5.2 C58.5,36.3,57.2,25.3,45.7,16.8z M26,38.2c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S28.2,38.2,26,38.2z M40.5,38.2 c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S42.7,38.2,40.5,38.2z" fill="#FFF"/>
    </svg>
);

export const SystemMonitorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#2E2E2E" rx="12"/>
        <path d="M12 40 L20 32 L28 44 L36 28 L44 48 L52 40" stroke="#34C759" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="12" y="16" width="40" height="8" fill="#444" rx="2"/>
        <circle cx="18" cy="20" r="2" fill="#FF6B6B"/>
        <circle cx="26" cy="20" r="2" fill="#FFD166"/>
        <circle cx="34" cy="20" r="2" fill="#06D6A0"/>
    </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#FF0000" rx="12"/>
        <path d="M26,20 L44,32 L26,44 Z" fill="white"/>
    </svg>
);

export const TrelloIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="56" height="56" x="4" y="4" fill="#0079BF" rx="12"/>
        <rect x="14" y="16" width="16" height="24" fill="#FFFFFF" rx="3"/>
        <rect x="34" y="16" width="16" height="16" fill="#FFFFFF" rx="3"/>
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);