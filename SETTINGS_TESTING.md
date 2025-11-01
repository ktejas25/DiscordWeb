# Settings Feature - Testing Checklist

## Pre-Testing Setup

- [ ] Database migration executed successfully
- [ ] `avatars` storage bucket exists and is public
- [ ] RLS policies enabled on all tables
- [ ] Dev server running (`npm run dev`)
- [ ] User logged in

## 1. Settings Overlay

### Opening/Closing
- [ ] Click gear icon in bottom-left → overlay opens
- [ ] Press ESC → overlay closes
- [ ] Click outside overlay → overlay closes
- [ ] Click X button in top-right → overlay closes
- [ ] Overlay is full-screen
- [ ] Overlay has dark background (80% opacity)

### Navigation
- [ ] Left sidebar shows all 12 sections
- [ ] Sections grouped by category (User Settings, App Settings, Info)
- [ ] Current section is highlighted
- [ ] Click section → content changes
- [ ] Scroll state preserved per section
- [ ] Log Out button at bottom
- [ ] Delete Account button at bottom

## 2. My Account Page

- [ ] Shows email (read-only)
- [ ] Shows user ID (read-only)
- [ ] Shows account created date (read-only)
- [ ] Shows username (read-only)
- [ ] "Change Password" link present

## 3. Profile Page (CRITICAL)

### Avatar Upload
- [ ] Shows current avatar or initial
- [ ] Click "Upload" → file picker opens
- [ ] Select PNG → uploads successfully
- [ ] Select JPG → uploads successfully
- [ ] Select WebP → uploads successfully
- [ ] Select PDF → shows error toast
- [ ] Select 6MB file → shows error toast
- [ ] Upload shows "Uploading..." state
- [ ] Avatar preview updates after upload
- [ ] Avatar URL saved to database

### Username
- [ ] Shows current username
- [ ] Can edit username
- [ ] Empty username → shows error "Username is required"
- [ ] 2-char username → shows error "Username must be 3-32 characters"
- [ ] 33-char username → shows error "Username must be 3-32 characters"
- [ ] Username with spaces → shows error "Username can only contain..."
- [ ] Username with special chars → shows error
- [ ] Duplicate username → shows error "This username is already taken"
- [ ] Valid username → saves successfully

### Bio
- [ ] Shows current bio (or empty)
- [ ] Can edit bio
- [ ] Character counter shows X/300
- [ ] Can type up to 300 characters
- [ ] Cannot type beyond 300 characters
- [ ] Bio saves successfully

### Save/Cancel
- [ ] "Save Changes" button present
- [ ] "Cancel" button present
- [ ] Click Save → shows "Saving..." state
- [ ] Save button disabled while saving
- [ ] Success → shows success toast
- [ ] Error → shows error toast
- [ ] Cancel → reverts changes
- [ ] Changes persist after page reload

### Integration
- [ ] Avatar updates in SelfFooter after save
- [ ] Username updates in SelfFooter after save
- [ ] Changes visible in other parts of app

## 4. Privacy & Safety Page

- [ ] "Allow Direct Messages" toggle present
- [ ] Toggle works (on/off)
- [ ] "Allow Friend Requests" toggle present
- [ ] Toggle works (on/off)
- [ ] Settings persist after page reload

## 5. Voice & Audio Page

- [ ] "Input Device" field present (disabled)
- [ ] "Output Device" field present (disabled)
- [ ] "Push to Talk Keybind" field present (disabled)
- [ ] No errors in console

## 6. Notifications Page

- [ ] "Enable Notifications" toggle present
- [ ] Toggle works (on/off)
- [ ] "Notification Sound" toggle present
- [ ] Toggle works (on/off)
- [ ] Settings persist after page reload

## 7. Text & Images Page

- [ ] "Show Link Previews" toggle present
- [ ] Toggle works (on/off)
- [ ] "Show Emoji" toggle present
- [ ] Toggle works (on/off)
- [ ] Settings persist after page reload

## 8. Appearance Page

