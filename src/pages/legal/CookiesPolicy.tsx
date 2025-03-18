
import { Cookie } from 'lucide-react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const CookiesPolicy = () => {
  return (
    <LegalPageLayout 
      title="Cookies Policy" 
      description="Information about how we use cookies on our platform."
      icon={<Cookie className="h-6 w-6 text-sound-light" />}
    >
      <h2>What Are Cookies</h2>
      <p>
        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site. Cookies allow us to recognize your device and store information about your preferences or past actions.
      </p>
      
      <h2>How We Use Cookies</h2>
      <p>
        SoundTrump uses cookies for various purposes, including:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt-out of these cookies.</li>
        <li><strong>Analytical/Performance Cookies:</strong> These cookies allow us to recognize and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works.</li>
        <li><strong>Functionality Cookies:</strong> These cookies enable our website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
        <li><strong>Targeting Cookies:</strong> These cookies record your visit to our website, the pages you have visited, and the links you have followed. We may use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
      </ul>
      
      <h2>Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service and to deliver advertisements on and through the service. These cookies may be placed by:
      </p>
      <ul>
        <li>Google Analytics</li>
        <li>Social media platforms (Facebook, Twitter, etc.)</li>
        <li>Advertising networks</li>
        <li>Service providers</li>
      </ul>
      
      <h2>Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings preferences. Here's how to manage cookies in the most common browsers:
      </p>
      <ul>
        <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
        <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy & Security &gt; Cookies and Site Data</li>
        <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
        <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and data stored</li>
      </ul>
      <p>
        Please note that restricting cookies may impact your experience on our website and limit the functionality we can provide.
      </p>
      
      <h2>Cookie Consent</h2>
      <p>
        When you first visit our website, you will be presented with a cookie banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
      </p>
      
      <h2>Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about our use of cookies, please contact us at privacy@soundtrump.com.
      </p>
      
      <div className="mt-10 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </LegalPageLayout>
  );
};

export default CookiesPolicy;
