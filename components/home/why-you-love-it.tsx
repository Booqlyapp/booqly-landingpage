"use client";


import React from 'react';
import Image from 'next/image';

const FEATURES = [
  "Dual Review System",
  "Verified IDs, licenses & documents",
  "Reels-style beauty content feed",
  "Secure booking & payments",
  "Built-in chat & photo sharing",
  "Growth tools for pros & suites",
];

const WhyYouLoveIt = () => {
  return (
    <section id="features" className="relative w-full px-6 pt-6 pb-6 md:px-16 sm:py-20 lg:py-10 bg-white font-inter overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Column (Features List) - Appears last on mobile, first on desktop */}
        <div className="order-3 lg:order-1 flex justify-center lg:justify-start">
          <div className="space-y-5">
            {FEATURES.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Image 
                    src="/images/check.svg" 
                    alt="check" 
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </div>
                <span className="text-base md:text-lg lg:text-xl text-[#1E1E1E] font-light">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column (Phone Mockup) - Stay in middle */}
        <div className="relative flex justify-center order-2 lg:order-2">
          <div className="relative transition-all duration-700 hover:rotate-2 hover:scale-105">
            <Image 
              src="/images/mobile+widget+circle5.png" 
              alt="Booqly App Preview" 
              width={420}
              height={840}
              className="w-[280px] md:w-[350px] lg:w-[420px] drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Column (Heading + Description + CTAs) - Appears first on mobile */}
        <div className="text-center lg:text-left order-1 lg:order-3 lg:pl-8">
          <p className="text-[#759CC9] font-semibold text-lg md:text-xl mb-4 tracking-wide">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0E1724]">
            Why You’ll Love It
          </h2>
          <div className="mt-6 text-[#1E1E1E] text-sm md:text-[16px] lg:text-[18px] leading-relaxed font-light max-w-md mx-auto lg:mx-0">
            <p>
              Verified clients and pros, secure payments, and dual reviews you can trust.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10">
            <a 
              href="#" 
              className="transition-transform active:scale-95 hover:opacity-90"
            >
              <Image 
                src="/images/Mobile-app-store-badge.svg" 
                alt="Download on App Store" 
                width={120}
                height={48}
                className="h-10 md:h-12" 
              />
            </a>
            <a 
              href="#" 
              className="transition-transform active:scale-95 hover:opacity-90"
            >
              <Image 
                src="/images/Mobile-app-google-play.svg" 
                alt="Get it on Google Play" 
                width={135}
                height={48}
                className="h-10 md:h-12" 
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyYouLoveIt;