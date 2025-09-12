import React from 'react';
import type { AppConfig, UserProfileData, VFS } from './types';
import Pages from './apps/Notes';
import Terminal from './apps/Terminal';
import Weather from './apps/Weather';
import Finder from './apps/MyDocs';
import Calculator from './apps/Calculator';
import Ozark from './apps/Maverick';
import About from './apps/About';
import Stocks from './apps/Stocks';
import Houston from './apps/Houston';
import Settings from './apps/Settings';
import Imaginarium from './apps/Imaginarium';
import Calendar from './apps/Calendar';
import Music from './apps/Music';
import PhotoBooth from './apps/PhotoBooth';
import ArsisId from './apps/ArsisId';
import DefenseIOS from './apps/DefenseIOS';
import NetworkInfo from './apps/NetworkInfo';
import Installer from './apps/Installer';
import AppStore from './apps/AppStore';
import Shortcuts from './apps/Shortcuts';
import SystemMonitor from './apps/SystemMonitor';
import Contacts from './apps/Contacts';
import News from './apps/News';
import Clock from './apps/Clock';
import Codex from './apps/Codex';

import { 
    PagesIcon, 
    TerminalIcon, 
    WeatherIcon, 
    FinderIcon, 
    CalculatorIcon, 
    OzarkIcon,
    AboutIcon,
    StocksIcon,
    HoustonIcon,
    SettingsIcon,
    ImaginariumIcon,
    CalendarIcon,
    MusicIcon,
    PhotoBoothIcon,
    LaunchpadIcon,
    ArsisIdIcon,
    DefenseIOSIcon,
    NetworkInfoIcon,
    InstallerIcon,
    AppStoreIcon,
    ChromeIcon,
    SteamIcon,
    GameIcon,
    SpotifyIcon,
    PhotopeaIcon,
    BbcNewsIcon,
    ShortcutsIcon,
    VscodeIcon,
    DiscordIcon,
    SystemMonitorIcon,
    YouTubeIcon,
    TrelloIcon,
    ContactsIcon,
    NewsIcon,
    ClockIcon,
    CodexIcon,
} from './components/Icons';

export const APPS: AppConfig[] = [
  // User-specified order
  { id: 'finder', title: 'Finder', icon: FinderIcon, component: Finder, width: 700, height: 500, onDesktop: true },
  { id: 'ozark', title: 'Ozark', icon: OzarkIcon, component: Ozark, width: 1024, height: 768 },
  { id: 'codex', title: 'Codex', icon: CodexIcon, component: Codex, width: 1100, height: 700 },
  { id: 'news', title: 'Helios News', icon: NewsIcon, component: News, width: 900, height: 600, widgetId: 'news-widget' },
  { id: 'contacts', title: 'Contacts', icon: ContactsIcon, component: Contacts, width: 750, height: 500 },
  { id: 'houston', title: 'Houston', icon: HoustonIcon, component: Houston, width: 600, height: 700, onDesktop: true },
  { id: 'terminal', title: 'Terminal', icon: TerminalIcon, component: Terminal, width: 680, height: 420, showInDock: false },
  { id: 'calendar', title: 'Calendar', icon: CalendarIcon, component: Calendar, width: 700, height: 550, widgetId: 'calendar-widget' },
  { id: 'clock', title: 'Clock', icon: ClockIcon, component: Clock, width: 600, height: 400, widgetId: 'clock-widget' },
  { id: 'imaginarium', title: 'Imaginarium', icon: ImaginariumIcon, component: Imaginarium, width: 800, height: 600 },
  { id: 'weather', title: 'Weather', icon: WeatherIcon, component: Weather, width: 400, height: 600, widgetId: 'weather-widget' },
  { id: 'calculator', title: 'Calculator', icon: CalculatorIcon, component: Calculator, width: 360, height: 580 },
  { id: 'stocks', title: 'Stocks', icon: StocksIcon, component: Stocks, width: 400, height: 600, widgetId: 'stocks-widget' },
  { id: 'pages', title: 'Pages', icon: PagesIcon, component: Pages, width: 700, height: 500 },
  { id: 'music', title: 'Music', icon: MusicIcon, component: Music, width: 600, height: 400 },
  { id: 'photo-booth', title: 'Photo Booth', icon: PhotoBoothIcon, component: PhotoBooth, width: 720, height: 600 },
  { id: 'defense-ios', title: 'DefenseIOS', icon: DefenseIOSIcon, component: DefenseIOS, width: 500, height: 750, showInDock: false },
  { id: 'arsis-id', title: 'Arsis ID', icon: ArsisIdIcon, component: ArsisId, width: 400, height: 500, showInDock: false },
  
  // Other apps in dock
  { id: 'settings', title: 'Settings', icon: SettingsIcon, component: Settings, width: 500, height: 400 },
  { id: 'network-info', title: 'Network Info', icon: NetworkInfoIcon, component: NetworkInfo, width: 400, height: 350, onDesktop: true, showInDock: false },
  { id: 'installer', title: 'Install ArsisOS', icon: InstallerIcon, component: Installer, width: 450, height: 400, onDesktop: true },
  { id: 'app-store', title: 'App Store', icon: AppStoreIcon, component: AppStore, width: 800, height: 600, showInDock: false },

  // Launchpad is last in dock
  { id: 'launchpad', title: 'Launchpad', icon: LaunchpadIcon },

  // Apps not in dock
  { id: 'about', title: 'About ArsisOS', icon: AboutIcon, component: About, width: 400, height: 250, showInDock: false },
  { id: 'shortcuts', title: 'Shortcuts', icon: ShortcutsIcon, component: Shortcuts, width: 500, height: 450, showInDock: false },
];

