
import { ShieldCheck } from 'lucide-react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const TermsOfService = () => {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      description="Please read these terms carefully before using SoundTrump."
      icon={<ShieldCheck className="h-6 w-6 text-sound-light" />}
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the SoundTrump platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
      </p>
      
      <h2>2. Eligibility</h2>
      <p>
        You must be at least 16 years old to use our Services. By using SoundTrump, you represent and warrant that you meet the eligibility requirements.
      </p>
      
      <h2>3. User Accounts</h2>
      <p>
        To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>
      
      <h2>4. Task Completion and Rewards</h2>
      <p>
        SoundTrump offers users the opportunity to earn rewards by completing various tasks related to music streaming and social engagement. All rewards are subject to verification and our anti-fraud measures.
      </p>
      
      <h2>5. Referral Program</h2>
      <p>
        Users may participate in our referral program to earn additional rewards. Referrals must be legitimate, and we reserve the right to invalidate any referrals that violate our policies.
      </p>
      
      <h2>6. Prohibited Activities</h2>
      <p>
        You agree not to engage in any fraudulent activities, including but not limited to: creating multiple accounts, using VPNs to bypass restrictions, automating task completion, and manipulating our systems.
      </p>
      
      <h2>7. Intellectual Property</h2>
      <p>
        All content, features, and functionality of SoundTrump, including but not limited to text, graphics, logos, and software, are owned by SoundTrump and protected by copyright, trademark, and other intellectual property laws.
      </p>
      
      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account and access to our Services at any time, for any reason, without notice.
      </p>
      
      <h2>9. Disclaimers and Limitations of Liability</h2>
      <p>
        THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL SOUNDTRUMP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>
      
      <h2>10. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. Your continued use of our Services after any changes indicates your acceptance of the modified Terms.
      </p>
      
      <h2>11. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
      </p>
      
      <h2>12. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us at legal@soundtrump.com.
      </p>
      
      <div className="mt-10 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfService;
