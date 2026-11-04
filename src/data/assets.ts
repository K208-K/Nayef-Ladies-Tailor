const storefrontExterior = '/assets/aistudio/ChatGPT_Image_Nov_4__2026__11_20_28_AM_faacd9bc.png';
const aboutStorefrontExterior = '/assets/aistudio/about_storefront_exterior.png';
import entranceGlassDoors from '../assets/images/entrance_glass_doors_1793808123027.jpg';
import interiorShowroomLeft from '../assets/images/interior_showroom_left_1793808125316.jpg';
import interiorShowroomRight from '../assets/images/interior_showroom_right_1793808127672.jpg';
import blackGoldAbaya from '../assets/images/black_gold_abaya_1793808128420.jpg';
import emeraldSilkGown from '../assets/images/emerald_silk_gown_1793808130240.jpg';
import ivoryBridalCouture from '../assets/images/ivory_bridal_couture_1793808131336.jpg';
import burgundyEveningDress from '../assets/images/burgundy_evening_dress_1793808133325.jpg';
import navyTailoredDress from '../assets/images/navy_tailored_dress_1793808134606.jpg';
import girlsFestiveCouture from '../assets/images/girls_festive_couture_1793808134492.jpg';

export const BOUTIQUE_ASSETS: Record<string, string> = {
  storefront_exterior: storefrontExterior,
  about_storefront_exterior: aboutStorefrontExterior,
  entrance_glass_doors: storefrontExterior,
  interior_showroom_left: interiorShowroomLeft,
  interior_showroom_right: interiorShowroomRight,
  black_gold_abaya: blackGoldAbaya,
  emerald_silk_gown: emeraldSilkGown,
  ivory_bridal_couture: ivoryBridalCouture,
  burgundy_evening_dress: burgundyEveningDress,
  navy_tailored_dress: navyTailoredDress,
  girls_festive_couture: girlsFestiveCouture,
};

export const ASSET_OPTIONS = [
  { key: 'black_gold_abaya', labelEn: 'Al-Ula Black & Gold Abaya', labelAr: 'عباية العلا السوداء المطرزة بالذهب' },
  { key: 'emerald_silk_gown', labelEn: 'Emerald Silk Cape Gown', labelAr: 'فستان الزمرد الحريري بالكاب' },
  { key: 'ivory_bridal_couture', labelEn: 'Ivory Champagne Bridal Couture', labelAr: 'فستان زفاف عاجي شامبين فاخر' },
  { key: 'burgundy_evening_dress', labelEn: 'Burgundy Pleated Evening Dress', labelAr: 'فستان سهرة عنابي مطرز' },
  { key: 'navy_tailored_dress', labelEn: 'Midnight Navy Tailored Gown', labelAr: 'فستان كحلي ملكي مفصل' },
  { key: 'girls_festive_couture', labelEn: 'Girls Champagne Festive Couture', labelAr: 'فستان فتيات احتفالي مطرز' },
  { key: 'interior_showroom_left', labelEn: 'Boutique Left Arched Showroom', labelAr: 'صالة العرض اليسرى المقوسة' },
  { key: 'interior_showroom_right', labelEn: 'Boutique Right Couture Gallery', labelAr: 'صالة العرض اليمنى للأزياء' },
  { key: 'entrance_glass_doors', labelEn: 'Store #128 Glass Door Entrance', labelAr: 'مدخل الأبواب الزجاجية لمتجر ١٢٨' },
  { key: 'storefront_exterior', labelEn: 'Store #128 Exterior Facade', labelAr: 'الواجهة الخارجية لمتجر ١٢٨' },
];

export function resolveAssetUrl(keyOrUrl: string | undefined): string {
  if (!keyOrUrl) return BOUTIQUE_ASSETS.black_gold_abaya;
  if (keyOrUrl in BOUTIQUE_ASSETS) {
    return BOUTIQUE_ASSETS[keyOrUrl];
  }
  return keyOrUrl;
}
