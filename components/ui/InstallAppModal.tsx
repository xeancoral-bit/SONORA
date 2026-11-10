'use client';

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  Share,
  PlusSquare,
  QrCode,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { usePWAInstall } from '@/context/PWAInstallContext';
import { useToast } from '@/context/ToastContext';
import confetti from 'canvas-confetti';

export const InstallAppModal: React.FC = () => {
  const {
    isModalOpen,
    closeInstallModal,
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    installApp
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'expo'>('pwa');
  const [isInstalling, setIsInstalling] = useState(false);
  const toast = useToast();

  if (!isModalOpen) return null;

  const handleInstallClick = async () => {
    try {
      setIsInstalling(true);
      const success = await installApp();
      if (success) {
        toast.success('🎉 SONORA installed successfully on your device!');
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
        setTimeout(() => closeInstallModal(), 1800);
      } else {
        if (isIOS) {
          toast.info('On iOS, tap the Share icon ⎋ then "Add to Home Screen" ⊞');
        } else {
          toast.info('Follow the prompt on your screen to complete installation!');
        }
      }
    } catch {
      toast.error('Could not launch app installer.');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={closeInstallModal} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#121214] border border-blue-500/20 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col z-10 max-h-[90vh]">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Download SONORA App
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Install directly on your phone or desktop
              </p>
            </div>
          </div>

          <button
            onClick={closeInstallModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/5 bg-white/[0.02] p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'apk'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Android APK</span>
          </button>
          <button
            onClick={() => setActiveTab('expo')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'expo'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Expo Go</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: PWA Direct Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              {/* App Status Banner */}
              {isInstalled ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300">
                      SONORA is already installed!
                    </h4>
                    <p className="text-[11px] text-emerald-400/80">
                      You are enjoying the native standalone app experience.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/15 via-blue-900/10 to-transparent border border-blue-500/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a0a0c] border border-blue-500/30 flex items-center justify-center shrink-0 shadow-lg">
                      {/* Logo Mini Soundwave */}
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                        <span className="w-1 h-5 bg-blue-300 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" />
                        <span className="w-1 h-2 bg-blue-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white">
                        SONORA — Standalone Music App
                      </h3>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        Adds the SONORA icon directly to your phone screen or desktop with fullscreen background audio.
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-neutral-300">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Zero browser address bar</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Instant home screen launch</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Install Action Button */}
              {!isInstalled && (
                <div>
                  {isIOS ? (
                    // iOS Safari Step-by-Step Instructions
                    <div className="p-4 rounded-2xl bg-[#18181c] border border-white/10 space-y-3">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-neutral-300" />
                        How to install on iPhone / iPad (Safari):
                      </h4>
                      <ol className="space-y-2 text-xs text-neutral-300">
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <span>
                            Tap the <strong>Share</strong> button (
                            <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" />
                            ) in Safari navigation bar.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <span>
                            Scroll down and select{' '}
                            <strong>
                              Add to Home Screen (
                              <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-blue-400" />
                              )
                            </strong>
                            .
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          <span>
                            Tap <strong>Add</strong> at top right. SONORA will now be placed on your home screen!
                          </span>
                        </li>
                      </ol>
                    </div>
                  ) : (
                    // Android & Desktop 1-Click Install Button
                    <button
                      onClick={handleInstallClick}
                      disabled={isInstalling}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isInstalling ? 'Opening Installer...' : 'Install SONORA App on this Device'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Desktop hint if user is on PC */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-[11px] text-neutral-400">
                <Laptop className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  Works seamlessly across Android phones, tablets, iPhone, Windows, and Mac.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Android APK Direct Download */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    SONORA Android Package (.APK)
                  </h3>
                  <span className="text-[11px] font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">
                    v1.0.0
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  Download the standalone Android package file directly to your phone storage to install offline.
                </p>
              </div>

              {/* Download APK Button */}
              <a
                href="/api/download/apk"
                download="SONORA-Music-v1.0.apk"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download APK File (Direct)</span>
              </a>

              {/* Install Guidance */}
              <div className="p-3.5 rounded-2xl bg-[#18181c] border border-white/10 space-y-2 text-xs text-neutral-300">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-neutral-400">
                  Installation Steps on Android:
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] text-neutral-300">
                  <li>Tap the button above to download the APK.</li>
                  <li>When downloaded, tap the file in your notification bar or Downloads folder.</li>
                  <li>If prompted, allow &quot;Install from unknown sources&quot; for your browser.</li>
                  <li>Tap <strong>Install</strong> to add SONORA to your phone!</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Expo Go (SDK 58) */}
          {activeTab === 'expo' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-neutral-300">
                Scan with your phone camera or the <strong>Expo Go</strong> app (SDK 58) to test the native React Native client.
              </p>

              {/* QR Code Container */}
              <div className="inline-block p-4 rounded-3xl bg-white shadow-xl mx-auto border-4 border-blue-500/30">
                {/* QR Code pointing to Metro Server / Expo Go */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=exp://192.168.1.18:8081"
                  alt="Expo QR Code"
                  width={180}
                  height={180}
                  className="rounded-xl"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#18181c] border border-white/10 text-left space-y-2 text-xs text-neutral-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider">
                    Expo Go SDK Version:
                  </span>
                  <span className="font-mono text-blue-400 font-bold">SDK 58.0.23</span>
                </div>
                <div className="p-2 rounded-xl bg-black/50 font-mono text-[11px] text-blue-300 flex items-center justify-between">
                  <span>cd mobile &amp;&amp; pnpm start</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SONORA Music System
          </span>
          <button
            onClick={closeInstallModal}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
