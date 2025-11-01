# Settings Feature - Visual Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React App                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ AuthContext │  │SettingsContext│  │ Components  │  │  │
│  │  │   (User)    │  │  (Modal)      │  │  (UI)       │  │  │
│  │  └──────┬──────┘  └───────┬───────┘  └──────┬──────┘  │  │
│  │         │                 │                  │         │  │
│  │         └─────────────────┴──────────────────┘         │  │
│  │                           │                            │  │
│  │                    ┌──────▼──────┐                     │  │
│  │                    │   Hooks     │                     │  │
│  │                    │ useProfile  │                     │  │
│  │                    │ useSettings │                     │  │
│  │                    └──────┬──────┘                     │  │
│  │                           │                            │  │
│  │                    ┌──────▼──────┐                     │  │
│  │                    │  Services   │                     │  │
│  │                    │  Supabase   │                     │  │
│  │                    │  Storage    │                     │  │
│  │                    └──────┬──────┘                     │  │
│  └───────────────────────────┼────────────────────────────┘  │
└────────────────────────────────┼───────────────────────────────┘
                                │
                                │ HTTPS
                                │
┌────────────────────────────────▼───────────────────────────────┐
│                      Supabase Cloud                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  PostgreSQL  │  │   Storage    │  │     Auth     │        │
│  │              │  │              │  │              │        │
│  │  profiles    │  │   avatars    │  │    users     │        │
│  │  settings    │  │   bucket     │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
└── AuthProvider
    └── SettingsProvider
        ├── SettingsOverlay (z-index: 50)
        │   ├── SettingsNav
        │   │   ├── Section Buttons (12)
        │   │   ├── Log Out Button
        │   │   └── Delete Account Button
        │   └── Content Pane
        │       ├── MyAccountPage
        │       ├── ProfilePage ⭐
        │       │   ├── Avatar Upload
        │       │   ├── Username Input
        │       │   └── Bio Textarea
        │       ├── PrivacyPage
        │       ├── VoicePage
        │       ├── NotificationsPage
        │       ├── TextImagesPage
        │       ├── AppearancePage
        │       ├── AccessibilityPage
        │       ├── KeybindsPage
        │       ├── AdvancedPage
        │       ├── LanguagePage
        │       └── ChangelogPage
        └── AppLayout
            └── SelfFooter
                └── Gear Icon Button
```

## Data Flow: Profile Update

```
┌─────────────┐
│    User     │
│ clicks Save │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  ProfilePage    │
│  validates      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐     ┌──────────────┐
│  uploadAvatar() │────▶│   Storage    │
│  (if changed)   │     │   avatars/   │
└──────┬──────────┘     └──────────────┘
       │
       ▼
┌─────────────────┐     ┌──────────────┐
│ updateProfile() │────▶│ api.profiles │
│  useProfile     │     │   UPDATE     │
└──────┬──────────┘     └──────────────┘
       │
       ▼
┌─────────────────┐
│  updateUser()   │
│  AuthContext    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  SelfFooter     │
│  re-renders     │
│  new avatar     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Toast shown    │
│  "Success!"     │
└─────────────────┘
```

## Data Flow: Settings Update

```
┌─────────────┐
│    User     │
│ toggles     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  SettingsPage   │
│  optimistic UI  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐     ┌──────────────────┐
│ updateSettings()│────▶│ api.user_settings│
│  useSettings    │     │     UPSERT       │
└──────┬──────────┘     └──────────────────┘
       │
       ├─── Success ───▶ Keep optimistic update
       │
       └─── Error ─────▶ Rollback + Toast
```

## Database Schema

```
┌──────────────────────┐
│    auth.users        │
│  (Supabase Auth)     │
│                      │
│  id (UUID) PK        │
│  email               │
│  created_at          │
└──────────┬───────────┘
           │
           │ 1:1
           │
    ┌──────┴──────┬──────────────┐
    │             │              │
    ▼             ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│profiles │  │user_     │  │storage.  │
│         │  │settings  │  │objects   │
│id PK,FK │  │id PK,FK  │  │          │
│username │  │theme     │  │bucket_id │
│bio      │  │locale    │  │name      │
│avatar_  │  │reduced_  │  │          │
│  url    │  │  motion  │  │          │
│         │  │notifica- │  │          │
│         │  │  tions   │  │          │
│         │  │privacy   │  │          │
│         │  │...       │  │          │
└─────────┘  └──────────┘  └──────────┘
```

## User Flow: Opening Settings

```
┌─────────────────────────────────────────────────────────────┐
│                      User Journey                            │
└─────────────────────────────────────────────────────────────┘

1. User sees gear icon in bottom-left
   │
   ▼
2. User clicks gear icon
   │
   ▼
3. Settings overlay opens (full-screen)
   │
   ▼
4. Left nav shows 12 sections
   │
   ▼
5. User clicks "Profile"
   │
   ▼
6. Profile page loads with current data
   │
   ▼
7. User sees:
   - Current avatar (or initial)
   - Current username
   - Current bio
   │
   ▼
8. User clicks "Upload" button
   │
   ▼
9. File picker opens
   │
   ▼
10. User selects image
    │
    ▼
11. Validation runs (type, size)
    │
    ├─ Valid ──▶ Upload to storage ──▶ Preview updates
    │
    └─ Invalid ─▶ Error toast shown
    │
    ▼
12. User edits username and bio
    │
    ▼
13. User clicks "Save Changes"
    │
    ▼
14. Validation runs (length, chars, uniqueness)
    │
    ├─ Valid ──▶ Save to database ──▶ Success toast
    │
    └─ Invalid ─▶ Inline error shown
    │
    ▼
