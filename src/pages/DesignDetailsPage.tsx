import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ZoomIn, MessageCircle, DoorOpen } from 'lucide-react';
import { Locale } from '../types/boutique';
import { UI_COPY, formatPriceSar } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { DesignCard } from '../components/common/DesignCard';
import { ImageLightbox } from '../components/common/ImageLightbox';

interface DesignDetailsPageProps {
  locale: Locale;
}

export const DesignDetailsPage: React.FC<DesignDetailsPageProps> = ({ locale }) => {
  const { slug } = useParams<{ slug: string }>();
  const { designs, categories, hotspots } = useStore();
  const design = designs.find((d) => d.slug === slug) || designs[0];

  const [activeImageKey, setActiveImageKey] = useState<string>(design?.mainImageKey || '');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedFabricIdx, setSelectedFabricIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (design) {
      setActiveImageKey(design.mainImageKey);
      setSelectedColorIdx(0);
      setSelectedFabricIdx(0);
    }
  }, [design]);

  if (!design) return null;

  const t = UI_COPY[locale].designDetails;
  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;
  const category = categories.find((c) => c.slug === design.categorySlug);
  const linkedHotspot = hotspots.find(
    (h) => h.designId === design.id && h.sceneId !== 'exterior'
  );
  const relatedDesigns = designs.filter((d) => d.id !== design.id).slice(0, 3);

  const allImages = Array.from(new Set([design.mainImageKey, ...design.galleryImageKeys]));
  const chosenColor = design.colors[selectedColorIdx] || design.colors[0];
  const chosenFabric = design.availableFabrics[selectedFabricIdx] || design.availableFabrics[0];

  const orderHref = `/${locale}/custom-order?design=${encodeURIComponent(
    design.id
  )}&color=${encodeURIComponent(chosenColor?.id || '')}&fabric=${selectedFabricIdx}`;

  return (
    <div className="py-12 lg:py-20 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Back Breadcrumb */}
        <div className="pb-8">
          <Link
            to={`/${locale}/collections`}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#9B8873] hover:text-[#171512] transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            <span>{t.backToCollections}</span>
          </Link>
        </div>

        {/* Sticky 2-Column Couture PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full bg-white border border-[#171512]/10 overflow-hidden">
              <LuxuryImage
                srcKeyOrUrl={activeImageKey}
                alt={design.name[locale]}
                className="w-full h-full"
                priority
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 end-4 px-3.5 py-2 bg-[#171512]/85 text-[#F5F0E7] hover:text-[#D2B477] text-xs inline-flex items-center gap-2 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
                <span>{UI_COPY[locale].collections.inspectZoom}</span>
              </button>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((imgKey) => (
                  <button
                    key={imgKey}
                    type="button"
                    onClick={() => setActiveImageKey(imgKey)}
                    className={`aspect-[4/3] overflow-hidden border transition-colors ${
                      activeImageKey === imgKey
                        ? 'border-[#171512] ring-1 ring-[#171512]'
                        : 'border-[#171512]/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <LuxuryImage
                      srcKeyOrUrl={imgKey}
                      alt={design.name[locale]}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Bespoke Commission Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#171512]/10 p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-[#171512]/10 pb-5">
              <div className="flex items-center gap-2 text-xs text-[#9B8873]">
                <span>{category ? category.name[locale] : design.categorySlug}</span>
                <span aria-hidden="true">·</span>
                <span>{design.fabric[locale]}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512] leading-tight">
                {design.name[locale]}
              </h1>

              <p className="font-mono text-xl font-medium tabular-nums text-[#171512] pt-1">
                {formatPriceSar(design.priceSar, locale)}
              </p>
            </div>

            <p className="text-sm text-[#171512]/80 leading-relaxed">
              {design.description[locale]}
            </p>

            {/* Color Palette Selector */}
            {design.colors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9B8873]">{t.selectColor}</span>
                  <span className="font-medium text-[#171512]">
                    {chosenColor?.name[locale]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {design.colors.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      aria-label={c.name[locale]}
                      className={`w-9 h-9 p-0.5 border transition-transform ${
                        selectedColorIdx === idx
                          ? 'border-[#171512] scale-105'
                          : 'border-[#171512]/20 hover:border-[#171512]/50'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: c.hex }}
                        className="block w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Silk / Fabric Selector */}
            {design.availableFabrics.length > 0 && (
              <div className="space-y-2.5">
                <span className="block text-xs text-[#9B8873]">{t.selectFabric}</span>
                <div className="grid grid-cols-1 gap-2">
                  {design.availableFabrics.map((fab, idx) => (
                    <button
                      key={fab.en}
                      type="button"
                      onClick={() => setSelectedFabricIdx(idx)}
                      className={`px-3.5 py-2.5 text-start text-xs border transition-colors ${
                        selectedFabricIdx === idx
                          ? 'border-[#171512] bg-[#F5F0E7] text-[#171512] font-medium'
                          : 'border-[#171512]/15 text-[#171512]/75 hover:border-[#171512]/40'
                      }`}
                    >
                      {fab[locale]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Craft & Tailoring Specifications */}
            <div className="pt-4 border-t border-[#171512]/10 space-y-3 text-xs">
              <div>
                <span className="text-[#9B8873] block mb-0.5">{t.embroiderySpec}</span>
                <span className="text-[#171512]/85 leading-relaxed">
                  {design.embroideryDetails[locale]}
                </span>
              </div>
              <div>
                <span className="text-[#9B8873] block mb-0.5">{t.customizationSpec}</span>
                <span className="text-[#171512]/85 leading-relaxed">
                  {design.customizationNotes[locale]}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#9B8873]">{t.estimatedLeadTime}</span>
                <span className="font-mono tabular-nums font-medium text-[#171512]">
                  {design.leadTimeDays} {UI_COPY[locale].boutique.days}
                </span>
              </div>
            </div>

            {/* Primary Commission Actions */}
            <div className="pt-3 space-y-3">
              <Link
                to={orderHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.commissionWhatsapp}</span>
              </Link>

              <Link
                to={
                  linkedHotspot
                    ? `/${locale}/virtual-boutique?scene=${linkedHotspot.sceneId}`
                    : `/${locale}/virtual-boutique`
                }
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium border border-[#171512]/25 text-[#171512] hover:border-[#171512] transition-colors whitespace-nowrap"
              >
                <DoorOpen className="w-4 h-4 shrink-0" />
                <span>{t.exploreInShowroom}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Atelier Pieces */}
        <div className="mt-24 pt-14 border-t border-[#171512]/10">
          <h2 className="font-display text-3xl font-semibold text-[#171512] mb-10">
            {t.relatedTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedDesigns.map((rel) => (
              <DesignCard
                key={rel.id}
                design={rel}
                category={categories.find((c) => c.slug === rel.categorySlug)}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageLightbox
        srcKeyOrUrl={lightboxOpen ? activeImageKey : null}
        title={design.name[locale]}
        caption={design.fabric[locale]}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
