import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    display_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.username || !formData.display_name) {
      setError('All fields are required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    // Password strength validation
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }

    if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.username,
        formData.display_name
      );
      navigate('/app/channels');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-discord-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-discord-darker border-discord-darker">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-discord-muted mb-6">Let's get started on your journey!</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Display Name
              </label>
              <Input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Your Display Name"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-discord-muted text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
