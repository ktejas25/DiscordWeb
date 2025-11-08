import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Form, Card, Alert, Space } from 'antd';
import { Button, Input } from '@/ui/antd';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';

export default function LoginAntd() {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setIsLoading(true);

    try {
      await login(values.email, values.password);
      setSuccess(true);
      setTimeout(() => navigate('/app/channels'), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-dark via-discord-darker to-discord-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-[420px] relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">H</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome back</h1>
        <p className="text-discord-muted text-center mb-8">We're so excited to see you again!</p>

        {error && <Alert message={error} type="error" showIcon className="mb-6" />}
        {success && <Alert message="Login successful! Redirecting..." type="success" showIcon className="mb-6" />}

        <Form form={form} onFinish={handleSubmit} layout="vertical" autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<Mail className="w-4 h-4 text-discord-muted" />} placeholder="you@example.com" disabled={isLoading} />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex justify-between w-full">
                <span>Password</span>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
            }
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<Lock className="w-4 h-4 text-discord-muted" />} placeholder="••••••••" disabled={isLoading} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={success}
              gradient
              block
              icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            >
              {success ? 'Success!' : 'Log In'}
            </Button>
          </Form.Item>

          <Space className="w-full justify-center text-xs text-discord-muted/70">
            <Shield className="w-3 h-3" />
            <span>Protected by industry-standard encryption</span>
          </Space>
        </Form>

        <p className="text-center text-discord-muted text-sm mt-6">
          Need an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
            Register
          </Link>
        </p>

        <p className="text-center text-discord-muted/50 text-xs mt-8">© 2024 Harmony. All rights reserved.</p>
      </Card>
    </div>
  );
}
