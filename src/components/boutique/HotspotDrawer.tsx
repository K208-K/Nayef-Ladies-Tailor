import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowUpRight, MessageCircle, Check } from 'lucide-react';
import { BoutiqueHotspot, Category, Design, Locale } from '../../types/boutique';
import { UI_COPY, formatPriceSar } from '../../i18n/translations';
import { LuxuryImage } from '../common/LuxuryImage';

interface HotspotDrawerProps {
  hotspot: BoutiqueHotspot | null;
  design: Design | undefined;
  category: Category | undefined;
  locale: Locale;
  onClose: () => void;
}

export const HotspotDrawer: React.FC<HotspotDrawerProps> = ({
  hotspot,
  design,
  category,
  locale,
  onClose,
}) => {
  if (!hotspot || !design) return null;
  const t = UI_COPY[locale].boutique;

  return (
    <div
      className="absolute inset-y-0 end-0 z-30 w-full sm:w-[400px] bg-[#171512]/96 text-[#F5F0E7] border-s border-[#D2B477]/35 flex flex-col shadow-2xl overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F0E7]/10">
        <div className="text-xs text-[#D2B477] truncate">
          {hotspot.subtitle[locale]}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 inline-flex items-center justify-center text-[#F5F0E7]/75 hover:text-[#D2B477] transition-colors"
          aria-label="Close design details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Studio Garment Photograph */}
      <div className="relative aspect-[4/4.6] w-full shrink-0 border-b border-[#F5F0E7]/10">
        <LuxuryImage
          srcKeyOrUrl={design.mainImageKey}
          alt={design.name[locale]}
          className="w-full h-full"
        />
      </div>

      {/* Garment Specifications */}
      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs text-[#9B8873]">
            <span>{category ? category.name[locale] : design.categorySlug}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#D2B477]">
              {formatPriceSar(design.priceSar, locale)}
            </span>
          </div>

          <h3 className="font-display text-2xl text-[#F5F0E7] leading-snug">
            {design.name[locale]}
          </h3>

          <p className="text-sm text-[#F5F0E7]/80 leading-relaxed">
            {design.shortDescription[locale]}
          </p>

          <div className="pt-2 space-y-3 border-t border-[#F5F0E7]/10 text-xs">
            <div>
              <span className="text-[#9B8873] block mb-0.5">{t.fabricLabel}</span>
              <span className="text-[#F5F0E7]/90">{design.fabric[locale]}</span>
            </div>
            <div>
              <span className="text-[#9B8873] block mb-0.5">{t.embroideryLabel}</span>
              <span className="text-[#F5F0E7]/90">{design.embroideryDetails[locale]}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#9B8873]">{t.leadTime}</span>
              <span className="font-mono tabular-nums text-[#D2B477]">
                {design.leadTimeDays} {t.days}
              </span>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-2 pt-1">
            {design.colors.map((c) => (
              <span
                key={c.id}
                title={c.name[locale]}
                style={{ backgroundColor: c.hex }}
                className="w-5 h-5 border border-[#D2B477]/50"
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#D2B477] pt-1">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{t.customizationAvailable}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 space-y-2.5 border-t border-[#F5F0E7]/10">
          <Link
            to={`/${locale}/custom-order?design=${design.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium bg-[#D2B477] text-[#171512] hover:bg-[#e2c78e] transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>{t.orderWhatsapp}</span>
          </Link>

          <Link
            to={`/${locale}/designs/${design.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium border border-[#F5F0E7]/25 text-[#F5F0E7] hover:border-[#D2B477] hover:text-[#D2B477] transition-colors whitespace-nowrap"
          >
            <span>{t.viewPieceDetails}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};
