
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Coins, Menu, X, User, Settings, LogOut, Trophy } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/referrals', label: 'Referrals' },
    { href: '/leaderboard', label: 'Leaderboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sound-light to-sound-medium rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sound-dark to-sound-medium bg-clip-text text-transparent">
              SoundTrump
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-700 hover:text-sound-medium transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Points Display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full"
                >
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold text-yellow-700">
                    {user?.points?.toLocaleString() || '0'} ST
                  </span>
                </motion.div>

                {/* Tier Badge */}
                <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {user?.tier || 'Free'}
                </Badge>

                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'User'} />
                        <AvatarFallback>{user?.initials || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.full_name || user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-2">
              {/* Points Display Mobile */}
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-full mb-4">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-yellow-700">
                  {user?.points?.toLocaleString() || '0'} ST
                </span>
                <Badge variant="outline" className="ml-2">
                  {user?.tier || 'Free'}
                </Badge>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-sound-medium hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
