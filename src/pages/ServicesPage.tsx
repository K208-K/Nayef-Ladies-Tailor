import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

interface ServicesPageProps {
  locale: Locale;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ locale }) => {
  const t = UI_COPY[locale].services;
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  const services = [
    {
      num: '01',
      title: {
        en: 'Bespoke Abaya & Jalabiya Tailoring',
        ar: 'تفصيل العبايات والجلابيات الخاصة',
      },
      leadTime: { en: '9 – 14 Days', ar: '٩ – ١٤ يوماً' },
      desc: {
        en: 'Individually drafted patterns cut from heavyweight Japanese matte crepe, Korean royal nada, and pure mulberry silk. Sleeve drape, lapel embroidery density, closure style, and matching shayla dimensions are tailored to your exact proportions.',
        ar: 'رسم باترون خاص لكل عميلة يُقص من الكريب الياباني المطفي وقماش الندى الملكي والحرير الطبيعي، مع تخصيص عرض الأكمام وكثافة التطريز ونوع الإغلاق وأبعاد الطرحة المتناسقة.',
      },
      imageKey: 'black_gold_abaya',
    },
    {
      num: '02',
      title: {
        en: 'Bridal Couture & Private Salon Fittings',
        ar: 'أزياء العرائس وجلسات القياس الخاصة',
      },
      leadTime: { en: '30 – 45 Days', ar: '٣٠ – ٤٥ يوماً' },
      desc: {
        en: 'One-of-one bridal gowns in Italian duchesse satin and cathedral silk organza. Every bridal commission includes three private appointments in our Riyadh Tahlia salon with our female master couturier for posture, veil, and train calibration.',
        ar: 'فساتين زفاف حصرية من الساتان الدوشيس الإيطالي والأورغنزا الحريرية الملكية. تشمل كل طلبية ثلاث جلسات قياس خاصة في صالون التحلية بالرياض بإشراف كبيرة الخياطات لضبط القصة والطرحة والذيل.',
      },
      imageKey: 'ivory_bridal_couture',
    },
    {
      num: '03',
      title: {
        en: 'Hand-Guided Zari & Bullion Embroidery',
        ar: 'التطريز اليدوي بخيوط الزري والقصب',
      },
      leadTime: { en: '40 – 180 Atelier Hours', ar: '٤٠ – ١٨٠ ساعة عمل يدوي' },
      desc: {
        en: 'Our artisans execute traditional Najdi geometric motifs and botanical arabesques using champagne-gold metallic zari, French silk tambour chain-stitch, and freshwater seed pearls.',
        ar: 'ينفذ حرفيو المشغل زخارف هندسية نجدية وأغصان أرابيسك نباتية باستخدام خيوط الزري الذهبي الشامبين، وغرزة السلسلة الحريرية، وحبيبات اللؤلؤ الطبيعي.',
      },
      imageKey: 'emerald_silk_gown',
    },
    {
      num: '04',
      title: {
        en: 'Mother & Daughter Festive Capsules',
        ar: 'كبسولات الأعياد المتناغمة للأم وابنتها',
      },
      leadTime: { en: '10 – 16 Days', ar: '١٠ – ١٦ يوماً' },
      desc: {
        en: 'Coordinated festive couture for Eid and family weddings, pairing women’s evening silhouettes with pure cotton-silk lined girls’ dresses in harmonized champagne, emerald, or burgundy palettes.',
        ar: 'تصاميم متناغمة للأعياد وحفلات الزفاف تجمع بين إطلالة الأم الراقية وفساتين الفتيات المبطنة بالحرير والقطن الطبيعي بألوان متكاملة.',
      },
      imageKey: 'girls_festive_couture',
    },
  ];

  const steps =
    locale === 'ar'
      ? [
          { step: '٠١', title: 'اختيار التصميم والقماش', text: 'عبر الموقع أو خلال زيارتكِ لصالوننا في الرياض لمعاينة عينات الحرير.' },
          { step: '٠٢', title: 'رفع المقاسات الدقيقة', text: 'إدخال المقاسات إلكترونياً أو حجز موعد قياس خاص مع خبيرة الخياطة.' },
          { step: '٠٣', title: 'التفصيل والتطريز اليدوي', text: 'قص الباترون الفردي وتنفيذ تطريز الزري والقصب في مشغل الدار.' },
          { step: '٠٤', title: 'البروفة النهائية والتسليم', text: 'فحص الجودة والكيّ بالبخار والتسليم في حافظة أماني كوتور الفاخرة.' },
        ]
      : [
          { step: '01', title: 'Silhouette & Swatch Selection', text: 'Select your piece online or inspect silk swatches inside our Riyadh showroom.' },
          { step: '02', title: 'Precision Measurement', text: 'Submit measurements online or attend a private fitting with our female head tailor.' },
          { step: '03', title: 'Pattern Cutting & Hand Embroidery', text: 'Individual toile drafting followed by hand-couched zari and bullion threadwork.' },
          { step: '04', title: 'Final Fitting & Garment Delivery', text: 'Hand-steamed inspection and courier delivery in an Amani Couture garment bag.' },
        ];

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl space-y-3 pb-14 border-b border-[#171512]/10">
          <p className="text-xs text-[#9B8873]">{t.kicker}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Alternating Editorial Service Chapters */}
        <div className="divide-y divide-[#171512]/10">
          {services.map((srv, idx) => (
            <div
              key={srv.num}
              className="py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              <div
                className={`lg:col-span-5 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <div className="aspect-[4/4.6] bg-white border border-[#171512]/10 overflow-hidden">
                  <LuxuryImage
                    srcKeyOrUrl={srv.imageKey}
                    alt={srv.title[locale]}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div
                className={`lg:col-span-7 space-y-5 ${
                  idx % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <div className="flex items-center gap-3 text-xs text-[#9B8873]">
                  <span className="font-mono tabular-nums text-[#171512] font-medium">
                    {srv.num}.
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{srv.leadTime[locale]}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
                  {srv.title[locale]}
                </h2>

                <p className="text-sm sm:text-base text-[#171512]/80 leading-relaxed max-w-2xl">
                  {srv.desc[locale]}
                </p>

                <div className="pt-2">
                  <Link
                    to={`/${locale}/custom-order`}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {locale === 'ar' ? 'اطلبي هذه الخدمة عبر واتساب' : 'Commission via WhatsApp'}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Atelier Journey */}
        <div className="mt-12 p-8 sm:p-12 bg-white border border-[#171512]/10">
          <h2 className="font-display text-3xl font-semibold text-[#171512] mb-8">
            {locale === 'ar' ? 'مراحل التفصيل في أماني كوتور' : 'The Bespoke Commission Journey'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="space-y-2">
                <span className="font-mono text-xs text-[#9B8873] tabular-nums">{s.step}</span>
                <h3 className="font-display text-xl font-semibold text-[#171512]">{s.title}</h3>
                <p className="text-xs text-[#171512]/75 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