export const EXTERNAL_APPS: AppConfig[] = [
  { 
    id: 'chrome-viewer', 
    title: 'Web Viewer', 
    icon: ChromeIcon, 
    externalUrl: 'https://www.google.com/webhp?igu=1',
    description: 'A simple web browser for navigating your favorite sites, powered by the secure Ozark engine.',
    width: 1024,
    height: 768,
  },
  { 
    id: 'steam-store', 
    title: 'Steam', 
    icon: SteamIcon, 
    externalUrl: 'https://store.steampowered.com/',
    description: 'Access the official Steam store to browse, and discover the latest PC games.',
    width: 1024,
    height: 768,
  },
  { 
    id: 'game-2048', 
    title: '2048', 
    icon: GameIcon, 
    externalUrl: 'https://play2048.co/',
    description: 'The classic sliding puzzle game. Combine tiles to reach the 2048 tile!',
    width: 500,
    height: 650,
  },
  { 
    id: 'spotify', 
    title: 'Spotify', 
    icon: SpotifyIcon, 
    externalUrl: 'https://open.spotify.com/',
    description: 'Listen to millions of songs and podcasts. Requires login.',
    width: 1024,
    height: 768,
  },
  {
    id: 'photopea',
    title: 'Photopea',
    icon: PhotopeaIcon,
    externalUrl: 'https://www.photopea.com/',
    description: 'A powerful, free online image editor that supports PSD, XCF, Sketch, XD and CDR formats.',
    width: 1200,
    height: 800,
  },
  {
    id: 'bbc-news',
    title: 'BBC News',
    icon: BbcNewsIcon,
    externalUrl: 'https://www.bbc.com/news',
    description: 'The latest news, sports, business, and entertainment from the BBC.',
    width: 1024,
    height: 768,
  },
  {
    id: 'discord-web',
    title: 'Discord',
    icon: DiscordIcon,
    externalUrl: 'https://discord.com/app',
    description: 'Chat, voice, and video calls with your communities. Requires login.',
    width: 1024,
    height: 768,
  },
  {
    id: 'youtube',
    title: 'YouTube',
    icon: YouTubeIcon,
    externalUrl: 'https://www.youtube.com/',
    description: 'Watch your favorite videos, creators, and channels.',
    width: 1200,
    height: 800,
  },
  {
    id: 'trello',
    title: 'Trello',
    icon: TrelloIcon,
    externalUrl: 'https://trello.com/',
    description: 'A visual tool for organizing your work and life. Requires login.',
    width: 1024,
    height: 768,
  }
];

