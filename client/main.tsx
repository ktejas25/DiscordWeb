import "./global.css";
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoot = () => {
  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('Global error:', e.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SettingsOverlay />  {/* MUST BE HERE */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/app/channels"
                  element={
                    <ProtectedRoute>
                      <Channels />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<AppRoot />);