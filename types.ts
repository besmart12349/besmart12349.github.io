import React from 'react';

// FIX: Add type definitions for the File System Access API to fix TS errors.
// These are not exhaustive but cover the usage in this application.
declare global {
  // PWA install prompt event
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
  
  interface FileSystemWritableFileStream {
    write(data: string): Promise<void>;
    close(): Promise<void>;
  }

  interface FileSystemFileHandle {
    // FIX: Add readonly modifier to 'kind' to match built-in TS types.
    readonly kind: 'file';
    name: string;
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemDirectoryHandle {
    // FIX: Add readonly modifier to 'kind' to match built-in TS types.
    readonly kind: 'directory';
    name: string;
    values(): AsyncIterableIterator<FileSystemFileHandle | FileSystemDirectoryHandle>;
  }

  // FIX: Add type definitions for Web Speech API to resolve 'SpeechRecognition' not found error.
  interface SpeechRecognition extends EventTarget {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start(): void;
      stop(): void;
      onresult: (event: any) => void;
      onerror: (event: any) => void;
      onend: () => void;
  }

  interface Window {
    showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>;
    showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
    showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>;
    // Add this for PWA install prompt
    onbeforeinstallprompt: ((this: Window, ev: BeforeInstallPromptEvent) => any) | null;
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export type AppID = 'pages' | 'terminal' | 'weather' | 'finder' | 'calculator' | 'ozark' | 'about' | 'stocks' | 'houston' | 'settings' | 'imaginarium' | 'calendar' | 'music' | 'photo-booth' | 'launchpad' | 'arsis-id' | 'defense-ios' | 'network-info' | 'installer' | 'app-store' | 'chrome-viewer' | 'steam-store' | 'game-2048' | 'spotify' | 'photopea' | 'bbc-news' | 'shortcuts' | 'contacts' | 'news' | 'clock' | 'codex' | string;

export interface Shortcut {
  id: string; // A unique ID, e.g., timestamp
  title: string;
  iconId: string; // keyof typeof SHORTCUT_ICONS
  uri: string; // The URI to launch, e.g., "vscode://"
}

// Local App types for .arsapp installation
export type LocalAppComponentID = 'system-monitor';
export type LocalAppIconID = 'system-monitor';

export interface InstalledApp {
  id: AppID;
  title: string;
  componentId: LocalAppComponentID;
  iconId: LocalAppIconID;
  width?: number;
  height?: number;
}


export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component?: React.ComponentType<any>;
  width?: number;
  height?: number;
  showInDock?: boolean;
  onDesktop?: boolean;
  initialProps?: any;
  externalUrl?: string;
  description?: string;
  uri?: string; // For native app shortcuts
  widgetId?: WidgetComponentID;
}

export interface WindowState {
  id: AppID;
  title:string;
  Component: React.ComponentType<any>;
  position: { x: number; y: number };
  // FIX: Allow width and height to be strings to support viewport units for maximized windows.
  size: { width: number | string; height: number | string };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  previousPosition?: { x: number; y: number };
  // FIX: Allow previousSize to store string values from maximized states, matching the `size` property.
  previousSize?: { width: number | string; height: number | string };
  initialProps?: any;
}

export interface Notification {
  id: number;
  appId: AppID;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  duration: number;
  src: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  progress: number;
  currentTrack: MusicTrack;
  currentTime: number;
  togglePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  seek: (value: number) => void;
}

export interface ProxyConfig {
  name: string;
  url: string;
}

export interface CalendarEvent {
    id: number;
    text: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    notified?: boolean;
}

export interface Alarm {
    id: number;
    time: string; // HH:MM
    label: string;
    enabled: boolean;
    notifiedForToday?: boolean;
}

export interface HoustonMessage {
    sender: 'user' | 'houston';
    text: string;
    file?: { name: string; content: string };
}

export type WidgetComponentID = 'weather-widget' | 'stocks-widget' | 'news-widget' | 'calendar-widget' | 'clock-widget';

export interface WidgetConfig {
    id: WidgetComponentID;
    title: string;
    component: React.ComponentType<any>;
    defaultSize: { width: number, height: number };
}

export interface WidgetState {
    instanceId: string; // e.g., "weather-widget-1680386400000"
    widgetId: WidgetComponentID;
    position: { x: number; y: number };
}

export interface TabState {
  id: number;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  content: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Contact {
  id: string; // e.g., "contact-1680386400000"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarId: number; // Index for an array of predefined avatars
}

// --- VIRTUAL FILE SYSTEM ---

export type VFSNodeType = 'file' | 'directory' | 'app';

// FIX: Refactor VFSNode into a discriminated union to fix typing errors across the application.
// This base interface holds common properties. It is not exported to avoid confusion.
interface VFSNodeBase {
    id: string; // e.g., "Desktop" or "file-1680386400000"
    name: string; // e.g., "My Document.txt"
    type: VFSNodeType;
    meta?: {
        iconPosition?: { x: number; y: number };
        appId?: AppID; // For app shortcuts on desktop
    }
}

export interface VFSFile extends VFSNodeBase {
    type: 'file';
    content: string; // File content, e.g., text or a base64 data URL
}

export interface VFSDirectory extends VFSNodeBase {
    type: 'directory';
    children: Record<string, VFSNode>; // Map of child node IDs to nodes
}

export interface VFSApp extends VFSNodeBase {
    type: 'app';
    meta: {
        appId: AppID;
        iconPosition?: { x: number; y: number };
    }
}

// VFSNode is now a discriminated union of all possible node types.
export type VFSNode = VFSFile | VFSDirectory | VFSApp;

// A simple VFS structure, with the root being a directory
export type VFS = VFSDirectory;


// --- USER PROFILE ---
export interface UserProfileData {
    vfs: VFS;
    calendarEvents: Record<string, CalendarEvent[]>;
    houstonHistory: HoustonMessage[];
    maverickUrl: string;
    settings: {
        wallpaper: string;
        theme: 'light' | 'dark';
    };
    clockSettings: {
        use24Hour: boolean;
        timezones: string[];
        alarms: Alarm[];
    };
    installedExternalApps?: AppID[];
    installedLocalApps?: InstalledApp[];
    shortcuts: Shortcut[];
    widgets?: WidgetState[];
    contacts: Contact[];
    watchedStocks?: string[];
    lockedApps?: AppID[];
    appLockPasscode?: string | null;
    hiddenInDock?: AppID[];
    houstonModel?: '1.0' | '1.5' | '2.0-pro';
}

// --- WEATHER TYPES ---
export interface HourlyForecast {
    time: string; // e.g., "14:00"
    temp: number;
    emoji: string;
}

export interface DailyForecast {
    day: string; // e.g., "Tuesday"
    high: number;
    low: number;
    emoji: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  emoji: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// --- STOCKS TYPES ---
export interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// --- NEWS TYPES ---
export interface NewsArticle {
    title: string;
    source: string;
    summary: string;
}