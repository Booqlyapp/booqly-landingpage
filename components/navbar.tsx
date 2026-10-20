"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  businessName?: string;
}

const Navbar = ({ businessName }: NavbarProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on a page that should show back button
  const showBackButton = pathname === '/our-founder' || pathname === '/terms';
  
  // Check if we're on a booking page (subdomain)
  const isBookingPage = !!businessName;
  
  // Detect subdomain after mount to avoid hydration mismatch
  React.useEffect(() => {
    const checkSubdomain = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isOnSubdomain = hostname.split('.').length > 2 || 
          (hostname.includes('.') && !hostname.startsWith('www.') && hostname !== 'localhost');
        setIsSubdomain(isOnSubdomain);
      }
      setHasMounted(true);
    };
    
    checkSubdomain();
  }, []);
  
  // Get the main domain URL
  const getMainDomainUrl = (path: string) => {
    // During SSR or before hydration, return relative path to avoid mismatch
    if (!hasMounted) return path;
    if (!isSubdomain) return path;
    
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // For localhost, use localhost:port
    if (hostname.includes('localhost')) {
      return `${protocol}//localhost${port ? ':' + port : ''}${path}`;
    }
    
    // For production, get the main domain (remove subdomain)
    const parts = hostname.split('.');
    const mainDomain = parts.slice(-2).join('.');
    return `${protocol}//${mainDomain}${path}`;
  };

  return (
    <header className="bg-[#759CC9] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between py-6">
          
          {/* Left: Back arrow (mobile) or Back arrow + text (desktop) */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link 
                href={getMainDomainUrl('/')} 
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                <span className="font-medium hidden lg:inline">Back</span>
              </Link>
            )}
            
            {/* Logo or Business Name — hidden on mobile when back button is shown (centered instead) */}
            {isBookingPage ? (
              <div className="text-white text-xl font-bold">
                {businessName}
              </div>
            ) : (
              <Link href={getMainDomainUrl('/')} className={`flex items-center ${showBackButton ? 'hidden lg:flex' : ''}`}>
                <Image 
                  src="/images/logo.svg" 
                  alt="Booqly Logo" 
                  width={120}
                  height={40}
                  className="h-10 w-auto" 
                  priority
                />
              </Link>
            )}
          </div>

          {/* Center: Logo on mobile when back button is shown */}
          {showBackButton && !isBookingPage && (
            <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
              <Link href={getMainDomainUrl('/')}>
                <Image 
                  src="/images/logo.svg" 
                  alt="Booqly Logo" 
                  width={120}
                  height={40}
                  className="h-10 w-auto" 
                  priority
                />
              </Link>
            </div>
          )}

          {/* Desktop Navigation - Hidden on booking pages */}
          {!isBookingPage && (
            <>
              <nav className="hidden lg:flex items-center space-x-8 text-[#FDE4F2] font-medium">
                <Link href={getMainDomainUrl('/#home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </Link>
                <Link href={getMainDomainUrl('/our-founder')} className="hover:text-black transition-colors text-black lg:text-[#FDE4F2]">
                  Our Founder
                </Link>
                <Link href={getMainDomainUrl('/terms')} className="hover:text-black transition-colors text-black lg:text-[#FDE4F2]">
                  Terms & Conditions
                </Link>
                <Link href={getMainDomainUrl('/#contact')} className="hover:text-black transition-colors text-black lg:text-[#FDE4F2] cursor-pointer">
                  Contact
                </Link>
                <Link href={getMainDomainUrl('/#pricing')} className="hover:text-black transition-colors text-black lg:text-[#FDE4F2] cursor-pointer">
                  Pricing
                </Link>
              </nav>

              {/* Desktop CTA Button */}
              <Link 
                href="#" 
                className="hidden lg:inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-all active:scale-95"
              >
                Download
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle (Hamburger) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden pb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col space-y-4 text-white font-medium">
              <Link href={getMainDomainUrl('/#home')} onClick={() => setIsOpen(false)} className="hover:text-black cursor-pointer">Home</Link>
              <Link href={getMainDomainUrl('/our-founder')} onClick={() => setIsOpen(false)} className="hover:text-black">Our Founder</Link>
              <Link href={getMainDomainUrl('/terms')} onClick={() => setIsOpen(false)} className="hover:text-black">Terms & Conditions</Link>
              <Link href={getMainDomainUrl('/#contact')} onClick={() => setIsOpen(false)} className="hover:text-black cursor-pointer">Contact</Link>
              <Link href={getMainDomainUrl('/#pricing')} onClick={() => setIsOpen(false)} className="hover:text-black cursor-pointer">Pricing</Link>
              <Link 
                href="#" 
                className="bg-black text-white text-center py-3 rounded-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                Download
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;