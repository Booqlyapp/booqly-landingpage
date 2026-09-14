'use client';

import Navbar from '@/components/navbar';


export default function OurFounderPage() {
  return (
    <div className="min-h-screen bg-[#F6FBFF]">
      <Navbar />
      
      {/* Our Founder Section */}
      <section className="bg-white py-16 px-6 md:px-16 font-inter font-light">
        <div className="max-w-7xl mx-auto text-center md:text-left items-center">

          {/* Header */}
          <div className="space-y-5 order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-bold mb-3 text-center md:text-center">Our Story</h2>
            <h2 className="text-xl md:text-4xl font-normal mb-6 text-center md:text-center text-[#1E1E1E]">
              A Word From the Founder
            </h2>

            <p className="text-[16px] md:text-[18px] leading-relaxed">
              For as long as I could remember, I was the woman who kept a steady job. I believed that real security came from a conventional 9 to 5. I followed the rules, showed up every day, and worked hard. But deep down, I was tired. I was tired of working a job that had no purpose. I was making money but still feeling unfulfilled. I knew I had more in me. I just didn&apos;t know how to unlock it yet.
            </p>

            <p className="text-[16px] md:text-[18px] leading-relaxed">
              Then, a year ago, I was laid off from my job and found myself in one of the lowest places I had ever been. I was overwhelmed, unsure of what to do next, and questioning everything I thought I knew about success and stability.
            </p>

            <p className="text-[16px] md:text-[18px] leading-relaxed">
              Losing my job forced me to cut back on the things that made me feel like myself. No more biweekly hair appointments, no more nails, lashes, waxes, or all the beauty services I had always loved. So I started doing my own hair at home to save money.
            </p>

            <p className="text-[16px] md:text-[18px] leading-relaxed">
              One day, I recorded myself trying a new color and I posted it on TikTok. That video went viral. What started as a way to save money became the beginning of my wig influencer journey. I spent the next year creating content, learning the industry from a new perspective, and reconnecting with God.
            </p>

            <p className="text-[16px] md:text-[18px] leading-relaxed">
              That&apos;s when everything started to make sense.
            </p>
          </div>
        </div>

        {/* This Paragraph Should Span Both Columns */}
        <div className="max-w-7xl mx-auto mt-10">
          <p className="text-[16px] md:text-[18px] leading-relaxed text-center md:text-left">
            In the middle of what felt like a &quot;loss&quot;, God told me to think bigger. Then one night, he gave me a vision in a dream. Clear and specific. A beauty app. A platform that would serve people like me, the client who just wants to feel confident and cared for, and the beauty professionals who need real tools, real visibility, and real support to grow.
          </p>
        </div>

        {/* Final Centered Section */}
        <div className="max-w-4xl mx-auto mt-8 space-y-5 text-center">
          <p className="text-[16px] md:text-[18px] leading-relaxed">
            That&apos;s how Booqly was born.
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed">
            I didn&apos;t just build a business. I found my purpose.
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed italic">Maybe this isn&apos;t just an app. It&apos;s a testimony.</p>

          <p className="text-[16px] md:text-[18px] font-semibold">xoxo</p>

          <p className="text-[16px] md:text-[18px] font-medium">
            Made by a Black woman who gets it.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-center text-center py-6">
        <div className="text-[9px] sm:text-[10px] lg:text-xs text-[#667085] text-center md:text-right px-2">
          &copy; 2025 Booqly. &quot;With God all things are possible.&quot; - Matthew 19:26
        </div>
      </footer>
    </div>
  );
}
