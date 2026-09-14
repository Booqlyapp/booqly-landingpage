'use client';

interface SubdomainNavbarProps {
  businessName: string;
  cartCount?: number;
  onCartClick?: () => void;
}

export default function SubdomainNavbar({ businessName, cartCount = 0, onCartClick }: SubdomainNavbarProps) {
  return (
    <nav className="bg-[#759CC9] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Business Name */}
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">{businessName}</h1>
          </div>

          {/* Cart Icon - Always visible on all screens */}
          <div className="flex items-center gap-6">
            <button
              onClick={onCartClick}
              className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
