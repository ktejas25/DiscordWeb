import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('email-input')?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShake(false);

    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/app/channels'), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-dark via-discord-darker to-discord-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-[420px] bg-discord-darker/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 rounded-2xl opacity-50" />
        
        <div className="relative p-8">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
              <img src="/Harmonny.png" alt="Harmony" className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-discord-muted text-center mb-8">We're so excited to see you again!</p>

          {error && (
            <div className={`bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${shake ? 'animate-shake' : ''}`}>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6 text-green-400 text-sm animate-in fade-in duration-300">
              Login successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-discord-muted" />
                <Input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  aria-invalid={!!error}
                  className="pl-10 bg-discord-dark/80 border-white/10 text-white placeholder:text-discord-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-discord-muted" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  aria-invalid={!!error}
                  className={`pl-10 bg-discord-dark/80 border-white/10 text-white placeholder:text-discord-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg h-11 ${shake ? 'border-red-500/50' : ''}`}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password || success}
              className={`w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold h-11 rounded-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${success ? 'bg-green-500 hover:bg-green-500' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : success ? (
                'Success!'
              ) : (
                'Log In'
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-discord-muted/70">
              <Shield className="w-3 h-3" />
              <span>Protected by industry-standard encryption</span>
            </div>
          </form>

          <p className="text-center text-discord-muted text-sm mt-6">
            Need an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium relative inline-block group transition-colors">
              Register
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200" />
            </Link>
          </p>

          <p className="text-center text-discord-muted/50 text-xs mt-8">
            © 2024 Harmony. All rights reserved.
          </p>
        </div>
      </Card>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
