import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Support from '@/pages/Support';
import Contact from '@/pages/Contact';
import DspTrust from '@/pages/DspTrust';
import NotFound from '@/pages/NotFound';
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import CookiesPolicy from '@/pages/legal/CookiesPolicy';
import Disclaimer from '@/pages/legal/Disclaimer';
import WhitePaper from '@/pages/legal/WhitePaper';

// Import app pages
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Withdrawal from '@/pages/Withdrawal';
import Referrals from '@/pages/Referrals';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

// Import admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminTasks from '@/pages/admin/Tasks';

// Import route guards
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';

// Import Spotify callback component
import SpotifyCallback from '@/components/spotify/SpotifyCallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simple app initialization without problematic edge function calls
    const initializeApp = async () => {
      try {
        // Add any necessary initialization here
        console.log('SoundTrump app initializing...');
      } catch (error) {
        console.error('Error during app initialization:', error);
      }

      setTimeout(() => {
        setAppReady(true);
      }, 500);
    };

    initializeApp();
  }, []);

  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="soundtrump-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <ProfileProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/dsp-trust" element={<DspTrust />} />
                  <Route path="/spotify/callback" element={<SpotifyCallback />} />
                  
                  <Route path="/legal/terms" element={<TermsOfService />} />
                  <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                  <Route path="/legal/cookies" element={<CookiesPolicy />} />
                  <Route path="/legal/disclaimer" element={<Disclaimer />} />
                  <Route path="/legal/whitepaper" element={<WhitePaper />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/withdrawal" element={<Withdrawal />} />
                    <Route path="/referrals" element={<Referrals />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/tasks" element={<AdminTasks />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </ProfileProvider>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
