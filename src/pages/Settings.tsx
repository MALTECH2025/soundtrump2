
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lock, UserRound, Shield, Bell, Smartphone, CreditCard } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/lib/toast';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
  
  function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({
        name: data.name,
      });
      
      toast.success("Profile updated successfully");
      setLoading(false);
    }, 1000);
  }
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto max-w-5xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and profile</p>
            </motion.div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile"><UserRound className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                <TabsTrigger value="account"><Shield className="w-4 h-4 mr-2" /> Account</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
                <TabsTrigger value="connections"><Smartphone className="w-4 h-4 mr-2" /> Connections</TabsTrigger>
                <TabsTrigger value="billing"><CreditCard className="w-4 h-4 mr-2" /> Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your account information and how others see you on SoundTrump
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This is your public display name.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} disabled />
                                </FormControl>
                                <FormDescription>
                                  <div className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Email cannot be changed</span>
                                  </div>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Status</CardTitle>
                      <CardDescription>
                        Your current membership and ranking status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Membership Tier</h3>
                        <Badge 
                          variant={user?.role.tier === "Premium" ? "default" : "outline"}
                          className={user?.role.tier === "Premium" ? "bg-sound-light" : ""}
                        >
                          {user?.role.tier || "Free"}
                        </Badge>
                        {user?.role.tier !== "Premium" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Upgrade to Premium to unlock additional features and rewards
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">User Status</h3>
                        <Badge 
                          variant={user?.role.status === "Influencer" ? "default" : "outline"}
                          className={user?.role.status === "Influencer" ? "bg-purple-500" : ""}
                        >
                          {user?.role.status || "Normal"}
                        </Badge>
                        {user?.role.status !== "Influencer" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Reach 500 referrals to become an Influencer and earn 2x rewards
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Member Since</h3>
                        <p className="text-sm">June 12, 2023</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Account settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how we contact you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Notification settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="connections">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Services</CardTitle>
                    <CardDescription>
                      Manage connected music streaming services and social accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Service connections will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing and Payments</CardTitle>
                    <CardDescription>
                      Manage your billing information and view payment history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Billing settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Settings;
