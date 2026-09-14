'use client';

import Navbar from '@/components/navbar';
import Image from 'next/image';
import { useState } from 'react';


export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6FBFF]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center px-6 py-16 bg-white overflow-hidden">
        <Image src="/images/privacy-top-lock.svg" alt="Privacy Illustration" width={600} height={400} className="w-[380px] md:w-[600px] mb-8" />
        <div className="w-full flex flex-col items-center">
          <p className="text-[#759CC9] font-semibold text-[20px] mb-2">Effective Date: August 25, 2025</p>
          <h1 className="text-3xl md:text-7xl font-semibold  mb-6">Privacy Policy</h1>
          <p className="text-[#1E1E1E] text-sm md:text-[20px] font-light leading-relaxed max-w-[1100px] text-center px-4">
            Booqly respects your privacy and is committed to protecting the personal data of all users who access our
            mobile app, web platform, and services. This Privacy Policy (&quot;Policy&quot;) describes how Booqly collects, uses,
            stores, shares, and protects your personal information and data. This Policy applies to Clients, Solo Beauty
            Professionals, Salon Suite Owners, and Team Members who interact with Booqly through our apps, websites, and
            services (&quot;Platform&quot;).
          </p>
        </div>
        <Image src="/images/stars-frame.svg" alt="Decoration" width={40} height={40}
          className="hidden md:block absolute bottom-10 right-10 w-8 md:w-10" />
      </section>

      {/* Main Content */}
      <section className="bg-white py-16 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:col-span-1 bg-[#F6FBFF] rounded-2xl shadow-sm p-6 sticky top-24 h-fit">
            <ul className="space-y-4  text-lg font-medium">
              <li><a href="#scope" className="hover:text-[#759CC9]">1. Scope</a></li>
              <li><a href="#data-collection" className="hover:text-[#759CC9]">2. Data Collection</a></li>
              <li><a href="#usage" className="hover:text-[#759CC9]">3. Usage</a></li>
              <li><a href="#legal-basis" className="hover:text-[#759CC9]">4. Legal Basis</a></li>
              <li><a href="#children" className="hover:text-[#759CC9]">5. Children&apos;s Privacy</a></li>
              <li><a href="#sharing" className="hover:text-[#759CC9]">6. Sharing</a></li>
              <li><a href="#payments" className="hover:text-[#759CC9]">7. Payments</a></li>
              <li><a href="#cookies" className="hover:text-[#759CC9]">8. Cookies</a></li>
              <li><a href="#rights" className="hover:text-[#759CC9]">9. Your Rights</a></li>
              <li><a href="#retention" className="hover:text-[#759CC9]">10. Retention</a></li>
              <li><a href="#security" className="hover:text-[#759CC9]">11. Security</a></li>
              <li><a href="#transfers" className="hover:text-[#759CC9]">12. Transfers</a></li>
              <li><a href="#choices" className="hover:text-[#759CC9]">13. Choices</a></li>
              <li><a href="#updates" className="hover:text-[#759CC9]">14. Updates</a></li>
            </ul>
          </aside>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed bottom-6 right-6 bg-[#759CC9] text-white p-4 rounded-full shadow-lg z-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Dark Overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 opacity-100 transition-opacity duration-300"
            />
          )}

          {/* Mobile Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-md z-50 shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out rounded-r-2xl ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-5 flex justify-between items-center border-b border-gray-200">
              <Image src="/images/logo-footer.svg" alt="Booqly" width={100} height={30} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center group"
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-[#759CC9] transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-6 px-6 space-y-3 overflow-y-auto h-[calc(100%-70px)]">
              <a href="#scope" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">1. Scope</a>
              <a href="#data-collection" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">2. Data Collection</a>
              <a href="#usage" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">3. Usage</a>
              <a href="#legal-basis" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">4. Legal Basis</a>
              <a href="#children" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">5. Children&apos;s Privacy</a>
              <a href="#sharing" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">6. Sharing</a>
              <a href="#payments" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">7. Payments</a>
              <a href="#cookies" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">8. Cookies</a>
              <a href="#rights" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">9. Your Rights</a>
              <a href="#retention" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">10. Retention</a>
              <a href="#security" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">11. Security</a>
              <a href="#transfers" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">12. Transfers</a>
              <a href="#choices" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">13. Choices</a>
              <a href="#updates" onClick={() => setSidebarOpen(false)} className="block  hover:text-[#759CC9] font-medium transition">14. Updates</a>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">

            {/* Section 1 */}
            <div id="scope" className="bg-[#F6FBFF] p-6 md:p-10 rounded-2xl shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold  mb-3">1. Scope of this Policy</h2>
              <p className="text-[#1E1E1E] text-sm md:text-lg leading-relaxed font-light">
                This Policy governs information collected via our mobile app, website, customer service interactions, marketing efforts, and third-party integrations.
                It does not apply to third-party services, websites, or social media platforms linked through our Platform.
                Please refer to their privacy policies directly.
              </p>
            </div>

            {/* Section 2 */}
            <div id="data-collection" className="bg-[#F6FBFF] p-6 md:p-10 rounded-2xl shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold  mb-3">2. Data Collection</h2>
              <p className="text-[#1E1E1E] text-sm md:text-lg leading-relaxed mb-4 font-light">
                We collect information about you in several ways:
              </p>

              <h3 className="font-semibold  mb-2">A. Information You Provide Directly</h3>
              <ul className="list-disc list-inside text-[#1E1E1E] text-sm md:text-lg leading-relaxed mb-4 space-y-1 font-light">
                <li>Name, email address, phone number, profile photo, and password</li>
                <li>Business name, EIN, licenses, and verification documentation (if applicable)</li>
                <li>Government-issued ID (required before booking, chatting, or accepting clients)</li>
                <li>Social media handles (e.g., Instagram, TikTok)</li>
                <li>Payment data (via Stripe, PayPal, Apple/Google Pay; we do not store full card details)</li>
                <li>Internal chat messages and photo uploads</li>
                <li>Booking history, subscription details, service preferences</li>
              </ul>

              <h3 className="font-semibold  mb-2">B. Information We Collect Automatically</h3>
              <ul className="list-disc list-inside text-[#1E1E1E] text-sm md:text-lg leading-relaxed mb-4 space-y-1 font-light">
                <li>Device type, IP address, browser type, OS, and crash logs</li>
                <li>App usage data (e.g., viewed pages, booking interactions, referral activity)</li>
                <li>Location data (if permissions are granted)</li>
                <li>Cookies, beacons, and analytics identifiers</li>
              </ul>

              <h3 className="font-semibold  mt-4 mb-2">C. Information From Third Parties</h3>
              <ul className="list-disc list-inside text-[#1E1E1E] text-sm md:text-lg leading-relaxed space-y-1 font-light">
                <li>Social media APIs (Instagram/TikTok for profile content)</li>
                <li>Google integrations (for review sync, calendar access)</li>
                <li>Payment processors</li>
              </ul>
            </div>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">3. User Accounts</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions 
                under your password.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">4. Verification Requirements</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                All users must complete identity verification before booking appointments or accepting clients. This includes submitting 
                government-issued ID and, for professionals, relevant licenses and certifications.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">5. Payments and Subscriptions</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                Subscription fees are charged monthly and are non-refundable. A 1.5% platform commission applies to all bookings. 
                All payments are processed securely through our payment partners.
              </p>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                You may cancel your subscription at any time, but you will not receive a refund for the current billing period.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">6. Prohibited Activities</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed mb-4">
                You may not use Booqly for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations 
                applicable to your use of the Service.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] font-light">
                <li>Harassment or abuse of other users</li>
                <li>Fraudulent bookings or payments</li>
                <li>Sharing of inappropriate content</li>
                <li>Attempting to circumvent platform fees</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">7. Termination</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">8. Limitation of Liability</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                In no event shall Booqly, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
                indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, 
                use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">9. Changes to Terms</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting 
                the new Terms on this page and updating the &quot;Effective Date&quot; at the top.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold  mb-4">10. Contact Us</h2>
              <p className="text-[#1E1E1E] font-light leading-relaxed">
                If you have any questions about these Terms, please contact us at support@booqlyapp.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
