
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import { SystemOverlay, WidgetPicker, WidgetContainer, WIDGETS } from './components/SystemOverlay';
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
import { loginOrCreateUser, saveUserProfile, createUser } from './services/userProfile';
import type { AppID, WindowState, AppConfig, Notification, UserProfileData, DesktopItem, Shortcut, InstalledApp, WidgetState, WidgetComponentID, Contact } from './types';
import ApiMonitorWidget from './components/ApiMonitorWidget';
import Maverick from './apps/Maverick';
import { TerminalIcon } from './components/Icons';
import { isPersistenceConfigured } from './config';

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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Widget state
  const [widgets, setWidgets] = useState<WidgetState[]>([]);
  const [isWidgetPickerVisible, setWidgetPickerVisible] = useState(false);
  
  // Memoize guest profile data, as it depends on window size.
  const GUEST_PROFILE_DATA = useMemo<UserProfileData>(() => ({
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
    widgets: [],
    contacts: [
        { id: 'contact-1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '555-0101', avatarId: 2 },
        { id: 'contact-2', firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com', phone: '555-0102', avatarId: 5 },
    ],
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
  
  // Update dock apps when allApps changes
  useEffect(() => {
      setDockApps(allApps.filter(app => app.showInDock !== false));
  }, [allApps]);

  // --- API / Persistence Logic ---
  const updateUserProfile = useCallback(async (updates: Partial<UserProfileData>) => {
      const newData = { ...userData, ...updates };
      setUserData(newData);
      
      if (currentUser && currentUser !== 'admin') {
          await saveUserProfile(currentUser, newData);
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
        setWidgets(userData.widgets || []);
    }
  }, [isLoggedIn, userData.desktopItems, userData.widgets]);
  
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
  const handleLogin = useCallback(async (credentials?: { arsisId: string }): Promise<{ success: boolean; error?: string }> => {
    if (credentials?.arsisId === 'admin') {
        console.log("Admin login detected.");
        setUserData(ADMIN_PROFILE_DATA);
        setIsLoggedIn(true);
        setCurrentUser('admin');
        return { success: true };
    }

    if (!credentials?.arsisId) { // Guest login
        setUserData(GUEST_PROFILE_DATA);
        setIsLoggedIn(true);
        setCurrentUser(null);
        return { success: true };
    }
    
    // Proactively check if persistence is configured and notify the user if it's not.
    if (!isPersistenceConfigured) {
        addNotification({
            appId: 'defense-ios',
            title: 'Temporary Session',
            message: 'Remote storage is not configured. Your session will not be saved.',
        });
    }

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
        setCurrentUser(newId);
        addNotification({
            appId: 'arsis-id',
            title: 'Account Created!',
            message: `Your session has been successfully saved to Arsis ID: ${newId}`
        });
    }
    
    return result;

  }, [userData, addNotification]);

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
            appSpecificProps.onTitleChange = (newTitle: string) => {
              setWindows(wins => wins.map(w => w.id === 'maverick' ? {...w, title: newTitle } : w));
            };
        } else if (appConfig.id === 'my-docs') {
          appSpecificProps.onOpenFile = (fileHandle: FileSystemFileHandle) => openApp('pages', { initialFileHandle: fileHandle });
          appSpecificProps.onInstallApp = handleInstallLocalApp;
        } else if (appConfig.id === 'pages') {
            appSpecificProps.savedPages = userData.pages;
            appSpecificProps.onSavePages = (pages: any) => updateUserProfile({ pages });
        } else if (appConfig.id === 'contacts') {
            appSpecificProps.savedContacts = userData.contacts;
            appSpecificProps.onSaveContacts = (contacts: Contact[]) => updateUserProfile({ contacts });
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
            appSpecificProps.currentUser = currentUser;
            appSpecificProps.onCreateUserFromGuest = handleCreateUserFromGuest;
        } else if (appConfig.id === 'app-store') {
            appSpecificProps.installedApps = userData.installedExternalApps || [];
            appSpecificProps.onInstall = handleInstallApp;
            appSpecificProps.onOpen = openApp;
        } else if (appConfig.id === 'shortcuts') {
            appSpecificProps.savedShortcuts = userData.shortcuts;
            appSpecificProps.onSaveShortcuts = (shortcuts: Shortcut[]) => updateUserProfile({ shortcuts });
        }
        
        const newWindow: WindowState = {
          id,
          title: appConfig.title,
          Component: AppComponent,
          position: { x: window.innerWidth / 2 - (appConfig.width || 800) / 2, y: window.innerHeight / 2 - (appConfig.height || 600) / 2 },
          size: { width: appConfig.width || 800, height: appConfig.height || 600 },
          zIndex: nextZIndex,
          isMinimized: false,
          isMaximized: false,
          initialProps: { ...appSpecificProps, ...initialProps }
        };

        setActiveWindow(id);
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
  
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
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
  }

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
                onHoustonClick={() => openApp('houston')}
                onMissionControlToggle={toggleMissionControl}
                onSpotlightToggle={toggleSpotlight}
                onControlCenterToggle={toggleControlCenter}
                onNotificationCenterToggle={toggleNotificationCenter}
                isInstallable={!!installPrompt}
                onInstallClick={handleInstallClick}
              />
              
              {desktopItems.map(item => {
                const appConfig = allApps.find(app => app.id === item.id);
                if (!appConfig) return null;
                return (
                  <DesktopIcon
                    key={item.id}
                    id={item.id}
                    title={appConfig.title}
                    IconComponent={appConfig.icon}
                    onOpen={() => openApp(item.id)}
                    initialPosition={item.position}
                    onPositionChange={(newPosition) => handleIconPositionChange(item.id, newPosition)}
                  />
                )
              })}
              
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
                          <WidgetComponent />
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
                onClose={closeContextMenu}
                onItemClick={() => openApp('settings')}
                onAddWidgetClick={() => setWidgetPickerVisible(true)}
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