export const SHORTCUT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'steam': SteamIcon,
    'vscode': VscodeIcon,
    'discord': DiscordIcon,
    'terminal': TerminalIcon,
    'spotify': SpotifyIcon,
};

// Maps for local .arsapp installation
export const LOCAL_APP_COMPONENTS: Record<string, React.ComponentType<any>> = {
    'system-monitor': SystemMonitor,
};

export const LOCAL_APP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'system-monitor': SystemMonitorIcon,
};


export const API_CALL_LIMIT = 1000;

export const createInitialVFS = (): VFS => {
    const desktopId = 'Desktop';
    const documentsId = 'Documents';
    const picturesId = 'Pictures';
    const welcomeFileId = 'file-welcome';
    const finderAppId = 'app-finder';
    const houstonAppId = 'app-houston';
    const networkInfoAppId = 'app-network';
    const installerAppId = 'app-installer';

    return {
        id: 'root',
        name: '/',
        type: 'directory',
        children: {
            [desktopId]: {
                id: desktopId,
                name: 'Desktop',
                type: 'directory',
                children: {
                    [welcomeFileId]: {
                        id: welcomeFileId,
                        name: 'Welcome.txt',
                        type: 'file',
                        content: 'Welcome to your new ArsisOS desktop!',
                        meta: { iconPosition: { x: window.innerWidth - 120, y: 40 }}
                    },
                    [finderAppId]: {
                        id: finderAppId,
                        name: 'Finder',
                        type: 'app',
                        meta: { appId: 'finder', iconPosition: { x: window.innerWidth - 120, y: 150 } }
                    },
                    [houstonAppId]: {
                        id: houstonAppId,
                        name: 'Houston',
                        type: 'app',
                        meta: { appId: 'houston', iconPosition: { x: window.innerWidth - 120, y: 260 } }
                    },
                     [networkInfoAppId]: {
                        id: networkInfoAppId,
                        name: 'Network Info',
                        type: 'app',
                        meta: { appId: 'network-info', iconPosition: { x: window.innerWidth - 120, y: 370 } }
                    },
                    [installerAppId]: {
                        id: installerAppId,
                        name: 'Install ArsisOS',
                        type: 'app',
                        meta: { appId: 'installer', iconPosition: { x: window.innerWidth - 120, y: 480 } }
                    }
                }
            },
            [documentsId]: {
                id: documentsId,
                name: 'Documents',
                type: 'directory',
                children: {
                    'doc-1': {
                        id: 'doc-1',
                        name: 'Getting Started.txt',
                        type: 'file',
                        content: '<h1>Welcome to Pages!</h1><p>This is your personal document editor. All your files are automatically saved to your Arsis ID.</p><p>You can create new files, edit existing ones, and even use the integrated <b>Houston AI</b> to help you write.</p>'
                    }
                }
            },
            [picturesId]: {
                id: picturesId,
                name: 'Pictures',
                type: 'directory',
                children: {}
            }
        }
    };
};

export const GUEST_PROFILE_DATA: Omit<UserProfileData, 'vfs' | 'settings'> = {
    calendarEvents: {},
    houstonHistory: [{ sender: 'houston', text: "Hello! I'm Houston, your AI assistant. How can I help you today?" }],
    maverickUrl: 'https://besmart12349.github.io/maverick2.github.io/',
    clockSettings: {
        use24Hour: false,
        timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo'],
        alarms: [],
    },
    installedExternalApps: [],
    installedLocalApps: [],
    shortcuts: [],
    widgets: [],
    contacts: [],
    watchedStocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
    lockedApps: [],
    appLockPasscode: null,
    hiddenInDock: [],
    houstonModel: '1.0',
};