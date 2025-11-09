import React from 'react';
import { useSettingsModal } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const sections = [
  { id: 'my-account', label: 'My Account', category: 'User Settings' },
  { id: 'profile', label: 'Profile', category: 'User Settings' },
  { id: 'privacy', label: 'Privacy & Safety', category: 'User Settings' },
  { id: 'voice', label: 'Voice & Audio', category: 'App Settings' },
  { id: 'notifications', label: 'Notifications', category: 'App Settings' },
  { id: 'text-images', label: 'Text & Images', category: 'App Settings' },
  { id: 'appearance', label: 'Appearance', category: 'App Settings' },
  { id: 'accessibility', label: 'Accessibility', category: 'App Settings' },
  { id: 'keybinds', label: 'Keybinds', category: 'App Settings' },
  { id: 'advanced', label: 'Advanced', category: 'App Settings' },
  { id: 'language', label: 'Language', category: 'App Settings' },
  { id: 'changelog', label: 'Changelog', category: 'Info' }
];

export function SettingsNav() {
  const { currentSection, setSection, closeSettings } = useSettingsModal();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    closeSettings();
    window.location.href = '/';
  };

  const categories = Array.from(new Set(sections.map(s => s.category)));

  return (
    <div className="w-64 bg-discord-darker flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <div className="text-xs font-semibold text-discord-muted uppercase mb-2">{category}</div>
            {sections.filter(s => s.category === category).map(section => (
              <button
                key={section.id}
                onClick={() => setSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  currentSection === section.id
                    ? 'bg-discord-dark text-white'
                    : 'text-discord-muted hover:bg-discord-dark/50 hover:text-white'
                }`}
              >
                {t(section.label as any)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-discord-dark space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-400 hover:bg-discord-dark transition"
        >
          <LogOut className="w-4 h-4" />
          {t('Log Out')}
        </button>
      </div>
    </div>
  );
}