15. Changes persist
    │
    ▼
16. Avatar updates in SelfFooter
    │
    ▼
17. User closes settings (ESC or click outside)
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      Global State                            │
└─────────────────────────────────────────────────────────────┘

AuthContext
├── user: User | null
│   ├── id: string
│   ├── email: string
│   ├── username: string
│   ├── avatar_url: string | null
│   └── ...
├── isAuthenticated: boolean
├── login()
├── logout()
└── updateUser()

SettingsContext
├── isOpen: boolean
├── currentSection: string
├── openSettings()
├── closeSettings()
└── setSection()

┌─────────────────────────────────────────────────────────────┐
│                      Local State                             │
└─────────────────────────────────────────────────────────────┘

useProfile()
├── profile: Profile | null
├── loading: boolean
├── error: string | null
├── updateProfile()
└── refetch()

useSettings()
├── settings: UserSettings | null
├── loading: boolean
├── updateSettings()
└── refetch()

ProfilePage
├── username: string
├── bio: string
├── avatarUrl: string
├── saving: boolean
├── uploading: boolean
└── usernameError: string
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                      RLS Policies                            │
└─────────────────────────────────────────────────────────────┘

api.profiles
├── SELECT: Anyone can view (public profiles)
│   USING (true)
│
├── UPDATE: Users can only update their own
│   USING (auth.uid() = id)
│
└── INSERT: Users can only insert their own
    WITH CHECK (auth.uid() = id)

api.user_settings
├── SELECT: Users can only view their own
│   USING (auth.uid() = id)
│
├── UPDATE: Users can only update their own
│   USING (auth.uid() = id)
│
└── INSERT: Users can only insert their own
    WITH CHECK (auth.uid() = id)

storage.objects (avatars bucket)
├── SELECT: Public read
│   USING (bucket_id = 'avatars')
│
├── INSERT: Users can only upload to their own folder
│   WITH CHECK (
│     bucket_id = 'avatars' AND
│     auth.uid()::text = (storage.foldername(name))[1]
│   )
│
├── UPDATE: Users can only update their own files
│   USING (
│     bucket_id = 'avatars' AND
│     auth.uid()::text = (storage.foldername(name))[1]
│   )
│
└── DELETE: Users can only delete their own files
    USING (
      bucket_id = 'avatars' AND
      auth.uid()::text = (storage.foldername(name))[1]
    )
```

## File Upload Flow

```
┌─────────────┐
│    User     │
│ selects file│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Validate Type  │
│  PNG/JPG/WebP?  │
└──────┬──────────┘
       │
       ├─ No ──▶ Error toast
       │
       ▼
┌─────────────────┐
│  Validate Size  │
│    < 5MB?       │
└──────┬──────────┘
       │
       ├─ No ──▶ Error toast
       │
       ▼
┌─────────────────┐
│  Generate Path  │
│  avatars/       │
│  {userId}/      │
│  {timestamp}.   │
│  {ext}          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Upload to      │
│  Supabase       │
│  Storage        │
└──────┬──────────┘
       │
       ├─ Error ──▶ Error toast
       │
       ▼
┌─────────────────┐
│  Get Public URL │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Update State   │
│  avatarUrl      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Preview shown  │
└─────────────────┘
```

## Error Handling Flow

```
┌─────────────────┐
│  User Action    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Try Operation  │
└──────┬──────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌─────────────────┐            ┌─────────────────┐
│    Success      │            │     Error       │
└──────┬──────────┘            └──────┬──────────┘
       │                              │
       ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│  Update State   │            │  Check Error    │
└──────┬──────────┘            │     Type        │
       │                       └──────┬──────────┘
       ▼                              │
┌─────────────────┐                   ├─ 23505 (unique) ──▶ Inline error
│  Success Toast  │                   │
└─────────────────┘                   ├─ Network ─────────▶ Error toast
                                      │
                                      ├─ Validation ──────▶ Inline error
                                      │
                                      └─ Other ───────────▶ Error toast
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                   Optimization Strategy                      │
└─────────────────────────────────────────────────────────────┘

1. Lazy Loading
   ├── Settings pages only render when selected
   └── Reduces initial bundle size

2. Optimistic Updates
   ├── UI updates immediately
   ├── Request sent in background
   └── Rollback on error

3. Efficient Re-renders
   ├── Context split (Auth + Settings)
   ├── Local state in components
   └── Minimal prop drilling

4. Code Splitting
   ├── Settings overlay loaded on demand
   └── Individual pages lazy loaded

5. Caching
   ├── Profile data cached in hook
   ├── Settings data cached in hook
   └── Refetch only when needed
```

## Accessibility Tree

```
Settings Overlay (role="dialog")
├── Close Button (aria-label="Close")
├── Navigation (role="navigation")
│   ├── Section Buttons (role="button")
│   │   ├── My Account
│   │   ├── Profile
│   │   └── ... (10 more)
│   ├── Log Out (role="button")
│   └── Delete Account (role="button")
└── Content (role="main")
    └── Profile Page
        ├── Heading (role="heading")
        ├── Avatar Upload
        │   ├── Image (alt="Avatar")
        │   └── Button (aria-label="Upload avatar")
        ├── Username Input (aria-label="Username")
        ├── Bio Textarea (aria-label="Bio")
        ├── Save Button (aria-label="Save changes")
        └── Cancel Button (aria-label="Cancel")
```

---

For more details, see:
- **SETTINGS_ARCHITECTURE.md** - Detailed architecture
- **SETTINGS_COMPONENTS.md** - Component reference
- **SETTINGS_QUICKREF.md** - API reference
