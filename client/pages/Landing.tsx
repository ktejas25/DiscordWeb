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
  ChevronDown
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

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
      title: 'Lightning Fast',
      description: 'Real-time messaging powered by Socket.io for instant communication.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Server,
      title: 'Organized Spaces',
      description: 'Create servers and channels with advanced permission management.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Build meaningful connections with friends and communities.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Rich Messaging',
      description: 'Direct messages, group chats, and typing indicators.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'End-to-end encryption with JWT authentication.',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Media Sharing',
      description: 'Share files and media securely with Supabase Storage.',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Community Manager',
      content: 'Harmony transformed how our team collaborates. The real-time features are incredible!',
      rating: 5
    },
    {
      name: 'Alex Rivera',
      role: 'Developer',
      content: 'The best Discord alternative I\'ve used. Clean, fast, and secure.',
      rating: 5
    },
    {
      name: 'Jordan Park',
      role: 'Content Creator',
      content: 'My community loves Harmony. The server organization is perfect for my needs.',
      rating: 5
    }
  ];

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-dark via-discord-darker to-black text-white overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-discord-dark/95 backdrop-blur-xl shadow-2xl border-b border-white/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Harmony
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-discord-muted hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-discord-muted hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-discord-muted hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 transition-all"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 transition-all transform hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-primary">50,000+ users online</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
            Your Community,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 animate-gradient">
              Connected
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-discord-muted mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Experience the future of community communication with real-time messaging, 
            voice channels, and powerful collaboration tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-400">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg px-10 py-7 shadow-2xl shadow-primary/25 transform hover:scale-105 transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 hover:bg-white/10 text-white text-lg px-10 py-7 backdrop-blur-sm"
              onClick={scrollToFeatures}
            >
              Explore Features
            </Button>
          </div>

          <div 
            onClick={scrollToFeatures}
            className="inline-flex flex-col items-center gap-2 cursor-pointer animate-bounce"
          >
            <span className="text-sm text-discord-muted">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-discord-muted" />
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div id="features" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400"> Thrive</span>
            </h2>
            <p className="text-xl text-discord-muted max-w-2xl mx-auto">
              Powerful features designed for modern communities and teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-discord-darker/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-discord-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Testimonials Section */}
      <div id="testimonials" className="py-32 px-4 bg-gradient-to-b from-transparent via-discord-darker/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Loved by Communities Worldwide</h2>
            <p className="text-xl text-discord-muted">Join thousands of satisfied users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-discord-darker/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg mb-6 text-white/90">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-discord-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                50K+
              </div>
              <p className="text-discord-muted text-lg">Active Users</p>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                10M+
              </div>
              <p className="text-discord-muted text-lg">Messages Daily</p>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <p className="text-discord-muted text-lg">Uptime</p>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <p className="text-discord-muted text-lg">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-32 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Communication?
            </span>
          </h2>
          <p className="text-xl text-discord-muted mb-12">
            Join thousands of communities already using Harmony to connect and collaborate.
          </p>
          
          <div className="bg-discord-darker/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/90">No credit card required</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/90">14-day free trial</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/90">Cancel anytime</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg px-12 py-7 shadow-2xl shadow-primary/25 transform hover:scale-105 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10 text-white text-lg px-12 py-7"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/5 bg-discord-darker/50 backdrop-blur-sm py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">Harmony</span>
              </div>
              <p className="text-discord-muted mb-6 leading-relaxed">
                Building the future of online communities with powerful, secure, and intuitive communication tools.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white/90">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white/90">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white/90">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-discord-muted hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-discord-muted text-sm">
              © 2024 Harmony. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-discord-muted hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-discord-muted hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-discord-muted hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}