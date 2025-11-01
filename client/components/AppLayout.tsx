import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, LogOut, Settings, Home, Users, PlusCircle, Menu, X, Search } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-discord-dark overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-discord-darker border-r border-discord-darker
        transition-transform duration-300 ease-in-out transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-discord-darker">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Harmony</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-discord-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Servers Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-discord-muted uppercase mb-3">Direct Messages</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition text-sm">
              Friends
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition text-sm">
              DMs
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-discord-darker">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-discord-muted uppercase">Servers</h3>
            <button className="text-discord-muted hover:text-white transition">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 rounded bg-discord-dark text-white text-sm hover:bg-discord-dark/80 transition cursor-pointer">
              Create Server
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-discord-darker bg-discord-darker">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.display_name}</p>
              <p className="text-xs text-discord-muted truncate">@{user?.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 p-2 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition">
              <Settings className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 p-2 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-discord-darker border-b border-discord-darker flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-discord-muted hover:text-white transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-white font-semibold">Select a Channel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded bg-discord-dark border border-discord-darker text-white text-sm placeholder:text-discord-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
