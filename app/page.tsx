'use client';

import Navbar from '@/components/navbar';
import Link from 'next/link';
import Image from 'next/image';
import BookingSteps from '@/components/home/booking-steps';
import ProfessionalSteps from '@/components/home/professional-steps';
import WhyYouLoveIt from '@/components/home/why-you-love-it';
import SubscriptionPlans from '@/components/home/sub-plans';
import DownloadCTA from '@/components/home/download-cta';
import AboutSection from '@/components/home/about';
import ContactSection from '@/components/home/contact';
import Footer from '@/components/home/footer';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Handle hash scrolling when navigating from other pages
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F6FBFF]">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative w-full bg-white font-inter overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-4 sm:py-20 lg:pt-16 lg:pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Mobile image & decoration */}
          <div className="relative z-0 flex min-w-0 justify-center lg:justify-start order-2 lg:order-1">
            {/* Background brush stroke SVG (Optional: Insert your SVG code here if you have it) */}

            {/* Mobile mockup */}
            <Image
              src="/images/mobile.png"
              alt="App Preview"
              width={900}
              height={1800}
              className="relative h-auto w-[360px] max-w-[90vw] sm:w-[340px] sm:max-w-[340px] md:w-[420px] md:max-w-[420px] lg:w-full lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px] rotate-[-8deg] drop-shadow-2xl transition-transform hover:rotate-0 duration-700"
              priority
            />
          </div>

          {/* Right: Text Content */}
          <div className="relative z-10 text-center lg:text-left space-y-6 order-1 lg:order-2">
            <p className="text-lg max-[421px]:text-base font-medium text-[#759CC9] tracking-wide">
              Welcome to Booqly
            </p>
            <h1 className="text-4xl max-[421px]:text-[28px] md:text-6xl font-extrabold text-[#0E1724] leading-tight">
              Beauty Booking.<br />
              <span className="">Made Simple.</span>
            </h1>
            <p className="text-[#1E1E1E] text-base max-[421px]:text-sm md:text-lg max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
              Your trusted beauty marketplace connecting clients with solo pros and salon suite owners.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link href="#" className="transform transition hover:scale-105 active:scale-95">
                <Image
                  src="/images/Mobile-app-store-badge-2.svg"
                  alt="App Store"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
              <Link href="#" className="transform transition hover:scale-105 active:scale-95">
                <Image
                  src="/images/Mobile-app-google-play.svg"
                  alt="Google Play"
                  width={135}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Steps Section */}
      <BookingSteps />

      <ProfessionalSteps />

      <WhyYouLoveIt />

      <SubscriptionPlans />
      
      <DownloadCTA />

      <AboutSection />

      <ContactSection />

      <Footer />
    </div>
  );
}
