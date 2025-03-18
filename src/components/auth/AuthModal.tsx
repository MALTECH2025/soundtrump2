import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleGoogleAuth = () => {
    console.log('Google auth initiated');
    toast.success('Google authentication would be initiated here');
    // Implement Google auth logic here
  };

  const handleSpotifyConnect = () => {
    console.log('Spotify connect initiated');
    toast.success('Spotify connection would be initiated here');
    // Implement Spotify connection logic here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    
    console.log(`${activeTab} submitted with email: ${email}`);
    toast.success(`${activeTab === 'login' ? 'Login' : 'Registration'} successful!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-lg">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 rounded-full" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="p-6 text-center relative bg-gradient-to-r from-sound-medium to-sound-dark">
            <h2 className="text-xl font-bold text-white mb-1">
              {activeTab === 'login' ? 'Welcome Back' : 'Join SoundTrump'}
            </h2>
            <p className="text-white/80 text-sm">
              {activeTab === 'login' 
                ? 'Log in to access your rewards and tasks' 
                : 'Create an account to start earning rewards'}
            </p>
          </div>
          
          <div className="p-6">
            <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" name="password" type="password" required />
                  </div>
                  <div className="text-right text-sm">
                    <a href="#" className="text-sound-light hover:underline">Forgot password?</a>
                  </div>
                  
                  <Button type="submit" className="w-full">Login</Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleAuth}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                      fill="#4285F4" 
                    />
                    <path 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                      fill="#34A853" 
                    />
                    <path 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                      fill="#FBBC05" 
                    />
                    <path 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                      fill="#EA4335" 
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continue with Google
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input id="register-name" name="name" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" name="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input id="register-password" name="password" type="password" required />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    By creating an account, you agree to our <a href="#" className="text-sound-light hover:underline">Terms of Service</a> and <a href="#" className="text-sound-light hover:underline">Privacy Policy</a>.
                  </div>
                  
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Or register with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleAuth}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                      fill="#4285F4" 
                    />
                    <path 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                      fill="#34A853" 
                    />
                    <path 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                      fill="#FBBC05" 
                    />
                    <path 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                      fill="#EA4335" 
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Register with Google
                </Button>
              </TabsContent>
            </Tabs>

            {activeTab === 'register' && (
              <div className="mt-6 border-t border-border pt-4">
                <div className="text-center mb-3 text-sm font-medium">Connect your streaming account</div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-[#1DB954]/10 to-[#1DB954]/5 hover:from-[#1DB954]/20 hover:to-[#1DB954]/10 border-[#1DB954]/30"
                  onClick={handleSpotifyConnect}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#1DB954"/>
                    <path d="M16.7917 16.7917C16.625 16.7917 16.4583 16.7417 16.3 16.6333C15.0583 15.85 13.55 15.4333 11.9833 15.4333C10.5333 15.4333 9.13333 15.7333 7.86667 16.325C7.55 16.4667 7.175 16.3583 6.975 16.0833C6.775 15.8083 6.84167 15.425 7.11667 15.2167C8.58333 14.5167 10.2333 14.1667 11.9833 14.1667C13.8 14.1667 15.5583 14.65 17.0333 15.5833C17.3167 15.7667 17.4167 16.1417 17.2333 16.425C17.125 16.65 16.9583 16.7917 16.7917 16.7917ZM17.8 13.9C17.6 13.9 17.4083 13.8333 17.2583 13.7C15.7917 12.7833 13.9333 12.2667 11.9917 12.2667C10.2083 12.2667 8.5 12.6583 6.975 13.425C6.60833 13.6 6.16667 13.45 5.99167 13.0833C5.81667 12.7167 5.96667 12.275 6.33333 12.1C8.08333 11.225 10.025 10.775 12.0083 10.775C14.2333 10.775 16.375 11.3667 18.075 12.4333C18.4083 12.65 18.525 13.1 18.3083 13.4333C18.175 13.7167 17.9917 13.9 17.8 13.9ZM19.0083 10.625C18.8083 10.625 18.6083 10.55 18.45 10.4167C16.7333 9.31667 14.425 8.70833 12.0167 8.70833C9.85 8.70833 7.75833 9.175 5.85 10.0917C5.525 10.2417 5.15 10.0833 5 9.76667C4.85 9.44167 5.00833 9.06667 5.33333 8.91667C7.425 7.90833 9.7 7.40833 12.0083 7.40833C14.7 7.40833 17.2833 8.09167 19.25 9.34167C19.55 9.54167 19.65 9.95 19.45 10.25C19.325 10.4833 19.175 10.625 19.0083 10.625Z" fill="white"/>
                  </svg>
                  Connect Spotify
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
