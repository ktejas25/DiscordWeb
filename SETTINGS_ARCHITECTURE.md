# Settings Feature - Architecture

## Component Hierarchy

```
App.tsx
├── AuthProvider
│   └── SettingsProvider
│       ├── SettingsOverlay (modal)
│       │   ├── SettingsNav (left sidebar)
│       │   │   ├── Section buttons
│       │   │   ├── Log Out button
│       │   │   └── Delete Account button
│       │   └── Content Pane (right)
│       │       ├── MyAccountPage
│       │       ├── ProfilePage ⭐
│       │       ├── PrivacyPage
│       │       ├── VoicePage
│       │       ├── NotificationsPage
│       │       ├── TextImagesPage
│       │       ├── AppearancePage
│       │       ├── AccessibilityPage
│       │       ├── KeybindsPage
│       │       ├── AdvancedPage
│       │       ├── LanguagePage
│       │       └── ChangelogPage
│       └── AppLayout
│           └── SelfFooter
│               └── Gear Icon (opens settings)
```

## Data Flow

### Profile Update Flow
```
User clicks "Save" in ProfilePage
    ↓
ProfilePage validates input
    ↓
uploadAvatar() → Supabase Storage
    ↓
useProfile.updateProfile() → api.profiles table
    ↓
AuthContext.updateUser() → Update global user state
    ↓
SelfFooter re-renders with new avatar
    ↓
Toast notification shown
```

### Settings Update Flow
```
User toggles setting
    ↓
Optimistic UI update (immediate feedback)
    ↓
useSettings.updateSettings() → api.user_settings table
    ↓
On success: Keep optimistic update
    ↓
On error: Rollback + show toast
```

## State Management

### Global State (AuthContext)
```typescript
{
  user: {
    id: string
    email: string
    username: string
    avatar_url: string
    // ... other fields
  }
}
```

### Settings Modal State (SettingsContext)
```typescript
{
  isOpen: boolean
  currentSection: string
  openSettings: (section?) => void
  closeSettings: () => void
  setSection: (section) => void
}
```

### Profile State (useProfile hook)
```typescript
{
  profile: {
    id: string
    username: string
    bio: string | null
    avatar_url: string | null
  }
  loading: boolean
  error: string | null
  updateProfile: (updates) => Promise<Profile>
  refetch: () => Promise<void>
}
```

### User Settings State (useSettings hook)
```typescript
{
  settings: {
    theme: 'dark' | 'light' | 'system'
    locale: string
    reduced_motion: boolean
    notifications: { enabled: boolean, sound: boolean }
    privacy: { allowDMs: boolean, ... }
    // ... other JSONB fields
  }
  loading: boolean
  updateSettings: (updates) => Promise<UserSettings>
  refetch: () => Promise<void>
}
```

## Database Schema

```
┌─────────────────────┐
│   auth.users        │
│  (Supabase Auth)    │
└──────────┬──────────┘
           │
           │ 1:1
           │
    ┌──────┴──────┬──────────────┐
    │             │              │
    ▼             ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│profiles │  │user_     │  │storage.  │
│         │  │settings  │  │objects   │
│         │  │          │  │(avatars) │
└─────────┘  └──────────┘  └──────────┘
```

### Relationships
- `auth.users.id` → `api.profiles.id` (1:1)
- `auth.users.id` → `api.user_settings.id` (1:1)
- `auth.users.id` → `storage.objects` (1:many, via folder path)

## Security (RLS)

### Profiles Table
```sql
-- SELECT: Anyone can view profiles
USING (true)

-- UPDATE/INSERT: Users can only modify their own
USING (auth.uid() = id)
```

### User Settings Table
```sql
-- SELECT/UPDATE/INSERT: Users can only access their own
USING (auth.uid() = id)
```

### Storage (avatars bucket)
```sql
-- SELECT: Public read
USING (bucket_id = 'avatars')

-- INSERT/UPDATE/DELETE: Users can only modify their own folder
USING (auth.uid()::text = (storage.foldername(name))[1])
```

## File Organization

