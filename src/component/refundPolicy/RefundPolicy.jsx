// RefundPolicy.js

import React from 'react';
import './refundPolicy.css'; // Optional: for custom styles

const RefundPolicy = () => {
  return (
    <div className="refund-policy-container">
      <h1>Refund Policy</h1>
      <p><strong>Effective Date: 30th July 2024</strong></p>
      <p>
        At Xircular Private Limited, we are committed to providing high-quality services through our AIEngage platform.
        We understand that there may be occasions when you need to request a refund. This Refund Policy outlines the
        terms and conditions for refunds related to our subscription plans.
      </p>
      
      <h2>1. Free Trial</h2>
      <ul>
        <li>We offer a free trial plan to allow users to experience our Service with limited responses and features. The free trial is designed to help you evaluate the Service before making a purchase.</li>
        <li>As the free trial is offered at no cost, it is not eligible for refunds.</li>
      </ul>

      <h2>2. Paid Subscription Plans</h2>
      <ul>
        <li>We offer various paid subscription plans, each with different response limits and features. By subscribing to a paid plan, you agree to pay the applicable fees and taxes for the selected plan.</li>
        <li>Payments for subscription plans are generally non-refundable. However, we may consider refund requests under the following circumstances:
          <ul>
            <li><strong>Billing Errors:</strong> If there has been a billing error or incorrect charge, please contact us within 30 days of the transaction to request a refund.</li>
            <li><strong>Service Defects:</strong> If the Service is not functioning as described due to a defect or issue on our end, you may be eligible for a refund. Please report any such issues within 30 days of encountering them.</li>
            <li><strong>Legal Requirements:</strong> Refunds will be issued in cases where it is required by law. This may include certain consumer protection rights or cancellation rights applicable in your jurisdiction.</li>
          </ul>
        </li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <ul>
        <li>To request a refund, please contact our support team at <a href="mailto:info@xircular.io">info@xircular.io</a>. Include your account details, the reason for the refund request, and any relevant documentation or evidence.</li>
        <li>Our support team will review your request and respond within 5-7 days. We may request additional information to process your request.</li>
      </ul>

      <h2>4. Refund Processing</h2>
      <ul>
        <li>Approved refunds will be processed within a time-frame of 7-14 days from the date of approval.</li>
        <li>Refunds will be issued to the original payment method used for the purchase. If the original payment method is no longer available, please inform us, and we will work with you to find an alternative solution.</li>
      </ul>

      <h2>5. Non-Refundable Situations</h2>
      <ul>
        <li>Refunds will not be provided for:
          <ul>
            <li>Change of mind after purchasing a subscription plan.</li>
            <li>Failure to use the Service during the subscription period.</li>
            <li>Dissatisfaction with features that are not included in the purchased plan.</li>
            <li>Any other reasons not covered under the "Paid Subscription Plans" section.</li>
          </ul>
        </li>
      </ul>

      <h2>6. Changes to this Refund Policy</h2>
      <ul>
        <li>We reserve the right to modify this Refund Policy at any time. Any changes will be posted
        on this page and will take effect immediately upon posting. You are advised to review this Refund Policy periodically for any changes.</li>
         </ul>

         <h2>7. Contact Us</h2>
         <ul>
           <li>If you have any questions or concerns about this Refund Policy, please contact us at <a href="mailto:info@xircular.io">info@xircular.io</a>.</li>
         </ul>
       </div>
     );
   };

   export default RefundPolicy;
