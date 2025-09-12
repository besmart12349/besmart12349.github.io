
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import { SystemOverlay, WidgetPicker, WidgetContainer, WIDGETS } from './components/SystemOverlay';
import ContextMenu, { ContextMenuItem } from './components/ContextMenu';
import MissionControl from './components/MissionControl';
import Spotlight from './components/Spotlight';
import Launchpad from './components/Launchpad';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import ControlCenter from './components/ControlCenter';
import NotificationCenter from './components/NotificationCenter';
import NotificationToast from './components/NotificationToast';
import PasscodePrompt from './components/PasscodePrompt';
import { MusicProvider } from './contexts/MusicContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { APPS, EXTERNAL_APPS, API_CALL_LIMIT, SHORTCUT_ICONS, LOCAL_APP_COMPONENTS, LOCAL_APP_ICONS, createInitialVFS } from './constants';
import { loginOrCreateUser, saveUserProfile, createUser } from './services/userProfile';
import { saveGuestProfile, getGuestProfile, clearGuestProfile } from './services/localDbService';
import type { AppID, WindowState, AppConfig, Notification, UserProfileData, Shortcut, InstalledApp, WidgetState, WidgetComponentID, Contact, VFSNode, VFS, VFSDirectory, VFSFile, VFSApp } from './types';
import ApiMonitorWidget from './components/ApiMonitorWidget';
import Maverick from './apps/Maverick';
import { TerminalIcon } from './components/Icons';
import { isPersistenceConfigured } from './config';

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
  items: ContextMenuItem[];
}

interface PasscodePromptState {
  visible: boolean;
  action: 'set' | 'enter';
  appIdToUnlock?: AppID;
  onSuccess: (passcode: string) => void;
}


const WALLPAPERS = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1483728642387-6c351b40b7de?auto=format&fit=crop&w=1920&q=80',
];

