# Settings Feature - Component Reference

## Component Tree

```
<App>
  <AuthProvider>
    <SettingsProvider>
      
      {/* Global Settings Overlay */}
      <SettingsOverlay>
        <SettingsNav />
        <ContentPane>
          {currentSection === 'my-account' && <MyAccountPage />}
          {currentSection === 'profile' && <ProfilePage />}
          {/* ... other sections */}
        </ContentPane>
      </SettingsOverlay>

      {/* Main App */}
      <AppLayout>
        <SelfFooter>
          <GearIcon onClick={openSettings} />
        </SelfFooter>
      </AppLayout>

    </SettingsProvider>
  </AuthProvider>
</App>
```

## Core Components

### SettingsOverlay
**Path**: `client/components/settings/SettingsOverlay.tsx`

**Purpose**: Main container for settings modal

**Props**: None (uses context)

**Features**:
- Full-screen overlay
- ESC key handler
- Click-outside handler
- Section routing

**Usage**:
```tsx
// Rendered globally in App.tsx
<SettingsOverlay />
```

---

### SettingsNav
**Path**: `client/components/settings/SettingsNav.tsx`

**Purpose**: Left sidebar navigation

**Props**: None (uses context)

**Features**:
- 12 section buttons
- Category grouping
- Active section highlighting
- Log Out button
- Delete Account button

**Sections**:
```typescript
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
```

---

### SelfFooter
**Path**: `client/components/SelfFooter.tsx`

**Purpose**: Bottom-left user area with controls

**Props**:
```typescript
interface SelfFooterProps {
  muted: boolean;
  deafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
}
```

**Features**:
- User avatar display
- Username display
- Mute/Deafen buttons
- Settings gear icon

**Modified**:
```tsx
// Added settings integration
const { openSettings } = useSettingsModal();

<button onClick={() => openSettings()}>
  <Settings />
</button>
```

---

## Settings Pages

### MyAccountPage
**Path**: `client/components/settings/pages/MyAccountPage.tsx`

**Purpose**: Display read-only account info

**Data Displayed**:
- Email
- User ID
- Account created date
- Username

**Features**:
- Change password link (placeholder)

---

### ProfilePage ⭐
**Path**: `client/components/settings/pages/ProfilePage.tsx`

**Purpose**: Edit profile (username, avatar, bio)

**State**:
```typescript
const [username, setUsername] = useState('');
const [bio, setBio] = useState('');
const [avatarUrl, setAvatarUrl] = useState('');
const [saving, setSaving] = useState(false);
const [uploading, setUploading] = useState(false);
const [usernameError, setUsernameError] = useState('');
```

**Features**:
- Avatar upload with preview
- File validation (type, size)
- Username validation (length, chars, uniqueness)
- Bio with character counter (300 max)
- Save/Cancel buttons
- Toast notifications
- Optimistic updates

**Validation Rules**:
```typescript
// Username
- Required
- 3-32 characters
- Only: a-z, A-Z, 0-9, _, -
- Unique (checked on save)

// Avatar
- PNG, JPG, or WebP
- Max 5MB

// Bio
- Max 300 characters
```

---

### PrivacyPage
**Path**: `client/components/settings/pages/PrivacyPage.tsx`

**Purpose**: Privacy and safety settings

**Settings**:
- Allow Direct Messages (toggle)
- Allow Friend Requests (toggle)

**Persistence**: `user_settings.privacy` JSONB

---

### VoicePage
**Path**: `client/components/settings/pages/VoicePage.tsx`

**Purpose**: Voice and audio settings

**Settings** (placeholders):
- Input Device (disabled)
- Output Device (disabled)
- Push to Talk Keybind (disabled)

**Future**: WebRTC device selection

---

### NotificationsPage
**Path**: `client/components/settings/pages/NotificationsPage.tsx`

**Purpose**: Notification preferences

**Settings**:
- Enable Notifications (toggle)
- Notification Sound (toggle)

