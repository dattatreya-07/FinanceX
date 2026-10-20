import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'ios' | 'unavailable'> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
      return choice.outcome;
    }

    if (isIOS) {
      return 'ios';
    }

    return 'unavailable';
  };

  return { isInstallable, isInstalled, isIOS, promptInstall };
};

export const InstallAppModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isIOS?: boolean;
}> = ({ isOpen, onClose, isIOS = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-[#0B1322] border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              FX
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Install FinanceX App</h3>
              <p className="text-[10px] text-slate-500">Fast, offline-ready & standalone</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p>To install FinanceX on your iPhone or iPad:</p>
            <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px]">
              <li className="flex items-center gap-2">
                <span>1. Tap the</span>
                <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 inline-flex items-center gap-1 font-bold">
                  <Share className="w-3.5 h-3.5 text-blue-500" /> Share
                </span>
                <span>button in Safari toolbar.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>2. Scroll down and select</span>
                <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 inline-flex items-center gap-1 font-bold">
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-500" /> Add to Home Screen
                </span>
              </li>
              <li>3. Tap <strong>Add</strong> in the top-right corner.</li>
            </ol>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Install FinanceX directly to your desktop or device for zero-latency trading simulations, offline syllabus review, and full-screen experience.
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
