'use client';

interface BookingStepHeaderProps {
  businessName: string;
  stepNumber: number;
  totalSteps?: number;
  onBack: () => void;
}

const STEP_LABELS = [
  'Service',
  'Add-ons',
  'Stylist',
  'Date & time',
  'Your info',
] as const;

export default function BookingStepHeader({
  businessName,
  stepNumber,
  totalSteps = 5,
  onBack,
}: BookingStepHeaderProps) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 h-14">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="shrink-0 -ml-1 p-2 text-black hover:bg-gray-50 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="font-booking-serif text-lg font-bold text-black truncate min-w-0 flex-1">
            {businessName}
          </h1>

          <span className="shrink-0 text-xs text-neutral-500 whitespace-nowrap">
            Step {stepNumber} of {totalSteps}
          </span>
        </div>

        <nav
          className="flex gap-0 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-3"
          aria-label="Booking progress"
        >
          {STEP_LABELS.map((label, index) => {
            const step = index + 1;
            const active = step <= stepNumber;
            return (
              <div key={label} className="flex-1 min-w-[4.5rem] px-0.5">
                <div
                  className={`h-1 rounded-full mb-2 ${
                    active ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
                <p
                  className={`text-[11px] sm:text-xs truncate ${
                    active ? 'text-black font-medium' : 'text-neutral-400'
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
