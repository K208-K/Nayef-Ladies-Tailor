import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { LuxuryImage } from './LuxuryImage';

interface ImageLightboxProps {
  srcKeyOrUrl: string | null;
  title?: string;
  caption?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  srcKeyOrUrl,
  title,
  caption,
  onClose,
}) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [srcKeyOrUrl]);

  useEffect(() => {
    if (!srcKeyOrUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [srcKeyOrUrl, onClose]);

  if (!srcKeyOrUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#171512]/95 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Couture Photograph Zoom'}
    >
      <div className="w-full max-w-5xl flex items-center justify-between pb-4 text-[#F5F0E7]">
        <div>
          {title && <h3 className="font-display text-xl text-[#F5F0E7]">{title}</h3>}
          {caption && <p className="text-xs text-[#9B8873] mt-0.5">{caption}</p>}
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="w-10 h-10 inline-flex items-center justify-center border border-[#D2B477]/40 text-[#F5F0E7] hover:border-[#D2B477] hover:text-[#D2B477] transition-colors"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 inline-flex items-center justify-center border border-[#F5F0E7]/25 text-[#F5F0E7] hover:border-[#D2B477] hover:text-[#D2B477] transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className="relative max-w-5xl w-full max-h-[80vh] overflow-auto border border-[#D2B477]/25 bg-[#171512]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setZoomed((z) => !z)}
          style={{
            transform: zoomed ? 'scale(1.65)' : 'scale(1)',
            transformOrigin: 'center center',
          }}
          className={`transition-transform duration-200 ${
            zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        >
          <LuxuryImage
            srcKeyOrUrl={srcKeyOrUrl}
            alt={title || 'Couture Photograph'}
            className="w-full max-h-[78vh]"
            imgClassName="object-contain max-h-[78vh]"
            priority
          />
        </div>
      </div>
    </div>
  );
};
