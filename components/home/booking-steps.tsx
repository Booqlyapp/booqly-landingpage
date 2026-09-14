"use client";

import React from 'react';
import Image from 'next/image';

const STEPS_DATA = [
  {
    id: "01",
    title: "Pick a Salon",
    desc: "Find trusted solo beauty pros and salons near you in just a tap",
    icon: "/images/e-1.svg",
    position: "xl:mt-20", // Alternating "Down"
    numPos: "-top-10"
  },
  {
    id: "02",
    title: "Choose Service",
    desc: "Select from hair, nails, skincare, and more",
    icon: "/images/e-2.svg",
    position: "xl:-mt-10", // Alternating "Up"
    numPos: "-bottom-12"
  },
  {
    id: "03",
    title: "Select Time",
    desc: "Book the time that fits your schedule perfectly.",
    icon: "/images/e-3.svg",
    position: "xl:mt-20",
    numPos: "-top-10"
  },
  {
    id: "04",
    title: "Pay Securely",
    desc: "Make hassle-free payments right inside the app",
    icon: "/images/e-4.svg",
    position: "xl:-mt-10",
    numPos: "-bottom-12"
  },
  {
    id: "05",
    title: "Share Your Review",
    desc: "Rate your experience and help others discover the best services",
    icon: "/images/e-5.svg",
    position: "xl:mt-20",
    numPos: "-top-10"
  }
];

export default function BookingSteps() {
  return (
    <section id="Clients" className="pt-4 pb-6 sm:py-20 lg:py-10 bg-white font-inter relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 text-center">
        
        {/* Section Heading */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E1724]">
            Simple steps to book <br />
            <span className="text-[#759CC9]">(For Clients)</span>
          </h2>
          <p className="text-[#1E1E1E] mt-4 max-w-2xl mx-auto font-light text-lg">
            Find verified professionals near you and book with confidence.
          </p>
        </div>

        {/* Global SVG Shadow Definition */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="hexShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#759CC9" floodOpacity="0.3" />
            </filter>
          </defs>
        </svg>

        {/* Ghost Hexagons */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden xl:block">
          <div className="absolute top-[50%] left-[34%]">
            <GhostHexagon />
          </div>
          <div className="absolute top-[50%] left-[50%]">
            <GhostHexagon />
          </div>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col xl:flex-row justify-center items-start gap-6 xl:gap-0 relative z-10">
          {STEPS_DATA.map((step) => (
            <div 
              key={step.id} 
              className={`relative flex flex-col items-center w-full xl:w-auto xl:-ml-12 first:ml-0 ${step.position}`}
            >
              {/* Step Number */}
              <span className={`hidden xl:block absolute ${step.numPos} text-4xl font-extrabold text-[#759CC9]`}>
                {step.id}
              </span>

              {/* Desktop Hexagon */}
              <div className="hidden xl:block relative w-[320px] h-[280px] drop-shadow-sm">
                <svg 
                  viewBox="0 0 313 279" 
                  className="w-full h-full drop-shadow-lg" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M300.227 129.5C303.799 135.688 303.799 143.312 300.226 149.5L237.023 258.971C233.451 265.159 226.848 268.971 219.703 268.971H93.297C86.1517 268.971 79.5491 265.159 75.9765 258.971L12.7735 149.5C9.20084 143.312 9.20084 135.688 12.7735 129.5L75.9765 20.0292C79.5492 13.8412 86.1517 10.0292 93.297 10.0292H219.703C226.848 10.0292 233.451 13.8412 237.023 20.0292L300.227 129.5Z" 
                    fill="white"
                    style={{ filter: "url(#hexShadow)" }}
                  />
                  
                  {/* Step Icon */}
                  <image x="131" y="45" width="50" height="50" href={step.icon} />
                  
                  {/* Text Content inside Hexagon */}
                  <foreignObject x="50" y="110" width="210" height="120">
                    <div className="flex flex-col items-center justify-center text-center px-2 h-full">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug font-light">
                        {step.desc}
                      </p>
                    </div>
                  </foreignObject>
                </svg>
              </div>

              {/* Mobile Card */}
              <div className="xl:hidden flex items-center w-full bg-white shadow-lg rounded-xl p-4 gap-4">
                <Image src={step.icon} width={80} height={80} className="flex-shrink-0" alt={step.title} />
                <div className="flex-1 text-center">
                  <h3 className="text-xl font-bold text-[#333]">{step.title}</h3>
                  <p className="text-sm text-[#333] mt-1 leading-snug">{step.desc}</p>
                </div>
                <span className="text-3xl font-bold text-[#759CC9] flex-shrink-0">{step.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GhostHexagon = () => (
  <svg width="220" height="200" viewBox="0 0 313 279" fill="none">
    <defs>
      <filter id="clientGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feFlood floodColor="#759CC9" floodOpacity="0.4" result="color" />
        <feComposite in="color" in2="blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M300.227 129.5C303.799 135.688 303.799 143.312 300.226 149.5L237.023 258.971C233.451 265.159 226.848 268.971 219.703 268.971H93.297C86.1517 268.971 79.5491 265.159 75.9765 258.971L12.7735 149.5C9.20084 143.312 9.20084 135.688 12.7735 129.5L75.9765 20.0292C79.5492 13.8412 86.1517 10.0292 93.297 10.0292H219.703C226.848 10.0292 233.451 13.8412 237.023 20.0292L300.227 129.5Z"
      fill="#759CC9"
      filter="url(#clientGlow)"
    />
  </svg>
);