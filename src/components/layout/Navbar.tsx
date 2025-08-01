
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationLinks = [
    { name: 'Home', href: '/', requiresAuth: false },
    { name: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { name: 'Tasks', href: '/tasks', requiresAuth: true },
    { name: 'Withdrawal', href: '/withdrawal', requiresAuth: true },
    { name: 'Leaderboard', href: '/leaderboard', requiresAuth: true },
    { name: 'Referrals', href: '/referrals', requiresAuth: true },
  ];

  const adminLinks = [
    { name: 'Admin', href: '/admin', requiresAuth: true, adminOnly: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const visibleLinks = navigationLinks.filter(link => 
    !link.requiresAuth || isAuthenticated
  );

  const visibleAdminLinks = adminLinks.filter(link => 
    (!link.requiresAuth || isAuthenticated) && 
    (!link.adminOnly || profile?.role === 'admin')
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ecfb5b09-9f0f-45d8-b463-4f39dd2ca81e.png" 
              alt="SoundTrump" 
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-foreground">SoundTrump</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {visibleAdminLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                <Crown className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Points Display */}
                {profile && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">
                      {profile.points?.toLocaleString() || 0} ST
                    </span>
                  </div>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* User Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile?.initials || profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {profile?.tier === 'Premium' && (
                        <Badge variant="default" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                          ⭐
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-foreground">{profile?.full_name || profile?.username || 'User'}</p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.points?.toLocaleString() || 0} ST Coins
                        </p>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {profile?.tier || 'Free'}
                          </Badge>
                          {profile?.status === 'Influencer' && (
                            <Badge variant="outline" className="text-xs">
                              Influencer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {visibleAdminLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 ${
                      isActive(link.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Crown className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {isAuthenticated && (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="flex items-center px-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile?.initials || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-foreground">
                        {profile?.full_name || profile?.username || 'User'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {profile?.points?.toLocaleString() || 0} ST Coins
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
              
              {!isAuthenticated && (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="px-2">
                    <Button asChild className="w-full">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
