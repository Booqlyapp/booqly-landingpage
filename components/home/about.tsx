"use client";

import React from 'react';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <>
      {/* ================= SECTION 1: ABOUT & CLIENTS ================= */}
      <section id="about-us" className="relative z-0 isolate bg-white pt-6 pb-10 md:py-20 px-6 md:px-16 overflow-hidden md:overflow-visible">
        {/* Background Shapes */}
        <Image 
          src="/images/Ellipse-no-5.svg" 
          alt="Decoration" 
          width={256}
          height={256}
          className="absolute -bottom-[20%] md:bottom-20 left-0 w-48 md:w-64 opacity-100 pointer-events-none select-none z-[1] max-[481px]:hidden" 
        />
        <Image 
          src="/images/Star-no-1.svg" 
          alt="Decoration" 
          width={800}
          height={800}
          className="absolute right-10 top-[50%] w-72 md:w-[50rem] opacity-100 pointer-events-none select-none z-[8]" 
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Intro */}
          <div className="text-center mb-6">
            <p className="text-[#759CC9] font-semibold font-inter text-2xl max-[421px]:text-xl md:text-[30px] md:mb-2">
              Beauty Booking. Made Simple.
            </p>
            <h2 className="text-3xl max-[421px]:text-2xl md:text-5xl font-bold text-[#0E1724] mb-6">
              About Booqly
            </h2>
          </div>

          <p className="text-[#1E1E1E] leading-relaxed max-w-5xl mx-auto text-center mb-12 font-inter font-light text-base max-[421px]:text-sm md:text-lg">
            Booqly is a beauty booking platform created to simplify how clients discover 
            professionals and how beauty pros and suite owners manage and grow their businesses.
          </p>

          {/* Grid: Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="order-2 md:order-1 md:-mt-20">
              <p className="text-[#1E1E1E] leading-relaxed font-light text-base max-[421px]:text-sm md:text-lg text-center md:text-left">
                For clients, Booqly offers verified reviews, ID-verified professionals, and a smooth, 
                secure booking experience that prioritizes your time and your trust. From your first 
                visit to your forever stylist, it helps you discover professionals you can rely on.
              </p>
            </div>
            <div className="flex justify-center order-1 md:order-2">
              <Image src="/images/mobile-full-x.png" alt="Booqly App" width={304} height={600} className="w-52 md:w-76 relative z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: SOLO PROFESSIONALS ================= */}
      <section className="relative bg-white pt-6 pb-10 md:py-20 lg:py-12 px-6 md:px-16 md:-mt-52">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 relative">
          
          {/* Left: Mobile Mockup */}
          <div className="flex justify-center md:justify-start md:-mt-30 relative z-30">
            <Image src="/images/iphone-8.png" alt="Booqly Services" width={304} height={600} className="w-52 md:w-76 relative z-20" />
          </div>

          {/* Right: Text Content */}
          <div className="flex justify-center md:justify-center md:mt-28 relative z-10">
            <p className="text-[#1E1E1E] text-base max-[421px]:text-sm md:text-lg font-inter font-light leading-relaxed text-center w-full">
              For solo beauty professionals, Booqly is more than a booking system. It 
              gives you another platform to be seen beyond your own social media.  
              You can grow your brand, build your portfolio, and manage your business 
              with real tools that support you at every level. Solo pros can also leave 
              reviews on clients, making it a two-way street that holds everyone 
              accountable and creates a better experience for both sides.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: SUITE OWNERS ================= */}
      <section className="relative bg-white pt-6 pb-10 md:py-20 lg:py-12 px-6 md:px-16 md:-mt-40">
        {/* Background Shapes */}
        <Image 
          src="/images/Ellipse-6.svg" 
          alt="Decoration" 
          width={320}
          height={320}
          className="absolute md:right-40 md:top-[20%] w-64 md:w-80 opacity-100 pointer-events-none select-none" 
        />
        <Image 
          src="/images/Star-no-1.svg" 
          alt="Decoration" 
          width={640}
          height={640}
          className="hidden md:block absolute -bottom-35 left-[30%] -translate-x-1/2 w-[28rem] md:w-[40rem] opacity-60 pointer-events-none select-none" 
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">
          {/* Right: Mobile Mockup */}
          <div className="flex justify-center order-1 md:order-2 relative z-20">
            <Image src="/images/iphone-4.png" alt="Booqly Openings" width={304} height={600} className="w-52 md:w-76" />
          </div>

          {/* Left: Text Content */}
          <div className="flex justify-center md:mt-65 order-2 md:order-1">
            <p className="text-[#1E1E1E] leading-relaxed text-center md:text-left font-light font-inter text-base max-[421px]:text-sm md:text-lg w-[90%] sm:w-[95%] md:w-full md:max-w-xl">
              For salon suite owners, Booqly helps you run your space with confidence.
              You can manage your team, track performance, organize bookings, and grow
              your business with purpose and structure.
            </p>
          </div>
        </div>

        {/* Bottom Closing Statement */}
        <div className="max-w-7xl mx-auto mt-16 md:ml-30 text-center relative z-10 px-4 md:px-0">
          <p className="text-[#1E1E1E] leading-relaxed text-[15px] max-[421px]:text-xs sm:text-base md:text-lg font-light font-inter w-[90%] sm:w-[95%] md:w-auto mx-auto">
            Everything you see in Booqly comes from real experience.
            Every feature has a purpose and every tool solves a problem.
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
