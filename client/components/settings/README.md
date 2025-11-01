# Settings Components

Discord-style settings overlay with profile management and user preferences.

## Quick Start

```tsx
// 1. Wrap app with SettingsProvider (already done in App.tsx)
<SettingsProvider>
  <App />
</SettingsProvider>

// 2. Use the hook to open settings
import { useSettingsModal } from '@/contexts/SettingsContext';

const { openSettings } = useSettingsModal();

// Open to default section
openSettings();

// Open to specific section
openSettings('profile');
```

## Components

### SettingsOverlay
Main container. Renders globally, controlled by SettingsContext.

### SettingsNav
Left sidebar with all sections and action buttons.

### Pages
Individual settings pages in `pages/` directory:
- `MyAccountPage` - Read-only account info
- `ProfilePage` - Edit username, avatar, bio ⭐
- `PrivacyPage` - Privacy toggles
- `VoicePage` - Voice settings (placeholder)
- `NotificationsPage` - Notification toggles
- `TextImagesPage` - Display toggles
- `AppearancePage` - Theme selector
- `AccessibilityPage` - Accessibility toggles
- `KeybindsPage` - Keybind editor (placeholder)
- `AdvancedPage` - Developer toggles
- `LanguagePage` - Locale selector
- `ChangelogPage` - Version history

## Adding a New Section

1. Create page component:
```tsx
// pages/NewPage.tsx
export function NewPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white">New Section</h2>
      {/* Your content */}
    </div>
  );
}
```

2. Export in `pages/index.ts`:
```tsx
export { NewPage } from './NewPage';
```

3. Add to SettingsNav sections:
```tsx
{ id: 'new-section', label: 'New Section', category: 'App Settings' }
```

4. Add case in SettingsOverlay:
```tsx
case 'new-section': return <NewPage />;
```

## Styling

Uses Tailwind with Discord theme:
- `bg-discord-dark` - Main background
- `bg-discord-darker` - Sidebar/inputs
- `text-discord-muted` - Secondary text
- `text-white` - Primary text

## Hooks

```tsx
// Profile management
import { useProfile } from '@/hooks/useProfile';
const { profile, updateProfile } = useProfile();

// Settings management
import { useSettings } from '@/hooks/useSettings';
const { settings, updateSettings } = useSettings();

// Modal control
import { useSettingsModal } from '@/contexts/SettingsContext';
const { openSettings, closeSettings } = useSettingsModal();
```

## File Structure

```
settings/
├── SettingsOverlay.tsx    # Main container
├── SettingsNav.tsx        # Left sidebar
├── pages/
│   ├── index.ts           # Barrel export
│   ├── ProfilePage.tsx    # ⭐ Core feature
│   └── ... (11 more)
└── README.md (this file)
```

## Documentation

See project root for complete docs:
- `SETTINGS_INDEX.md` - Documentation index
- `SETTINGS_SUMMARY.md` - Feature summary
- `SETTINGS_QUICKREF.md` - Quick reference
- `SETTINGS_COMPONENTS.md` - Component reference
- `setup-settings.md` - Setup guide

## Testing

See `SETTINGS_TESTING.md` in project root for comprehensive checklist.

## Support

Issues? Check `setup-settings.md` troubleshooting section.