- [ ] "Theme" dropdown present
- [ ] Can select Dark
- [ ] Can select Light
- [ ] Can select System
- [ ] Selection persists after page reload
- [ ] "Font Size" dropdown present
- [ ] Can select Small/Medium/Large

## 9. Accessibility Page

- [ ] "Reduced Motion" toggle present
- [ ] Toggle works (on/off)
- [ ] "High Contrast" toggle present
- [ ] Toggle works (on/off)
- [ ] Settings persist after page reload

## 10. Keybinds Page

- [ ] "Push to Talk" field present (disabled)
- [ ] "Toggle Mute" field present (disabled)
- [ ] No errors in console

## 11. Advanced Page

- [ ] "Developer Mode" toggle present
- [ ] Toggle works (on/off)
- [ ] "Debug Logs" toggle present
- [ ] Toggle works (on/off)
- [ ] Settings persist after page reload

## 12. Language Page

- [ ] "Language" dropdown present
- [ ] Can select English
- [ ] Can select Español
- [ ] Can select Français
- [ ] Can select Deutsch
- [ ] Can select 日本語
- [ ] Selection persists after page reload

## 13. Changelog Page

- [ ] Shows version number
- [ ] Shows release date
- [ ] Shows feature list
- [ ] No errors in console

## 14. Log Out

- [ ] Click "Log Out" button
- [ ] User logged out
- [ ] Redirected to login page
- [ ] Settings overlay closes

## 15. Accessibility

- [ ] Tab key navigates through controls
- [ ] Shift+Tab navigates backwards
- [ ] Enter key activates buttons
- [ ] Space key toggles switches
- [ ] Focus visible on all controls
- [ ] Screen reader announces labels
- [ ] No keyboard traps (except modal)

## 16. Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save profile → shows error toast
- [ ] Reconnect internet
- [ ] Try again → saves successfully

### Validation Errors
- [ ] Invalid username → inline error shown
- [ ] Invalid file type → toast error shown
- [ ] File too large → toast error shown
- [ ] Duplicate username → inline error shown

### Edge Cases
- [ ] Open settings, log out → overlay closes
- [ ] Open settings, navigate away → overlay closes
- [ ] Multiple rapid saves → handled gracefully
- [ ] Upload avatar while saving profile → handled gracefully

## 17. Performance

- [ ] Overlay opens instantly (<100ms)
- [ ] Section switching is instant
- [ ] No lag when typing in inputs
- [ ] Avatar upload shows progress
- [ ] No memory leaks (check DevTools)

## 18. Browser Compatibility

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## 19. Database Verification

Run these queries in Supabase SQL Editor:

```sql
-- Check profile was created
SELECT * FROM api.profiles WHERE id = 'YOUR_USER_ID';

-- Check settings were created
SELECT * FROM api.user_settings WHERE id = 'YOUR_USER_ID';

-- Check avatar was uploaded
SELECT * FROM storage.objects WHERE bucket_id = 'avatars';
```

- [ ] Profile row exists
- [ ] Settings row exists
- [ ] Avatar file exists in storage

## 20. Security Testing

### RLS Policies
- [ ] User A cannot view User B's settings
- [ ] User A cannot update User B's profile
- [ ] User A cannot upload to User B's avatar folder
- [ ] User A cannot delete User B's avatar

### Input Sanitization
- [ ] XSS attempt in username → sanitized
- [ ] XSS attempt in bio → sanitized
- [ ] SQL injection attempt → blocked by Supabase

## Bug Report Template

If you find a bug, report it with:

```
**Bug**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]

**Actual**: [What actually happened]

**Console Errors**: [Copy/paste any errors]

**Browser**: [Chrome 120, Firefox 121, etc.]

**Screenshot**: [If applicable]
```

## Test Results

Date: ___________
Tester: ___________

Total Tests: 150+
Passed: ___________
Failed: ___________
Blocked: ___________

Critical Issues: ___________
Minor Issues: ___________

Notes:
___________________________________________
___________________________________________
___________________________________________
