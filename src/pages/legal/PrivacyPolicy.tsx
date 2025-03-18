
import { Lock } from 'lucide-react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      description="How we collect, use, and protect your information."
      icon={<Lock className="h-6 w-6 text-sound-light" />}
    >
      <h2>1. Information We Collect</h2>
      <p>
        We collect several types of information from and about users of our Services, including:
      </p>
      <ul>
        <li>Personal information: name, email address, and social media accounts</li>
        <li>Account information: login credentials and profile information</li>
        <li>Usage data: information about how you use our Services</li>
        <li>Device information: IP address, browser type, and operating system</li>
        <li>Music streaming data: information from connected streaming accounts</li>
      </ul>
      
      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul>
        <li>Provide, maintain, and improve our Services</li>
        <li>Process and verify task completion</li>
        <li>Distribute rewards</li>
        <li>Detect and prevent fraudulent activities</li>
        <li>Communicate with you about promotions and updates</li>
        <li>Analyze usage patterns and trends</li>
      </ul>
      
      <h2>3. Information Sharing</h2>
      <p>
        We may share your information with:
      </p>
      <ul>
        <li>Service providers who perform services on our behalf</li>
        <li>Business partners for marketing and promotional purposes (with your consent)</li>
        <li>Law enforcement or other governmental agencies when required by law</li>
      </ul>
      
      <h2>4. Third-Party Integration</h2>
      <p>
        Our Services integrate with third-party services such as Spotify and Google. When you connect these accounts, we may receive information from these services. Please review the privacy policies of these third-party services.
      </p>
      
      <h2>5. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
      </p>
      
      <h2>6. Your Rights and Choices</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal information, including:
      </p>
      <ul>
        <li>Access to your personal information</li>
        <li>Correction of inaccurate information</li>
        <li>Deletion of your personal information</li>
        <li>Objection to certain processing activities</li>
        <li>Data portability</li>
      </ul>
      
      <h2>7. Children's Privacy</h2>
      <p>
        Our Services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16.
      </p>
      
      <h2>8. Changes to Our Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
      </p>
      
      <h2>9. Contact Information</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at privacy@soundtrump.com.
      </p>
      
      <div className="mt-10 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
