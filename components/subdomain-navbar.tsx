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
  onEditColors?: () => void;
}

export default function SubdomainNavbar({
  businessName,
  cartCount = 0,
  onCartClick,
  navItems = [],
  onEditColors,
}: SubdomainNavbarProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--booking-bg, #ffffff)',
        borderColor: 'color-mix(in srgb, var(--booking-text, #111) 12%, transparent)',
        color: 'var(--booking-text, #111111)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center min-h-[3.5rem] py-3 gap-3">
          <h1 className="font-booking-serif text-[1.35rem] sm:text-[1.65rem] leading-tight font-bold tracking-tight truncate min-w-0">
            {businessName}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
          {onEditColors && (
            <button
              type="button"
              onClick={onEditColors}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold"
              style={{
                borderColor: 'color-mix(in srgb, var(--booking-text, #111) 25%, transparent)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Cart"
            className="relative shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: 'color-mix(in srgb, var(--booking-text, #111) 25%, transparent)',
            }}
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
              <span className="booking-primary-btn absolute -top-1 -right-1 text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          </div>
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
