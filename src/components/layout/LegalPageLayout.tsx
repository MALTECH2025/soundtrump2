
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import { FileText } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ 
  title, 
  description, 
  icon = <FileText className="h-6 w-6 text-sound-light" />,
  children 
}) => {
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={false} />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="container px-6 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center mb-4">
                {icon}
                <h1 className="text-3xl md:text-4xl font-bold ml-3">{title}</h1>
              </div>
              {description && (
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-slate dark:prose-invert max-w-none"
            >
              {children}
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default LegalPageLayout;
