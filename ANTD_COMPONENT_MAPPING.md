# Ant Design Component Mapping - Harmony Project

## Component Migration Reference

### ✅ Direct Replacements (Use antd directly)

| Current Component | AntD Component | Import | Notes |
|-------------------|----------------|--------|-------|
| `Avatar` | `Avatar` | `import { Avatar } from 'antd'` | Direct replacement |
| `Badge` | `Badge` | `import { Badge } from 'antd'` | Direct replacement |
| `Tooltip` | `Tooltip` | `import { Tooltip } from 'antd'` | Direct replacement |
| `Skeleton` | `Skeleton` | `import { Skeleton } from 'antd'` | Direct replacement |
| `Spin` | `Spin` | `import { Spin } from 'antd'` | Loading indicator |
| `Divider` | `Divider` | `import { Divider } from 'antd'` | Direct replacement |
| `Space` | `Space` | `import { Space } from 'antd'` | Layout spacing |
| `Typography` | `Typography` | `import { Typography } from 'antd'` | Text components |

### 🔧 Wrapped Components (Use from @/ui/antd)

| Current Component | Wrapper Component | Import | Customization |
|-------------------|-------------------|--------|---------------|
| `Button` | `Button` | `import { Button } from '@/ui/antd'` | Gradient support, consistent height |
| `Input` | `Input` | `import { Input } from '@/ui/antd'` | Dark theme, focus states |
| `Card` | `Card` | `import { Card } from '@/ui/antd'` | Backdrop blur, elevated shadows |
| `Modal` | `Modal` | `import { Modal } from '@/ui/antd'` | Custom footer, backdrop blur |
| `Form` | `Form` | `import { Form } from '@/ui/antd'` | Validation helpers |
| `Select` | `Select` | `import { Select } from '@/ui/antd'` | Dark dropdown styling |
| `Table` | `Table` | `import { Table } from '@/ui/antd'` | Dark theme, hover states |
| `Menu` | `Menu` | `import { Menu } from '@/ui/antd'` | Navigation styling |
| `Dropdown` | `Dropdown` | `import { Dropdown } from '@/ui/antd'` | Dark theme |

### 🔄 Complex Migrations

#### Dialog/AlertDialog → Modal
```tsx
// Before (Radix)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogDescription>Content</DialogDescription>
    <DialogFooter>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// After (AntD)
<Modal
  open={open}
  onCancel={onCancel}
  title="Title"
  footer={[
    <Button key="cancel" onClick={onCancel}>Cancel</Button>,
    <Button key="confirm" type="primary" onClick={onConfirm}>Confirm</Button>
  ]}
>
  Content
</Modal>
```

#### Sheet/Drawer → Drawer
```tsx
// Before (Radix)
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    Content
  </SheetContent>
</Sheet>

// After (AntD)
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Title"
  placement="right"
>
  Content
</Drawer>
```

#### DropdownMenu → Dropdown + Menu
```tsx
// Before (Radix)
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={action1}>Item 1</DropdownMenuItem>
    <DropdownMenuItem onClick={action2}>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// After (AntD)
<Dropdown
  menu={{
    items: [
      { key: '1', label: 'Item 1', onClick: action1 },
      { key: '2', label: 'Item 2', onClick: action2 },
    ]
  }}
>
  <Button>Menu</Button>
</Dropdown>
```

#### Tabs → Tabs
```tsx
// Before (Radix)
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// After (AntD)
<Tabs
  activeKey={tab}
  onChange={setTab}
  items={[
    { key: 'tab1', label: 'Tab 1', children: 'Content 1' },
    { key: 'tab2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>
```

#### Form → Form
```tsx
// Before (react-hook-form)
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('email', { required: true })} />
  {errors.email && <span>Required</span>}
</form>

// After (AntD Form)
const [form] = Form.useForm();

<Form form={form} onFinish={onSubmit}>
  <Form.Item
    name="email"
    rules={[{ required: true, message: 'Required' }]}
  >
    <Input />
  </Form.Item>
</Form>
```

