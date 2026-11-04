import React, { useState } from 'react';
import { resolveAssetUrl } from '../../data/assets';

interface LuxuryImageProps {
  srcKeyOrUrl: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  draggable?: boolean;
}

export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  srcKeyOrUrl,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  draggable = false,
}) => {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveAssetUrl(srcKeyOrUrl);

  if (failed || !resolvedSrc) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#1E1B17] text-[#D2B477] p-6 overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          viewBox="0 0 80 100"
          className="w-12 h-14 stroke-[#D2B477]/70 fill-none mb-3"
          strokeWidth="1.2"
        >
          <path d="M10 92 V46 C10 22 40 8 40 8 C40 8 70 22 70 46 V92 Z" />
          <path d="M18 92 V48 C18 29 40 17 40 17 C40 17 62 29 62 48 V92" strokeOpacity="0.45" />
        </svg>
        <span className="font-display text-sm text-center text-[#F5F0E7]/90 max-w-[20ch] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#171512]/5 ${className}`}>
      <img
        src={resolvedSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        draggable={draggable}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover select-none ${imgClassName}`}
      />
    </div>
  );
};
