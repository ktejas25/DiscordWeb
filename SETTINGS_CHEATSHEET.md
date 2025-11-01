# Settings Feature - Cheat Sheet

## 🚀 Quick Start (3 Steps)

```bash
# 1. Run SQL migration in Supabase Dashboard
supabase/migrations/001_profiles_and_settings.sql

# 2. Start dev server
npm run dev

# 3. Test: Click gear → Profile → Upload avatar → Save
```

## 📦 Key Files

| File | Purpose |
|------|---------|
| `SettingsOverlay.tsx` | Main modal |
| `ProfilePage.tsx` | Username/avatar/bio |
| `useProfile.ts` | Profile CRUD |
| `useSettings.ts` | Settings CRUD |
| `storageService.ts` | Avatar upload |

## 🎯 Common Tasks

### Open Settings
```tsx
import { useSettingsModal } from '@/contexts/SettingsContext';
const { openSettings } = useSettingsModal();
openSettings('profile');
```

### Update Profile
```tsx
import { useProfile } from '@/hooks/useProfile';
const { updateProfile } = useProfile();
await updateProfile({ username: 'new', bio: 'Hi!' });
```

### Update Settings
```tsx
import { useSettings } from '@/hooks/useSettings';
const { updateSettings } = useSettings();
await updateSettings({ theme: 'dark' });
```

### Upload Avatar
```tsx
import { uploadAvatar } from '@/services/storageService';
const url = await uploadAvatar(userId, file);
```

## 🗄️ Database

### Tables
```sql
api.profiles (id, username, bio, avatar_url)
api.user_settings (id, theme, locale, ...)
```

### Storage
```
avatars/{userId}/{timestamp}.{ext}
```

## ✅ Validation

| Field | Rules |
|-------|-------|
| Username | 3-32 chars, alphanumeric + _ -, unique |
| Avatar | PNG/JPG/WebP, max 5MB |
| Bio | Max 300 chars |

## 🎨 Sections

1. My Account (read-only)
2. **Profile** (username, avatar, bio) ⭐
3. Privacy & Safety
4. Voice & Audio
5. Notifications
6. Text & Images
7. Appearance
8. Accessibility
9. Keybinds
10. Advanced
11. Language
12. Changelog

## 🔒 Security

```sql
-- RLS: Users can only access their own data
USING (auth.uid() = id)
```

## 🎨 Styling

```css
bg-discord-dark      /* Main background */
bg-discord-darker    /* Sidebar/inputs */
text-discord-muted   /* Secondary text */
text-white           /* Primary text */
```

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Migration fails | Check if tables exist, drop first |
| Avatar upload fails | Verify bucket exists, check RLS |
| Username conflict | Verify unique constraint |
| Settings don't persist | Check RLS policies |

## 📚 Docs

- **Setup**: `setup-settings.md`
- **API**: `SETTINGS_QUICKREF.md`
- **Architecture**: `SETTINGS_ARCHITECTURE.md`
- **Testing**: `SETTINGS_TESTING.md`
- **Complete**: `SETTINGS_COMPLETE.md`

## 🎯 Testing

```bash
# Manual test flow
1. Click gear icon
2. Go to Profile
3. Upload avatar (PNG/JPG/WebP, <5MB)
4. Change username (3-32 chars, unique)
5. Add bio (max 300 chars)
6. Click Save
7. Verify changes persist after reload
```

## 📊 Stats

- **Files**: 30+
- **Lines**: 2,500+
- **Sections**: 12
- **Tests**: 150+
- **Docs**: 10

## 🚀 Deployment

```bash
# Pre-deploy checklist
✅ Migration applied
✅ Storage configured
✅ RLS enabled
✅ Tests pass
✅ No console errors
```

## 🔗 Quick Links

- [Complete Guide](./SETTINGS_COMPLETE.md)
- [Setup Guide](./setup-settings.md)
- [API Reference](./SETTINGS_QUICKREF.md)
- [Testing](./SETTINGS_TESTING.md)

---

**Need more?** See [SETTINGS_INDEX.md](./SETTINGS_INDEX.md) for full documentation.
