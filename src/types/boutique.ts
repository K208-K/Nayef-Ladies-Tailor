export type Locale = 'en' | 'ar';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface Category {
  id: string;
  slug: string;
  name: BilingualText;
  description: BilingualText;
  featured: boolean;
  coverImageKey: string;
}

export interface ColorOption {
  id: string;
  name: BilingualText;
  hex: string;
}

export interface Design {
  id: string;
  slug: string;
  name: BilingualText;
  categorySlug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  priceSar?: number;
  fabric: BilingualText;
  embroideryDetails: BilingualText;
  customizationNotes: BilingualText;
  leadTimeDays: number;
  colors: ColorOption[];
  availableFabrics: BilingualText[];
  mainImageKey: string;
  galleryImageKeys: string[];
  featured: boolean;
  isNewArrival: boolean;
}

export type BoutiqueSceneId = 'exterior' | 'entrance' | 'interior-left' | 'interior-right';

export interface BoutiqueHotspot {
  id: string;
  sceneId: 'exterior' | 'interior-left' | 'interior-right';
  xPercent: number;
  yPercent: number;
  label: BilingualText;
  subtitle: BilingualText;
  designId: string;
  active: boolean;
}

export type OrderStatus =
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'In Production'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type MeasurementMethod = 'custom' | 'in-store';

export interface CustomMeasurements {
  unit: 'cm' | 'in';
  length: string;
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  sleeve: string;
}

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  designId: string;
  designName: BilingualText;
  selectedColor: BilingualText;
  selectedFabric: BilingualText;
  customizationInstructions: string;
  measurementMethod: MeasurementMethod;
  measurements?: CustomMeasurements;
  preferredFittingDate?: string;
  preferredFittingTime?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  locale: Locale;
  status: OrderStatus;
  estimatedPriceSar?: number;
}

export interface GalleryItem {
  id: string;
  title: BilingualText;
  caption: BilingualText;
  category: 'architecture' | 'craftsmanship' | 'bridal' | 'evening';
  imageKey: string;
  aspect: 'landscape' | 'portrait';
}

export interface Testimonial {
  id: string;
  clientName: BilingualText;
  roleAndCity: BilingualText;
  quote: BilingualText;
  commissionedPiece: BilingualText;
  year: string;
}

export interface FittingInquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
}

export interface SiteSettings {
  boutiqueName: BilingualText;
  tagline: BilingualText;
  heroHeadline: BilingualText;
  heroSubheadline: BilingualText;
  whatsappNumber: string;
  salonAddress: BilingualText;
  salonHours: BilingualText;
  contactEmail: string;
  instagramHandle: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    snapchat: string;
  };
}

export interface BoutiqueDatabase {
  categories: Category[];
  designs: Design[];
  hotspots: BoutiqueHotspot[];
  orders: Order[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  inquiries: FittingInquiry[];
  settings: SiteSettings;
}
