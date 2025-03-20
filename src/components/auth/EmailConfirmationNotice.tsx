
import React from 'react';
import { RefreshCw, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface EmailConfirmationNoticeProps {
  email: string;
}

const EmailConfirmationNotice = ({ email }: EmailConfirmationNoticeProps) => {
  const [isResending, setIsResending] = React.useState(false);
  
  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }
    
    try {
      setIsResending(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast.success('Confirmation email resent successfully');
    } catch (error: any) {
      console.error('Error resending confirmation email:', error);
      toast.error(error.message || 'Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200">
      <Mail className="h-4 w-4 text-amber-700" />
      <AlertTitle className="text-amber-800">Email verification required</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-2">
          A verification email has been sent to <strong>{email}</strong>. 
          Please check your inbox and click the link to verify your email address.
        </p>
        <div className="flex items-center justify-start mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-amber-300 text-amber-800 hover:border-amber-400 hover:bg-amber-100"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationNotice;
