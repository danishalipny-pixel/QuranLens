import React, { createContext, useContext, useState, useEffect } from 'react';

const PWAContext = createContext();

export function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine !== false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  // Check if iOS
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;

  // Check if already in standalone display mode
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener?.('change', checkStandalone);

    return () => {
      mediaQuery.removeEventListener?.('change', checkStandalone);
    };
  }, []);

  // Listen for beforeinstallprompt event (Android Chrome, Edge, desktop Chrome)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('[QuranLens PWA] beforeinstallprompt captured and ready.');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallModal(false);
      console.log('[QuranLens PWA] App was successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for Service Worker updates
  useEffect(() => {
    const handleSWUpdate = (e) => {
      console.log('[QuranLens PWA] Service worker update detected.');
      setIsUpdateAvailable(true);
      if (e.detail) setSwRegistration(e.detail);
    };

    window.addEventListener('quranlens-sw-update', handleSWUpdate);
    return () => {
      window.removeEventListener('quranlens-sw-update', handleSWUpdate);
    };
  }, []);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger installation prompt
  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[QuranLens PWA] User response to installation: ${outcome}`);
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setShowInstallModal(false);
      }
    } else {
      // Open custom guide modal (especially for iOS Safari or manual installation)
      setShowInstallModal(true);
    }
  };

  const updateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isIOS,
        isOnline,
        showInstallModal,
        setShowInstallModal,
        promptInstall,
        isUpdateAvailable,
        setIsUpdateAvailable,
        setSwRegistration,
        updateApp,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
