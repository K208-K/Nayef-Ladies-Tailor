import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, DoorOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Design, Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { DesignCard } from '../components/common/DesignCard';
import { ImageLightbox } from '../components/common/ImageLightbox';
import { VirtualBoutiqueExperience } from '../components/boutique/VirtualBoutiqueExperience';

import { BrandLogo } from '../components/common/BrandLogo';

interface HomePageProps {
  locale: Locale;
}

export const HomePage: React.FC<HomePageProps> = ({ locale }) => {
  const { settings, categories, designs, testimonials } = useStore();
  const [zoomedDesign, setZoomedDesign] = useState<Design | null>(null);

  const tHero = UI_COPY[locale].hero;
  const tHome = UI_COPY[locale].home;
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  const featuredCategories = categories.filter((c) => c.featured).slice(0, 5);
  const signatureDesigns = designs.filter((d) => d.featured).slice(0, 6);

  return (
    <div>
      {/* SECTION 2: CINEMATIC EXTERIOR STOREFRONT HERO (IMAGE 4) */}
      <section className="relative min-h-[90vh] w-full bg-[#171512] text-[#F5F0E7] flex items-end overflow-hidden">
        {/* Subtle Background Zoom on Storefront Exterior */}
        <motion.div
          initial={{ scale: 1.07, opacity: 0.75 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <LuxuryImage
            srcKeyOrUrl="storefront_exterior"
            alt={settings.boutiqueName[locale]}
            className="w-full h-full"
            priority
          />
          {/* Measured Contrast Scrim for Guaranteed Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/60 to-[#171512]/30" />
        </motion.div>

        <div className="relative z-10 max-w-[1360px] mx-auto w-full px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-block p-3 sm:p-4 bg-[#171512]/85 border border-[#D2B477]/40 shadow-xl backdrop-blur-xs">
              <BrandLogo variant="horizontal" showSubtitle={true} />
            </div>

            <p className="text-xs sm:text-sm tracking-wide text-[#D2B477]">
              {tHero.kicker}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-medium leading-[1.15] text-[#F5F0E7]">
              {settings.heroHeadline[locale]}
            </h1>
            <p className="text-sm sm:text-base text-[#F5F0E7]/85 leading-relaxed max-w-xl">
              {settings.heroSubheadline[locale]}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={`/${locale}/virtual-boutique`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium bg-[#D2B477] text-[#171512] hover:bg-[#e3c891] transition-colors whitespace-nowrap"
              >
                <DoorOpen className="w-4 h-4 shrink-0" />
                <span>{tHero.enterBoutique}</span>
              </Link>

              <Link
                to={`/${locale}/collections`}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-[#F5F0E7]/45 text-[#F5F0E7] hover:border-[#D2B477] hover:text-[#D2B477] bg-[#171512]/40 transition-colors whitespace-nowrap"
              >
                <span>{tHero.exploreCollection}</span>
                <ArrowIcon className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED COLLECTIONS */}
      <section className="py-20 lg:py-28 bg-[#F5F0E7]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#171512]/10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs text-[#9B8873]">{tHome.featuredKicker}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
                {tHome.featuredTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed pt-1">
                {tHome.featuredSubtitle}
              </p>
            </div>
            <Link
              to={`/${locale}/collections`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#171512] hover:text-[#9B8873] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{tHome.viewAllCollections}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/${locale}/collections?category=${cat.slug}`}
                className="group flex flex-col bg-white border border-[#171512]/10 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <LuxuryImage
                    srcKeyOrUrl={cat.coverImageKey}
                    alt={cat.name[locale]}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-display text-2xl font-semibold text-[#171512] group-hover:text-[#9B8873] transition-colors">
                    {cat.name[locale]}
                  </h3>
                  <p className="text-xs text-[#171512]/70 line-clamp-2 leading-relaxed">
                    {cat.description[locale]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: BOUTIQUE INTRODUCTION & CRAFT */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#171512]/10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-xs text-[#9B8873]">{tHome.storyKicker}</p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#171512] leading-tight">
                  {tHome.storyTitle}
                </h2>
                <p className="text-base text-[#171512]/80 leading-relaxed">
                  {tHome.storyBody1}
                </p>
                <p className="text-base text-[#171512]/75 leading-relaxed">
                  {tHome.storyBody2}
                </p>
              </div>

              <div>
                <Link
                  to={`/${locale}/services`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
                >
                  <span>{tHome.discoverServices}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 min-h-[380px]">
              <LuxuryImage
                srcKeyOrUrl="interior_showroom_left"
                alt="Amani Couture Riyadh Marble Interior Showroom"
                className="w-full h-full min-h-[380px] border border-[#171512]/10"
              />
            </div>
          </div>

          {/* Full-width 3-Column Quantitative Proof Row Below Split */}
          <div className="mt-14 pt-10 border-t border-[#171512]/10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                180+ hrs
              </p>
              <p className="text-xs text-[#9B8873]">{tHome.statHoursLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                3 Fittings
              </p>
              <p className="text-xs text-[#9B8873]">{tHome.statFittingsLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                100% Pure
              </p>
              <p className="text-xs text-[#9B8873]">{tHome.statSilksLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE VIRTUAL BOUTIQUE PREVIEW */}
      <section className="py-20 lg:py-24 bg-[#171512] text-[#F5F0E7]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs text-[#D2B477]">{tHome.virtualKicker}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#F5F0E7]">
                {tHome.virtualTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#F5F0E7]/75 leading-relaxed">
                {tHome.virtualSubtitle}
              </p>
            </div>
            <Link
              to={`/${locale}/virtual-boutique`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#D2B477] text-[#171512] hover:bg-[#e3c891] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{tHome.openFullShowroom}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <VirtualBoutiqueExperience locale={locale} initialScene="exterior" embedded />
      </section>

      {/* SECTION 6: SIGNATURE DESIGNS */}
      <section className="py-20 lg:py-28 bg-[#F5F0E7]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#171512]/10">
            <div className="space-y-2">
              <p className="text-xs text-[#9B8873]">{tHome.signatureKicker}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
                {tHome.signatureTitle}
              </h2>
            </div>
            <Link
              to={`/${locale}/collections`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#171512] hover:text-[#9B8873] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{tHome.viewAllCollections}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {signatureDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                category={categories.find((c) => c.slug === design.categorySlug)}
                locale={locale}
                onZoom={setZoomedDesign}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: ATTRIBUTABLE CLIENT TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-white border-t border-[#171512]/10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="space-y-2 pb-12 border-b border-[#171512]/10">
            <p className="text-xs text-[#9B8873]">{tHome.testimonialsKicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
              {tHome.testimonialsTitle}
            </h2>
          </div>

          <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-8 bg-[#F5F0E7]/65 border border-[#171512]/10 flex flex-col justify-between space-y-6"
              >
                <p className="text-sm sm:text-base text-[#171512]/85 leading-relaxed">
                  “{item.quote[locale]}”
                </p>

                <div className="pt-4 border-t border-[#171512]/10 space-y-1">
                  <p className="font-display text-lg font-semibold text-[#171512]">
                    {item.clientName[locale]}
                  </p>
                  <p className="text-xs text-[#9B8873]">
                    {item.roleAndCity[locale]}
                  </p>
                  <p className="text-xs text-[#171512]/70 pt-0.5">
                    {item.commissionedPiece[locale]} · <span className="font-mono tabular-nums">{item.year}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: BESPOKE WHATSAPP COMMISSION BANNER */}
      <section className="py-20 bg-[#EBE3D5] border-t border-[#171512]/10 bg-mashrabiya">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
            {tHome.ctaTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {tHome.ctaSubtitle}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/${locale}/custom-order`}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
            >
              {tHome.ctaButton}
            </Link>
            <Link
              to={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium border border-[#171512]/35 text-[#171512] hover:border-[#171512] bg-white/70 transition-colors whitespace-nowrap"
            >
              {tHome.bookFitting}
            </Link>
          </div>
        </div>
      </section>

      <ImageLightbox
        srcKeyOrUrl={zoomedDesign?.mainImageKey || null}
        title={zoomedDesign?.name[locale]}
        caption={zoomedDesign?.fabric[locale]}
        onClose={() => setZoomedDesign(null)}
      />
    </div>
  );
};
