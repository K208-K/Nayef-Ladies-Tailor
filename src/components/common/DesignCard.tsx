import React from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, MessageCircle } from 'lucide-react';
import { Category, Design, Locale } from '../../types/boutique';
import { UI_COPY, formatPriceSar } from '../../i18n/translations';
import { LuxuryImage } from './LuxuryImage';

interface DesignCardProps {
  design: Design;
  category?: Category;
  locale: Locale;
  onZoom?: (design: Design) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  category,
  locale,
  onZoom,
}) => {
  const t = UI_COPY[locale].collections;
  const secondaryImageKey =
    design.galleryImageKeys.find((k) => k !== design.mainImageKey) || design.mainImageKey;

  return (
    <article className="group flex flex-col bg-white border border-[#171512]/10 transition-transform duration-200 hover:-translate-y-0.5">
      {/* 3:4 Editorial Garment Portrait */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EBE3D5]">
        <Link to={`/${locale}/designs/${design.slug}`} className="block w-full h-full">
          <LuxuryImage
            srcKeyOrUrl={design.mainImageKey}
            alt={design.name[locale]}
            className="w-full h-full transition-opacity duration-300 group-hover:opacity-0"
          />
          <LuxuryImage
            srcKeyOrUrl={secondaryImageKey}
            alt={`${design.name[locale]} alternate view`}
            className="absolute inset-0 w-full h-full opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-103"
          />
        </Link>

        {onZoom && (
          <button
            type="button"
            onClick={() => onZoom(design)}
            aria-label={t.inspectZoom}
            className="absolute top-3 end-3 z-10 w-9 h-9 inline-flex items-center justify-center bg-[#171512]/80 text-[#F5F0E7] hover:bg-[#171512] hover:text-[#D2B477] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contiguous Unboxed Metadata & Action Block */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-[#9B8873]">
            <span>{category ? category.name[locale] : design.categorySlug}</span>
            {design.isNewArrival && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#171512] font-medium">
                  {locale === 'ar' ? 'وصل حديثاً' : 'New Season'}
                </span>
              </>
            )}
          </div>

          <Link
            to={`/${locale}/designs/${design.slug}`}
            className="block font-display text-xl font-semibold text-[#171512] hover:text-[#9B8873] transition-colors leading-snug"
          >
            {design.name[locale]}
          </Link>

          <p className="text-xs text-[#171512]/70 line-clamp-2 leading-relaxed">
            {design.shortDescription[locale]}
          </p>
        </div>

        <div className="pt-3 border-t border-[#171512]/8 flex items-center justify-between gap-3">
          <span className="font-mono text-sm font-medium tabular-nums text-[#171512]">
            {formatPriceSar(design.priceSar, locale)}
          </span>

          <div className="flex items-center gap-3">
            <Link
              to={`/${locale}/designs/${design.slug}`}
              className="text-xs font-medium text-[#171512]/75 hover:text-[#171512] underline underline-offset-4 whitespace-nowrap"
            >
              {t.viewDetails}
            </Link>
            <Link
              to={`/${locale}/custom-order?design=${design.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.commissionNow}</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
