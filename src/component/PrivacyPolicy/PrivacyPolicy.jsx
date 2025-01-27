import React from 'react';
import styles from './PrivacyPolicy.module.css';
// import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyContainer}>
      <h1 className={styles.title}>Privacy Policy: AIEngage</h1>
      <p className={styles.effectiveDate}>Effective Date: 22nd August 2024</p>
      <p>
        Welcome to AIEngage, a subsidiary of Xircular Tech Private Limited. Your
        privacy is important to us, and this Privacy Policy outlines how we collect,
        use, store, and protect your information when you access our website, services,
        or platform. By using AIEngage, you consent to the practices described in this policy.
      </p>

      <section>
        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <h3 className={styles.subTitle}>a. Personal Information:</h3>
        <ul className="bulletList">
          <li>Name, email address, phone number, and other contact details you provide when registering or contacting us.</li>
          <li>Billing details and payment information when you purchase our services.</li>
        </ul>
        <h3 className={styles.subTitle}>b. Non-Personal Information:</h3>
        <ul className="bulletList">
          <li>Device details (browser type, operating system, IP address).</li>
          <li>Usage data (pages visited, time spent on the site, clicks, and interactions).</li>
        </ul>
        <h3 className={styles.subTitle}>c. Feedback and Responses:</h3>
        <ul className="bulletList">
          <li>Information shared through feedback campaigns, videos, surveys, and chatbot interactions.</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul className="bulletList">
          <li>Provide, operate, and improve AIEngage’s services.</li>
          <li>Communicate with you about product updates, new features, or promotional offers.</li>
          <li>Process payments and manage your subscriptions.</li>
          <li>Ensure compliance with our terms and conditions.</li>
          <li>Personalize your experience based on your preferences and usage patterns.</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>3. Sharing Your Information</h2>
        <p>
          We do not sell or rent your information. However, we may share your data in the
          following cases:
        </p>
        <ul className="bulletList">
          <li>Service Providers: Third-party vendors who assist in delivering our services (e.g., payment processors, hosting providers).</li>
          <li>Legal Compliance: When required by law or in response to valid legal requests.</li>
          <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>4. Cookies and Tracking Technologies</h2>
        <p>
          AIEngage uses cookies and similar technologies to enhance your experience and
          collect usage data. You can manage your cookie preferences through your browser
          settings.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>5. Data Security</h2>
        <p>
          We implement robust security measures to protect your data from unauthorized access,
          alteration, disclosure, or destruction. However, no method of transmission over the
          internet or electronic storage is 100% secure.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>6. Third-Party Links</h2>
        <p>
          Our website may contain links to external websites. We are not responsible for the
          privacy practices or content of those websites. Please review their privacy policies
          before sharing any information.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>7. Your Data Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal data, including:</p>
        <ul className="bulletList">
          <li>Accessing and updating your information.</li>
          <li>Requesting the deletion of your data.</li>
          <li>Opting out of marketing communications.</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:info@xircular.io">info@xircular.io</a>.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>8. Retention of Data</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes
          outlined in this policy, comply with legal obligations, or resolve disputes.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>9. Children’s Privacy</h2>
        <p>
          AIEngage is not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be effective
          immediately upon posting on this page, and the updated date will be reflected at the top.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>11. Contact Us</h2>
        <p>For questions or concerns about this Privacy Policy, please contact us:</p>
        <ul className="bulletList">
          <li>Email: <a href="mailto:info@xircular.io">info@xircular.io</a></li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
