import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Locale } from '../../types/boutique';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useStore } from '../../context/StoreContext';

interface LayoutProps {
  locale: Locale;
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ locale, children, hideFooter = false }) => {
  const location = useLocation();
  const { settings } = useStore();

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.title =
      locale === 'ar'
        ? `${settings.boutiqueName.ar} — أزياء سعودية فاخرة وتفصيل خاص`
        : `${settings.boutiqueName.en} — Luxury Saudi Fashion & Bespoke Tailoring`;
  }, [locale, settings.boutiqueName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const isVirtualPage = location.pathname.includes('/virtual-boutique');
  const isOrderPage = location.pathname.includes('/custom-order');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#171512] overflow-x-clip">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer locale={locale} />}

      {/* Compact Mobile WhatsApp Order Shortcut (Strict <= 15% sticky viewport budget) */}
      {!isVirtualPage && !isOrderPage && (
        <Link
          to={`/${locale}/custom-order`}
          className="sm:hidden fixed bottom-4 end-4 z-30 inline-flex items-center gap-2 px-4 h-11 bg-[#171512] text-[#D2B477] border border-[#D2B477]/50 shadow-lg text-xs font-medium whitespace-nowrap"
          aria-label={locale === 'ar' ? 'طلب عبر واتساب' : 'WhatsApp Order'}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>{locale === 'ar' ? 'طلب تفصيل' : 'WhatsApp Order'}</span>
        </Link>
      )}
    </div>
  );
};
