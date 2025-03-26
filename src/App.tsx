
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "@/lib/toast";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Rewards from '@/pages/Rewards';
import Referrals from '@/pages/Referrals';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Support from '@/pages/Support';
import Contact from '@/pages/Contact';
import DspTrust from '@/pages/DspTrust';
import NotFound from '@/pages/NotFound';

// Legal pages
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import CookiesPolicy from '@/pages/legal/CookiesPolicy';
import Disclaimer from '@/pages/legal/Disclaimer';
import WhitePaper from '@/pages/legal/WhitePaper';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [appReady, setAppReady] = useState(false);

  // Ensure app is fully initialized before rendering
  useEffect(() => {
    // Give a small delay to ensure all providers are initialized
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="soundtrump-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <ProfileProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/support" element={<Support />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dsp-trust" element={<DspTrust />} />
                
                {/* Legal Routes */}
                <Route path="/legal/terms" element={<TermsOfService />} />
                <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                <Route path="/legal/cookies" element={<CookiesPolicy />} />
                <Route path="/legal/disclaimer" element={<Disclaimer />} />
                <Route path="/legal/whitepaper" element={<WhitePaper />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/referrals" element={<Referrals />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </ProfileProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
