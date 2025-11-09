# Settings Usage Guide

Quick reference for using settings throughout the app.

## Reading Settings

```typescript
import { useSettings } from '@/hooks/useSettings';

function MyComponent() {
  const { settings, loading } = useSettings();
  
  // Access any setting
  const theme = settings?.settings?.theme || 'system';
  const allowDMs = settings?.settings?.privacy?.allowDMsFromServerMembers ?? true;
  const inputVolume = settings?.settings?.voice?.inputVolume ?? 100;
}
```

## Updating Settings

```typescript
import { useSettings } from '@/hooks/useSettings';

function MyComponent() {
  const { updateSettings } = useSettings();
  
  // Update a top-level setting
  await updateSettings({ theme: 'dark' });
  
  // Update a nested setting
  await updateSettings({ 
    privacy: { 
      ...settings?.settings?.privacy, 
      allowDMsFromServerMembers: false 
    } 
  });
}
```

## Checking Privacy Settings

```typescript
import { settingsService } from '@/services/settingsService';

// Check if user accepts DMs
const allowsDMs = await settingsService.checkPrivacySetting(
  userId, 
  'allowDMsFromServerMembers'
);

// Check if user accepts friend requests
const allowsFriendRequests = await settingsService.checkPrivacySetting(
  userId, 
  'allowFriendRequests'
);

if (!allowsDMs) {
  throw new Error('This user does not accept direct messages.');
}
```

## Showing Notifications

```typescript
import { settingsService } from '@/services/settingsService';

// Play notification sound
const notifSettings = await settingsService.getNotificationSettings(userId);
if (notifSettings.enableSounds) {
  settingsService.playNotificationSound();
}

// Show desktop notification
if (notifSettings.desktopPush) {
  settingsService.showDesktopNotification('New Message', 'You have a new message!');
}
```

## Applying Theme Globally

The `useTheme` hook automatically applies theme, font size, and reduced motion on app load. It's already integrated in `App.tsx`.

```typescript
import { useTheme } from '@/hooks/useTheme';

function AppContent() {
  useTheme(); // Automatically applies all appearance settings
  return <YourApp />;
}
```

## Settings Structure

```typescript
interface Settings {
  theme: 'system' | 'dark' | 'light';
  locale: string; // 'en', 'es', 'fr', etc.
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  notifications: {
    enableSounds: boolean;
    desktopPush: boolean;
  };
  privacy: {
    allowDMsFromServerMembers: boolean;
    allowFriendRequests: boolean;
  };
  textImages: {
    linkPreviews: boolean;
    showEmoji: boolean;
  };
  voice: {
    inputVolume: number; // 0-100
    inputDevice: string;
    outputDevice: string;
  };
  advanced: {
    developerMode: boolean;
    debugLogs: boolean;
  };
  keybinds: {
    pushToTalk: string;
    toggleMute: string;
  };
}
```

## Common Patterns

### Conditional Rendering Based on Settings

```typescript
const { settings } = useSettings();
const showEmoji = settings?.settings?.textImages?.showEmoji ?? true;

return (
  <div>
    {showEmoji && <span>😀</span>}
  </div>
);
```

### Gating Features with Developer Mode

```typescript
const { settings } = useSettings();
const devMode = settings?.settings?.advanced?.developerMode ?? false;

return (
  <div>
    {devMode && <DebugPanel />}
  </div>
);
```

### Respecting Reduced Motion

CSS automatically handles this via the `.reduce-motion` class, but you can also check in JS:

```typescript
const { settings } = useSettings();
const reducedMotion = settings?.settings?.reducedMotion ?? false;

return (
  <motion.div
    animate={reducedMotion ? {} : { scale: 1.2 }}
  >
    Content
  </motion.div>
);
```

## Error Handling

Always handle errors when checking privacy settings:

```typescript
try {
  await dmService.sendDMMessage(conversationId, authorId, content);
} catch (error: any) {
  const message = error?.message || 'Failed to send message';
  toast.error(message); // Shows "This user does not accept direct messages."
}
```

## Best Practices

1. **Always provide defaults**: Use `??` operator for boolean settings
2. **Check privacy before actions**: Always check recipient's settings before sending DMs/friend requests
3. **Show user feedback**: Use toast messages for blocked actions
4. **Feature detection**: Check for browser API availability before using
5. **Immediate application**: Apply theme/font-size changes immediately, not on reload
6. **Cleanup listeners**: Remove event listeners in useEffect cleanup
7. **Persist immediately**: Update settings as soon as user changes them

## Testing Checklist

- [ ] Settings persist after page reload
- [ ] Privacy toggles block actions with toast messages
- [ ] Theme changes apply immediately
- [ ] Font size changes apply immediately
- [ ] Reduced motion disables animations
- [ ] Notification permission requested when enabling
- [ ] Voice slider is interactive and shows value
- [ ] Keybind recording works and can be canceled with Escape
- [ ] Language selector shows all 15 languages
- [ ] Changelog displays new v1.1.0 entry
