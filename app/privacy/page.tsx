'use client';

import Navbar from '@/components/navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6FBFF]">
      <Navbar />
      
      <main className="px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0E1724] text-center mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#759CC9] font-semibold text-center mb-12">
            Effective Date: January 1, 2025
          </p>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">1. Information We Collect</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] font-light">
                <li>Name, email address, phone number, and profile photo</li>
                <li>Government-issued ID for verification purposes</li>
                <li>Business information and licenses (for professionals)</li>
                <li>Payment information processed through secure third-party providers</li>
                <li>Booking history and preferences</li>
                <li>Messages and communications within the app</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">2. How We Use Your Information</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] font-light">
                <li>Provide, maintain, and improve our services</li>
                <li>Process bookings and payments</li>
                <li>Verify user identity and prevent fraud</li>
                <li>Send booking confirmations, reminders, and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and improve user experience</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">3. Information Sharing</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] font-light">
                <li>Other users as necessary to facilitate bookings</li>
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Professional partners with your consent</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">4. Data Security</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method 
                of transmission over the Internet or electronic storage is 100% secure. We use encryption, secure servers, and regular 
                security audits to protect your data.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">5. Your Rights</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] font-light">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">6. Cookies and Tracking</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                Our service is intended for users aged 18 and older. We do not knowingly collect personal information from anyone 
                under the age of 18. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">8. Changes to This Policy</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the &quot;Effective Date&quot; at the top.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#0E1724] mb-4">9. Contact Us</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at support@booqlyapp.com
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
