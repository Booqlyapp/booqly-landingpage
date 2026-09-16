"use client";

import React from "react";
import Image from "next/image";

const DownloadCTA = () => {
  return (
    <section className="w-full bg-white pt-6 pb-6 sm:pt-10 sm:pb-10 lg:pt-10 lg:pb-0 font-inter relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 items-center lg:items-end gap-4 sm:gap-8 lg:gap-12 relative">
        {/* Left Content */}
        <div className="text-center lg:text-left relative order-1 lg:order-none z-10 lg:pb-16">
          <h2 className="text-3xl max-[421px]:text-[24px] sm:text-4xl lg:text-5xl font-semibold text-[#0E1724] mb-6">
            Download app today!
          </h2>
          <p className="text-[#1E1E1E] text-base max-[421px]:text-sm sm:text-lg md:text-xl font-light mb-8 mx-auto lg:mx-0 leading-relaxed max-w-xs sm:max-w-sm md:max-w-sm">
            Download app for Android, iOS & iPadOS today — free trials and paid
            plans available.
          </p>

          {/* Store Buttons */}
          <div className="flex justify-center lg:justify-start gap-4 relative z-10">
            <a href="#" className="transition-transform active:scale-95">
              <Image
                src="/images/Mobile-app-store-badge-2.svg"
                alt="App Store"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </a>
            <a href="#" className="transition-transform active:scale-95">
              <Image
                src="/images/Mobile-app-google-play.svg"
                alt="Google Play"
                width={135}
                height={48}
                className="h-12 w-auto"
              />
            </a>
          </div>

          <div
            className="hidden"
          >
            <Image
              src="/images/Ellipse-3.svg"
              alt=""
              width={480}
              height={280}
              className="w-[80%] h-full object-contain"
            />
          </div>
        </div>

        {/* Right Mockups */}
        <div className="relative flex justify-center lg:justify-start lg:items-end items-center order-2 lg:order-none mt-4 lg:mt-0 w-full">
          <Image
            src="/images/downloadbooqly3.png"
            alt="Download Booqly App"
            width={1060}
            height={1057}
            className="w-[90%] sm:w-[85%] lg:w-full h-auto z-10 lg:-ml-15 lg:mb-0 block"
          />

          {/* Big Background Shape (Behind Mockups) */}
          {/* <Image
              src="/images/Ellipse-4.svg"
              alt="Background Shape Large"
              width={400}
              height={350}
              className="w-[95%] md:w-full h-[90%] md:h-full object-contain"
            /> */}
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;