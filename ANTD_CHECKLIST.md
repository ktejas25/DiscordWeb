# Ant Design Migration Checklist

## Phase 1: Setup ✅
- [x] Create migration plan document
- [x] Create component mapping document
- [x] Create implementation guide
- [ ] Install antd: `pnpm add antd`
- [x] Create `client/theme/antd.config.ts`
- [x] Create `client/providers/AntdProvider.tsx`
- [x] Create `client/ui/antd/` directory
- [x] Create wrapper components (Button, Input)
- [ ] Update `client/App.tsx` to use AntdProvider
- [ ] Test basic setup (Button, Input render correctly)

## Phase 2: Authentication Pages (Week 1-2)
- [x] Create `client/pages/LoginAntd.tsx`
- [ ] Create `client/pages/RegisterAntd.tsx`
- [ ] Update routes to use new pages
- [ ] Test login flow
- [ ] Test register flow
- [ ] Test form validation
- [ ] Test error handling
- [ ] Test loading states
- [ ] Accessibility audit (keyboard nav, screen reader)

## Phase 3: Core Wrapper Components (Week 2)
- [x] `client/ui/antd/Button.tsx` (with gradient support)
- [x] `client/ui/antd/Input.tsx`
- [ ] `client/ui/antd/Card.tsx`
- [ ] `client/ui/antd/Modal.tsx`
- [ ] `client/ui/antd/Form.tsx`
- [ ] `client/ui/antd/Select.tsx`
- [ ] `client/ui/antd/Notification.ts`
- [ ] `client/ui/antd/index.ts` (export all)
- [ ] Test each wrapper component
- [ ] Document usage in implementation guide

## Phase 4: Layout Components (Week 2-3)
- [ ] Migrate `client/components/AppLayout.tsx`
- [ ] Migrate `client/components/ServerSidebar.tsx`
- [ ] Create `client/ui/antd/Layout.tsx` wrapper
- [ ] Create `client/ui/antd/Menu.tsx` wrapper
- [ ] Test responsive layout
- [ ] Test sidebar collapse/expand
- [ ] Test navigation

## Phase 5: Feature Pages (Week 3-4)
- [ ] Migrate `client/pages/Landing.tsx` (navigation only)
- [ ] Migrate `client/pages/Channels.tsx`
- [ ] Migrate `client/components/ChannelsList.tsx`
- [ ] Migrate `client/components/MessageList.tsx`
- [ ] Migrate `client/components/FriendsList.tsx`
- [ ] Test all feature pages
- [ ] Test real-time updates
- [ ] Test message sending/receiving

## Phase 6: Modals & Forms (Week 4-5)
- [ ] Migrate `client/components/channel/InviteMemberModal.tsx`
- [ ] Migrate `client/components/server/RoleManagementModal.tsx`
- [ ] Migrate `client/components/server/RolesList.tsx`
- [ ] Migrate `client/components/server/MembersList.tsx`
- [ ] Create `client/ui/antd/Drawer.tsx` wrapper
- [ ] Test modal interactions
- [ ] Test form submissions
- [ ] Test validation

## Phase 7: Settings Pages (Week 5)
- [ ] Migrate `client/components/settings/SettingsOverlay.tsx`
- [ ] Migrate `client/components/settings/SettingsNav.tsx`
- [ ] Migrate all settings pages
- [ ] Create `client/ui/antd/Tabs.tsx` wrapper
- [ ] Test settings navigation
- [ ] Test settings save/load

## Phase 8: Admin & Tables (Week 5)
- [ ] Migrate `client/components/server/MemberRoleAssignment.tsx`
- [ ] Create `client/ui/antd/Table.tsx` wrapper
- [ ] Test table sorting
- [ ] Test table filtering
- [ ] Test table pagination

## Phase 9: Optimization (Week 5-6)
- [ ] Bundle size analysis: `pnpm build && npx vite-bundle-visualizer`
- [ ] Ensure bundle < 500KB gzipped
- [ ] Implement code splitting for heavy components
- [ ] Optimize icon imports (specific imports only)
- [ ] Test tree-shaking effectiveness
- [ ] Lighthouse performance audit (LCP < 2.5s, FCP < 1.5s)

## Phase 10: Accessibility (Week 6)
- [ ] Run axe-core on all pages
- [ ] Fix critical violations (target: 0)
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test screen reader (NVDA/JAWS)
- [ ] Test focus indicators
- [ ] Test color contrast (WCAG AA)
- [ ] Test `prefers-reduced-motion`
- [ ] Add ARIA labels where needed

## Phase 11: Testing (Week 6)
- [ ] Unit tests for wrapper components
- [ ] Integration tests for forms
- [ ] Integration tests for modals
- [ ] Visual regression tests (Percy/Chromatic)
- [ ] E2E tests for critical flows (login, send message)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing

## Phase 12: Documentation (Week 6)
- [ ] Update README with AntD info
- [ ] Create component usage examples
- [ ] Create theme customization guide
- [ ] Create troubleshooting guide
- [ ] Document migration patterns
- [ ] Create video walkthrough (optional)

## Phase 13: Cleanup (Week 6)
- [ ] Remove old Radix components from `client/components/ui/`
- [ ] Remove unused @radix-ui/* dependencies
- [ ] Remove old toast/sonner if replaced
- [ ] Update imports across codebase
- [ ] Remove feature flags (if used)
- [ ] Clean up commented code

## Phase 14: Rollout (Week 6)
- [ ] Deploy to staging environment
- [ ] Internal testing (dev team)
- [ ] Canary release (5% users)
- [ ] Monitor error rates (Sentry)
- [ ] Monitor performance (Lighthouse CI)
- [ ] Gradual rollout (25% → 50% → 100%)
- [ ] Monitor user feedback
- [ ] Fix critical issues
- [ ] Full rollout

## Success Metrics
- [ ] Bundle size < 500KB gzipped
- [ ] LCP < 2.5s
- [ ] FCP < 1.5s
- [ ] 0 critical accessibility violations
- [ ] No increase in error rates
- [ ] No increase in support tickets
- [ ] Positive developer feedback

## Rollback Plan
- [ ] Keep old components until 100% rollout
- [ ] Feature flags for instant rollback (optional)
- [ ] Database/API unchanged (UI-only)
- [ ] Documented rollback procedure

## Post-Migration
- [ ] Remove old Radix dependencies: `pnpm remove @radix-ui/*`
- [ ] Archive migration documents
- [ ] Celebrate! 🎉
- [ ] Retrospective meeting
- [ ] Document lessons learned

---

## Quick Commands

### Install
```bash
pnpm add antd
```

### Build & Analyze
```bash
pnpm build
npx vite-bundle-visualizer
```

### Test
```bash
pnpm test
pnpm test:a11y  # If configured
```

### Lighthouse CI
```bash
pnpm build
npx lighthouse http://localhost:4173 --view
```

---

## Notes
- Keep this checklist updated as you progress
- Mark items complete with `[x]`
- Add notes for blockers or issues
- Review weekly with team
