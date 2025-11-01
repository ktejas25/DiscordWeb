import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/app/channels');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-discord-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-discord-darker border-discord-darker">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-discord-muted mb-6">We're so excited to see you again!</p>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="text-center text-discord-muted text-sm mt-4">
            Need an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
