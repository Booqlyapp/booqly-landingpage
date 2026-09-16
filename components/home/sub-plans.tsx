"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type PlanFeature = {
  text: string;
  note?: string;
};

type Plan = {
  name: string;
  price: string;
  save?: string;
  badge?: string;
  featured?: boolean;
  features: PlanFeature[];
};

const CLIENT_PLANS: Plan[] = [
  {
    name: "Referral Plan",
    price: "Free",
    features: [
      { text: "Book Verified Providers", note: "(Limited - Referred Only)" },
      { text: "Internal Chat", note: "(Limited - Referred Only)" },
    ],
  },
  {
    name: "Premium",
    price: "$4.99/month Plan",
    badge: "Most Popular",
    featured: true,
    features: [
      { text: "One Free Booking" },
      { text: "Verified Provider Reviews" },
      { text: "Internal Chat unlimited" },
      { text: "Favorite Service Providers" },
      { text: "Personalized Portfolio" },
      { text: "Discover Any Provider" },
    ],
  },
  {
    name: "Trial Plan",
    price: "Free",
    features: [
      { text: "One Free Booking" },
      { text: "Verified Provider Reviews" },
      {
        text: "Internal Chat",
        note: "(Limited, Chat with only 3 different providers)",
      },
      {
        text: "Discover Any Provider",
        note: "(Only for initial discovery. After using your one free booking, discovery locks unless you subscribe or enter a referral code.)",
      },
    ],
  },
];

const PROFESSIONAL_PLANS: Plan[] = [
  {
    name: "Basic",
    price: "US $14.99/month",
    save: "Save up to 20% by paying yearly",
    features: [
      { text: "Verified Business Profile" },
      { text: "Booking Calendar" },
      { text: "Internal Client Chat" },
      { text: "Unlimited Promotions & Deals" },
    ],
  },
  {
    name: "Pro",
    price: "US $29.99/month",
    save: "Save up to 20% by paying yearly",
    badge: "Most Popular",
    featured: true,
    features: [
      { text: "Everything in basic" },
      { text: "Reply to Client Reviews" },
      { text: "Basic Booking Analytics" },
      { text: "Custom Referral Codes" },
      {
        text: "Limited Priority Search Ranking",
        note: "(2 ads a month)",
      },
    ],
  },
  {
    name: "Premium",
    price: "US $49.99/month",
    save: "Save up to 20% by paying yearly",
    features: [
      { text: "Everything in pro" },
      { text: "Advance Booking Analytics" },
      { text: "Beta Tool Access" },
      {
        text: "Limited Priority Search Ranking",
        note: "(4 ads a month)",
      },
    ],
  },
];

