import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Design, Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { DesignCard } from '../components/common/DesignCard';
import { ImageLightbox } from '../components/common/ImageLightbox';

interface CollectionsPageProps {
  locale: Locale;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ locale }) => {
  const { categories, designs } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomedDesign, setZoomedDesign] = useState<Design | null>(null);

  const activeCategory = searchParams.get('category') || 'all';
  const t = UI_COPY[locale].collections;

  const handleSelectCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      const matchesCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'new-arrivals'
          ? d.isNewArrival || d.categorySlug === 'new-arrivals'
          : d.categorySlug === activeCategory;

      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        d.name.en.toLowerCase().includes(q) ||
        d.name.ar.includes(q) ||
        d.fabric.en.toLowerCase().includes(q) ||
        d.fabric.ar.includes(q) ||
        d.shortDescription.en.toLowerCase().includes(q) ||
        d.shortDescription.ar.includes(q)
      );
    });
  }, [designs, activeCategory, searchQuery]);

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Editorial Header */}
        <div className="max-w-2xl space-y-3 pb-10">
          <p className="text-xs text-[#9B8873]">{t.kicker}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive Category Tabs + Search Bar */}
        <div className="py-5 border-y border-[#171512]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#171512] text-[#F5F0E7]'
                  : 'bg-white/70 text-[#171512]/75 hover:text-[#171512] border border-[#171512]/10'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat.slug
                    ? 'bg-[#171512] text-[#F5F0E7]'
                    : 'bg-white/70 text-[#171512]/75 hover:text-[#171512] border border-[#171512]/10'
                }`}
              >
                {cat.name[locale]}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#9B8873] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full ps-10 pe-4 py-2 text-xs bg-white border border-[#171512]/15 text-[#171512] placeholder:text-[#9B8873] focus:outline-none focus:border-[#171512]"
            />
          </div>
        </div>

        {/* Result Count */}
        <div className="py-6 flex items-center justify-between text-xs text-[#9B8873]">
          <span className="font-mono tabular-nums">
            {filteredDesigns.length} {t.piecesCount}
          </span>
        </div>

        {/* Couture Responsive Grid */}
        {filteredDesigns.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#171512]/10 space-y-4">
            <p className="text-sm text-[#171512]/75">{t.noResults}</p>
            <button
              type="button"
              onClick={() => {
                handleSelectCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 text-xs font-medium bg-[#171512] text-[#F5F0E7]"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                category={categories.find((c) => c.slug === design.categorySlug)}
                locale={locale}
                onZoom={setZoomedDesign}
              />
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        srcKeyOrUrl={zoomedDesign?.mainImageKey || null}
        title={zoomedDesign?.name[locale]}
        caption={zoomedDesign?.fabric[locale]}
        onClose={() => setZoomedDesign(null)}
      />
    </div>
  );
};