**Persistence**: `user_settings.notifications` JSONB

---

### TextImagesPage
**Path**: `client/components/settings/pages/TextImagesPage.tsx`

**Purpose**: Text and image display settings

**Settings**:
- Show Link Previews (toggle)
- Show Emoji (toggle)

**Persistence**: `user_settings.text_images` JSONB

---

### AppearancePage
**Path**: `client/components/settings/pages/AppearancePage.tsx`

**Purpose**: Visual appearance settings

**Settings**:
- Theme (dark/light/system)
- Font Size (small/medium/large)

**Persistence**: `user_settings.theme`, `user_settings.appearance` JSONB

---

### AccessibilityPage
**Path**: `client/components/settings/pages/AccessibilityPage.tsx`

**Purpose**: Accessibility options

**Settings**:
- Reduced Motion (toggle)
- High Contrast (toggle)

**Persistence**: `user_settings.reduced_motion`, `user_settings.accessibility` JSONB

---

### KeybindsPage
**Path**: `client/components/settings/pages/KeybindsPage.tsx`

**Purpose**: Keyboard shortcuts

**Settings** (placeholders):
- Push to Talk (disabled)
- Toggle Mute (disabled)

**Future**: Keybind editor with conflict detection

---

### AdvancedPage
**Path**: `client/components/settings/pages/AdvancedPage.tsx`

**Purpose**: Advanced/developer settings

**Settings**:
- Developer Mode (toggle)
- Debug Logs (toggle)

**Persistence**: `user_settings.advanced` JSONB

---

### LanguagePage
**Path**: `client/components/settings/pages/LanguagePage.tsx`

**Purpose**: Language selection

**Settings**:
- Language (en/es/fr/de/ja)

**Persistence**: `user_settings.locale`

---

### ChangelogPage
**Path**: `client/components/settings/pages/ChangelogPage.tsx`

**Purpose**: Version history and updates

**Content**:
- Version number
- Release date
- Feature list

**Static**: No persistence needed

---

## Hooks

### useProfile
**Path**: `client/hooks/useProfile.ts`

**Purpose**: Profile CRUD operations

**Returns**:
```typescript
{
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  refetch: () => Promise<void>;
}
```

**Usage**:
```tsx
const { profile, updateProfile, loading } = useProfile();

await updateProfile({ 
  username: 'newname', 
  bio: 'Hello!', 
  avatar_url: 'https://...' 
});
```

---

### useSettings
**Path**: `client/hooks/useSettings.ts`

**Purpose**: User settings CRUD operations

**Returns**:
```typescript
{
  settings: UserSettings | null;
  loading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<UserSettings>;
  refetch: () => Promise<void>;
}
```

**Usage**:
```tsx
const { settings, updateSettings } = useSettings();

await updateSettings({ 
  theme: 'dark', 
  locale: 'en',
  notifications: { enabled: true, sound: false }
});
```

---

### useSettingsModal
**Path**: `client/contexts/SettingsContext.tsx`

**Purpose**: Settings modal state management

**Returns**:
```typescript
{
  isOpen: boolean;
  currentSection: string;
  openSettings: (section?: string) => void;
  closeSettings: () => void;
  setSection: (section: string) => void;
}
```

**Usage**:
```tsx
const { openSettings, closeSettings } = useSettingsModal();

// Open to specific section
openSettings('profile');

// Open to default section (my-account)
openSettings();

// Close
closeSettings();
```

---

## Services

### storageService
**Path**: `client/services/storageService.ts`

**Functions**:

#### uploadAvatar
```typescript
async function uploadAvatar(userId: string, file: File): Promise<string>
```
- Uploads avatar to `avatars/{userId}/{timestamp}.{ext}`
- Returns public URL
- Throws on error

#### deleteAvatar
```typescript
async function deleteAvatar(url: string): Promise<void>
```
- Deletes avatar from storage
- Extracts path from URL
- Throws on error