const CheckIcon = ({ featured }: { featured?: boolean }) => {
  const color = featured ? "#FFFFFF" : "#759CC9";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="mt-[2px] shrink-0"
    >
      <circle cx="9" cy="9" r="7.25" stroke={color} strokeWidth="1.35" />
      <path
        d="M5.4 9.15L7.75 11.45L12.6 6.55"
        stroke={color}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PlanCard = ({ plan }: { plan: Plan }) => {
  const featured = Boolean(plan.featured);

  return (
    <article
      className={`relative flex h-full flex-col rounded-[28px] px-8 pb-10 pt-8 text-left ${
        featured ? "bg-[#759CC9] text-white" : "bg-[#F5F7FA] text-[#0E1724]"
      }`}
    >
      {plan.badge ? (
        <span className="absolute right-6 top-6 rounded-full bg-[#FDE4F2] px-3 py-1 text-[11px] font-medium leading-none text-[#0E1724]">
          {plan.badge}
        </span>
      ) : null}

      <h3 className={`text-[17px] max-[421px]:text-[15px] font-semibold ${plan.badge ? "pr-24" : ""}`}>
        {plan.name}
      </h3>

      <p className="mt-3 text-[20px] max-[421px]:text-[18px] font-bold leading-tight">{plan.price}</p>

      {plan.save ? (
        <p
          className={`mt-1 text-[12px] font-normal ${
            featured ? "text-white/80" : "text-[#55575C]"
          }`}
        >
          {plan.save}
        </p>
      ) : null}

      <ul className={`space-y-2.5 ${plan.save ? "mt-5" : "mt-4"}`}>
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-2.5">
            <CheckIcon featured={featured} />
            <div className="min-w-0">
              <p className="text-[14px] max-[421px]:text-[13px] leading-snug">{feature.text}</p>
              {feature.note ? (
                <p
                  className={`mt-0.5 text-[11px] leading-snug ${
                    featured ? "text-white/80" : "text-[#55575C]"
                  }`}
                >
                  {feature.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
};

const PlanGrid = ({ plans }: { plans: Plan[] }) => (
  <div className="grid grid-cols-1 items-stretch gap-6 px-4 md:grid-cols-3 md:gap-8">
    {plans.map((plan) => (
      <PlanCard key={plan.name} plan={plan} />
    ))}
  </div>
);

const SubscriptionPlans = () => {
  return (
    <section id="pricing" className="relative w-full bg-white px-6 pt-6 pb-6 font-inter md:px-16 md:py-20 lg:py-10">
      <div className="mb-10 flex justify-center">
        <div className="custom-pagination flex items-center justify-center gap-2" />
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        className="relative mx-auto max-w-7xl"
      >
        <SwiperSlide>
          <div className="mb-6 text-center">
            <h2 className="mb-4 text-4xl max-[421px]:text-[28px] font-semibold text-[#0E1724]">
              Client Subscription Plans
            </h2>
            <p className="mx-auto max-w-5xl text-lg max-[421px]:text-base font-light text-[#1E1E1E]">
              Book your favorite beauty services in seconds, while professionals manage and grow their business with ease.
            </p>
          </div>

          <div className="h-12" />
          <PlanGrid plans={CLIENT_PLANS} />
        </SwiperSlide>

        <SwiperSlide>
          <div className="mb-6 text-center">
            <h2 className="mb-4 text-4xl max-[421px]:text-[28px] font-semibold text-[#0E1724]">
              Professional Subscription Plans
            </h2>
            <p className="mx-auto max-w-5xl text-lg max-[421px]:text-base font-light text-[#1E1E1E]">
              Manage clients, bookings, and payments with ease all in one app.
            </p>
          </div>

          <div className="h-12" />
          <PlanGrid plans={PROFESSIONAL_PLANS} />
        </SwiperSlide>

        <SwiperSlide>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-4xl max-[421px]:text-[28px] font-semibold text-[#0E1724]">
              Beauty Suite Owner Subscription Plans
            </h2>
            <p className="text-lg max-[421px]:text-base font-light text-[#1E1E1E]">
              Salon Suite Owner Free Trial for one month
            </p>
            <p className="text-lg max-[421px]:text-base font-light text-[#1E1E1E]">
              Includes all Premium plan features plus team tools
            </p>
          </div>

          <div className="flex flex-col gap-8 px-4 md:px-6 lg:flex-row">
            <div className="w-full rounded-3xl bg-[#759CC9] p-8 text-white shadow-lg lg:w-[30%]">
              <div className="mb-6 grid grid-cols-3 text-sm max-[421px]:text-xs font-semibold">
                <span>Package</span>
                <span className="text-center">Employees</span>
                <span className="text-right">Price</span>
              </div>

              <div className="space-y-6 text-sm max-[421px]:text-xs">
                {[
                  ["Starter Suite", "1–3", "$49.99"],
                  ["Growing Suite", "4–7", "$74.99"],
                  ["Pro Suite", "8–12", "$99.99"],
                  ["Elite Suite", "13–20", "$149.99"],
                ].map(([pkg, emp, price]) => (
                  <div key={pkg} className="grid grid-cols-3 items-center">
                    <span>{pkg}</span>
                    <span className="border-x border-white/30 text-center">{emp}</span>
                    <span className="text-right">{price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full rounded-3xl border border-gray-200 bg-[#F3F4F6] p-8 max-[481px]:px-4 max-[481px]:py-6 lg:w-[70%]">
              <div className="mb-6 grid grid-cols-[minmax(7.5rem,44%)_1fr] max-[481px]:grid-cols-[minmax(0,30%)_minmax(0,1fr)] max-[481px]:gap-x-2 border-b border-gray-300 pb-4 md:grid-cols-[30%_70%]">
                <h3 className="pr-3 max-[481px]:pr-3 font-bold text-[#0E1724] max-[421px]:text-sm md:pr-4">Category</h3>
                <h3 className="border-l border-gray-300 pl-3 max-[481px]:pl-3 font-bold text-[#0E1724] max-[421px]:text-sm md:pl-6">
                  Details
                </h3>
              </div>

              <div className="space-y-6 text-sm max-[421px]:text-xs">
                <FeatureRow
                  label="Premium Plan Inclusion"
                  detail="Includes all Premium Solo Pro features, plus exclusive team tools"
                />

                <FeatureRow
                  label="Team Member Management"
                  detail="Add or remove team members"
                />

                <FeatureRow
                  label="Verification Requirements"
                  detail="Each team member must complete verification (ID or license)"
                />

                <FeatureRow
                  label="Team Member Access"
                  detail={
                    <>
                      Personal calendar <br />
                      Internal chat <br />
                      Booking management tools
                    </>
                  }
                />

                <FeatureRow
                  label="Suite Owner Controls"
                  detail={
                    <>
                      Edit business profile <br />
                      Manage subscription tier <br />
                      Set suite-wide pricing and policies
                    </>
                  }
                />

                <FeatureRow
                  label="Team Oversight Tools"
                  detail={
                    <>
                      Assign roles/services <br />
                      Monitor staff earnings <br />
                      View suite-wide calendar <br />
                      Track occupancy
                    </>
                  }
                />

                <FeatureRow
                  label="Booking Policy Options/ Manage walk-in clients"
                  detail={
                    <>
                      Suite-wide policies can be: <br />
                      • <b>Unified:</b> All team members follow the same rules <br />
                      • <b>Individual:</b> Each member sets their own page, pricing, and policies <br />
                      {"(under suite unbrella)"}
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #759cc9 !important;
          opacity: 1 !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #000 !important;
          width: 30px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
};

const FeatureRow = ({ label, detail }: { label: string; detail: React.ReactNode }) => (
  <div className="grid grid-cols-[minmax(7.5rem,44%)_1fr] max-[481px]:grid-cols-[minmax(0,30%)_minmax(0,1fr)] max-[481px]:gap-x-2 items-start md:grid-cols-[30%_70%]">
    <div className="pr-3 max-[481px]:pr-3 font-medium text-[#0E1724] max-[421px]:text-xs md:pr-4">{label}</div>
    <div className="border-l border-gray-300 pl-3 max-[481px]:pl-3 leading-relaxed text-[#4B5563] max-[421px]:text-xs md:pl-6">
      {detail}
    </div>
  </div>
);

export default SubscriptionPlans;
