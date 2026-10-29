'use client';

export interface BookingNavItem {
  id: string;
  label: string;
}

interface SubdomainNavbarProps {
  businessName: string;
  cartCount?: number;
  onCartClick?: () => void;
  navItems?: BookingNavItem[];
}

export default function SubdomainNavbar({
  businessName,
  cartCount = 0,
  onCartClick,
  navItems = [],
}: SubdomainNavbarProps) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center min-h-[3.5rem] py-3 gap-3">
          <h1 className="font-booking-serif text-[1.35rem] sm:text-[1.65rem] leading-tight font-bold tracking-tight text-black truncate min-w-0">
            {businessName}
          </h1>

          <button
            type="button"
            onClick={onCartClick}
            aria-label="Cart"
            className="relative shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-black hover:bg-gray-50 transition-colors"
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
                strokeWidth={1.75}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {navItems.length > 0 && (
          <nav
            className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-gray-200"
            aria-label="Page sections"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 py-3.5 text-[15px] font-medium text-neutral-800 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
