import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'horizontal';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'horizontal',
  showSubtitle = true,
}) => {
  const CrownedLadyIcon = () => (
    <svg
      viewBox="0 0 100 120"
      className="w-10 h-12 sm:w-11 sm:h-13 text-[#D2B477] fill-none stroke-current shrink-0"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M43 14 L41 22 L50 18 L59 22 L57 14 L50 16 Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="50" cy="27" r="5" strokeWidth="2" />
      <path d="M48 32 L48 37 C48 38 46 41 42 43 C40 44 38 46 38 50 L62 50 C62 46 60 44 58 43 C54 41 52 38 52 37 L52 32" strokeWidth="2" />
      <path d="M42 50 C44 58 46 63 47 67 L53 67 C54 63 56 58 58 50 Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M47 67 C40 76 28 92 12 110 C36 113 64 113 88 110 C72 92 60 76 53 67 Z" strokeWidth="2.4" />
      <path d="M48 67 C42 80 34 96 26 111" strokeWidth="1.6" strokeOpacity="0.85" />
      <path d="M49 67 C46 82 43 98 40 112" strokeWidth="1.6" strokeOpacity="0.85" />
      <path d="M51 67 C54 82 57 98 60 112" strokeWidth="1.6" strokeOpacity="0.85" />
      <path d="M52 67 C58 80 66 96 74 111" strokeWidth="1.6" strokeOpacity="0.85" />
    </svg>
  );

  const NeedleSpoolIcon = () => (
    <svg
      viewBox="0 0 100 120"
      className="w-10 h-12 sm:w-11 sm:h-13 text-[#D2B477] fill-none stroke-current shrink-0"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M36 30 L64 30 M38 30 L40 38 L60 38 L62 30" strokeWidth="2" />
      <rect x="38" y="38" width="24" height="42" rx="1" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <line x1="38" y1="46" x2="62" y2="46" strokeWidth="1.8" strokeOpacity="0.8" />
      <line x1="38" y1="54" x2="62" y2="54" strokeWidth="1.8" strokeOpacity="0.8" />
      <line x1="38" y1="62" x2="62" y2="62" strokeWidth="1.8" strokeOpacity="0.8" />
      <line x1="38" y1="70" x2="62" y2="70" strokeWidth="1.8" strokeOpacity="0.8" />
      <path d="M38 80 L36 88 L64 88 L62 80" strokeWidth="2" />
      <path d="M78 20 L28 100" strokeWidth="2.6" />
      <ellipse cx="74" cy="27" rx="1.5" ry="4" transform="rotate(-30 74 27)" fill="currentColor" />
      <path d="M72 31 C60 48 24 94 28 102 C30 106 48 102 78 106 C84 107 90 110 94 112" strokeWidth="2" />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <CrownedLadyIcon />
        <div className="flex flex-col">
          <span className="font-display text-xs text-[#D2B477] tracking-wider leading-none">
            خياط عبدالعزيز نايف
          </span>
          <span className="font-display text-lg font-bold text-[#F5F0E7] leading-tight">
            خياط نسائي
          </span>
          <span className="text-[10px] tracking-[0.2em] font-medium text-[#D2B477] uppercase leading-none">
            Ladies Tailor
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      <CrownedLadyIcon />
      <div className="flex flex-col items-center text-center">
        <span className="text-[11px] sm:text-xs font-medium text-[#D2B477] tracking-wider leading-tight">
          خياط عبدالعزيز نايف
        </span>
        <span className="font-display text-xl sm:text-2xl lg:text-[28px] font-bold text-[#F5F0E7] tracking-wide leading-none pt-0.5">
          خياط نسائي
        </span>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1 w-full justify-center">
            <span className="h-[1px] w-4 sm:w-6 bg-gradient-to-r from-transparent to-[#D2B477]/70" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.22em] font-semibold text-[#D2B477] uppercase">
              LADIES TAILOR
            </span>
            <span className="text-[8px] text-[#D2B477]">❖</span>
            <span className="h-[1px] w-4 sm:w-6 bg-gradient-to-l from-transparent to-[#D2B477]/70" />
          </div>
        )}
      </div>
      <NeedleSpoolIcon />
    </div>
  );
};
