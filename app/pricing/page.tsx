'use client';

import Navbar from '@/components/navbar';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F6FBFF]">
      <Navbar />
      
      <main className="px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0E1724] text-center mb-6">
            Pricing Plans
          </h1>
          <p className="text-lg md:text-xl text-[#1E1E1E] text-center mb-16 font-light max-w-3xl mx-auto">
            Choose the perfect plan for your needs
          </p>

          {/* Client Plans */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1724] text-center mb-12">
              Client Subscription Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  name: 'Free Trial', 
                  price: 'Free', 
                  features: [
                    '1 free booking',
                    'Limited discovery',
                    'Chat with 3 providers',
                    'Basic support'
                  ] 
                },
                { 
                  name: 'Premium', 
                  price: '$4.99/mo', 
                  features: [
                    'Unlimited bookings',
                    'Full discovery access',
                    'Unlimited chat',
                    'Favorites & Portfolio',
                    'Priority support'
                  ], 
                  highlight: true 
                },
                { 
                  name: 'Referral Plan', 
                  price: 'Free', 
                  features: [
                    'Free with referral code',
                    'Access to referred providers',
                    'Unlimited bookings with referred',
                    'Standard support'
                  ] 
                }
              ].map((plan, idx) => (
                <div key={idx} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-[#759CC9] text-white shadow-lg scale-105' : 'bg-white'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#0E1724]'}`}>{plan.name}</h3>
                  <div className={`text-4xl font-bold mb-6 ${plan.highlight ? 'text-white' : 'text-[#759CC9]'}`}>{plan.price}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-[#759CC9]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? 'text-white' : 'text-[#1E1E1E]'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.highlight ? 'bg-white text-[#759CC9] hover:bg-gray-100' : 'bg-[#759CC9] text-white hover:bg-[#6A8EB7]'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Plans */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1724] text-center mb-12">
              Solo Professional Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Basic', price: '$14.99/mo', features: ['Booking calendar', 'Payment processing', 'Client chat', 'Basic analytics'] },
                { name: 'Pro', price: '$29.99/mo', features: ['Everything in Basic', 'Review responses', 'Google Review Boost', 'Referral codes', 'Advanced analytics'], highlight: true },
                { name: 'Premium', price: '$49.99/mo', features: ['Everything in Pro', 'Priority search placement', 'Beta features access', 'Dedicated support'] }
              ].map((plan, idx) => (
                <div key={idx} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-[#759CC9] text-white shadow-lg scale-105' : 'bg-white'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#0E1724]'}`}>{plan.name}</h3>
                  <div className={`text-4xl font-bold mb-6 ${plan.highlight ? 'text-white' : 'text-[#759CC9]'}`}>{plan.price}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-[#759CC9]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? 'text-white' : 'text-[#1E1E1E]'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.highlight ? 'bg-white text-[#759CC9] hover:bg-gray-100' : 'bg-[#759CC9] text-white hover:bg-[#6A8EB7]'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Suite Owner Plans */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1724] text-center mb-12">
              Salon Suite Owner Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Starter', price: '$49.99/mo', team: '1-5 team members' },
                { name: 'Growing', price: '$74.99/mo', team: '6-10 team members', highlight: true },
                { name: 'Pro', price: '$99.99/mo', team: '11-15 team members' },
                { name: 'Elite', price: '$149.99/mo', team: '16-20 team members' }
              ].map((plan, idx) => (
                <div key={idx} className={`rounded-2xl p-6 ${plan.highlight ? 'bg-[#759CC9] text-white shadow-lg' : 'bg-white'}`}>
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#0E1724]'}`}>{plan.name}</h3>
                  <div className={`text-3xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#759CC9]'}`}>{plan.price}</div>
                  <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/90' : 'text-[#1E1E1E]'}`}>{plan.team}</p>
                  <button className={`w-full py-2 rounded-lg font-semibold transition text-sm ${plan.highlight ? 'bg-white text-[#759CC9] hover:bg-gray-100' : 'bg-[#759CC9] text-white hover:bg-[#6A8EB7]'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 text-center">
            <p className="text-[#1E1E1E] mb-4">All plans include 1.5% platform commission on bookings</p>
            <Link href="/#contact" className="text-[#759CC9] hover:underline font-medium">
              Have questions? Contact us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
