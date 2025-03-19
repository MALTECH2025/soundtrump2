
import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mail, MessageSquare, Share2, Users } from 'lucide-react';
import { toast } from '@/lib/toast';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  inquiryType: z.enum(["general", "technical", "billing", "partnerships"], {
    required_error: "Please select the type of inquiry.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiryType: "general",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', data);
      toast.success("Thanks for reaching out! We'll get back to you soon.");
      form.reset();
      setLoading(false);
    }, 1500);
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
              className="mb-8 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you! Reach out to our team using the form below.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
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
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="inquiryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Inquiry</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="general" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    General
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="technical" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Technical
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="billing" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Billing
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="partnerships" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Partnerships
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What is your message about?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please type your message here"
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Our Contact Info</CardTitle>
                  <CardDescription>
                    Alternative ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm">
                        <a href="mailto:hello@soundtrump.com" className="text-muted-foreground hover:text-foreground">
                          hello@soundtrump.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Support</h3>
                      <p className="text-sm">
                        <a href="/support" className="text-muted-foreground hover:text-foreground">
                          Visit our support page
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Partnerships</h3>
                      <p className="text-sm">
                        <a href="mailto:partners@soundtrump.com" className="text-muted-foreground hover:text-foreground">
                          partners@soundtrump.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Follow Us</h3>
                    <div className="flex space-x-3">
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => toast.success("Social media links coming soon!")}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => toast.success("Social media links coming soon!")}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => toast.success("Social media links coming soon!")}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">What is SoundTrump?</h3>
                    <p className="text-sm text-muted-foreground">
                      SoundTrump is a platform that rewards users for activities related to music streaming services, allowing you to earn while enjoying your favorite music.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">How do I redeem rewards?</h3>
                    <p className="text-sm text-muted-foreground">
                      You can redeem your earned rewards in the Rewards section of your dashboard for various options including gift cards and cryptocurrency.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Is SoundTrump available worldwide?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, SoundTrump is available to users worldwide, though some features and rewards may vary by region.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">How can I become a partner?</h3>
                    <p className="text-sm text-muted-foreground">
                      For partnership inquiries, please contact us at partners@soundtrump.com with details about your organization and proposal.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Have more questions? Check out our <a href="/support" className="text-primary hover:underline">Support page</a> for more information.
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Contact;
