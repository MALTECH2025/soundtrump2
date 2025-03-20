
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import HomePage from '@/pages/Index';
import DashboardPage from '@/pages/Dashboard';
import LeaderboardPage from '@/pages/Leaderboard';
import RewardsPage from '@/pages/Rewards';
import ProfilePage from '@/pages/Profile';
import ReferralsPage from '@/pages/Referrals';
import SettingsPage from '@/pages/Settings';
import TasksPage from '@/pages/Tasks';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <Toaster />
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
