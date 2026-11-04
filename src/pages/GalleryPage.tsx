import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { GalleryItem, Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { ImageLightbox } from '../components/common/ImageLightbox';

interface GalleryPageProps {
  locale: Locale;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ locale }) => {
  const { gallery } = useStore();
  const [filter, setFilter] = useState<'all' | GalleryItem['category']>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const t = UI_COPY[locale].gallery;

  const tabs: { id: 'all' | GalleryItem['category']; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'architecture', label: t.architecture },
    { id: 'craftsmanship', label: t.craftsmanship },
    { id: 'bridal', label: t.bridal },
    { id: 'evening', label: t.evening },
  ];

  const items = filter === 'all' ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl space-y-3 pb-10">
          <p className="text-xs text-[#9B8873]">{t.kicker}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="py-5 border-y border-[#171512]/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === tab.id
                  ? 'bg-[#171512] text-[#F5F0E7]'
                  : 'bg-white/70 text-[#171512]/75 hover:text-[#171512] border border-[#171512]/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Curated Lookbook & Showroom Grid */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <figure
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white border border-[#171512]/10 overflow-hidden cursor-pointer flex flex-col"
            >
              <div
                className={`relative w-full overflow-hidden ${
                  item.aspect === 'landscape' ? 'aspect-[16/10]' : 'aspect-[4/4.6]'
                }`}
              >
                <LuxuryImage
                  srcKeyOrUrl={item.imageKey}
                  alt={item.title[locale]}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                />
                <span className="absolute top-3 end-3 w-9 h-9 inline-flex items-center justify-center bg-[#171512]/80 text-[#F5F0E7] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
              <figcaption className="p-5 space-y-1">
                <h2 className="font-display text-xl font-semibold text-[#171512]">
                  {item.title[locale]}
                </h2>
                {item.caption[locale] && (
                  <p className="text-xs text-[#9B8873] leading-relaxed">
                    {item.caption[locale]}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <ImageLightbox
        srcKeyOrUrl={activeItem?.imageKey || null}
        title={activeItem?.title[locale]}
        caption={activeItem?.caption[locale]}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
};
