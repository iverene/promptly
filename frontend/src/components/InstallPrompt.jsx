import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [iosInstructions, setIosInstructions] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isIos && !isStandalone() && sessionStorage.getItem('promptly-install-dismissed') !== 'true') {
      setIosInstructions(true);
      setVisible(true);
    }
    const beforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      if (!isStandalone() && sessionStorage.getItem('promptly-install-dismissed') !== 'true') setVisible(true);
    };
    const installed = () => {
      setVisible(false);
      setInstallEvent(null);
      sessionStorage.removeItem('promptly-install-dismissed');
    };
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  if (!visible || (!installEvent && !iosInstructions)) return null;

  const dismiss = () => {
    sessionStorage.setItem('promptly-install-dismissed', 'true');
    setVisible(false);
  };
  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    setVisible(false);
    setInstallEvent(null);
    if (outcome === 'dismissed') sessionStorage.setItem('promptly-install-dismissed', 'true');
  };

  return <aside role="dialog" aria-label="Install Promptly" className="glass-strong soft-enter fixed left-4 right-4 top-4 z-50 mx-auto max-w-sm p-4 md:top-6">
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black text-white"><Download size={18} /></span>
      <div className="min-w-0 flex-1"><h2 className="text-lg">Install Promptly</h2><p className="mt-1 text-sm leading-5 text-secondary">{iosInstructions ? 'Tap Share, then choose Add to Home Screen.' : 'Add it to your device for quick access and an app-like experience.'}</p></div>
      <button type="button" onClick={dismiss} aria-label="Dismiss install prompt" className="focus-ring grid size-9 shrink-0 place-items-center rounded-full hover:bg-black/5"><X size={17} /></button>
    </div>
    <div className="mt-4 flex justify-end gap-2">
      <button type="button" onClick={dismiss} className="focus-ring min-h-10 px-4 text-sm font-medium">Later</button>
      {iosInstructions
        ? <button type="button" onClick={dismiss} className="focus-ring min-h-10 bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800">Got it</button>
        : <button type="button" onClick={install} className="focus-ring min-h-10 bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800">Install</button>}
    </div>
  </aside>;
}
