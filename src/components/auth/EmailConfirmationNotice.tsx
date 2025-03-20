
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import { toast } from '@/lib/toast';

interface EmailConfirmationNoticeProps {
  email: string;
}

const EmailConfirmationNotice = ({ email }: EmailConfirmationNoticeProps) => {
  const [isSending, setIsSending] = useState(false);

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    try {
      setIsSending(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast.success('Confirmation email resent! Please check your inbox');
    } catch (error: any) {
      console.error('Error resending confirmation email:', error);
      toast.error(error.message || 'Failed to resend confirmation email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Alert variant="warning" className="mb-4 border-yellow-400">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-700">Email verification required</AlertTitle>
      <AlertDescription className="text-yellow-600">
        <p className="mb-2">
          Please check your email to verify your account. If you didn't receive an email or need a new one, click below:
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 text-yellow-700 border-yellow-300"
          onClick={handleResendConfirmation}
          disabled={isSending}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isSending ? 'Sending...' : 'Resend confirmation email'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationNotice;
