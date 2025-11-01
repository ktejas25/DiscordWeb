# Settings Feature - Quick Reference

## 🎯 One-Minute Overview
Discord-style settings overlay with profile management (username, avatar, bio) and user preferences. Click gear icon → edit profile → save. All changes persist to Supabase.

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `supabase/migrations/001_profiles_and_settings.sql` | Database schema + RLS |
| `client/services/storageService.ts` | Avatar upload/delete |
| `client/hooks/useProfile.ts` | Profile CRUD |
| `client/hooks/useSettings.ts` | Settings CRUD |
| `client/contexts/SettingsContext.tsx` | Modal state |
| `client/components/settings/SettingsOverlay.tsx` | Main overlay |
| `client/components/settings/pages/ProfilePage.tsx` | Username/avatar/bio editor |

## 🚀 Quick Setup

```bash
# 1. Run migration in Supabase SQL Editor
# Copy/paste: supabase/migrations/001_profiles_and_settings.sql

# 2. Start dev server
npm run dev

# 3. Test: Click gear icon → Profile → Upload avatar → Save
```

## 📦 API Usage

### Profile Hook
```typescript
import { useProfile } from '@/hooks/useProfile';

const { profile, updateProfile, loading } = useProfile();

// Update profile
await updateProfile({ 
  username: 'newname', 
  bio: 'Hello!', 
  avatar_url: 'https://...' 
});
```

### Settings Hook
```typescript
import { useSettings } from '@/hooks/useSettings';

const { settings, updateSettings } = useSettings();

// Update settings
await updateSettings({ 
  theme: 'dark', 
  locale: 'en',
  reduced_motion: true 
});
```

### Settings Modal
```typescript
import { useSettingsModal } from '@/contexts/SettingsContext';

const { openSettings, closeSettings } = useSettingsModal();

// Open to specific section
openSettings('profile');
```

### Storage Service
```typescript
import { uploadAvatar } from '@/services/storageService';

const url = await uploadAvatar(userId, file);
```

## 🗄️ Database Schema

### api.profiles
```sql
id          UUID PRIMARY KEY
username    TEXT UNIQUE NOT NULL
bio         TEXT
avatar_url  TEXT
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### api.user_settings
```sql
id              UUID PRIMARY KEY
theme           TEXT (dark/light/system)
locale          TEXT (en/es/fr/de/ja)
reduced_motion  BOOLEAN
notifications   JSONB
privacy         JSONB
voice           JSONB
text_images     JSONB
appearance      JSONB
accessibility   JSONB
keybinds        JSONB
advanced        JSONB
```

## 🎨 Settings Sections

| Section | Persisted | Status |
|---------|-----------|--------|
| My Account | Read-only | ✅ |
| Profile | username, bio, avatar_url | ✅ |
| Privacy & Safety | privacy JSONB | ✅ |
| Voice & Audio | voice JSONB | 🚧 Placeholder |
| Notifications | notifications JSONB | ✅ |
| Text & Images | text_images JSONB | ✅ |
| Appearance | theme, appearance JSONB | ✅ |
| Accessibility | reduced_motion, accessibility JSONB | ✅ |
| Keybinds | keybinds JSONB | 🚧 Placeholder |
| Advanced | advanced JSONB | ✅ |
| Language | locale | ✅ |
| Changelog | Static | ✅ |

## 🔒 Security (RLS)

```sql
-- Users can only access their own data
auth.uid() = id
```

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| Username | 3-32 chars, alphanumeric + _ -, unique |
| Bio | Max 300 chars |
| Avatar | PNG/JPG/WebP, max 5MB |

## 🎯 Common Tasks

### Add New Setting
```typescript
// 1. Update user_settings table (or use existing JSONB column)
// 2. Add UI in appropriate settings page
// 3. Use updateSettings() to persist

const { settings, updateSettings } = useSettings();
await updateSettings({ 
  notifications: { 
    ...settings.notifications, 
    newSetting: true 
  } 
});
```

### Add New Section
```typescript
// 1. Create page: client/components/settings/pages/NewPage.tsx
// 2. Export in pages/index.ts
// 3. Add to SettingsNav sections array
// 4. Add case in SettingsOverlay renderContent()
```

### Customize Avatar Upload
```typescript
// Edit: client/services/storageService.ts
// Change path format, add image processing, etc.
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration fails | Check if tables exist, drop and re-run |
| Avatar upload fails | Verify bucket exists, check RLS policies |
| Username conflict not caught | Verify unique constraint on username |
| Settings don't persist | Check RLS policies, verify user is authenticated |
| Overlay doesn't open | Check SettingsProvider in App.tsx |

## 📚 Related Docs
- Full implementation: `SETTINGS_IMPLEMENTATION.md`
- Setup guide: `setup-settings.md`
- Summary: `SETTINGS_SUMMARY.md`
