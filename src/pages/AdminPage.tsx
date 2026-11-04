import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  MessageCircle,
  Upload,
  Check,
  MapPin,
} from 'lucide-react';
import {
  BoutiqueHotspot,
  Category,
  Design,
  FittingInquiry,
  GalleryItem,
  Locale,
  Order,
  OrderStatus,
  SiteSettings,
} from '../types/boutique';
import { useStore } from '../context/StoreContext';
import { ASSET_OPTIONS, resolveAssetUrl } from '../data/assets';
import { formatPriceSar } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { LuxuryImage } from '../components/common/LuxuryImage';

interface AdminPageProps {
  locale: Locale;
}

const ORDER_STATUSES: OrderStatus[] = [
  'New',
  'Contacted',
  'Confirmed',
  'In Production',
  'Ready',
  'Completed',
  'Cancelled',
];

type AdminTab = 'overview' | 'orders' | 'designs' | 'boutique' | 'content';

export const AdminPage: React.FC<AdminPageProps> = ({ locale }) => {
  const { adminToken, setAdminToken, refreshStore } = useStore();

  // Auth state
  const [email, setEmail] = useState('owner@abdulaziznayef.sa');
  const [password, setPassword] = useState('tailor2026');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin Data
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<FittingInquiry[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotspots, setHotspots] = useState<BoutiqueHotspot[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Orders filter
  const [orderFilter, setOrderFilter] = useState<'All' | OrderStatus>('All');

  // Design Editor State
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [desNameEn, setDesNameEn] = useState('');
  const [desNameAr, setDesNameAr] = useState('');
  const [desCatSlug, setDesCatSlug] = useState('abayas');
  const [desPrice, setDesPrice] = useState('4500');
  const [desFabricEn, setDesFabricEn] = useState('Japanese Matte Silk Crepe');
  const [desFabricAr, setDesFabricAr] = useState('كريب حريري ياباني مطفي');
  const [desEmbroideryEn, setDesEmbroideryEn] = useState('Hand-stitched champagne gold zari threadwork.');
  const [desEmbroideryAr, setDesEmbroideryAr] = useState('تطريز يدوي بخيوط الزري الذهبي الشامبين.');
  const [desShortEn, setDesShortEn] = useState('');
  const [desShortAr, setDesShortAr] = useState('');
  const [desImageKey, setDesImageKey] = useState('black_gold_abaya');
  const [desFeatured, setDesFeatured] = useState(true);
  const [desNew, setDesNew] = useState(true);

  // Category Form State
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');

  // Virtual Boutique Hotspot Editor State
  const [editorScene, setEditorScene] = useState<'exterior' | 'interior-left' | 'interior-right'>(
    'interior-left'
  );
  const [hsX, setHsX] = useState<number>(50);
  const [hsY, setHsY] = useState<number>(58);
  const [hsLabelEn, setHsLabelEn] = useState('');
  const [hsLabelAr, setHsLabelAr] = useState('');
  const [hsSubEn, setHsSubEn] = useState('Illuminated Showroom Display');
  const [hsSubAr, setHsSubAr] = useState('منصة العرض المضيئة');
  const [hsDesignId, setHsDesignId] = useState('');

  // Gallery Form State
  const [galTitleEn, setGalTitleEn] = useState('');
  const [galTitleAr, setGalTitleAr] = useState('');
  const [galCat, setGalCat] = useState<GalleryItem['category']>('evening');
  const [galImgKey, setGalImgKey] = useState('black_gold_abaya');

  const notify = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => setStatusMessage(''), 3200);
  };

  const fetchAdminData = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setAdminToken(null);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders || []);
      setInquiries(data.inquiries || []);
      setDesigns(data.designs || []);
      setCategories(data.categories || []);
      setHotspots(data.hotspots || []);
      setGallery(data.gallery || []);
      setSettingsForm(data.settings || null);
      if (data.designs?.[0] && !hsDesignId) {
        setHsDesignId(data.designs[0].id);
      }
    } catch {
      // Ignore transient fetch errors
    }
  }, [adminToken, setAdminToken, hsDesignId]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setAdminToken(data.token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (adminToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchAdminData();
      notify(locale === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated.');
    }
  };

  const populateDesignForEdit = (d: Design) => {
    setEditingDesignId(d.id);
    setDesNameEn(d.name.en);
    setDesNameAr(d.name.ar);
    setDesCatSlug(d.categorySlug);
    setDesPrice(d.priceSar ? String(d.priceSar) : '');
    setDesFabricEn(d.fabric.en);
    setDesFabricAr(d.fabric.ar);
    setDesEmbroideryEn(d.embroideryDetails.en);
    setDesEmbroideryAr(d.embroideryDetails.ar);
    setDesShortEn(d.shortDescription.en);
    setDesShortAr(d.shortDescription.ar);
    setDesImageKey(d.mainImageKey);
    setDesFeatured(d.featured);
    setDesNew(d.isNewArrival);
  };

  const resetDesignForm = () => {
    setEditingDesignId(null);
    setDesNameEn('');
    setDesNameAr('');
    setDesShortEn('');
    setDesShortAr('');
    setDesPrice('4500');
  };

  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    const payload = {
      name: { en: desNameEn, ar: desNameAr },
      categorySlug: desCatSlug,
      priceSar: desPrice ? Number(desPrice) : undefined,
      fabric: { en: desFabricEn, ar: desFabricAr },
      embroideryDetails: { en: desEmbroideryEn, ar: desEmbroideryAr },
      shortDescription: { en: desShortEn || desNameEn, ar: desShortAr || desNameAr },
      description: { en: desShortEn || desNameEn, ar: desShortAr || desNameAr },
      mainImageKey: desImageKey,
      featured: desFeatured,
      isNewArrival: desNew,
    };

    const url = editingDesignId
      ? `/api/admin/designs/${editingDesignId}`
      : '/api/admin/designs';
    const method = editingDesignId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetDesignForm();
      await fetchAdminData();
      await refreshStore();
      notify(locale === 'ar' ? 'تم حفظ التصميم بنجاح' : 'Couture design saved.');
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/designs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.ok) {
      await fetchAdminData();
      await refreshStore();
      notify(locale === 'ar' ? 'تم حذف التصميم' : 'Design removed.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !catNameEn || !catNameAr) return;
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: { en: catNameEn, ar: catNameAr },
        description: { en: catNameEn, ar: catNameAr },
        featured: false,
      }),
    });
    if (res.ok) {
      setCatNameEn('');
      setCatNameAr('');
      await fetchAdminData();
      await refreshStore();
      notify('Category added.');
    }
  };

  const handleSceneCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setHsX(Math.max(4, Math.min(96, x)));
    setHsY(Math.max(8, Math.min(92, y)));
  };

  const handleAddHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    const linked = designs.find((d) => d.id === hsDesignId) || designs[0];
    const res = await fetch('/api/admin/hotspots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        sceneId: editorScene,
        xPercent: hsX,
        yPercent: hsY,
        label: {
          en: hsLabelEn || linked?.name.en || 'Couture Display',
          ar: hsLabelAr || linked?.name.ar || 'تصميم راقٍ',
        },
        subtitle: { en: hsSubEn, ar: hsSubAr },
        designId: linked?.id || '',
        active: true,
      }),
    });
    if (res.ok) {
      setHsLabelEn('');
      setHsLabelAr('');
      await fetchAdminData();
      await refreshStore();
      notify('Showroom hotspot added.');
    }
  };

  const handleToggleHotspot = async (hs: BoutiqueHotspot) => {
    if (!adminToken) return;
    await fetch(`/api/admin/hotspots/${hs.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ active: !hs.active }),
    });
    await fetchAdminData();
    await refreshStore();
  };

  const handleDeleteHotspot = async (id: string) => {
    if (!adminToken) return;
    await fetch(`/api/admin/hotspots/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await fetchAdminData();
    await refreshStore();
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !galTitleEn || !galTitleAr) return;
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: { en: galTitleEn, ar: galTitleAr },
        caption: { en: '', ar: '' },
        category: galCat,
        imageKey: galImgKey,
        aspect: 'portrait',
      }),
    });
    if (res.ok) {
      setGalTitleEn('');
      setGalTitleAr('');
      await fetchAdminData();
      await refreshStore();
      notify('Photograph added to gallery.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !settingsForm) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(settingsForm),
    });
    const data = await res.json();
    if (!res.ok) {
      notify(data.error || 'Validation error');
      return;
    }
    if (data.settings) setSettingsForm(data.settings);
    await fetchAdminData();
    await refreshStore();
    notify(locale === 'ar' ? 'تم حفظ إعدادات الموقع ورقم واتساب' : 'Website content & WhatsApp configuration saved.');
  };

  /* -------------------- OWNER LOGIN VIEW -------------------- */
  if (!adminToken) {
    return (
      <div className="py-20 bg-[#F5F0E7] min-h-[82vh] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white border border-[#171512]/15 p-8 sm:p-10 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 mx-auto bg-[#171512] text-[#D2B477] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-[#171512]">
              {locale === 'ar'
                ? 'بوابة إدارة خياط عبدالعزيز نايف'
                : 'Abdulaziz Nayef Atelier Administration'}
            </h1>
            <p className="text-xs text-[#9B8873]">
              {locale === 'ar'
                ? 'تسجيل دخول خاص بمالك المشغل وإدارة البوتيك'
                : 'Private access for Store #128 boutique management, commissions, and showroom hotspots'}
            </p>
          </div>

          {authError && (
            <p className="text-xs text-red-800 bg-red-50 border border-red-200 px-3.5 py-2.5">
              {authError}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[#9B8873] mb-1">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Owner Email'}
              </label>
              <input
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9B8873] mb-1">
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                dir="ltr"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 text-xs font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
            >
              {loggingIn
                ? '...'
                : locale === 'ar'
                ? 'دخول لوحة الإدارة'
                : 'Sign In to Atelier Console'}
            </button>
          </form>

          <div className="pt-3 border-t border-[#171512]/10 text-[11px] text-[#9B8873] text-center">
            Demo Owner Access: <span className="font-mono text-[#171512]">owner@abdulaziznayef.sa</span> ·{' '}
            <span className="font-mono text-[#171512]">tailor2026</span>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- AUTHENTICATED DASHBOARD -------------------- */
  const filteredOrders =
    orderFilter === 'All' ? orders : orders.filter((o) => o.status === orderFilter);

  const sceneImgKey =
    editorScene === 'exterior'
      ? 'storefront_exterior'
      : editorScene === 'interior-right'
      ? 'interior_showroom_right'
      : 'interior_showroom_left';

  const sceneHotspots = hotspots.filter((h) => h.sceneId === editorScene);

  return (
    <div className="py-12 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-8">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#171512]/10">
          <div>
            <p className="text-xs text-[#9B8873]">
              {locale === 'ar' ? 'الإدارة الخاصة للمشغل' : 'Private Maison Management'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#171512]">
              {locale === 'ar'
                ? 'لوحة تحكم خياط عبدالعزيز نايف النسائي'
                : 'Abdulaziz Nayef Ladies Tailor Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#D2B477] text-[#171512]">
                <Check className="w-3.5 h-3.5 text-[#9B8873]" />
                <span>{statusMessage}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#171512]/25 text-[#171512] hover:bg-[#171512] hover:text-[#F5F0E7] transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'overview', en: 'Overview', ar: 'نظرة عامة' },
            { id: 'orders', en: `Orders (${orders.length})`, ar: `الطلبات (${orders.length})` },
            { id: 'designs', en: `Designs & Categories (${designs.length})`, ar: `التصاميم والأقسام (${designs.length})` },
            { id: 'boutique', en: `Showroom Hotspots (${hotspots.length})`, ar: `نقاط البوتيك الافتراضي (${hotspots.length})` },
            { id: 'content', en: 'Gallery & Site Settings', ar: 'المعرض وإعدادات واتساب' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#171512] text-[#D2B477]'
                  : 'bg-white text-[#171512]/75 hover:text-[#171512] border border-[#171512]/10'
              }`}
            >
              {locale === 'ar' ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 bg-white border border-[#171512]/10 space-y-1">
                <span className="text-xs text-[#9B8873]">
                  {locale === 'ar' ? 'إجمالي طلبات التفصيل' : 'Total Bespoke Orders'}
                </span>
                <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                  {orders.length}
                </p>
              </div>
              <div className="p-6 bg-white border border-[#171512]/10 space-y-1">
                <span className="text-xs text-[#9B8873]">
                  {locale === 'ar' ? 'قيد التنفيذ والتأكيد' : 'Active In-Atelier'}
                </span>
                <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                  {
                    orders.filter((o) =>
                      ['New', 'Confirmed', 'In Production'].includes(o.status)
                    ).length
                  }
                </p>
              </div>
              <div className="p-6 bg-white border border-[#171512]/10 space-y-1">
                <span className="text-xs text-[#9B8873]">
                  {locale === 'ar' ? 'التصاميم المعروضة' : 'Published Designs'}
                </span>
                <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                  {designs.length}
                </p>
              </div>
              <div className="p-6 bg-white border border-[#171512]/10 space-y-1">
                <span className="text-xs text-[#9B8873]">
                  {locale === 'ar' ? 'نقاط البوتيك النشطة' : 'Active Showroom Hotspots'}
                </span>
                <p className="font-mono text-3xl font-medium tabular-nums text-[#171512]">
                  {hotspots.filter((h) => h.active).length}
                </p>
              </div>
            </div>

            {/* Recent Commissions Table */}
            <div className="bg-white border border-[#171512]/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-[#171512]">
                  {locale === 'ar' ? 'أحدث طلبات التفصيل' : 'Recent Commissions'}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs underline text-[#171512]/75 hover:text-[#171512]"
                >
                  {locale === 'ar' ? 'إدارة جميع الطلبات' : 'Manage All Orders'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#171512]/10 text-[#9B8873]">
                      <th className="py-3 text-start font-medium">Reference</th>
                      <th className="py-3 text-start font-medium">Client</th>
                      <th className="py-3 text-start font-medium">Design</th>
                      <th className="py-3 text-start font-medium">Measurements</th>
                      <th className="py-3 text-start font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171512]/8">
                    {orders.slice(0, 6).map((o) => (
                      <tr key={o.id}>
                        <td className="py-3.5 font-mono tabular-nums font-medium text-[#171512]">
                          {o.reference}
                        </td>
                        <td className="py-3.5 text-[#171512]">
                          {o.customerName} · <span className="font-mono">{o.customerPhone}</span>
                        </td>
                        <td className="py-3.5 text-[#171512]/85">{o.designName[locale]}</td>
                        <td className="py-3.5 text-[#9B8873]">
                          {o.measurementMethod === 'in-store'
                            ? `In-Store (${o.preferredFittingDate || 'Riyadh'})`
                            : `Custom (${o.measurements?.unit || 'cm'})`}
                        </td>
                        <td className="py-3.5 font-medium text-[#171512]">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Salon Appointment Inquiries */}
            {inquiries.length > 0 && (
              <div className="bg-white border border-[#171512]/10 p-6 space-y-4">
                <h2 className="font-display text-2xl font-semibold text-[#171512]">
                  {locale === 'ar' ? 'طلبات مواعيد الصالون' : 'Private Salon Appointment Inquiries'}
                </h2>
                <div className="divide-y divide-[#171512]/10">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="py-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#171512]">
                          {inq.name} · <span className="font-mono">{inq.phone}</span>
                        </span>
                        <span className="text-[#9B8873]">{inq.serviceType}</span>
                      </div>
                      <p className="text-[#171512]/80">{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS & CUSTOMERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['All', ...ORDER_STATUSES] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilter(st)}
                  className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap ${
                    orderFilter === st
                      ? 'bg-[#171512] text-[#F5F0E7]'
                      : 'bg-white border border-[#171512]/10 text-[#171512]/75'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredOrders.map((o) => {
                const replyUrl = buildWhatsAppUrl(
                  o.customerPhone,
                  `Greetings ${o.customerName}, this is Amani Couture regarding your commission ${o.reference} (${o.designName.en}). Status: ${o.status}.`
                );

                return (
                  <div
                    key={o.id}
                    className="bg-white border border-[#171512]/10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9B8873]">
                        <span className="font-mono font-medium text-[#171512] tabular-nums">
                          {o.reference}
                        </span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                        <span>·</span>
                        <span>{o.customerCity}</span>
                      </div>

                      <h3 className="font-display text-2xl font-semibold text-[#171512]">
                        {o.designName[locale]}
                      </h3>

                      <p className="text-xs text-[#171512]/80">
                        {o.selectedColor[locale]} · {o.selectedFabric[locale]} ·{' '}
                        <span className="font-mono tabular-nums">
                          {formatPriceSar(o.estimatedPriceSar, locale)}
                        </span>
                      </p>

                      {o.measurementMethod === 'custom' && o.measurements ? (
                        <p className="text-xs font-mono tabular-nums text-[#171512]/80 bg-[#F5F0E7]/60 px-3 py-2 border border-[#171512]/10">
                          [{o.measurements.unit}] Length: {o.measurements.length} · Bust:{' '}
                          {o.measurements.bust} · Waist: {o.measurements.waist} · Hips:{' '}
                          {o.measurements.hips} · Shoulder: {o.measurements.shoulder} · Sleeve:{' '}
                          {o.measurements.sleeve}
                        </p>
                      ) : (
                        <p className="text-xs text-[#171512]/80 bg-[#F5F0E7]/60 px-3 py-2 border border-[#171512]/10">
                          In-Boutique Salon Fitting Requested · {o.preferredFittingDate} at{' '}
                          {o.preferredFittingTime}
                        </p>
                      )}

                      {o.customizationInstructions && (
                        <p className="text-xs text-[#171512]/75">
                          <span className="text-[#9B8873]">Notes: </span>
                          {o.customizationInstructions}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-s border-[#171512]/10 pt-4 lg:pt-0 lg:ps-6">
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-[#171512]">{o.customerName}</p>
                        <p className="font-mono text-[#9B8873]" dir="ltr">
                          {o.customerPhone}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#9B8873] mb-1">
                          Order Status
                        </label>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleOrderStatusChange(o.id, e.target.value as OrderStatus)
                          }
                          className="w-full px-3 py-2 text-xs font-medium bg-[#F5F0E7]/60 border border-[#171512]/20"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <a
                        href={replyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Message Client on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DESIGNS & CATEGORIES CRUD */}
        {activeTab === 'designs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleSaveDesign}
                className="bg-white border border-[#171512]/10 p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#171512]/10 pb-3">
                  <h2 className="font-display text-2xl font-semibold text-[#171512]">
                    {editingDesignId ? 'Edit Couture Design' : 'Add New Couture Design'}
                  </h2>
                  {editingDesignId && (
                    <button
                      type="button"
                      onClick={resetDesignForm}
                      className="text-xs underline text-[#9B8873]"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">English Name *</label>
                    <input
                      type="text"
                      required
                      value={desNameEn}
                      onChange={(e) => setDesNameEn(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">Arabic Name *</label>
                    <input
                      type="text"
                      dir="rtl"
                      required
                      value={desNameAr}
                      onChange={(e) => setDesNameAr(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">Category</label>
                    <select
                      value={desCatSlug}
                      onChange={(e) => setDesCatSlug(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name.en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">Price (SAR)</label>
                    <input
                      type="number"
                      value={desPrice}
                      onChange={(e) => setDesPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-[#171512]/20 bg-[#F5F0E7]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">Fabric (EN)</label>
                    <input
                      type="text"
                      value={desFabricEn}
                      onChange={(e) => setDesFabricEn(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1">Fabric (AR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={desFabricAr}
                      onChange={(e) => setDesFabricAr(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#9B8873] mb-1">Summary (EN)</label>
                  <textarea
                    rows={2}
                    value={desShortEn}
                    onChange={(e) => setDesShortEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8873] mb-1">Summary (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={desShortAr}
                    onChange={(e) => setDesShortAr(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                  />
                </div>

                {/* Photograph Selection or Local Upload */}
                <div className="space-y-2">
                  <label className="block text-xs text-[#9B8873]">Garment Photograph</label>
                  <select
                    value={desImageKey.startsWith('data:') ? 'custom' : desImageKey}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setDesImageKey(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                  >
                    {ASSET_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.labelEn}
                      </option>
                    ))}
                    {desImageKey.startsWith('data:') && (
                      <option value="custom">Uploaded Custom Photograph</option>
                    )}
                  </select>

                  <label className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-[#171512]/20 cursor-pointer hover:border-[#171512]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Fashion Photograph</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, setDesImageKey)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-5 text-xs">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={desFeatured}
                      onChange={(e) => setDesFeatured(e.target.checked)}
                    />
                    <span>Featured Signature</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={desNew}
                      onChange={(e) => setDesNew(e.target.checked)}
                    />
                    <span>New Arrival</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                >
                  {editingDesignId ? 'Update Design' : 'Publish Couture Design'}
                </button>
              </form>

              {/* Category Manager */}
              <form
                onSubmit={handleAddCategory}
                className="bg-white border border-[#171512]/10 p-6 space-y-4"
              >
                <h3 className="font-display text-xl font-semibold text-[#171512]">
                  Manage Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Category (EN)"
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    className="px-3 py-2 text-xs border border-[#171512]/20"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="اسم القسم (AR)"
                    value={catNameAr}
                    onChange={(e) => setCatNameAr(e.target.value)}
                    className="px-3 py-2 text-xs border border-[#171512]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs bg-[#171512] text-[#F5F0E7]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            {/* Existing Designs List */}
            <div className="lg:col-span-7 space-y-4">
              {designs.map((d) => (
                <div
                  key={d.id}
                  className="bg-white border border-[#171512]/10 p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-20 shrink-0 overflow-hidden border border-[#171512]/10">
                    <LuxuryImage
                      srcKeyOrUrl={d.mainImageKey}
                      alt={d.name.en}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg font-semibold text-[#171512] truncate">
                      {d.name.en} · {d.name.ar}
                    </p>
                    <p className="text-xs text-[#9B8873] truncate">
                      {d.categorySlug} · {formatPriceSar(d.priceSar, 'en')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => populateDesignForEdit(d)}
                      className="p-2 border border-[#171512]/15 hover:border-[#171512]"
                      aria-label="Edit design"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDesign(d.id)}
                      className="p-2 border border-[#171512]/15 text-red-800 hover:border-red-800"
                      aria-label="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIRTUAL BOUTIQUE HOTSPOT VISUAL CONFIGURATOR */}
        {activeTab === 'boutique' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                {(
                  [
                    { id: 'interior-left', label: 'Left Showroom (Image 1)' },
                    { id: 'interior-right', label: 'Right Showroom (Image 2)' },
                    { id: 'exterior', label: 'Exterior Storefront (Image 4)' },
                  ] as const
                ).map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setEditorScene(sc.id)}
                    className={`px-3.5 py-2 text-xs font-medium ${
                      editorScene === sc.id
                        ? 'bg-[#171512] text-[#D2B477]'
                        : 'bg-white border border-[#171512]/10 text-[#171512]/75'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#9B8873]">
                Click anywhere on the showroom photograph below to position a new diamond couture hotspot:
              </p>

              {/* Interactive Coordinate Picker Canvas */}
              <div
                onClick={handleSceneCanvasClick}
                className="relative aspect-[16/9] w-full bg-[#171512] border border-[#171512]/20 overflow-hidden cursor-crosshair select-none"
              >
                <img
                  src={resolveAssetUrl(sceneImgKey)}
                  alt="Showroom Hotspot Editor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Existing Hotspots */}
                {sceneHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rotate-45 border ${
                      hs.active
                        ? 'bg-[#D2B477] border-[#171512]'
                        : 'bg-[#171512]/50 border-[#F5F0E7]/40'
                    }`}
                    title={hs.label.en}
                  />
                ))}

                {/* New Target Reticle */}
                <div
                  style={{ left: `${hsX}%`, top: `${hsY}%` }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  <MapPin className="w-6 h-6 text-[#D2B477] drop-shadow" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleAddHotspot}
                className="bg-white border border-[#171512]/10 p-6 space-y-4"
              >
                <h2 className="font-display text-2xl font-semibold text-[#171512]">
                  Add Hotspot at ({hsX}%, {hsY}%)
                </h2>

                <div>
                  <label className="block text-xs text-[#9B8873] mb-1">Linked Couture Design</label>
                  <select
                    value={hsDesignId}
                    onChange={(e) => setHsDesignId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20 bg-[#F5F0E7]/30"
                  >
                    {designs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Hotspot Title (EN)"
                    value={hsLabelEn}
                    onChange={(e) => setHsLabelEn(e.target.value)}
                    className="px-3 py-2 text-xs border border-[#171512]/20"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="عنوان النقطة (AR)"
                    value={hsLabelAr}
                    onChange={(e) => setHsLabelAr(e.target.value)}
                    className="px-3 py-2 text-xs border border-[#171512]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-medium bg-[#171512] text-[#D2B477]"
                >
                  Save Hotspot to Scene
                </button>
              </form>

              <div className="bg-white border border-[#171512]/10 p-6 space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#171512]">
                  Scene Hotspots ({sceneHotspots.length})
                </h3>
                {sceneHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="py-2.5 border-b border-[#171512]/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="truncate">
                      <p className="font-medium text-[#171512] truncate">{hs.label.en}</p>
                      <p className="font-mono text-[11px] text-[#9B8873]">
                        x:{hs.xPercent}% · y:{hs.yPercent}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleHotspot(hs)}
                        className="px-2.5 py-1 border border-[#171512]/20 text-[11px]"
                      >
                        {hs.active ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHotspot(hs.id)}
                        className="p-1.5 text-red-800"
                        aria-label="Delete hotspot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY & WEBSITE CONTENT / SAUDI WHATSAPP NUMBER */}
        {activeTab === 'content' && settingsForm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveSettings}
              className="lg:col-span-7 bg-white border border-[#171512]/10 p-6 sm:p-8 space-y-5"
            >
              <h2 className="font-display text-2xl font-semibold text-[#171512] border-b border-[#171512]/10 pb-3">
                Saudi WhatsApp Concierge & Bilingual Site Copy
              </h2>

              <div>
                <label className="block text-xs text-[#9B8873] mb-1">
                  Configurable Saudi WhatsApp Number (+966...) *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9B8873] mb-1">Boutique Name (EN)</label>
                  <input
                    type="text"
                    value={settingsForm.boutiqueName.en}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        boutiqueName: { ...settingsForm.boutiqueName, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8873] mb-1">Boutique Name (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={settingsForm.boutiqueName.ar}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        boutiqueName: { ...settingsForm.boutiqueName, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9B8873] mb-1">Hero Headline (EN)</label>
                <input
                  type="text"
                  value={settingsForm.heroHeadline.en}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      heroHeadline: { ...settingsForm.heroHeadline, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9B8873] mb-1">Hero Headline (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settingsForm.heroHeadline.ar}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      heroHeadline: { ...settingsForm.heroHeadline, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                />
              </div>

              <div className="border-t border-[#171512]/10 pt-5 space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#171512]">Social Media Links</h3>
                <p className="text-xs text-[#9B8873]">
                  Add full URLs, for example https://instagram.com/your-account. Save, then refresh the public page.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['instagram', 'facebook', 'tiktok', 'youtube', 'snapchat'] as const).map((platform) => (
                    <div key={platform}>
                      <label className="block text-xs text-[#9B8873] mb-1 capitalize">{platform}</label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder={`https://${platform}.com/...`}
                        value={settingsForm.socialLinks?.[platform] || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            socialLinks: {
                              ...settingsForm.socialLinks,
                              [platform]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-xs font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
              >
                Save Website & WhatsApp Settings
              </button>
            </form>

            {/* Gallery Manager */}
            <div className="lg:col-span-5 bg-white border border-[#171512]/10 p-6 space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#171512]">
                Editorial Gallery ({gallery.length})
              </h2>

              <form onSubmit={handleAddGalleryItem} className="space-y-3 pb-4 border-b border-[#171512]/10">
                <input
                  type="text"
                  placeholder="Title (EN)"
                  value={galTitleEn}
                  onChange={(e) => setGalTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                />
                <input
                  type="text"
                  dir="rtl"
                  placeholder="العنوان (AR)"
                  value={galTitleAr}
                  onChange={(e) => setGalTitleAr(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#171512]/20"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={galCat}
                    onChange={(e) => setGalCat(e.target.value as GalleryItem['category'])}
                    className="px-3 py-2 text-xs border border-[#171512]/20"
                  >
                    <option value="architecture">Boutique Showroom</option>
                    <option value="craftsmanship">Craftsmanship</option>
                    <option value="bridal">Bridal</option>
                    <option value="evening">Evening</option>
                  </select>

                  <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-[#171512]/20 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, setGalImgKey)}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-medium bg-[#171512] text-[#F5F0E7]"
                >
                  Add Gallery Photograph
                </button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-[#171512]/8"
                  >
                    <span className="truncate">{g.title.en}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch(`/api/admin/gallery/${g.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${adminToken}` },
                        });
                        await fetchAdminData();
                        await refreshStore();
                      }}
                      className="text-red-800 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
