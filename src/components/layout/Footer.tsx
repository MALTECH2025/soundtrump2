
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Instagram, 
  Music, 
  Headphones, 
  MessageCircle, 
  Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    // Here we would normally send this to an API
    console.log('Subscribed with email:', email);
    
    toast.success('Successfully subscribed to newsletter!');
    form.reset();
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Music className="w-6 h-6 text-sound-light mr-2" />
              <span className="text-lg font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-sound-light to-sound-accent">
                SoundTrump
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Earn rewards while enjoying your favorite music streaming platforms.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="rounded-full hover:text-sound-light">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:text-sound-light">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:text-sound-light">
                <Music className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Tasks', 'Leaderboard', 'Referrals'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and rewards.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input 
                name="email"
                type="email" 
                placeholder="Your email address"
                required
                className="h-9 bg-background/50"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} SoundTrump. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>Support</span>
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