### 📦 Layout Components

#### AppLayout Migration
```tsx
// Before (Custom)
<div className="flex h-screen">
  <aside className="w-64 bg-sidebar">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>

// After (AntD Layout)
import { Layout } from 'antd';
const { Sider, Content } = Layout;

<Layout className="h-screen">
  <Sider width={256}>Sidebar</Sider>
  <Content>Content</Content>
</Layout>
```

### 🔔 Notifications & Messages

#### Toast/Sonner → notification/message
```tsx
// Before (Sonner)
import { toast } from 'sonner';
toast.success('Success message');
toast.error('Error message');

// After (AntD)
import { notification, message } from 'antd';

// For important notifications
notification.success({
  message: 'Success',
  description: 'Operation completed successfully',
  placement: 'topRight',
});

// For quick feedback
message.success('Success message');
message.error('Error message');
```

### 🎨 Icons

Keep lucide-react for brand consistency, but use AntD icons for common UI elements:

```tsx
// Brand/Custom icons - Keep lucide-react
import { MessageSquare, Users, Settings } from 'lucide-react';

// Common UI icons - Use AntD (optional)
import { UserOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
```

### 📊 Data Display

#### Table Migration
```tsx
// Before (Custom)
<table>
  <thead>
    <tr><th>Name</th><th>Email</th></tr>
  </thead>
  <tbody>
    {data.map(row => <tr key={row.id}><td>{row.name}</td><td>{row.email}</td></tr>)}
  </tbody>
</table>

// After (AntD)
<Table
  columns={[
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ]}
  dataSource={data}
  rowKey="id"
/>
```

### 🎯 Priority Migration Order

1. **Phase 1 (Week 1-2)**: Authentication pages
   - ✅ Login.tsx → LoginAntd.tsx
   - ✅ Register.tsx → RegisterAntd.tsx
   - Button, Input, Form wrappers

2. **Phase 2 (Week 2-3)**: Layout & Navigation
   - AppLayout.tsx
   - ServerSidebar.tsx
   - Layout, Menu, Dropdown wrappers

3. **Phase 3 (Week 3-4)**: Feature Pages
   - Channels.tsx
   - MessageList.tsx
   - ChannelsList.tsx
   - Card, Avatar, Badge components

4. **Phase 4 (Week 4-5)**: Modals & Forms
   - InviteMemberModal.tsx
   - RoleManagementModal.tsx
   - Modal, Drawer, Select wrappers

5. **Phase 5 (Week 5-6)**: Settings & Admin
   - Settings pages
   - Role management tables
   - Table wrapper

### 🚫 Components to Remove After Migration

Delete these files from `client/components/ui/` after migration:
- accordion.tsx
- alert-dialog.tsx
- alert.tsx
- button.tsx
- card.tsx
- dialog.tsx
- drawer.tsx
- dropdown-menu.tsx
- form.tsx
- input.tsx
- select.tsx
- sheet.tsx
- table.tsx
- tabs.tsx
- toast.tsx
- toaster.tsx

Keep these (not replaced by AntD):
- use-toast.ts (can coexist with AntD notifications)
- Any custom business logic components

### 📝 Migration Checklist Template

For each component migration:
- [ ] Identify current component usage
- [ ] Choose AntD equivalent or wrapper
- [ ] Update imports
- [ ] Migrate props (refer to AntD docs)
- [ ] Test functionality
- [ ] Test accessibility (keyboard nav, screen reader)
- [ ] Test visual appearance (dark theme)
- [ ] Update tests
- [ ] Remove old component if no longer used

### 🔗 Useful Links

- [AntD Components](https://ant.design/components/overview/)
- [AntD Theme Editor](https://ant.design/theme-editor)
- [AntD Dark Theme](https://ant.design/docs/react/customize-theme#seedtoken)
- [Migration from v4 to v5](https://ant.design/docs/react/migration-v5)
