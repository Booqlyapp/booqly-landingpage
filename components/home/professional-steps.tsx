"use client";

import React from "react";
import Image from "next/image";

const PROF_STEPS = [
  {
    id: "01",
    title: "Create Your Profile",
    desc: "Showcase your services, portfolio, and availability to attract new clients.",
    icon: "/images/b-1.svg",
    xlOffset: "xl:mt-20 xl:-ml-12",
    numPos: "-top-10",
    hexColor: "#759CC9",
  },
  {
    id: "02",
    title: "Set Your Service",
    desc: "Add pricing, service details, and durations that fit your business.",
    icon: "/images/b-2.svg",
    xlOffset: "xl:-mt-10 xl:-ml-12",
    numPos: "-bottom-12",
    hexColor: "#759CC9",
  },
  {
    id: "03",
    title: "Manage Your Calendar",
    desc: "Control your availability and approve bookings with just a tap.",
    icon: "/images/b-3.svg",
    xlOffset: "xl:mt-20 xl:-ml-12",
    numPos: "-top-10",
    hexColor: "#759CC9",
  },
  {
    id: "04",
    title: "Get Paid Your Way",
    desc: "Choose secure in-app payments or connect with a third party — you decide.",
    icon: "/images/b-4.svg",
    xlOffset: "xl:-mt-10 xl:-ml-12",
    numPos: "-bottom-12",
    hexColor: "#759CC9",
  },
  {
    id: "05",
    title: "Share Your Review",
    desc: "Review clients after appointment and build trusted relationships.",
    icon: "/images/b-5.svg",
    xlOffset: "xl:mt-20 xl:-ml-12",
    numPos: "-top-10",
    hexColor: "#759CC9",
  },
];

const ProfessionalSteps = () => {
  return (
    <section
      id="Professionals"
      className="pt-6 pb-6 sm:py-24 lg:py-12 bg-white font-inter relative overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto px-6 text-center">
        
        {/* Header */}
        <div className="mb-8 sm:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E1724]">
            Simple steps to Grow <br />
            <span className="text-[#759CC9]">(For Professionals)</span>
          </h2>
          <p className="text-[#1E1E1E] mt-4 max-w-2xl mx-auto font-light text-lg">
            Manage clients, bookings, and payments with ease — all in one app.
          </p>
        </div>

        {/* Ghost Hexagons */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden xl:block">
          <div className="absolute top-[50%] left-[34%]">
            <GhostHexagon />
          </div>
          <div className="absolute top-[50%] left-[50%]">
            <GhostHexagon />
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col xl:flex-row justify-center items-start gap-6 xl:gap-0 relative z-10">
          {PROF_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex flex-col items-center w-full xl:w-auto ${step.xlOffset} ${
                index === 0 ? "xl:ml-0" : ""
              }`}
            >
              {/* Step Number */}
              <span
                className={`hidden xl:block absolute ${step.numPos} text-4xl font-extrabold text-black`}
              >
                {step.id}
              </span>

              {/* Desktop Hex */}
              <div className="hidden xl:block relative transition-transform duration-500 hover:scale-105 cursor-pointer">
                <svg
                  width="320"
                  height="280"
                  viewBox="0 0 313 279"
                  fill="none"
                >
                  <path
                    d="M300.227 129.5C303.799 135.688 303.799 143.312 300.226 149.5L237.023 258.971C233.451 265.159 226.848 268.971 219.703 268.971H93.297C86.1517 268.971 79.5491 265.159 75.9765 258.971L12.7735 149.5C9.20084 143.312 9.20084 135.688 12.7735 129.5L75.9765 20.0292C79.5492 13.8412 86.1517 10.0292 93.297 10.0292H219.703C226.848 10.0292 233.451 13.8412 237.023 20.0292L300.227 129.5Z"
                    fill={step.hexColor}
                  />

                  {/* Icon */}
                  <image
                    x="131"
                    y="45"
                    width="50"
                    height="50"
                    href={step.icon}
                  />

                  {/* Content */}
                  <foreignObject x="50" y="105" width="213" height="130">
                    <div className="flex flex-col items-center text-center px-4 h-full">
                      <h3 className="text-[20px] font-bold text-white mb-2 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-[16px] text-white/90 leading-snug font-light">
                        {step.desc}
                      </p>
                    </div>
                  </foreignObject>
                </svg>
              </div>

              {/* Mobile Card */}
              <div
                className="xl:hidden flex items-center w-full shadow-lg rounded-xl p-4 gap-4"
                style={{ backgroundColor: step.hexColor }}
              >
                <Image
                  src={step.icon}
                  width={80}
                  height={80}
                  className="w-20 h-20 flex-shrink-0"
                  alt={step.title}
                />
                <div className="flex-1 text-center">
                  <h4 className="text-xl font-bold text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm text-white mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <span className="text-3xl font-bold text-black flex-shrink-0">
                  {step.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GhostHexagon = () => (
  <svg width="220" height="200" viewBox="0 0 313 279" fill="none">
    <defs>
      <filter id="profGlow" x="-50%" y="-50%" width="200%" height="200%">
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
      fill="black"
      filter="url(#profGlow)"
    />
  </svg>
);

export default ProfessionalSteps;