# Settings Feature Implementation

## Overview
Complete Discord-style settings overlay with profile management, avatar uploads, and user preferences.

## Features Implemented

### 1. Storage (Supabase)
- **Avatars bucket**: Public bucket for avatar images
- **Upload path**: `avatars/{userId}/{timestamp}.{ext}`
- **File validation**: PNG/JPG/WebP, max 5MB
- **RLS policies**: Users can only upload/update/delete their own avatars

### 2. Database Schema
- **api.profiles table**:
  - `id` (UUID, references auth.users)
  - `username` (TEXT, UNIQUE)
  - `bio` (TEXT, max 300 chars)
  - `avatar_url` (TEXT)
  - Timestamps

- **api.user_settings table**:
  - `id` (UUID, references auth.users)
  - `theme` (TEXT: dark/light/system)
  - `locale` (TEXT: en/es/fr/de/ja)
  - `reduced_motion` (BOOLEAN)
  - `notifications` (JSONB)
  - `privacy` (JSONB)
  - `voice` (JSONB)
  - `text_images` (JSONB)
  - `appearance` (JSONB)
  - `accessibility` (JSONB)
  - `keybinds` (JSONB)
  - `advanced` (JSONB)

### 3. UI Components

#### Settings Overlay
- Full-screen modal with ESC/click-outside to close
- Left navigation sidebar with all sections
- Right content pane with section-specific forms
- Focus trap and keyboard navigation

#### Settings Sections
1. **My Account** (read-only): Email, User ID, Created date, Username
2. **Profile** (editable): Username, Avatar upload, Bio (300 chars)
3. **Privacy & Safety**: DM permissions, Friend requests
4. **Voice & Audio**: Device selection (placeholder), Push-to-talk
5. **Notifications**: Enable/disable, Sound toggle
6. **Text & Images**: Link previews, Emoji display
7. **Appearance**: Theme selector, Font size
8. **Accessibility**: Reduced motion, High contrast
9. **Keybinds**: Push-to-talk, Toggle mute (placeholders)
10. **Advanced**: Developer mode, Debug logs
11. **Language**: Locale selector
12. **Changelog**: Version history

### 4. Client Services

#### storageService.ts
- `uploadAvatar(userId, file)`: Upload avatar to Supabase Storage
- `deleteAvatar(url)`: Remove avatar from storage

#### Hooks
- `useProfile()`: Fetch/update user profile (username, bio, avatar_url)
- `useSettings()`: Fetch/update user settings (theme, locale, etc.)

#### Context
- `SettingsContext`: Manage overlay open/close state and current section

### 5. Validation & Error Handling

#### Username Validation
- Required, 3-32 characters
- Only letters, numbers, underscore, hyphen
- Uniqueness check (catches PostgreSQL 23505 error)
- Inline error display

#### Avatar Upload
- File type validation (PNG/JPG/WebP)
- Size limit (5MB)
- Error toasts on failure
- Optimistic UI with rollback

#### Settings Persistence
- Optimistic updates
- Rollback on network failure
- Toast notifications for success/error

## Setup Instructions

### 1. Run Database Migration
```bash
# Connect to your Supabase project and run:
supabase/migrations/001_profiles_and_settings.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `001_profiles_and_settings.sql`
3. Execute

### 2. Verify Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Verify `avatars` bucket exists and is public
3. Check RLS policies are enabled

### 3. Test the Feature
1. Click gear icon in bottom-left self area
2. Navigate to Profile section
3. Upload an avatar (PNG/JPG/WebP, <5MB)
4. Change username (must be unique)
5. Add a bio (max 300 chars)
6. Click Save
7. Verify changes persist across page reload

## File Structure
```
client/
├── components/
│   ├── settings/
│   │   ├── SettingsOverlay.tsx      # Main overlay container
│   │   ├── SettingsNav.tsx          # Left navigation
│   │   └── pages/
│   │       ├── MyAccountPage.tsx
│   │       ├── ProfilePage.tsx      # Avatar/username/bio
│   │       ├── PrivacyPage.tsx
│   │       ├── VoicePage.tsx
│   │       ├── NotificationsPage.tsx
│   │       ├── TextImagesPage.tsx
│   │       ├── AppearancePage.tsx
│   │       ├── AccessibilityPage.tsx
│   │       ├── KeybindsPage.tsx
│   │       ├── AdvancedPage.tsx
│   │       ├── LanguagePage.tsx
│   │       └── ChangelogPage.tsx
│   └── SelfFooter.tsx               # Updated with gear button
├── contexts/
│   └── SettingsContext.tsx          # Settings state management
├── hooks/
│   ├── useProfile.ts                # Profile CRUD
│   └── useSettings.ts               # Settings CRUD
├── services/
│   └── storageService.ts            # Avatar upload/delete
└── App.tsx                          # Added SettingsProvider

supabase/
└── migrations/
    └── 001_profiles_and_settings.sql
```

## API Endpoints (Supabase)

### Profiles
- `GET /rest/v1/profiles?id=eq.{userId}` - Fetch profile
- `POST /rest/v1/profiles` - Create profile
- `PATCH /rest/v1/profiles?id=eq.{userId}` - Update profile

### User Settings
- `GET /rest/v1/user_settings?id=eq.{userId}` - Fetch settings
- `POST /rest/v1/user_settings` - Create settings
- `PATCH /rest/v1/user_settings?id=eq.{userId}` - Update settings

### Storage
- `POST /storage/v1/object/avatars/{path}` - Upload avatar
- `DELETE /storage/v1/object/avatars/{path}` - Delete avatar
- `GET /storage/v1/object/public/avatars/{path}` - Get public URL

## Accessibility Features
- Focus trap in modal
- ESC key to close
- Keyboard navigation
- ARIA labels on all interactive elements
- Screen reader friendly

## Future Enhancements
- Avatar cropping tool
- Password change flow (Supabase reset)
- Delete account confirmation
- Export user data
- Keybind editor with conflict detection
- Voice device selection (WebRTC integration)
- Theme customization (colors, accent)
- Font family selector
