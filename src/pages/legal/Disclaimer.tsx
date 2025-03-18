
import { AlertTriangle } from 'lucide-react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const Disclaimer = () => {
  return (
    <LegalPageLayout 
      title="Disclaimer" 
      description="Important information about the use of our platform."
      icon={<AlertTriangle className="h-6 w-6 text-sound-light" />}
    >
      <h2>General Disclaimer</h2>
      <p>
        The information provided on SoundTrump is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on our platform.
      </p>
      
      <h2>No Liability</h2>
      <p>
        Under no circumstance shall SoundTrump have any liability to you for any loss or damage of any kind incurred as a result of the use of our platform or reliance on any information provided. Your use of SoundTrump and your reliance on any information on the platform is solely at your own risk.
      </p>
      
      <h2>External Links</h2>
      <p>
        Our platform may contain links to external websites that are not provided or maintained by or in any way affiliated with SoundTrump. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
      </p>
      
      <h2>Rewards Disclaimer</h2>
      <p>
        The rewards offered through SoundTrump are subject to our verification process and anti-fraud measures. We reserve the right to withhold rewards if we detect any suspicious activity or violation of our Terms of Service. The availability and value of rewards may change at any time without notice.
      </p>
      
      <h2>Music Streaming Services</h2>
      <p>
        SoundTrump is not affiliated with, endorsed by, or sponsored by any music streaming service (such as Spotify or Apple Music) unless explicitly stated. We do not guarantee the accuracy, reliability, or availability of information obtained from these services.
      </p>
      
      <h2>Professional Advice</h2>
      <p>
        The contents of SoundTrump are not intended to be a substitute for professional advice. Before making any decision or taking any action that might affect your finances or business, you should consult with a qualified professional advisor.
      </p>
      
      <h2>Testimonials</h2>
      <p>
        Any testimonials or success stories featured on our platform represent the experiences of specific users. Results may vary, and we do not guarantee that you will achieve similar results.
      </p>
      
      <h2>Accuracy of Information</h2>
      <p>
        While we strive to provide accurate and up-to-date information, we make no guarantees about the accuracy, completeness, or reliability of any information on our platform. Information may change without notice, and it is your responsibility to verify any information before relying on it.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Disclaimer, please contact us at legal@soundtrump.com.
      </p>
      
      <div className="mt-10 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </LegalPageLayout>
  );
};

export default Disclaimer;