```
client/
├── components/
│   ├── settings/
│   │   ├── SettingsOverlay.tsx      # Main container
│   │   ├── SettingsNav.tsx          # Left sidebar
│   │   └── pages/
│   │       ├── index.ts             # Barrel export
│   │       ├── MyAccountPage.tsx
│   │       ├── ProfilePage.tsx      # ⭐ Core feature
│   │       └── ... (10 more pages)
│   └── SelfFooter.tsx               # Gear button
├── contexts/
│   ├── AuthContext.tsx              # User state
│   └── SettingsContext.tsx          # Modal state
├── hooks/
│   ├── useProfile.ts                # Profile CRUD
│   └── useSettings.ts               # Settings CRUD
└── services/
    ├── supabaseClient.ts            # Supabase instance
    └── storageService.ts            # Avatar upload

supabase/
└── migrations/
    └── 001_profiles_and_settings.sql
```

## API Endpoints (Supabase REST)

### Profiles
```
GET    /rest/v1/profiles?id=eq.{userId}
POST   /rest/v1/profiles
PATCH  /rest/v1/profiles?id=eq.{userId}
```

### User Settings
```
GET    /rest/v1/user_settings?id=eq.{userId}
POST   /rest/v1/user_settings
PATCH  /rest/v1/user_settings?id=eq.{userId}
```

### Storage
```
POST   /storage/v1/object/avatars/{userId}/{timestamp}.{ext}
DELETE /storage/v1/object/avatars/{userId}/{timestamp}.{ext}
GET    /storage/v1/object/public/avatars/{userId}/{timestamp}.{ext}
```

## Event Flow

### Opening Settings
```
User clicks gear icon
    ↓
SelfFooter.onClick()
    ↓
useSettingsModal().openSettings()
    ↓
SettingsContext.setIsOpen(true)
    ↓
SettingsOverlay renders
    ↓
useProfile() fetches profile data
    ↓
useSettings() fetches user settings
    ↓
ProfilePage renders with data
```

### Closing Settings
```
User presses ESC / clicks outside / clicks X
    ↓
SettingsOverlay.handleEscape() / onClick()
    ↓
useSettingsModal().closeSettings()
    ↓
SettingsContext.setIsOpen(false)
    ↓
SettingsOverlay unmounts
```

## Error Handling

### Username Conflict
```
User enters duplicate username
    ↓
ProfilePage.handleSave()
    ↓
useProfile.updateProfile()
    ↓
Supabase returns 23505 error
    ↓
Catch error, check code
    ↓
Show inline error: "This username is already taken"
```

### Avatar Upload Failure
```
User selects invalid file
    ↓
ProfilePage.handleAvatarUpload()
    ↓
Validate file type/size
    ↓
If invalid: Show toast error
    ↓
If valid but upload fails:
    ↓
storageService.uploadAvatar() throws
    ↓
Catch error, show toast
    ↓
Keep previous avatar_url
```

## Performance Optimizations

1. **Lazy Loading**: Settings pages only render when selected
2. **Optimistic Updates**: UI updates immediately, rollback on error
3. **Debouncing**: Could add for text inputs (not implemented)
4. **Memoization**: React.memo on heavy components (not needed yet)
5. **Image Optimization**: Could add compression before upload (future)

## Accessibility Features

- ✅ Focus trap in modal
- ✅ ESC key to close
- ✅ Keyboard navigation (Tab/Shift+Tab)
- ✅ ARIA labels on all buttons
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ Color contrast (Discord theme)

## Extension Points

### Adding a New Setting
1. Add field to `user_settings` table (or use existing JSONB)
2. Update `useSettings` hook types
3. Add UI control in appropriate page
4. Call `updateSettings()` on change

### Adding a New Section
1. Create page component in `pages/`
2. Export in `pages/index.ts`
3. Add to `SettingsNav` sections array
4. Add case in `SettingsOverlay` renderContent()

### Customizing Avatar Upload
1. Edit `storageService.ts`
2. Add image processing (crop, resize, compress)
3. Update validation rules
4. Modify storage path format
