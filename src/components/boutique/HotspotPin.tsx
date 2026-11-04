import React from 'react';
import { BoutiqueHotspot, Locale } from '../../types/boutique';

interface HotspotPinProps {
  hotspot: BoutiqueHotspot;
  locale: Locale;
  isSelected: boolean;
  onSelect: (hotspot: BoutiqueHotspot) => void;
}

export const HotspotPin: React.FC<HotspotPinProps> = ({
  hotspot,
  locale,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      style={{
        left: `${hotspot.xPercent}%`,
        top: `${hotspot.yPercent}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot);
        }}
        aria-label={hotspot.label[locale]}
        className={`relative w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B477] transition-transform duration-150 ${
          isSelected ? 'scale-115' : 'hover:scale-110'
        }`}
      >
        {/* Architectural Double-Diamond Champagne Gold Reticle (Static, Zero Pulsing Dots) */}
        <span
          className={`w-7 h-7 rotate-45 border transition-colors duration-150 flex items-center justify-center shadow-md ${
            isSelected
              ? 'bg-[#D2B477] border-[#F5F0E7]'
              : 'bg-[#171512]/85 border-[#D2B477] group-hover:bg-[#D2B477]/95'
          }`}
        >
          <span
            className={`w-2 h-2 transition-colors duration-150 ${
              isSelected
                ? 'bg-[#171512]'
                : 'bg-[#D2B477] group-hover:bg-[#171512]'
            }`}
          />
        </span>
      </button>

      {/* Clean Couture Tooltip on Hover */}
      <div
        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#171512]/95 border border-[#D2B477]/45 text-[#F5F0E7] shadow-xl transition-opacity duration-150 whitespace-nowrap ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <p className="font-display text-sm text-[#F5F0E7] leading-tight">
          {hotspot.label[locale]}
        </p>
        <p className="text-[11px] text-[#D2B477] mt-0.5">
          {hotspot.subtitle[locale]}
        </p>
      </div>
    </div>
  );
};