// --- Hashing Utility ---
const hashPasscode = async (passcode: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- VFS UTILITY FUNCTIONS ---
const findVFSNode = (vfs: VFSDirectory, path: string): VFSNode | null => {
    if (path === '/') return vfs;
    const parts = path.split('/').filter(p => p);
    let currentNode: VFSNode = vfs;

    for (const part of parts) {
        if (currentNode.type !== 'directory') return null;
        const children = (currentNode as VFSDirectory).children;
        const nextNode = Object.values(children).find(c => c.name === part);
        if (!nextNode) return null;
        currentNode = nextNode;
    }
    return currentNode;
};


const findParentVFSNode = (vfs: VFSDirectory, path: string): VFSDirectory | null => {
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    return findVFSNode(vfs, parentPath || '/') as VFSDirectory | null;
}

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<AppID | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [systemAction, setSystemAction] = useState<'restart' | 'shutdown' | 'sleep' | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, visible: false, items: [] });
  const [isMissionControlActive, setMissionControlActive] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [isSpotlightVisible, setSpotlightVisible] = useState(false);
  const [isLaunchpadVisible, setLaunchpadVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isControlCenterVisible, setControlCenterVisible] = useState(false);
  const [isNotificationCenterVisible, setNotificationCenterVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [brightness, setBrightness] = useState(100);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [dockApps, setDockApps] = useState<AppConfig[]>([]);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Widget state
  const [widgets, setWidgets] = useState<WidgetState[]>([]);
  const [isWidgetPickerVisible, setWidgetPickerVisible] = useState(false);

  // App Lock State
  const [passcodePrompt, setPasscodePrompt] = useState<PasscodePromptState>({ visible: false, action: 'enter', onSuccess: () => {} });
  
  // Memoize guest profile data, as it depends on window size.
  const GUEST_PROFILE_DATA = useMemo<UserProfileData>(() => ({
    vfs: createInitialVFS(),
    calendarEvents: {},
    houstonHistory: [{ sender: 'houston', text: "Hello! I'm Houston, your AI assistant. How can I help you today?" }],
    maverickUrl: 'https://besmart12349.github.io/maverick2.github.io/',
    settings: { wallpaper: WALLPAPERS[3], theme: 'light' },
    installedExternalApps: [],
    installedLocalApps: [],
    shortcuts: [],
    widgets: [],
    contacts: [],
    watchedStocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
    lockedApps: [],
    appLockPasscode: null,
    hiddenInDock: [],
  }), []);

    // Memoize admin profile data
    const ADMIN_PROFILE_DATA = useMemo<UserProfileData>(() => ({
        ...GUEST_PROFILE_DATA,
        settings: { wallpaper: WALLPAPERS[5], theme: 'dark' },
        installedExternalApps: EXTERNAL_APPS.map(app => app.id),
    }), [GUEST_PROFILE_DATA]);

  // User State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfileData>(GUEST_PROFILE_DATA);
  
  // Combine built-in apps, installed external apps, and shortcuts
  const allApps = useMemo(() => {
      const installedAppsFromUserData = userData.installedExternalApps || [];
      const installedAppsConfigs = installedAppsFromUserData
          .map(appId => EXTERNAL_APPS.find(app => app.id === appId))
          .filter((app): app is AppConfig => !!app && !APPS.some(a => a.id === app.id));

      const shortcutApps: AppConfig[] = (userData.shortcuts || []).map(shortcut => ({
        id: shortcut.id,
        title: shortcut.title,
        icon: SHORTCUT_ICONS[shortcut.iconId] || TerminalIcon,
        uri: shortcut.uri,
        onDesktop: true,
        showInDock: false,
      }));

      const localApps: AppConfig[] = (userData.installedLocalApps || []).map(app => ({
        id: app.id,
        title: app.title,
        icon: LOCAL_APP_ICONS[app.iconId],
        component: LOCAL_APP_COMPONENTS[app.componentId],
        width: app.width,
        height: app.height,
        showInDock: true,
        onDesktop: false,
      }));

      return [...APPS, ...installedAppsConfigs, ...shortcutApps, ...localApps];
  }, [userData.installedExternalApps, userData.shortcuts, userData.installedLocalApps]);
  
  // Update dock apps when allApps or hiddenInDock changes
  useEffect(() => {
    const hidden = userData.hiddenInDock || [];
    setDockApps(allApps.filter(app => app.showInDock !== false && !hidden.includes(app.id)));
  }, [allApps, userData.hiddenInDock]);

  // --- API / Persistence Logic ---
  const updateUserProfile = useCallback(async (updates: Partial<UserProfileData>) => {
      const newData = { ...userData, ...updates };
      setUserData(newData);
      
      if (currentUser && currentUser !== 'admin') {
          await saveUserProfile(currentUser, newData);
      } else if (!currentUser) { // Guest user
          await saveGuestProfile(newData);
      }
  }, [userData, currentUser]);
  
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'icon'>) => {
    const newId = Date.now();
    const appConfig = allApps.find(app => app.id === notificationData.appId);
    if (!appConfig) return;

    const newNotification: Notification = { ...notificationData, id: newId, icon: appConfig.icon };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    setToasts(prev => [...prev, newNotification]);
    setTimeout(() => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== newId));
    }, 5000);
  }, [allApps]);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  // Calendar Notification Checker
  useEffect(() => {
    const notificationTimer = setInterval(() => {
        if (!isLoggedIn) return;

        const now = new Date();
        const currentDateKey = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().substring(0, 5); // HH:MM

        const eventsForToday = userData.calendarEvents?.[currentDateKey] || [];
        if (eventsForToday.length === 0) return;

        let needsUpdate = false;
        const updatedEventsForToday = eventsForToday.map(event => {
            if (event.time === currentTime && !event.notified) {
                console.log(`Sending notification for event: ${event.text}`);
                addNotification({
                    appId: 'calendar',
                    title: 'Calendar Event Reminder',
                    message: `${event.time}: ${event.text}`
                });
                needsUpdate = true;
                return { ...event, notified: true };
            }
            return event;
        });

        if (needsUpdate) {
            const newCalendarEvents = {
                ...userData.calendarEvents,
                [currentDateKey]: updatedEventsForToday
            };
            updateUserProfile({ calendarEvents: newCalendarEvents });
        }
    }, 60000); // Check every minute

    return () => clearInterval(notificationTimer);
  }, [isLoggedIn, userData.calendarEvents, addNotification, updateUserProfile]);


  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
    }
    setInstallPrompt(null);
  };

  // One-time setup on app load
  useEffect(() => {
    let interval: number;

    const initializeApp = async () => {
      const guestProfile = await getGuestProfile();
      if (guestProfile) {
        console.log("Found saved guest session. Restoring...");
        setUserData(guestProfile);
        setIsLoggedIn(true);
        setCurrentUser(null);
      }

      interval = window.setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 500);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
    };

    initializeApp();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
  
  useEffect(() => {
    if (userData.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userData.settings.theme]);
  
  useEffect(() => {
    if (isLoggedIn) {
        setWidgets(userData.widgets || []);
    }
  }, [isLoggedIn, userData.widgets]);
  
  const handleInstallApp = useCallback((appId: AppID) => {
      const currentInstalled = userData.installedExternalApps || [];
      if (currentInstalled.includes(appId)) return;

      const appConfig = EXTERNAL_APPS.find(app => app.id === appId);
      if (!appConfig) return;

      updateUserProfile({ installedExternalApps: [...currentInstalled, appId] });

      addNotification({
          appId: 'app-store',
          title: 'App Installed',
          message: `${appConfig.title} has been added to your system.`
      });
  }, [addNotification, updateUserProfile, userData.installedExternalApps]);

  const handleInstallLocalApp = useCallback((appManifest: InstalledApp) => {
    const currentInstalled = userData.installedLocalApps || [];
    if (currentInstalled.some(app => app.id === appManifest.id)) {
        addNotification({
            appId: 'finder',
            title: 'Installation Failed',
            message: `${appManifest.title} is already installed.`
        });
        return;
    }

    if (!LOCAL_APP_COMPONENTS[appManifest.componentId] || !LOCAL_APP_ICONS[appManifest.iconId]) {
         addNotification({
            appId: 'finder',
            title: 'Installation Failed',
            message: `The app manifest for ${appManifest.title} is invalid or corrupted.`
        });
        return;
    }

    updateUserProfile({ installedLocalApps: [...currentInstalled, appManifest] });

    addNotification({
        appId: 'finder',
        title: 'App Installed',
        message: `${appManifest.title} has been installed successfully.`
    });
  }, [addNotification, updateUserProfile, userData.installedLocalApps]);

  // --- Auth Logic ---
  const handleLogin = useCallback(async (credentials?: { arsisId: string }): Promise<{ success: boolean; error?: string }> => {
    if (credentials?.arsisId === 'admin') {
        console.log("Admin login detected.");
        await clearGuestProfile();
        setUserData(ADMIN_PROFILE_DATA);
        setIsLoggedIn(true);
        setCurrentUser('admin');
        return { success: true };
    }

    if (!credentials?.arsisId) { // Guest login
        const freshGuestProfile = GUEST_PROFILE_DATA;
        setUserData(freshGuestProfile);
        await saveGuestProfile(freshGuestProfile);
        setIsLoggedIn(true);
        setCurrentUser(null);
        return { success: true };
    }
    
    if (!isPersistenceConfigured) {
        addNotification({
            appId: 'defense-ios',
            title: 'Temporary Session',
            message: 'Remote storage is not configured. Your session will not be saved.',
        });
    }
    
    await clearGuestProfile();
    const userProfileData = await loginOrCreateUser(credentials.arsisId, GUEST_PROFILE_DATA);

    if (isPersistenceConfigured) {
        setCurrentUser(credentials.arsisId);
    } else {
        setCurrentUser(null);
    }

    setUserData(userProfileData);
    setIsLoggedIn(true);
    return { success: true };
  }, [GUEST_PROFILE_DATA, ADMIN_PROFILE_DATA, addNotification]);

  const handleCreateUserFromGuest = useCallback(async (newId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isPersistenceConfigured) {
        addNotification({
            appId: 'defense-ios',
            title: 'Creation Failed',
            message: 'Remote storage is not configured. Cannot create account.',
        });
        return { success: false, error: 'Remote storage is not configured.' };
    }

    const result = await createUser(newId, userData);

    if (result.success) {
        await clearGuestProfile();
        setCurrentUser(newId);
        addNotification({
            appId: 'arsis-id',
            title: 'Account Created!',
            message: `Your session has been successfully saved to Arsis ID: ${newId}`
        });
    }
    
    return result;

  }, [userData, addNotification]);

  const handleLogOut = useCallback(async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserData(GUEST_PROFILE_DATA);
    setWindows([]);
    setActiveWindow(null);
    setNotifications([]);
    setToasts([]);
    setWidgets([]);
    setApiCallCount(0);
    setMissionControlActive(false);
    setSpotlightVisible(false);
    setLaunchpadVisible(false);
    setControlCenterVisible(false);
    setNotificationCenterVisible(false);
    setContextMenu(prev => ({ ...prev, visible: false }));
    setWidgetPickerVisible(false);
    await clearGuestProfile();
  }, [GUEST_PROFILE_DATA]);

  const toggleTheme = () => {
    updateUserProfile({ settings: { ...userData.settings, theme: userData.settings.theme === 'light' ? 'dark' : 'light' } });
  };
  
  const setWallpaper = (url: string) => {
    updateUserProfile({ settings: { ...userData.settings, wallpaper: url } });
  }

  const incrementApiCallCount = useCallback(() => {
    setApiCallCount(prev => prev + 1);
  }, []);

  // --- VFS Handlers ---
  const handleVFSUpdate = (newVfs: VFS) => {
      updateUserProfile({ vfs: newVfs });
  };

  const handleCreateNode = (parentPath: string, name: string, type: 'file' | 'directory', content = '') => {
      const newVfs = JSON.parse(JSON.stringify(userData.vfs));
      const parentNode = findVFSNode(newVfs, parentPath) as VFSDirectory;
      if (!parentNode || parentNode.type !== 'directory') return;

      const newNodeId = `${type}-${Date.now()}`;
      const newNode: VFSNode = type === 'file'
          ? { id: newNodeId, name, type, content }
          : { id: newNodeId, name, type, children: {} };

      parentNode.children[newNodeId] = newNode;
      handleVFSUpdate(newVfs);
  };
  
  const handleUpdateNodeContent = (path: string, content: string) => {
      const newVfs = JSON.parse(JSON.stringify(userData.vfs));
      const node = findVFSNode(newVfs, path) as VFSFile;
      if (!node || node.type !== 'file') return;

      node.content = content;
      handleVFSUpdate(newVfs);
  };
  
  const handleDeleteNode = (path: string) => {
      const newVfs = JSON.parse(JSON.stringify(userData.vfs));
      const parentNode = findParentVFSNode(newVfs, path);
      const nodeToDelete = findVFSNode(newVfs, path);
      if (!parentNode || !nodeToDelete) return;

      delete parentNode.children[nodeToDelete.id];
      handleVFSUpdate(newVfs);
  };

  const handleRenameNode = (path: string, newName: string) => {
      const newVfs = JSON.parse(JSON.stringify(userData.vfs));
      const node = findVFSNode(newVfs, path);
      if (!node) return;

      // Check for name collision
      const parent = findParentVFSNode(newVfs, path);
      if (parent && Object.values(parent.children).some(child => child.name === newName && child.id !== node.id)) {
        addNotification({ appId: 'finder', title: 'Rename Failed', message: `An item named "${newName}" already exists here.`});
        return;
      }

      node.name = newName;
      handleVFSUpdate(newVfs);
  };
  
  const handleIconPositionChange = (id: string, newPosition: { x: number; y: number }) => {
    const newVfs = JSON.parse(JSON.stringify(userData.vfs));
    const desktopNode = findVFSNode(newVfs, '/Desktop') as VFSDirectory;
    if (!desktopNode) return;
    
    const node = desktopNode.children[id];
    if (node) {
        if (!node.meta) node.meta = {};
        node.meta.iconPosition = newPosition;
        handleVFSUpdate(newVfs);
    }
  };

  // --- Widget Handlers ---
  const handleWidgetPositionChange = (instanceId: string, newPosition: { x: number, y: number }) => {
    const newWidgets = widgets.map(w => w.instanceId === instanceId ? { ...w, position: newPosition } : w);
    setWidgets(newWidgets);
    updateUserProfile({ widgets: newWidgets });
  };

  const addWidget = (widgetId: WidgetComponentID) => {
    const newWidget: WidgetState = {
        widgetId,
        instanceId: `${widgetId}-${Date.now()}`,
        position: { x: 20, y: 120 + widgets.length * 40 },
    };
    const newWidgets = [...widgets, newWidget];
    setWidgets(newWidgets);
    updateUserProfile({ widgets: newWidgets });
    setWidgetPickerVisible(false);
  };

  const removeWidget = (instanceId: string) => {
    const newWidgets = widgets.filter(w => w.instanceId !== instanceId);
    setWidgets(newWidgets);
    updateUserProfile({ widgets: newWidgets });
  };
  
  // --- App Lock Handlers ---
  const handleSetPasscode = async (passcode: string) => {
      const hashed = await hashPasscode(passcode);
      updateUserProfile({ appLockPasscode: hashed });
      setPasscodePrompt({ visible: false, action: 'set', onSuccess: () => {} });
      addNotification({ appId: 'defense-ios', title: 'Security', message: 'App Lock passcode has been set.' });
  };

  const handleToggleAppLock = (appId: AppID) => {
    const lockAction = () => {
      const currentLocked = userData.lockedApps || [];
      const isLocked = currentLocked.includes(appId);
      const newLocked = isLocked ? currentLocked.filter(id => id !== appId) : [...currentLocked, appId];
      updateUserProfile({ lockedApps: newLocked });
    };

    if (!userData.appLockPasscode) {
      setPasscodePrompt({
        visible: true,
        action: 'set',
        onSuccess: (passcode) => {
          handleSetPasscode(passcode).then(() => {
            // After setting the passcode, proceed to lock the app
            const currentLocked = userData.lockedApps || [];
            updateUserProfile({ lockedApps: [...currentLocked, appId] });
          });
        }
      });
    } else {
      lockAction();
    }
  };
  
  // --- App Management ---
  const openApp = useCallback((appId: AppID, initialProps: any = {}) => {
    setLaunchpadVisible(false);
    setSpotlightVisible(false);

    // App Lock Check
    if ((userData.lockedApps || []).includes(appId)) {
        setPasscodePrompt({
            visible: true,
            action: 'enter',
            appIdToUnlock: appId,
            onSuccess: async (passcode) => {
                const hashed = await hashPasscode(passcode);
                if (hashed === userData.appLockPasscode) {
                    setPasscodePrompt({ visible: false, action: 'enter', onSuccess: () => {} });
                    openApp(appId, initialProps); // Re-call openApp, this time it will pass the lock check
                } else {
                    addNotification({ appId: 'defense-ios', title: 'Access Denied', message: 'Incorrect passcode.'});
                }
            }
        });
        // This is a bit of a hack: remove the app from locked list temporarily to allow the recursive call to pass
        // A better solution might involve a temporary "unlocked" state list. For now, this works.
        const originalLockedApps = userData.lockedApps;
        setUserData(d => ({...d, lockedApps: (d.lockedApps || []).filter(id => id !== appId) }));
        // Restore lock after a short delay in case user cancels prompt.
        setTimeout(() => {
            setUserData(d => ({...d, lockedApps: originalLockedApps }));
        }, 1000); 
        return;
    }


    let effectiveAppId = appId;
    const appConfig = allApps.find(app => app.id === effectiveAppId);
    if (!appConfig) return;

    if (appConfig.uri) {
      window.location.href = appConfig.uri;
      addNotification({ appId: 'shortcuts', title: 'Launching Shortcut', message: `Attempting to open ${appConfig.title}...` });
      return;
    }
    
    // VFS file opening logic
    if (initialProps.filePath) {
        const fileNode = findVFSNode(userData.vfs, initialProps.filePath) as VFSFile;
        if (!fileNode) {
            addNotification({ appId: 'finder', title: 'Error', message: 'File not found.' });
            return;
        }
        if (fileNode.name.endsWith('.txt') || fileNode.name.endsWith('.md')) {
            effectiveAppId = 'pages'; // Override to open with Pages
        } else if (fileNode.name.endsWith('.arsapp')) {
            try {
                const manifest = JSON.parse(fileNode.content);
                handleInstallLocalApp(manifest);
            } catch (e) {
                addNotification({ appId: 'finder', title: 'Installation Error', message: 'The selected file is not a valid app manifest.' });
            }
            return; // Don't open a window, just run the installer.
        }
    }
    
    const finalAppConfig = allApps.find(app => app.id === effectiveAppId)!;

    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(win => win.id === effectiveAppId);
      
      const AppComponent = finalAppConfig.externalUrl ? Maverick : finalAppConfig.component;
      if (!AppComponent) return currentWindows;

      if (existingWindow && !initialProps.filePath) { // Don't focus if opening new file
        setActiveWindow(effectiveAppId);
        return currentWindows.map(win => win.id === effectiveAppId ? { ...win, zIndex: nextZIndex, isMinimized: false } : win);
      } else {
        const appSpecificProps: any = {};
        
        const vfsProps = {
            vfs: userData.vfs,
            onCreateNode: handleCreateNode,
            onUpdateNodeContent: handleUpdateNodeContent,
            onDeleteNode: handleDeleteNode,
            onRenameNode: handleRenameNode
        };

        if(finalAppConfig.externalUrl) {
            appSpecificProps.initialUrl = finalAppConfig.externalUrl;
            appSpecificProps.onApiCall = incrementApiCallCount;
            appSpecificProps.onUrlChange = () => {};
            appSpecificProps.onTitleChange = () => {};
        } else if (finalAppConfig.id === 'settings') {
          appSpecificProps.onWallpaperSelect = setWallpaper;
          appSpecificProps.wallpapers = WALLPAPERS;
          appSpecificProps.theme = userData.settings.theme;
          appSpecificProps.onThemeToggle = toggleTheme;
        } else if (['houston', 'imaginarium', 'weather', 'defense-ios', 'news'].includes(finalAppConfig.id)) {
          appSpecificProps.onApiCall = incrementApiCallCount;
          appSpecificProps.addNotification = addNotification;
        } else if (finalAppConfig.id === 'maverick') {
            appSpecificProps.onApiCall = incrementApiCallCount;
            appSpecificProps.initialUrl = userData.maverickUrl;
            appSpecificProps.onUrlChange = (maverickUrl: string) => updateUserProfile({ maverickUrl });
            appSpecificProps.onTitleChange = (newTitle: string) => {
              setWindows(wins => wins.map(w => w.id === 'maverick' ? {...w, title: newTitle } : w));
            };
        } else if (finalAppConfig.id === 'finder') {
            appSpecificProps.openApp = openApp;
            appSpecificProps.onOpenFile = (filePath: string) => openApp('finder', { filePath });
            Object.assign(appSpecificProps, vfsProps);
        } else if (finalAppConfig.id === 'pages') {
            Object.assign(appSpecificProps, vfsProps, { onApiCall: incrementApiCallCount });
        } else if (finalAppConfig.id === 'photo-booth') {
             Object.assign(appSpecificProps, vfsProps);
        } else if (finalAppConfig.id === 'imaginarium') {
             Object.assign(appSpecificProps, { onCreateNode: handleCreateNode });
        } else if (finalAppConfig.id === 'contacts') {
            appSpecificProps.savedContacts = userData.contacts;
            appSpecificProps.onSaveContacts = (contacts: Contact[]) => updateUserProfile({ contacts });
        } else if (finalAppConfig.id === 'houston') {
            appSpecificProps.history = userData.houstonHistory;
            appSpecificProps.onHistoryChange = (houstonHistory: any) => updateUserProfile({ houstonHistory });
        } else if (finalAppConfig.id === 'calendar') {
            appSpecificProps.savedEvents = userData.calendarEvents;
            appSpecificProps.onSaveEvents = (calendarEvents: any) => updateUserProfile({ calendarEvents });
        } else if (finalAppConfig.id === 'arsis-id') {
            appSpecificProps.currentUser = currentUser;
            appSpecificProps.onCreateUserFromGuest = handleCreateUserFromGuest;
        } else if (finalAppConfig.id === 'app-store') {
            appSpecificProps.installedApps = userData.installedExternalApps || [];
            appSpecificProps.onInstall = handleInstallApp;
            appSpecificProps.onOpen = openApp;
        } else if (finalAppConfig.id === 'shortcuts') {
            appSpecificProps.savedShortcuts = userData.shortcuts;
            appSpecificProps.onSaveShortcuts = (shortcuts: Shortcut[]) => updateUserProfile({ shortcuts });
        } else if (finalAppConfig.id === 'stocks') {
            appSpecificProps.watchedStocks = userData.watchedStocks || [];
            appSpecificProps.onWatchlistChange = (watchedStocks: string[]) => updateUserProfile({ watchedStocks });
            appSpecificProps.onApiCall = incrementApiCallCount;
        }
        
        const newWindow: WindowState = {
          id: initialProps.filePath ? `${effectiveAppId}-${Date.now()}` : effectiveAppId,
          title: initialProps.filePath ? findVFSNode(userData.vfs, initialProps.filePath)?.name || finalAppConfig.title : finalAppConfig.title,
          Component: AppComponent,
          position: { x: window.innerWidth / 2 - (finalAppConfig.width || 800) / 2, y: window.innerHeight / 2 - (finalAppConfig.height || 600) / 2 },
          size: { width: finalAppConfig.width || 800, height: finalAppConfig.height || 600 },
          zIndex: nextZIndex,
          isMinimized: false,
          isMaximized: false,
          initialProps: { ...appSpecificProps, ...initialProps }
        };

        setActiveWindow(newWindow.id);
        setNextZIndex(prev => prev + 1);
        return [...currentWindows, newWindow];
      }
    });
  }, [allApps, nextZIndex, incrementApiCallCount, userData, toggleTheme, updateUserProfile, addNotification, handleInstallLocalApp, currentUser, setWallpaper, handleCreateUserFromGuest]);

  const closeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.filter(win => win.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  }, [activeWindow]);

  const focusApp = useCallback((id: AppID) => {
    if (activeWindow !== id) {
      setActiveWindow(id);
      setWindows(currentWindows => currentWindows.map(win =>
        win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win
      ));
      setNextZIndex(prev => prev + 1);
    }
  }, [activeWindow, nextZIndex]);
  
  const minimizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.map(win =>
      win.id === id ? { ...win, isMinimized: true } : win
    ));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  }, [activeWindow]);

  const maximizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.map(win => {
      if (win.id !== id) return win;

      if (win.isMaximized) {
        return {
          ...win,
          isMaximized: false,
          position: win.previousPosition || { x: 100, y: 100 },
          size: win.previousSize || { width: 800, height: 600 },
        };
      } else {
        return {
          ...win,
          isMaximized: true,
          previousPosition: win.position,
          previousSize: win.size,
          position: { x: 0, y: 28 }, // Top bar height
          size: { width: '100vw', height: 'calc(100vh - 28px - 88px)' }, // Fullscreen minus topbar and dock
        };
      }
    }));
    focusApp(id);
  }, [focusApp]);
  
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };
  
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu(); // Close any existing menu
    setContextMenu({
        x: e.clientX,
        y: e.clientY,
        visible: true,
        items: [
            { label: 'Change Background...', action: () => openApp('settings') },
            { type: 'divider' },
            { label: 'Add Widget...', action: () => setWidgetPickerVisible(true) },
        ]
    });
  };
  
  const handleToggleDockVisibility = (appId: AppID) => {
    const currentHidden = userData.hiddenInDock || [];
    const isHidden = currentHidden.includes(appId);
    const newHidden = isHidden ? currentHidden.filter(id => id !== appId) : [...currentHidden, appId];
    updateUserProfile({ hiddenInDock: newHidden });
  };
  
  const handleAppIconContextMenu = (e: React.MouseEvent, node: VFSApp) => {
      e.preventDefault();
      e.stopPropagation();
      closeContextMenu();
      
      const { appId } = node.meta;
      const appConfig = allApps.find(app => app.id === appId);
      if (!appConfig) return;

      const isRunning = windows.some(win => win.id === appId);
      const isHidden = (userData.hiddenInDock || []).includes(appId);
      
      const menuItems: ContextMenuItem[] = [];

      if (isRunning) {
          menuItems.push({ label: 'Force Quit', action: () => closeApp(appId) });
      }
      
      // Don't allow locking/hiding finder
      if (appId !== 'finder') {
          menuItems.push({ label: (userData.lockedApps || []).includes(appId) ? 'Unlock' : 'Lock', action: () => handleToggleAppLock(appId) });
           if (appConfig.showInDock !== false) {
             menuItems.push({ label: isHidden ? 'Show in Dock' : 'Hide in Dock', action: () => handleToggleDockVisibility(appId) });
           }
      }
      
      if (appConfig.widgetId) {
          menuItems.push({ type: 'divider' });
          menuItems.push({ label: 'Add Widget', action: () => addWidget(appConfig.widgetId!) });
      }

      setContextMenu({
          x: e.clientX,
          y: e.clientY,
          visible: true,
          items: menuItems
      });
  };


  const handleRestart = () => setSystemAction('restart');
  const handleShutdown = () => setSystemAction('shutdown');
  const handleSleep = () => setSystemAction('sleep');
  const handleWakeUp = () => setSystemAction(null);

  const toggleMissionControl = () => setMissionControlActive(prev => !prev);
  const toggleSpotlight = () => setSpotlightVisible(prev => !prev);
  const toggleLaunchpad = () => setLaunchpadVisible(prev => !prev);

  const toggleControlCenter = () => {
    setNotificationCenterVisible(false);
    setControlCenterVisible(prev => !prev);
  };
  const toggleNotificationCenter = () => {
    setControlCenterVisible(false);
    setNotificationCenterVisible(prev => !prev);
  };

  const closeSystemMenus = () => {
    setControlCenterVisible(false);
    setNotificationCenterVisible(false);
    closeContextMenu();
  }
  
  const desktopItems = useMemo(() => {
    const desktopNode = findVFSNode(userData.vfs, '/Desktop') as VFSDirectory;
    if (!desktopNode || desktopNode.type !== 'directory') return [];
    
    return Object.values(desktopNode.children).map(node => {
        const isApp = node.type === 'app';
        const appId = isApp ? (node as VFSApp).meta.appId : 'finder';
        const appConfig = allApps.find(app => app.id === appId);

        return {
            id: node.id,
            title: node.name,
            IconComponent: appConfig?.icon || TerminalIcon,
            position: node.meta?.iconPosition || { x: 50, y: 50 },
            onOpen: () => isApp 
                ? openApp((node as VFSApp).meta.appId) 
                : openApp('finder', { filePath: `/Desktop/${node.name}` }),
            onContextMenu: isApp ? (e: React.MouseEvent) => handleAppIconContextMenu(e, node as VFSApp) : undefined
        };
    });
  }, [userData.vfs, allApps, openApp]);

  // --- Render logic ---
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  if (systemAction) {
    return <SystemOverlay action={systemAction} onWakeUp={handleWakeUp} />;
  }

  return (
    <SecurityProvider>
      <MusicProvider>
        <div 
          className="w-screen h-screen bg-cover bg-center overflow-hidden" 
          style={{ backgroundImage: `url(${userData.settings.wallpaper})` }}
          onClick={closeSystemMenus}
          onContextMenu={handleDesktopContextMenu}
        >
          {!isLoggedIn ? (
            <LoginScreen onLogin={handleLogin} />
          ) : (
            <>
              <TopBar
                activeAppName={windows.find(win => win.id === activeWindow)?.title || 'Desktop'}
                onAboutClick={() => openApp('about')}
                onRestart={handleRestart}
                onShutdown={handleShutdown}
                onSleep={handleSleep}
                onLogOut={handleLogOut}
                onHoustonClick={() => openApp('houston')}
                onMissionControlToggle={toggleMissionControl}
                onSpotlightToggle={toggleSpotlight}
                onControlCenterToggle={toggleControlCenter}
                onNotificationCenterToggle={toggleNotificationCenter}
                isInstallable={!!installPrompt}
                onInstallClick={handleInstallClick}
              />
              
              {desktopItems.map(item => (
                  <DesktopIcon
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    IconComponent={item.IconComponent}
                    onOpen={item.onOpen}
                    initialPosition={item.position}
                    onPositionChange={(newPosition) => handleIconPositionChange(item.id, newPosition)}
                    onContextMenu={item.onContextMenu}
                  />
              ))}
              
              {widgets.map(widget => {
                  const widgetConfig = WIDGETS.find(w => w.id === widget.widgetId);
                  if (!widgetConfig) return null;
                  const WidgetComponent = widgetConfig.component;
                  return (
                      <WidgetContainer
                          key={widget.instanceId}
                          instanceId={widget.instanceId}
                          position={widget.position}
                          size={widgetConfig.defaultSize}
                          onPositionChange={(newPos) => handleWidgetPositionChange(widget.instanceId, newPos)}
                          onRemove={removeWidget}
                      >
                          <WidgetComponent userData={userData} />
                      </WidgetContainer>
                  )
              })}
              
              {windows.map(win => (
                <Window
                  key={win.id}
                  id={win.id}
                  title={win.title}
                  position={win.position}
                  size={win.size}
                  zIndex={win.zIndex}
                  isActive={win.id === activeWindow}
                  isMinimized={win.isMinimized}
                  isMaximized={win.isMaximized}
                  onClose={() => closeApp(win.id)}
                  onFocus={() => focusApp(win.id)}
                  onMinimize={() => minimizeApp(win.id)}
                  onMaximize={() => maximizeApp(win.id)}
                >
                  <win.Component {...win.initialProps} />
                </Window>
              ))}

              <Dock
                apps={dockApps}
                setApps={setDockApps}
                onAppClick={(id) => openApp(id)}
                onLaunchpadClick={toggleLaunchpad}
                windows={windows}
                lockedApps={userData.lockedApps || []}
                onToggleLock={handleToggleAppLock}
              />

              <ApiMonitorWidget
                apiCallCount={apiCallCount}
                limit={API_CALL_LIMIT}
                initialPosition={{ x: 20, y: 40 }}
              />

              {isMissionControlActive && (
                <MissionControl
                  windows={windows.filter(w => !w.isMinimized)}
                  onSelectWindow={(id) => {
                    focusApp(id as AppID);
                    setMissionControlActive(false);
                  }}
                  onClose={() => setMissionControlActive(false)}
                />
              )}
              
              {isSpotlightVisible && (
                  <Spotlight 
                    onClose={() => setSpotlightVisible(false)} 
                    onAppSelect={(id) => openApp(id)}
                    allApps={allApps}
                  />
              )}

              {isLaunchpadVisible && (
                  <Launchpad 
                    onClose={() => setLaunchpadVisible(false)}
                    onAppSelect={(id) => openApp(id)}
                    wallpaperUrl={userData.settings.wallpaper}
                    allApps={allApps}
                  />
              )}
              
              {passcodePrompt.visible && (
                <PasscodePrompt
                    action={passcodePrompt.action}
                    onClose={() => setPasscodePrompt(p => ({ ...p, visible: false }))}
                    onConfirm={passcodePrompt.onSuccess}
                    appName={passcodePrompt.appIdToUnlock ? allApps.find(a => a.id === passcodePrompt.appIdToUnlock)?.title : undefined}
                />
              )}

              <ControlCenter
                visible={isControlCenterVisible}
                onClose={() => setControlCenterVisible(false)}
                brightness={brightness}
                onBrightnessChange={setBrightness}
                wifiOn={wifiOn}
                onWifiToggle={() => setWifiOn(prev => !prev)}
                bluetoothOn={bluetoothOn}
                onBluetoothToggle={() => setBluetoothOn(prev => !prev)}
              />

              <NotificationCenter
                visible={isNotificationCenterVisible}
                notifications={notifications}
                onClear={() => setNotifications([])}
              />
              
              <WidgetPicker
                visible={isWidgetPickerVisible}
                onClose={() => setWidgetPickerVisible(false)}
                onAddWidget={addWidget}
              />

              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                visible={contextMenu.visible}
                items={contextMenu.items}
                onClose={closeContextMenu}
              />
              
              <div className="absolute top-8 right-4 space-y-2 z-[70]">
                  {toasts.map(toast => <NotificationToast key={toast.id} notification={toast} />)}
              </div>
            </>
          )}
        </div>
      </MusicProvider>
    </SecurityProvider>
  );
};

export default App;