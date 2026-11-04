import React from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';
import { Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { LuxuryImage } from '../components/common/LuxuryImage';

interface AboutPageProps {
  locale: Locale;
}

export const AboutPage: React.FC<AboutPageProps> = ({ locale }) => {
  const t = UI_COPY[locale].about;

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-20">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs text-[#9B8873]">{t.kicker}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512] leading-tight">
              {t.title}
            </h1>
            <p className="text-base text-[#171512]/80 leading-relaxed">
              {t.subtitle}
            </p>
            <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed whitespace-pre-line">
              {locale === 'ar'
                ? 'منذ تأسيس مشغلنا في متجر رقم ١٢٨ بالرياض، يقدم خياط عبدالعزيز نايف النسائي أرقى خدمات التفصيل المتقن لفساتين الزفاف والسهرة، وتطريز الزري اليدوي، وتقنيات الكشكشة والتفريغ والباترونات الفردية تحت شعارنا الدائم: الأناقة تخيط حكايتكِ (Fashion Stitches Your Story ♡).'
                : 'Abdulaziz Nayef Ladies Tailor is an exclusive ladies’ tailoring and haute couture atelier located at Boutique #128, Riyadh, Saudi Arabia. Rooted in the artistry of fine craftsmanship, we specialize in bespoke women’s fashion, transforming exquisite fabrics into beautifully tailored creations through precision patterning, intricate embroidery, delicate cutwork perforation, and distinctive fabric crushing techniques.\n\nAt our atelier, every creation is a reflection of individuality, sophistication, and timeless elegance. From breathtaking royal-inspired wedding gowns to exquisitely detailed occasion wear, we bring each vision to life through meticulous attention to detail, personalized tailoring, and a passion for perfection. Blending traditional craftsmanship with contemporary couture aesthetics, we create garments designed not merely to be worn, but to be remembered.\n\nFashion Stitches Your Story ♡'}
            </p>
            <div className="pt-2">
              <Link
                to={`/${locale}/virtual-boutique`}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
              >
                <DoorOpen className="w-4 h-4" />
                <span>
                  {locale === 'ar' ? 'ادخلي البوتيك الافتراضي' : 'Step Inside Our Virtual Showroom'}
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-square bg-white border border-[#171512]/10 overflow-hidden shadow-lg">
              <LuxuryImage
                srcKeyOrUrl="about_storefront_exterior"
                alt="خياط عبدالعزيز نايف — الواجهة الخارجية للمتجر"
                className="w-full h-full"
                imgClassName="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Two Coordinated Showroom Wings */}
        <div className="pt-12 border-t border-[#171512]/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#171512]/10 overflow-hidden flex flex-col">
            <div className="aspect-[16/10]">
              <LuxuryImage
                srcKeyOrUrl="interior_showroom_left"
                alt="West Arched Abaya Gallery"
                className="w-full h-full"
                imgClassName="object-contain"
              />
            </div>
            <div className="p-6 space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#171512]">
                {locale === 'ar'
                  ? 'الرواق الأيسر · أقواس العبايات الملكية'
                  : 'The Left Gallery · Illuminated Abaya Alcoves'}
              </h2>
              <p className="text-xs sm:text-sm text-[#171512]/75 leading-relaxed">
                {locale === 'ar'
                  ? 'يضم الرواق الأيسر أقواساً جدارية منحوتة بزخارف عربية ومضاءة بدفء لإبراز تفاصيل الزري الذهبي على العبايات السوداء والتصاميم العاجية.'
                  : 'Carved Arabic geometric alcoves with warm recessed lighting showcase our signature black silk crepe abayas and draped ivory silhouettes.'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#171512]/10 overflow-hidden flex flex-col">
            <div className="aspect-[16/10]">
              <LuxuryImage
                srcKeyOrUrl="interior_showroom_right"
                alt="East Color Couture & Bridal Salon"
                className="w-full h-full"
                imgClassName="object-contain"
              />
            </div>
            <div className="p-6 space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#171512]">
                {locale === 'ar'
                  ? 'الرواق الأيمن · صالون السهرة والعرائس'
                  : 'The Right Gallery · Chromatic Evening & Bridal Salon'}
              </h2>
              <p className="text-xs sm:text-sm text-[#171512]/75 leading-relaxed">
                {locale === 'ar'
                  ? 'يحتضن الجناح المقابل تشكيلات السهرة بدرجات الكحلي الملكي والأخضر الزمردي والعنابي، تتوسطها منصة فساتين الزفاف الملكية.'
                  : 'Across the marble promenade, golden mashrabiya arches frame curated midnight navy, deep emerald, rich burgundy, and bridal duchesse satin collections.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
