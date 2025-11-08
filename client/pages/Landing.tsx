// Landing.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Users, 
  Shield, 
  Zap, 
  Server, 
  Lock,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/channels');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Zap,
      title: 'Instant Messaging',
      description: 'Real-time communication with zero latency. Messages delivered instantly across all devices.',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      iconGradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Server,
      title: 'Organized Workspaces',
      description: 'Structure your community with servers, channels, and granular permission controls.',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconGradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Connect teams and communities with powerful group features and presence indicators.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconGradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Rich Communication',
      description: 'Direct messages, threads, reactions, and typing indicators for natural conversations.',
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconGradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, JWT authentication, and compliance-ready infrastructure.',
      gradient: 'from-red-500/20 to-rose-500/20',
      iconGradient: 'from-red-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Secure File Sharing',
      description: 'Share documents, images, and media with encrypted cloud storage and access controls.',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      iconGradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Community Manager',
      company: 'TechCorp',
      content: 'Harmony transformed how our 5,000+ member community collaborates. Engagement increased 40% in the first month.',
      avatar: 'SC'
    },
    {
      name: 'Alex Rivera',
      role: 'Engineering Lead',
      company: 'DevStudio',
      content: 'The best communication platform we\'ve used. Clean interface, powerful features, and rock-solid reliability.',
      avatar: 'AR'
    },
    {
      name: 'Jordan Park',
      role: 'Content Creator',
      company: 'Creator Labs',
      content: 'My audience loves the organized channels and seamless experience. Harmony just works beautifully.',
      avatar: 'JP'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '10M+', label: 'Messages Daily', icon: MessageSquare },
    { value: '99.9%', label: 'Uptime SLA', icon: TrendingUp },
    { value: '150+', label: 'Countries', icon: Award }
  ];

  const trustedBy = ['Acme Corp', 'TechFlow', 'Innovate Inc', 'Digital Labs', 'CloudSync'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.08]' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-semibold text-[15px] tracking-tight">Harmony</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-white/60 hover:text-white transition-colors">Customers</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Docs</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/5 h-9 px-4"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white h-9 px-4 shadow-lg shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <button 
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.08]">
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-white/80 hover:text-white">Features</a>
              <a href="#testimonials" className="block text-white/80 hover:text-white">Customers</a>
              <a href="#pricing" className="block text-white/80 hover:text-white">Pricing</a>
              <a href="#" className="block text-white/80 hover:text-white">Docs</a>
              <div className="pt-4 space-y-3 border-t border-white/[0.08]">
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-40 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-white/90">Trusted by 50,000+ users worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Where communities
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary">
              come together
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            A modern platform for real-time communication. Built for teams, communities, and creators who value simplicity and security.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base shadow-xl shadow-primary/20"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 hover:bg-white/5 text-white px-8 h-12 text-base"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-6 border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-wider text-white/40 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {trustedBy.map((company, i) => (
              <div key={i} className="text-white/30 font-medium text-sm">{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Everything you need to connect
            </h2>
            <p className="text-lg text-white/60">
              Powerful features designed for modern communication, without the complexity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.iconGradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/60 text-[15px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl mb-4 group-hover:bg-white/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Loved by teams worldwide
            </h2>
            <p className="text-lg text-white/60">See what our customers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-[15px] leading-relaxed text-white/80 mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-xs font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-white/50">{testimonial.role} · {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Join thousands of communities already using Harmony to connect and collaborate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/register">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-10 h-12 text-base shadow-xl shadow-primary/20"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg"
                variant="outline" 
                className="border-white/20 hover:bg-white/5 text-white px-10 h-12 text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/40">
            No credit card required · 14-day free trial · 99.9% uptime SLA
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.08]">
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-bold text-2xl tracking-tight">Harmony</span>
            </Link>
            
            <p className="text-sm text-white/50 mb-8 text-center max-w-md">
              Building the future of community communication
            </p>
            
            <div className="flex gap-4 mb-12">
              <a href="#" className="relative w-11 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group" aria-label="GitHub">
                <Github className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">GitHub</span>
              </a>
              <a href="#" className="relative w-11 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Twitter</span>
              </a>
              <a href="#" className="relative w-11 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">LinkedIn</span>
              </a>
            </div>

            <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/[0.08] w-full">
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">Privacy</a>
                <span className="text-white/20">•</span>
                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">Terms</a>
                <span className="text-white/20">•</span>
                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">Cookies</a>
                <span className="text-white/20">•</span>
                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">Accessibility</a>
              </div>
              <p className="text-xs text-white/30">
                © 2024 Harmony Technologies, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
