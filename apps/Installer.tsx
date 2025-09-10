import React, { useState, useEffect } from 'react';
import { InstallerIcon, DownloadIcon } from '../components/Icons';

declare const JSZip: any;

type PWAStatus = 'checking' | 'ready' | 'unsupported';

const Installer: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>('checking');
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setPwaStatus('ready');
    };

    window.addEventListener('beforeinstallprompt', handler);

    const timeout = setTimeout(() => {
        if (pwaStatus === 'checking') {
            setPwaStatus('unsupported');
        }
    }, 4000);

    return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timeout);
    };
  }, [pwaStatus]);

  const handlePwaInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
    setPwaStatus('unsupported'); // Prompt can't be used again
  };

  const handleDownloadBundle = async () => {
    setIsZipping(true);
    
    try {
      const zip = new JSZip();
      const url = window.location.origin;

      const launcherHtml = `<!DOCTYPE html>
<html>
<head>
    <title>ArsisOS Launcher</title>
    <meta charset="utf-8" />
    <style>
        body { font-family: sans-serif; background-color: #0d0d0d; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; }
        a { color: #4dabf7; }
    </style>
    <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
    <div class="container">
        <h1>Launching ArsisOS...</h1>
        <p>If you are not redirected, <a href="${url}">click here</a>.</p>
    </div>
</body>
</html>`;
      
      const readmeTxt = `ArsisOS - Installation Instructions
===================================

Thank you for downloading ArsisOS!

To launch the application:
1. Unzip this file.
2. Open the "ArsisOS Launcher.html" file in your web browser.

This will launch the full ArsisOS experience. You can move the launcher file to your Desktop or Applications folder for easy access.

For the best experience, we recommend using the PWA installation option available within the OS. This provides offline access and a more integrated feel.`;

      zip.file("ArsisOS Launcher.html", launcherHtml);
      zip.file("README.txt", readmeTxt);

      const content = await zip.generateAsync({ type: "blob" });
      
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'ArsisOS-Launcher.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

    } catch (err) {
      console.error("Failed to create zip bundle:", err);
      alert("An error occurred while creating the download bundle.");
    } finally {
      setIsZipping(false);
    }
  };
  
  const PwaInstallButton = () => {
    const buttonState = {
        checking: { text: 'Checking PWA support...', disabled: true },
        ready: { text: 'Install PWA (Recommended)', disabled: false },
        unsupported: { text: 'PWA Not Supported', disabled: true },
    }[pwaStatus];
    
    return (
        <button
            onClick={handlePwaInstall}
            disabled={buttonState.disabled}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            <InstallerIcon className="w-5 h-5 mr-2"/>
            {buttonState.text}
        </button>
    );
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center justify-center text-center">
      <InstallerIcon className="w-24 h-24 text-gray-700 dark:text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold mb-2 dark:text-white">Install ArsisOS</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
        Install ArsisOS to your device for offline access and to run it in its own dedicated window.
      </p>

      {isInstalled ? (
        <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 p-4 rounded-lg">
          <p className="font-semibold">ArsisOS is installed!</p>
          <p className="text-sm">You can launch it from your desktop or applications folder.</p>
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-xs">
            <PwaInstallButton />
            <button
                onClick={handleDownloadBundle}
                disabled={isZipping}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                <DownloadIcon className="w-5 h-5 mr-2"/>
                {isZipping ? 'Creating Bundle...' : 'Download App Bundle'}
            </button>
        </div>
      )}
    </div>
  );
};

export default Installer;