
import React from 'react';
import type { AppConfig } from './types';
import Pages from './apps/Notes';
import Terminal from './apps/Terminal';
import Weather from './apps/Weather';
import MyDocs from './apps/MyDocs';
import Calculator from './apps/Calculator';
import Maverick from './apps/Maverick';
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

import { 
    PagesIcon, 
    TerminalIcon, 
    WeatherIcon, 
    MyDocsIcon, 
    CalculatorIcon, 
    MaverickIcon,
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
} from './components/Icons';

export const APPS: AppConfig[] = [
  // User-specified order
  { id: 'my-docs', title: 'MyDocs', icon: MyDocsIcon, component: MyDocs, width: 700, height: 500, onDesktop: true },
  { id: 'maverick', title: 'Maverick', icon: MaverickIcon, component: Maverick, width: 1024, height: 768 },
  { id: 'contacts', title: 'Contacts', icon: ContactsIcon, component: Contacts, width: 750, height: 500 },
  { id: 'houston', title: 'Houston', icon: HoustonIcon, component: Houston, width: 500, height: 700, onDesktop: true },
  { id: 'terminal', title: 'Terminal', icon: TerminalIcon, component: Terminal, width: 680, height: 420, showInDock: false },
  { id: 'calendar', title: 'Calendar', icon: CalendarIcon, component: Calendar, width: 700, height: 550 },
  { id: 'imaginarium', title: 'Imaginarium', icon: ImaginariumIcon, component: Imaginarium, width: 800, height: 600 },
  { id: 'weather', title: 'Weather', icon: WeatherIcon, component: Weather, width: 350, height: 500 },
  { id: 'calculator', title: 'Calculator', icon: CalculatorIcon, component: Calculator, width: 360, height: 580 },
  { id: 'stocks', title: 'Stocks', icon: StocksIcon, component: Stocks, width: 400, height: 600 },
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
    description: 'A simple web browser for navigating your favorite sites, powered by the secure Maverick engine.',
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