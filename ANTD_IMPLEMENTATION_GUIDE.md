# Ant Design Implementation Guide - Quick Start

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies
```bash
pnpm add antd
```

### Step 2: Wrap App with AntdProvider
Update `client/App.tsx`:

```tsx
import { AntdProvider } from '@/providers/AntdProvider';

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SettingsProvider>
            <AntdProvider>  {/* Add this */}
              <TooltipProvider>
                <BrowserRouter>
                  {/* ... routes */}
                </BrowserRouter>
              </TooltipProvider>
            </AntdProvider>  {/* Add this */}
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### Step 3: Start Using Components
```tsx
// Use wrapper components
import { Button, Input } from '@/ui/antd';

// Use antd directly for non-wrapped components
import { Avatar, Badge, Tooltip } from 'antd';
```

---

## 📚 Common Patterns

### Pattern 1: Forms with Validation
```tsx
import { Form } from 'antd';
import { Button, Input } from '@/ui/antd';

function MyForm() {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <Input placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Min 8 characters' }
        ]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

### Pattern 2: Modals
```tsx
import { Modal } from 'antd';
import { Button } from '@/ui/antd';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Confirm Action"
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            // Handle submit
            setOpen(false);
          }}>
            Confirm
          </Button>
        ]}
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

### Pattern 3: Notifications
```tsx
import { notification, message } from 'antd';

// Success notification (persistent)
notification.success({
  message: 'Success',
  description: 'Your changes have been saved',
  placement: 'topRight',
  duration: 3,
});

// Error notification
notification.error({
  message: 'Error',
  description: 'Something went wrong',
  placement: 'topRight',
});

// Quick message (auto-dismiss)
message.success('Saved successfully');
message.error('Failed to save');
message.loading('Saving...');
```

### Pattern 4: Dropdowns
```tsx
import { Dropdown } from 'antd';
import { Button } from '@/ui/antd';
import { MoreVertical } from 'lucide-react';

function MyComponent() {
  const items = [
    { key: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
    { key: 'delete', label: 'Delete', danger: true, onClick: () => console.log('Delete') },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button icon={<MoreVertical className="w-4 h-4" />} />
    </Dropdown>
  );
}
```

### Pattern 5: Tables
```tsx
import { Table } from 'antd';
import { Avatar } from 'antd';

function UserTable() {
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <Avatar>{name[0]}</Avatar>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
}
```

### Pattern 6: Layout with Sidebar
```tsx
import { Layout, Menu } from 'antd';
import { MessageSquare, Users, Settings } from 'lucide-react';

const { Sider, Content } = Layout;

function AppLayout() {
  const menuItems = [
    { key: 'channels', icon: <MessageSquare className="w-4 h-4" />, label: 'Channels' },
    { key: 'friends', icon: <Users className="w-4 h-4" />, label: 'Friends' },
    { key: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  return (
    <Layout className="h-screen">
      <Sider width={256}>
        <Menu
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={['channels']}
        />
      </Sider>
      <Content className="p-6">
        {/* Your content */}
      </Content>
    </Layout>
  );
}
```

---

## 🎨 Styling Best Practices

### Use Tailwind for Layout, AntD for Components
```tsx
// ✅ Good: Tailwind for layout, AntD components
<div className="flex gap-4 p-6">
  <Button type="primary">Click me</Button>
  <Input placeholder="Type here" />
</div>

// ❌ Bad: Mixing component styles
<Button className="bg-blue-500 text-white">Click me</Button>
```

### Custom Styling with className
```tsx
// AntD components accept className for custom styles
<Button className="shadow-lg hover:shadow-xl transition-shadow">
  Custom Button
</Button>

<Card className="backdrop-blur-xl border-white/10">
  Custom Card
</Card>
```

### Using Gradient Buttons
```tsx
import { Button } from '@/ui/antd';

// Use gradient prop for primary gradient buttons
<Button type="primary" gradient>
  Gradient Button
</Button>

// Regular primary button (no gradient)
<Button type="primary">
  Regular Button
</Button>
```

---

## 🔧 TypeScript Tips

### Form Types
```tsx
interface LoginForm {
  email: string;
  password: string;
}

const [form] = Form.useForm<LoginForm>();

const handleSubmit = async (values: LoginForm) => {
  // values is typed as LoginForm
  console.log(values.email, values.password);
};
```

### Table Types
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnsType<User> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
];

const data: User[] = [...];
```

---

## ⚡ Performance Tips

### 1. Use Named Imports
```tsx
// ✅ Good: Tree-shakeable
import { Button, Input, Modal } from 'antd';

// ❌ Bad: Imports everything
import * as antd from 'antd';
```

### 2. Lazy Load Heavy Components
```tsx
import { lazy, Suspense } from 'react';

const RoleManagementModal = lazy(() => import('./RoleManagementModal'));

function MyComponent() {
  return (
    <Suspense fallback={<Spin />}>
      <RoleManagementModal />
    </Suspense>
  );
}
```

### 3. Optimize Icons
```tsx
// ✅ Good: Import specific icons
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

// ❌ Bad: Import all icons
import * as Icons from '@ant-design/icons';
```

---

## 🧪 Testing

### Testing Forms
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import { Button, Input } from '@/ui/antd';

test('form submission', async () => {
  const handleSubmit = vi.fn();
  
  render(
    <Form onFinish={handleSubmit}>
      <Form.Item name="email">
        <Input placeholder="Email" />
      </Form.Item>
      <Button htmlType="submit">Submit</Button>
    </Form>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText('Submit'));
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Styles Not Applying
**Problem**: AntD styles not showing up

**Solution**: Ensure AntdProvider wraps your app
```tsx
<AntdProvider>
  <App />
</AntdProvider>
```

### Issue 2: Form Validation Not Working
**Problem**: Form.Item validation not triggering

**Solution**: Ensure `name` prop is set on Form.Item
```tsx
<Form.Item name="email" rules={[{ required: true }]}>
  <Input />
</Form.Item>
```

### Issue 3: Modal Not Closing
**Problem**: Modal stays open after action

**Solution**: Call `onCancel` or update `open` state
```tsx
<Modal
  open={open}
  onCancel={() => setOpen(false)}
  onOk={() => {
    // Do something
    setOpen(false); // Close modal
  }}
/>
```

---

## 📖 Additional Resources

- [AntD Documentation](https://ant.design/components/overview/)
- [AntD GitHub](https://github.com/ant-design/ant-design)
- [Theme Customization](https://ant.design/docs/react/customize-theme)
- [Form Examples](https://ant.design/components/form#components-form-demo-basic)
- [Migration Guide](./ANTD_MIGRATION_PLAN.md)
- [Component Mapping](./ANTD_COMPONENT_MAPPING.md)
