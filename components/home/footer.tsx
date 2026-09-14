"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-8 border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- Mobile Layout (Visible only on small screens) --- */}
        <div className="flex flex-col justify-center items-center font-semibold mb-6 sm:hidden">
          {/* Logo */}
          <div className="mb-6">
            <Image src="/images/logo-footer.svg" alt="Booqly Logo" width={120} height={40} className="h-10" />
          </div>

          {/* Mobile Links (Grid layout for better thumb reach) */}
          <nav className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm text-[#0E1724] text-center">
            <a href="#about-us" className="hover:text-[#759CC9] transition-colors">Overview</a>
            <Link href="/founder" className="hover:text-[#759CC9] transition-colors">Our Founder</Link>
            <a href="#pricing" className="hover:text-[#759CC9] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#759CC9] transition-colors">Contact Us</a>
            <Link href="/terms#privacy" className="hover:text-[#759CC9] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#759CC9] transition-colors">Help</Link>
          </nav>
        </div>

        {/* --- Desktop Layout (Visible on tablets and up) --- */}
        <div className="hidden sm:block">
          <div className="text-center mb-6">
            <Image src="/images/logo-footer.svg" alt="Booqly Logo" width={180} height={64} className="mx-auto h-16" />
          </div>

          <nav className="flex flex-wrap justify-center gap-6 font-semibold mb-6 text-sm text-[#0E1724] text-center">
            <a href="#about-us" className="hover:underline decoration-[#759CC9] underline-offset-4">Overview</a>
            <Link href="/founder" className="hover:underline decoration-[#759CC9] underline-offset-4">Our Founder</Link>
            <a href="#pricing" className="hover:underline decoration-[#759CC9] underline-offset-4">Pricing</a>
            <a href="#contact" className="hover:underline decoration-[#759CC9] underline-offset-4">Contact Us</a>
            <Link href="/terms#privacy" className="hover:underline decoration-[#759CC9] underline-offset-4">Privacy</Link>
            <Link href="/terms" className="hover:underline decoration-[#759CC9] underline-offset-4">Help</Link>
          </nav>
        </div>

        <hr className="border-[#E4E7EC] mb-8" />

        {/* --- Bottom Row: App Stores, Socials, & Copyright --- */}
        {/* Using a custom grid ratio [1fr_auto_1fr] to maximize space for the outer elements while keeping the center perfectly true */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center space-y-8 md:space-y-0 gap-4">
          
          {/* App Store Badges */}
          <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4">
            <a href="#" className="inline-block transition-transform active:scale-95">
              <Image src="/images/Mobile-app-store-badge-2.svg" alt="App Store" width={120} height={48} className="h-8 sm:h-10 md:h-12" />
            </a>
            <a href="#" className="inline-block transition-transform active:scale-95">
              <Image src="/images/Mobile-app-google-play.svg" alt="Google Play" width={135} height={48} className="h-8 sm:h-10 md:h-12" />
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center space-x-6 md:px-4">
            <a href="https://www.tiktok.com/@booqly.app" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition">
              <Image className="w-8 h-8 object-contain" src="/images/tiktok.png" alt="TikTok" width={32} height={32} />
            </a>
            <a href="https://www.instagram.com/booqly.app" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition">
              <Image className="w-8 h-8 object-contain" src="/images/instagram.png" alt="Instagram" width={32} height={32} />
            </a>
          </div>

          {/* Copyright & Quote (Forced to one line when space permits) */}
          <div className="text-[10px] lg:text-xs text-[#667085] text-center md:text-right px-2 font-medium md:whitespace-nowrap">
            &copy; {currentYear} Booqly. <span className="italic inline">&quot;With God all things are possible.&quot; - Matthew 19:26</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;