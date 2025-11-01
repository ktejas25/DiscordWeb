import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSettingsModal } from '@/contexts/SettingsContext';
import { SettingsNav } from './SettingsNav';
import {
  MyAccountPage,
  ProfilePage,
  PrivacyPage,
  VoicePage,
  NotificationsPage,
  TextImagesPage,
  AppearancePage,
  AccessibilityPage,
  KeybindsPage,
  AdvancedPage,
  LanguagePage,
  ChangelogPage
} from './pages';

export function SettingsOverlay() {
  const { isOpen, currentSection, closeSettings } = useSettingsModal();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeSettings]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (currentSection) {
      case 'my-account': return <MyAccountPage />;
      case 'profile': return <ProfilePage />;
      case 'privacy': return <PrivacyPage />;
      case 'voice': return <VoicePage />;
      case 'notifications': return <NotificationsPage />;
      case 'text-images': return <TextImagesPage />;
      case 'appearance': return <AppearancePage />;
      case 'accessibility': return <AccessibilityPage />;
      case 'keybinds': return <KeybindsPage />;
      case 'advanced': return <AdvancedPage />;
      case 'language': return <LanguagePage />;
      case 'changelog': return <ChangelogPage />;
      default: return <MyAccountPage />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={closeSettings}>
      <div className="w-full h-full flex" onClick={(e) => e.stopPropagation()}>
        <SettingsNav />
        <div className="flex-1 flex flex-col bg-discord-dark">
          <div className="flex items-center justify-between p-4 border-b border-discord-darker">
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <button onClick={closeSettings} className="p-2 hover:bg-discord-darker rounded" aria-label="Close">
              <X className="w-5 h-5 text-discord-muted" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
