"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.booqlyapp.com';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Unable to send message. Please check your connection and try again.');
    }
  };

  return (
    <section id="contact" className="bg-white pt-6 pb-6 md:py-16 lg:py-10 px-4 sm:px-8 md:px-16 md:mt-20 lg:mt-10 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side */}
        <div className="flex-1 w-full">
          <h2 className="text-3xl max-[421px]:text-[24px] text-center md:text-start md:text-7xl font-semibold font-inter text-[#0E1724] md:-mt-15 mb-5">
            Get In Touch
          </h2>

          <p className="text-[#1E1E1E] text-center md:text-left text-[16px] max-[421px]:text-sm md:text-[20px] font-light mb-8 leading-relaxed">
            Questions or requests regarding this Policy
            <br className="block md:hidden" /> can be sent to:
          </p>

          {/* Info Section (hidden on mobile, visible on md and above) */}
          <div className="hidden md:block">
            <h3 className="text-2xl text-center md:text-left font-bold text-[#0E1724] md:-mb-4">
              Information
            </h3>

            <div className="flex flex-col gap-5 mt-8 md:mt-10">
              {/* Email */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Image src="/images/sms.svg" alt="Email icon" width={24} height={24} className="w-6 h-6" />
                <p className="text-[#0E1724] text-lg font-medium">support@booqlyapp.com</p>
              </div>

              {/* Location */}
              <div className="flex items-start justify-center md:justify-start gap-3">
                <Image src="/images/location.svg" alt="Location icon" width={24} height={24} className="w-6 h-6" />
                <p className="text-[#0E1724] text-lg font-medium leading-relaxed">
                  2086 Jodeco Road #1009<br />
                  McDonough, GA 30253<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex-1 w-full bg-[#F6FBFF] rounded-2xl shadow-md border border-gray-100 p-6 -mt-12 md:-mt-7 sm:p-8 md:ml-20 bg-gradient-to-br">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0E1724]">Message Sent!</h3>
              <p className="text-[#667085] text-sm">Thank you for reaching out. We&apos;ll get back to you soon.</p>
              <button onClick={() => setStatus('idle')} className="mt-2 text-[#6A8EB7] text-sm font-medium hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-10">
              {/* Name Input */}
              <div className="flex items-center gap-3 border border-[#6A8EB7] rounded-lg px-4 py-3 bg-white">
                <Image src="/images/name.svg" alt="Name Icon" width={20} height={20} className="w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  className="w-full text-[#0E1724] placeholder-[#0E1724] focus:outline-none focus:ring-0 bg-transparent"
                />
              </div>

              {/* Email Input */}
              <div className="flex items-center gap-3 border border-[#6A8EB7] rounded-lg px-4 py-3 bg-white">
                <Image src="/images/email.svg" alt="Email Icon" width={20} height={20} className="w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full text-[#0E1724] placeholder-[#0E1724] focus:outline-none focus:ring-0 bg-transparent"
                />
              </div>

              {/* Subject Input */}
              <div className="flex items-center gap-3 border border-[#6A8EB7] rounded-lg px-4 py-3 bg-white">
                <Image src="/images/subject.svg" alt="Subject Icon" width={20} height={20} className="w-5 h-5" />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  className="w-full text-[#0E1724] placeholder-[#0E1724] focus:outline-none focus:ring-0 bg-transparent"
                />
              </div>

              {/* Message Input */}
              <div className="flex items-start gap-3 border border-[#6A8EB7] rounded-lg px-4 py-3 bg-white">
                <Image src="/images/message.svg" alt="Message Icon" width={20} height={20} className="w-5 h-5 mt-1" />
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write message"
                  className="w-full text-[#0E1724] placeholder-[#0E1724] focus:outline-none focus:ring-0 bg-transparent resize-none"
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm -mt-4">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#6A8EB7] text-white font-semibold py-3 rounded-lg hover:bg-[#4c72a8] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Submit message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile-only Info */}
      <div className="md:hidden mt-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
             <Image src="/images/sms.svg" alt="Email" width={20} height={20} className="w-5 h-5" />
             <p className="text-[#0E1724] font-medium max-[421px]:text-sm">support@booqlyapp.com</p>
          </div>
          <div className="text-center">
             <p className="text-[#0E1724] font-medium max-[421px]:text-sm leading-relaxed">
               2086 Jodeco Road #1009, McDonough, GA 30253
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;