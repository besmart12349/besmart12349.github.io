
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import SystemOverlay from './components/SystemOverlay';
import ContextMenu from './components/ContextMenu';
import MissionControl from './components/MissionControl';
import Spotlight from './components/Spotlight';
import Launchpad from './components/Launchpad';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import ControlCenter from './components/ControlCenter';
import NotificationCenter from './components/NotificationCenter';
import NotificationToast from './components/NotificationToast';
import { MusicProvider } from './contexts/MusicContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { APPS, EXTERNAL_APPS, API_CALL_LIMIT, SHORTCUT_ICONS, LOCAL_APP_COMPONENTS, LOCAL_APP_ICONS } from './constants';
import type { AppID, WindowState, AppConfig, Notification, UserProfile, UserProfileData, ArsisIdCredentials, DesktopItem, Shortcut, InstalledApp } from './types';
import ApiMonitorWidget from './components/ApiMonitorWidget';
import Maverick from './apps/Maverick';
import { TerminalIcon } from './components/Icons';

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1483728642387-6c351b40b7de?auto=format&fit=crop&w=1920&q=80',
];

const GUEST_PROFILE_DATA: UserProfileData = {
    desktopItems: APPS.filter(app => app.onDesktop).map((app, index) => ({
      id: app.id,
      position: { x: window.innerWidth - 120, y: 40 + index * 110 }
    })),
    pages: [{ id: 1, title: 'Welcome Page', content: '<h1>Welcome to ArsisOS!</h1><p>This is a temporary page for your guest session. Create an <b>Arsis ID</b> to save your work!</p><p>Try the new Houston AI assistant integrated into Pages to help you write.</p>' }],
    calendarEvents: {},
    photos: [],
    houstonHistory: [{ sender: 'houston', text: "Hello! I'm Houston, your AI assistant. How can I help you today?" }],
    maverickUrl: 'https://www.wikipedia.org/',
    settings: { wallpaper: WALLPAPERS[3], theme: 'light' },
    installedExternalApps: [],
    installedLocalApps: [],
    shortcuts: [],
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<AppID | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [systemAction, setSystemAction] = useState<'restart' | 'shutdown' | 'sleep' | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, visible: false });
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
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const [dockApps, setDockApps] = useState<AppConfig[]>([]);

  // User State
  const [authToken, setAuthToken] = useState<string | null>(null);
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
  
  // Update dock apps when allApps changes
  useEffect(() => {
      setDockApps(allApps.filter(app => app.showInDock !== false));
  }, [allApps]);

  // --- API / Persistence Logic ---
  const updateUserProfile = useCallback(async (updates: Partial<UserProfileData>) => {
      const newData = { ...userData, ...updates };
      setUserData(newData);
      
      if (authToken) {
          try {
              // In a real app, you'd send this to your server
              console.log('User profile updated on server (mock).', newData);
              const storedProfileStr = localStorage.getItem(`arsis-user-${authToken.replace('mock-jwt-for-','')}`);
              if (storedProfileStr) {
                  const userProfile: UserProfile = JSON.parse(storedProfileStr);
                  userProfile.data = newData;
                  localStorage.setItem(`arsis-user-${userProfile.credentials.username}`, JSON.stringify(userProfile));
              }
          } catch (error) {
              console.error("Failed to update user profile on server:", error);
          }
      }
  }, [userData, authToken]);
  
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

  useEffect(() => {
    // Pre-seed admin user 'brennan'
    const brennanUsername = 'brennan';
    if (!localStorage.getItem(`arsis-user-${brennanUsername}`)) {
      const brennanProfile: UserProfile = {
        credentials: {
          username: brennanUsername,
          hash: btoa('820210153'), // btoa('351012028'.split('').reverse().join(''))
        },
        data: GUEST_PROFILE_DATA,
      };
      localStorage.setItem(`arsis-user-${brennanUsername}`, JSON.stringify(brennanProfile));
      console.log('Admin user "brennan" has been created.');
    }

    // Pre-seed hidden admin user 'admin'
    const adminUsername = 'admin';
    if (!localStorage.getItem(`arsis-user-${adminUsername}`)) {
        const adminProfile: UserProfile = {
            credentials: {
                username: adminUsername,
                hash: btoa('nimda'), // btoa('admin'.split('').reverse().join(''))
            },
            data: GUEST_PROFILE_DATA,
        };
        localStorage.setItem(`arsis-user-${adminUsername}`, JSON.stringify(adminProfile));
        console.log('Hidden admin user "admin" has been created.');
    }
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30); 
    return () => clearInterval(interval);
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
        setDesktopItems(userData.desktopItems || []);
    }
  }, [isLoggedIn, userData.desktopItems]);
  
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
            appId: 'my-docs',
            title: 'Installation Failed',
            message: `${appManifest.title} is already installed.`
        });
        return;
    }

    // Basic validation
    if (!LOCAL_APP_COMPONENTS[appManifest.componentId] || !LOCAL_APP_ICONS[appManifest.iconId]) {
         addNotification({
            appId: 'my-docs',
            title: 'Installation Failed',
            message: `The app manifest for ${appManifest.title} is invalid or corrupted.`
        });
        return;
    }

    updateUserProfile({ installedLocalApps: [...currentInstalled, appManifest] });

    addNotification({
        appId: 'my-docs',
        title: 'App Installed',
        message: `${appManifest.title} has been installed successfully.`
    });
  }, [addNotification, updateUserProfile, userData.installedLocalApps]);

  // --- Auth Logic ---
  const handleLogin = useCallback(async (credentials?: { username: string, password?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!credentials) { // Guest login
        setUserData(GUEST_PROFILE_DATA);
        setIsLoggedIn(true);
        setAuthToken(null);
        return { success: true };
    }
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency
    
    const storedProfileStr = localStorage.getItem(`arsis-user-${credentials.username}`);
    if (storedProfileStr) {
        const userProfile: UserProfile = JSON.parse(storedProfileStr);
        const passwordMatches = atob(userProfile.credentials.hash).split('').reverse().join('') === credentials.password;
        if(passwordMatches) {
            setAuthToken(`mock-jwt-for-${userProfile.credentials.username}`);
            // Ensure new fields from GUEST_PROFILE_DATA are added to older profiles
            setUserData({ ...GUEST_PROFILE_DATA, ...userProfile.data });
            setIsLoggedIn(true);
            return { success: true };
        }
    }

    return { success: false, error: 'Invalid username or password.' };
  }, []);

  const handleCreateUser = useCallback(async (credentials: ArsisIdCredentials): Promise<{ success: boolean; error?: string }> => {
    await new Promise(res => setTimeout(res, 500)); 
    if (localStorage.getItem(`arsis-user-${credentials.username}`)) {
      return { success: false, error: 'Username already exists.' };
    }
    const newUserProfile: UserProfile = { credentials, data: GUEST_PROFILE_DATA };
    localStorage.setItem(`arsis-user-${credentials.username}`, JSON.stringify(newUserProfile));
    
    return { success: true };
  }, []);

  const toggleTheme = () => {
    updateUserProfile({ settings: { ...userData.settings, theme: userData.settings.theme === 'light' ? 'dark' : 'light' } });
  };
  
  const setWallpaper = (url: string) => {
    updateUserProfile({ settings: { ...userData.settings, wallpaper: url } });
  }

  const incrementApiCallCount = useCallback(() => {
    setApiCallCount(prev => prev + 1);
  }, []);

  const handleIconPositionChange = (id: AppID, newPosition: { x: number; y: number }) => {
    const newDesktopItems = desktopItems.map(item => item.id === id ? { ...item, position: newPosition } : item);
    setDesktopItems(newDesktopItems);
    updateUserProfile({ desktopItems: newDesktopItems });
  };

  const openApp = useCallback((id: AppID, initialProps: any = {}) => {
    setLaunchpadVisible(false);
    setSpotlightVisible(false);

    const appConfig = allApps.find(app => app.id === id);
    if (!appConfig) return;

    // Handle native app shortcuts
    if (appConfig.uri) {
      window.location.href = appConfig.uri;
      addNotification({
        appId: 'shortcuts',
        title: 'Launching Shortcut',
        message: `Attempting to open ${appConfig.title}...`
      });
      return;
    }

    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(win => win.id === id);
      
      const AppComponent = appConfig.externalUrl ? Maverick : appConfig.component;
      if (!AppComponent) return currentWindows;

      if (existingWindow) {
        setActiveWindow(id);
        return currentWindows.map(win => 
          win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win
        );
      } else {
        const appSpecificProps: any = {};
        
        if(appConfig.externalUrl) {
            appSpecificProps.initialUrl = appConfig.externalUrl;
            appSpecificProps.onApiCall = incrementApiCallCount;
        } else if (appConfig.id === 'settings') {
          appSpecificProps.onWallpaperSelect = setWallpaper;
          appSpecificProps.wallpapers = WALLPAPERS;
          appSpecificProps.theme = userData.settings.theme;
          appSpecificProps.onThemeToggle = toggleTheme;
        } else if (['houston', 'imaginarium', 'weather', 'pages', 'defense-ios'].includes(appConfig.id)) {
          appSpecificProps.onApiCall = incrementApiCallCount;
          appSpecificProps.addNotification = addNotification;
        } else if (appConfig.id === 'maverick') {
            appSpecificProps.onApiCall = incrementApiCallCount;
            appSpecificProps.initialUrl = userData.maverickUrl;
            appSpecificProps.onUrlChange = (maverickUrl: string) => updateUserProfile({ maverickUrl });
        } else if (appConfig.id === 'my-docs') {
          appSpecificProps.onOpenFile = (fileHandle: FileSystemFileHandle) => openApp('pages', { initialFileHandle: fileHandle });
          appSpecificProps.onInstallApp = handleInstallLocalApp;
        } else if (appConfig.id === 'pages') {
            appSpecificProps.savedPages = userData.pages;
            appSpecificProps.onSavePages = (pages: any) => updateUserProfile({ pages });
        } else if (appConfig.id === 'houston') {
            appSpecificProps.history = userData.houstonHistory;
            appSpecificProps.onHistoryChange = (houstonHistory: any) => updateUserProfile({ houstonHistory });
        } else if (appConfig.id === 'calendar') {
            appSpecificProps.savedEvents = userData.calendarEvents;
            appSpecificProps.onSaveEvents = (calendarEvents: any) => updateUserProfile({ calendarEvents });
        } else if (appConfig.id === 'photo-booth') {
            appSpecificProps.savedPhotos = userData.photos;
            appSpecificProps.onSavePhoto = (photo: string) => updateUserProfile({ photos: [...userData.photos, photo] });
        } else if (appConfig.id === 'arsis-id') {
            appSpecificProps.onCreateUser = handleCreateUser;
            appSpecificProps.currentUser = authToken ? authToken.replace('mock-jwt-for-', '') : null;
        } else if (appConfig.id === 'app-store') {
            appSpecificProps.installedApps = userData.installedExternalApps || [];
            appSpecificProps.onInstall = handleInstallApp;
            appSpecificProps.onOpen = openApp;
        } else if (appConfig.id === 'shortcuts') {
            appSpecificProps.savedShortcuts = userData.shortcuts || [];
            appSpecificProps.onSaveShortcuts = (shortcuts: Shortcut[]) => updateUserProfile({ shortcuts });
        }
          
        const newWindow: WindowState = {
          id: appConfig.id,
          title: appConfig.title,
          Component: (props) => <AppComponent {...props} {...appSpecificProps} />,
          position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
          size: { width: appConfig.width || 800, height: appConfig.height || 600 },
          zIndex: nextZIndex,
          isMinimized: false, isMaximized: false, initialProps,
        };
        setActiveWindow(id);
        return [...currentWindows, newWindow];
      }
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, incrementApiCallCount, userData, addNotification, updateUserProfile, authToken, handleCreateUser, allApps, handleInstallApp, handleInstallLocalApp]);

  const closeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.filter(win => win.id !== id));
    if (activeWindow === id) {
        const remainingWindows = windows.filter(win => win.id !== id);
        if (remainingWindows.length > 0) {
          const nextActive = remainingWindows.reduce((prev, curr) => curr.zIndex > prev.zIndex ? curr : prev);
          setActiveWindow(nextActive.id);
        } else {
          setActiveWindow(null);
        }
    }
  }, [activeWindow, windows]);

  const focusApp = useCallback((id: AppID) => {
    if (activeWindow === id) return;
    setActiveWindow(id);
    setWindows(currentWindows => currentWindows.map(win => win.id === id ? { ...win, zIndex: nextZIndex } : win));
    setNextZIndex(prev => prev + 1);
  }, [activeWindow, nextZIndex]);

  const minimizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.map(win => (win.id === id ? { ...win, isMinimized: true } : win)));
    if (activeWindow === id) setActiveWindow(null);
  }, [activeWindow]);

  const toggleMaximizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows =>
      currentWindows.map(win => {
        if (win.id === id) {
          if (win.isMaximized) return { ...win, isMaximized: false, position: win.previousPosition || win.position, size: win.previousSize || win.size };
          else return { ...win, isMaximized: true, previousPosition: win.position, previousSize: win.size, position: { x: 0, y: 28 }, size: { width: window.innerWidth, height: window.innerHeight - 28 } };
        }
        return win;
      })
    );
    focusApp(id);
  }, [focusApp]);

  const getActiveAppName = () => activeWindow ? (allApps.find(app => app.id === activeWindow)?.title || "Finder") : "Finder";
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  };
  const closeContextMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));
  const handleMissionControlSelect = (id: AppID) => {
    focusApp(id);
    setMissionControlActive(false);
  };
  const closeOverlays = () => {
    setControlCenterVisible(false);
    setNotificationCenterVisible(false);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSleep = () => {
    setSystemAction('sleep');
    setIsLoggedIn(false);
    setAuthToken(null);
    setWindows([]);
  };
  
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <MusicProvider>
      <SecurityProvider>
        <div 
          className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
          style={{ backgroundImage: `url(${userData.settings.wallpaper})` }}
          onContextMenu={isLoggedIn ? handleContextMenu : (e) => e.preventDefault()}
          onClick={isLoggedIn ? closeOverlays : undefined}
        >
          {isLoggedIn ? (
            <>
              <TopBar 
                activeAppName={getActiveAppName()} 
                onAboutClick={() => openApp('about')}
                onRestart={() => setSystemAction('restart')}
                onShutdown={() => setSystemAction('shutdown')}
                onSleep={handleSleep}
                onHoustonClick={() => openApp('houston')}
                onMissionControlToggle={() => setMissionControlActive(prev => !prev)}
                onSpotlightToggle={() => setSpotlightVisible(prev => !prev)}
                onControlCenterToggle={() => setControlCenterVisible(prev => !prev)}
                onNotificationCenterToggle={() => setNotificationCenterVisible(prev => !prev)}
              />
              <main className="relative w-full h-full pt-7">
                <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300" style={{ opacity: (100 - brightness) / 150 }} />
                <ApiMonitorWidget apiCallCount={apiCallCount} limit={API_CALL_LIMIT} initialPosition={{ x: 20, y: 40 }} />
                {desktopItems.map(item => {
                  const appConfig = allApps.find(app => app.id === item.id);
                  if (!appConfig) return null;
                  return (
                    <DesktopIcon key={item.id} id={item.id} title={appConfig.title} IconComponent={appConfig.icon} onOpen={() => openApp(item.id)} initialPosition={item.position} onPositionChange={(newPos) => handleIconPositionChange(item.id, newPos)} />
                  );
                })}
                
                {windows.map((win) => (
                  <Window key={win.id} id={win.id} title={win.title} position={win.position} size={win.size} zIndex={win.zIndex} isActive={activeWindow === win.id} isMinimized={win.isMinimized} isMaximized={win.isMaximized} onClose={() => closeApp(win.id)} onFocus={() => focusApp(win.id)} onMinimize={() => minimizeApp(win.id)} onMaximize={() => toggleMaximizeApp(win.id)}>
                    <win.Component {...win.initialProps} />
                  </Window>
                ))}
              </main>
              <Dock apps={dockApps} setApps={setDockApps} onAppClick={openApp} onLaunchpadClick={() => setLaunchpadVisible(true)} windows={windows} />
              {systemAction && <SystemOverlay action={systemAction} onWakeUp={() => setSystemAction(null)} />}
              <ContextMenu x={contextMenu.x} y={contextMenu.y} visible={contextMenu.visible} onClose={closeContextMenu} onItemClick={() => openApp('settings')} />
              {isMissionControlActive && <MissionControl windows={windows.filter(w => !w.isMinimized)} onSelectWindow={handleMissionControlSelect} onClose={() => setMissionControlActive(false)} />}
              {isSpotlightVisible && <Spotlight onClose={() => setSpotlightVisible(false)} onAppSelect={openApp} allApps={allApps} />}
              {isLaunchpadVisible && <Launchpad onClose={() => setLaunchpadVisible(false)} onAppSelect={openApp} wallpaperUrl={userData.settings.wallpaper} allApps={allApps} />}
              <ControlCenter visible={isControlCenterVisible} onClose={() => setControlCenterVisible(false)} brightness={brightness} onBrightnessChange={setBrightness} wifiOn={wifiOn} onWifiToggle={() => setWifiOn(prev => !prev)} bluetoothOn={bluetoothOn} onBluetoothToggle={() => setBluetoothOn(prev => !prev)} />
              <NotificationCenter visible={isNotificationCenterVisible} notifications={notifications} onClear={() => setNotifications([])} />
              <div className="fixed top-9 right-4 z-[9999] space-y-2">
                {toasts.map(toast => (<NotificationToast key={toast.id} notification={toast} />))}
              </div>
            </>
          ) : (
            <LoginScreen onLogin={handleLogin} />
          )}
        </div>
      </SecurityProvider>
    </MusicProvider>
  );
};

export default App;