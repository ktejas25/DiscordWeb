# Ant Design Migration Plan - Harmony Project

## Executive Summary
Migrate Harmony from Radix UI + Tailwind to Ant Design (antd) v5 as the primary component library while preserving the dark Discord-like theme and brand identity.

---

## Phase 1: Setup & Configuration (Week 1)

### 1.1 Dependencies
```bash
pnpm add antd
pnpm add -D @ant-design/cssinjs
```

### 1.2 Remove/Keep Strategy
- **Keep**: Tailwind (for utilities), lucide-react (icons), framer-motion
- **Phase out**: All @radix-ui/* packages (gradually)
- **Remove**: shadcn/ui components in `client/components/ui/` (after migration)

### 1.3 Configuration Files
- Create `client/theme/antd.config.ts` - Theme tokens
- Create `client/providers/AntdProvider.tsx` - ConfigProvider wrapper
- Update `vite.config.ts` - Ensure CSS-in-JS support

---

## Phase 2: Theme & Design Tokens (Week 1)

### 2.1 Token Mapping
| Harmony Token | AntD v5 Token | Value |
|---------------|---------------|-------|
| `--primary` | `colorPrimary` | `hsl(235, 85%, 64%)` → `#6366f1` |
| `--background` | `colorBgBase` | `hsl(218, 14%, 9%)` → `#141419` |
| `--card` | `colorBgContainer` | `hsl(215, 14%, 12%)` → `#1a1b21` |
| `--border` | `colorBorder` | `hsl(215, 13%, 17%)` → `#26272f` |
| `--radius` | `borderRadius` | `12px` |
| `--text-color` | `colorText` | `hsl(210, 40%, 98%)` → `#f9fafb` |

### 2.2 Component-Specific Overrides
- **Button**: Gradient backgrounds, 11px height
- **Input**: Dark background, focus ring
- **Modal**: Backdrop blur, rounded corners
- **Card**: Elevated shadows, border glow

---

## Phase 3: Component Mapping

### Core Components
| Current (Radix/Custom) | AntD Equivalent | Wrapper Needed |
|------------------------|-----------------|----------------|
| `Button` | `Button` | ✅ Yes (gradient) |
| `Input` | `Input` | ✅ Yes (styling) |
| `Card` | `Card` | ✅ Yes (blur) |
| `Dialog` | `Modal` | ✅ Yes (footer) |
| `Select` | `Select` | ✅ Yes (dark theme) |
| `Tabs` | `Tabs` | ✅ Yes (styling) |
| `Avatar` | `Avatar` | ❌ No |
| `Badge` | `Badge` | ❌ No |
| `Tooltip` | `Tooltip` | ❌ No |
| `Dropdown` | `Dropdown` | ✅ Yes (menu style) |
| `Form` | `Form` | ✅ Yes (validation) |
| `Table` | `Table` | ✅ Yes (dark theme) |
| `Layout` | `Layout` | ✅ Yes (sidebar) |
| `Menu` | `Menu` | ✅ Yes (navigation) |

---

## Phase 4: Implementation Priority

### Week 1-2: Foundation
1. ✅ Install antd + configure theme
2. ✅ Create `AntdProvider` with ConfigProvider
3. ✅ Create wrapper components in `client/ui/antd/`
4. ✅ Update `App.tsx` to use AntdProvider

### Week 2-3: Authentication & Core
5. ✅ Migrate `Login.tsx` (HIGH PRIORITY)
6. ✅ Migrate `Register.tsx`
7. ✅ Migrate `Landing.tsx` navigation
8. ✅ Create shared layout components

### Week 3-4: Feature Pages
9. ✅ Migrate `AppLayout.tsx`
10. ✅ Migrate `ServerSidebar.tsx`
11. ✅ Migrate `ChannelsList.tsx`
12. ✅ Migrate `MessageList.tsx`
13. ✅ Migrate Settings pages

### Week 4-5: Advanced Features
14. ✅ Migrate modals (InviteMemberModal, RoleManagementModal)
15. ✅ Migrate forms (channel creation, server settings)
16. ✅ Migrate admin/role management tables

### Week 5-6: Polish & Optimization
17. ✅ Accessibility audit (axe-core)
18. ✅ Performance optimization (bundle analysis)
19. ✅ Visual regression tests (Percy/Chromatic)
20. ✅ Remove old Radix components

---

## Phase 5: Wrapper Components Architecture

### Directory Structure
```
client/
├── ui/
│   ├── antd/
│   │   ├── Button.tsx          # Gradient + loading
│   │   ├── Input.tsx           # Dark theme + icons
│   │   ├── Modal.tsx           # Backdrop blur
│   │   ├── Form.tsx            # Validation helpers
│   │   ├── Card.tsx            # Elevated shadows
│   │   ├── Select.tsx          # Dark dropdown
│   │   ├── Table.tsx           # Dark table
│   │   ├── Layout.tsx          # Sidebar layout
│   │   ├── Menu.tsx            # Navigation menu
│   │   ├── Notification.ts     # Toast wrapper
│   │   └── index.ts            # Re-exports
│   └── [old radix components]  # Delete after migration
```

---

## Phase 6: Performance & Bundle Size

### Optimization Strategy
1. **Tree-shaking**: Use named imports only
   ```ts
   import { Button, Input } from 'antd'; // ✅ Good
   import * as antd from 'antd'; // ❌ Bad
   ```

2. **Code Splitting**: Lazy load heavy components
   ```tsx
   const RoleManagementModal = lazy(() => import('./RoleManagementModal'));
   ```

3. **Icon Optimization**: Import specific icons
   ```ts
   import { UserOutlined } from '@ant-design/icons'; // ✅ Good
   import * as Icons from '@ant-design/icons'; // ❌ Bad
   ```

4. **Bundle Analysis**: Target < 50KB increase
   ```bash
   pnpm build && npx vite-bundle-visualizer
   ```

### Expected Bundle Impact
- **Before**: ~450KB (gzipped)
- **After**: ~480KB (gzipped) - Target < 500KB
- **Savings**: Remove Radix (~30KB) + optimize icons (~20KB)

---

## Phase 7: Accessibility & Testing

### Accessibility Checklist
- [ ] All forms have proper labels and ARIA attributes
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Screen reader announcements for dynamic content
- [ ] `prefers-reduced-motion` respected

### Testing Strategy
1. **Unit Tests**: Wrapper components (Vitest)
2. **Integration Tests**: Forms and modals (React Testing Library)
3. **Visual Regression**: Critical pages (Percy/Chromatic)
4. **Accessibility**: Automated scans (axe-core in CI)
5. **Performance**: Lighthouse CI (FCP < 1.5s, LCP < 2.5s)

### CI/CD Integration
```yaml
# .github/workflows/antd-quality.yml
- name: Accessibility Audit
  run: pnpm test:a11y
- name: Bundle Size Check
  run: pnpm build && npx bundlesize
- name: Visual Regression
  run: pnpm percy
```

---

## Phase 8: Migration Rollout Strategy

### Feature Flags (Optional)
```ts
// client/config/features.ts
export const FEATURES = {
  USE_ANTD_LOGIN: true,
  USE_ANTD_LAYOUT: false,
  USE_ANTD_MODALS: false,
};
```

### Rollout Plan
1. **Week 1-2**: Internal testing (dev environment)
2. **Week 3**: Canary release (5% of users)
3. **Week 4**: Gradual rollout (25% → 50% → 100%)
4. **Week 5**: Monitor metrics, fix issues
5. **Week 6**: Remove old components, cleanup

### Rollback Plan
- Keep old Radix components until 100% rollout
- Feature flags allow instant rollback
- Database/API unchanged (UI-only migration)

---

## Phase 9: Documentation & Training

### Developer Documentation
- [ ] Component usage guide (`docs/antd-components.md`)
- [ ] Theme customization guide (`docs/antd-theming.md`)
- [ ] Migration checklist for new features
- [ ] Storybook examples (optional)

### Code Style Guide
```tsx
// ✅ Good: Use wrapper components
import { Button } from '@/ui/antd';

// ❌ Bad: Direct antd import
import { Button } from 'antd';

// ✅ Good: Consistent prop naming
<Button type="primary" loading={isLoading}>Submit</Button>

// ❌ Bad: Mixing patterns
<Button className="bg-primary" disabled={isLoading}>Submit</Button>
```

---

## Phase 10: Success Metrics

### KPIs
- **Bundle Size**: < 500KB gzipped (target: 480KB)
- **Performance**: LCP < 2.5s, FCP < 1.5s
- **Accessibility**: 0 critical axe-core violations
- **User Satisfaction**: No increase in support tickets
- **Developer Velocity**: 20% faster component development

### Monitoring
- Sentry for error tracking
- Lighthouse CI for performance
- Bundle size tracking in CI
- User feedback surveys

---

## Risk Mitigation

### Potential Risks
1. **Bundle size increase** → Mitigation: Aggressive tree-shaking, code splitting
2. **Visual regressions** → Mitigation: Percy/Chromatic tests
3. **Accessibility issues** → Mitigation: axe-core in CI, manual testing
4. **Developer resistance** → Mitigation: Training, documentation, pair programming
5. **Performance degradation** → Mitigation: Lighthouse CI, profiling

### Contingency Plan
- If bundle size > 550KB: Remove antd, revert to Radix
- If performance degrades > 20%: Optimize or rollback
- If accessibility violations > 10: Pause rollout, fix issues

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Setup | Week 1 | Dependencies, theme config, providers |
| Core Pages | Week 2-3 | Login, Register, Landing, Layout |
| Feature Pages | Week 3-4 | Channels, Messages, Settings |
| Advanced | Week 4-5 | Modals, Forms, Tables |
| Polish | Week 5-6 | A11y, Performance, Tests |
| **Total** | **6 weeks** | **Production-ready migration** |

---

## Next Steps

1. **Approve this plan** with stakeholders
2. **Create Jira/Linear tickets** for each phase
3. **Assign engineers** to phases
4. **Set up CI/CD** for quality checks
5. **Begin Phase 1** (Setup & Configuration)

---

## Appendix: Quick Reference

### Import Patterns
```tsx
// Wrapper components (preferred)
import { Button, Input, Modal } from '@/ui/antd';

// Direct antd (for non-wrapped components)
import { Avatar, Badge, Tooltip } from 'antd';

// Icons (specific imports only)
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
```

### Theme Customization
```tsx
// client/providers/AntdProvider.tsx
<ConfigProvider theme={{
  token: {
    colorPrimary: '#6366f1',
    borderRadius: 12,
    // ... see antd.config.ts
  }
}}>
  {children}
</ConfigProvider>
```

### Common Patterns
```tsx
// Form with validation
<Form form={form} onFinish={handleSubmit}>
  <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
    <Input placeholder="Email" />
  </Form.Item>
</Form>

// Modal with custom footer
<Modal open={open} footer={[
  <Button key="cancel" onClick={onCancel}>Cancel</Button>,
  <Button key="submit" type="primary" onClick={onOk}>OK</Button>
]}>
  {content}
</Modal>

// Notification
notification.success({
  message: 'Success',
  description: 'Operation completed',
  placement: 'topRight'
});
```