**Usage**:
```tsx
import { uploadAvatar } from '@/services/storageService';

const url = await uploadAvatar(user.id, file);
```

---

## Contexts

### SettingsContext
**Path**: `client/contexts/SettingsContext.tsx`

**State**:
```typescript
{
  isOpen: boolean;
  currentSection: string;
}
```

**Actions**:
```typescript
{
  openSettings: (section?: string) => void;
  closeSettings: () => void;
  setSection: (section: string) => void;
}
```

**Provider**:
```tsx
<SettingsProvider>
  {children}
</SettingsProvider>
```

---

## UI Components Used

### shadcn/ui Components
- `Button` - Save/Cancel/Upload buttons
- `Input` - Text inputs
- `Textarea` - Bio input
- `Label` - Form labels
- `Switch` - Toggle switches
- `Select` - Dropdowns (theme, locale)
- `useToast` - Toast notifications

### lucide-react Icons
- `Settings` - Gear icon
- `Upload` - Upload button
- `X` - Close button
- `LogOut` - Log out button
- `Trash2` - Delete account button

---

## Styling

### Tailwind Classes
```css
/* Backgrounds */
bg-discord-dark      /* Main background */
bg-discord-darker    /* Sidebar, inputs */

/* Text */
text-white           /* Primary text */
text-discord-muted   /* Secondary text */

/* Borders */
border-discord-dark
border-discord-darker

/* Interactive */
hover:bg-discord-dark
hover:text-white
```

### Custom Colors (tailwind.config.ts)
```typescript
colors: {
  'discord-dark': '#2f3136',
  'discord-darker': '#202225',
  'discord-muted': '#72767d',
  'primary': '#5865f2'
}
```

---

## Component Communication

```
User Action
    ↓
Component (ProfilePage)
    ↓
Hook (useProfile)
    ↓
Supabase Client
    ↓
Database/Storage
    ↓
Response
    ↓
Hook Updates State
    ↓
Component Re-renders
    ↓
Context Updates (AuthContext)
    ↓
Other Components Re-render (SelfFooter)
```

---

## Testing Components

### Unit Testing
```typescript
// Example: ProfilePage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfilePage } from './ProfilePage';

test('validates username length', () => {
  render(<ProfilePage />);
  const input = screen.getByLabelText('Username');
  fireEvent.change(input, { target: { value: 'ab' } });
  fireEvent.click(screen.getByText('Save Changes'));
  expect(screen.getByText(/must be 3-32 characters/)).toBeInTheDocument();
});
```

### Integration Testing
See **SETTINGS_TESTING.md** for manual testing checklist

---

## Performance Considerations

### Optimizations
- Lazy loading: Pages only render when selected
- Optimistic updates: Immediate UI feedback
- Debouncing: Could add for text inputs
- Memoization: Not needed yet (components are lightweight)

### Bundle Size
- Total: ~50KB (uncompressed)
- Settings pages: ~5KB each
- Hooks: ~3KB each
- Services: ~2KB

---

## Accessibility

### ARIA Labels
```tsx
<button aria-label="Settings">
<button aria-label="Close">
<input aria-label="Username">
```

### Keyboard Navigation
- Tab/Shift+Tab: Navigate controls
- Enter: Activate buttons
- Space: Toggle switches
- ESC: Close modal

### Focus Management
- Focus trap in modal
- Focus returns to trigger on close
- Visible focus indicators

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## Troubleshooting Components

### Component Not Rendering
1. Check if SettingsProvider is in App.tsx
2. Verify import paths
3. Check console for errors

### State Not Updating
1. Verify hook is called inside component
2. Check if user is authenticated
3. Verify Supabase connection

### Styles Not Applied
1. Check Tailwind config
2. Verify class names
3. Check for CSS conflicts

---

For more details, see:
- **SETTINGS_ARCHITECTURE.md** - Data flow and architecture
- **SETTINGS_QUICKREF.md** - API reference
- **SETTINGS_TESTING.md** - Testing guide
