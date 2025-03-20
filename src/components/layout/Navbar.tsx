
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlignJustify, 
  Music2, 
  User, 
  LogOut, 
  Settings, 
  Trophy, 
  Users, 
  Gift, 
  LayoutDashboard 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { toast } from '@/lib/toast';
import { ProfileDisplayData } from '@/types';

interface NavbarProps {
  isAuthenticated?: boolean;
  userProfile?: ProfileDisplayData;
}

export const Navbar = ({ 
  userProfile
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useProfile();
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Tasks', path: '/tasks', icon: <Music2 className="w-4 h-4 mr-2" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-4 h-4 mr-2" /> },
    { name: 'Referrals', path: '/referrals', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Rewards', path: '/rewards', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Music2 className="w-8 h-8 text-sound-light mr-2" />
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-sound-light to-sound-accent">
              SoundTrump
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant={location.pathname === link.path ? "default" : "ghost"} 
                size="sm"
                className="transition-all duration-300"
              >
                {link.icon}
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-sound-light text-white">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 p-2 animate-fade-in">
                <div className="flex flex-col p-2 mb-2 border-b">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">ST Member</p>
                </div>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/rewards')}>
                  <Gift className="w-4 h-4 mr-2" />
                  <span>My Rewards</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link to="/login">
                <Button variant="default" size="sm">Sign up</Button>
              </Link>
            </div>
          )}

          <div className="ml-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AlignJustify className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden py-3 px-4 bg-card border-b border-border"
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button 
                  variant={location.pathname === link.path ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
