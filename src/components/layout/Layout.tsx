import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Locale } from '../../types/boutique';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface LayoutProps {
  locale: Locale;
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ locale, children, hideFooter = false }) => {
  const location = useLocation();
  const { settings } = useStore();
  const [whatsappMenuOpen, setWhatsappMenuOpen] = useState(false);

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
  const directWhatsAppHref = buildWhatsAppUrl(
    settings.whatsappNumber,
    locale === 'ar'
      ? 'مرحباً، أود التواصل مباشرة مع خياط عبدالعزيز نايف النسائي.'
      : 'Greetings, I would like to speak directly with Abdulaziz Nayef Ladies Tailor.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#171512] overflow-x-clip">
      <Navbar locale={locale} />
      <main className={`flex-1 ${!isVirtualPage && !isOrderPage ? 'pb-20 sm:pb-0' : ''}`}>{children}</main>
      {!hideFooter && <Footer locale={locale} />}

      {/* Compact Mobile WhatsApp Order Shortcut (Strict <= 15% sticky viewport budget) */}
      {!isVirtualPage && !isOrderPage && (
        <div
          className="sm:hidden fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setWhatsappMenuOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') setWhatsappMenuOpen(false);
          }}
        >
          {whatsappMenuOpen && (
            <div
              className="flex flex-col items-stretch gap-1 min-w-48 p-2 bg-[#171512] border border-[#D2B477]/45 shadow-xl"
              aria-label={locale === 'ar' ? 'خيارات واتساب' : 'WhatsApp options'}
            >
              <Link
                to={`/${locale}/custom-order`}
                className="px-4 py-3 text-xs text-start text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                onClick={() => setWhatsappMenuOpen(false)}
              >
                {locale === 'ar' ? 'طلب مخصص' : 'Custom Order'}
              </Link>
              <a
                href={directWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-xs text-start text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                onClick={() => setWhatsappMenuOpen(false)}
              >
                {locale === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}
              </a>
            </div>
          )}
          <button
            type="button"
            className="whatsapp-floating-button inline-flex items-center justify-center w-16 h-16"
            aria-label={
              whatsappMenuOpen
                ? locale === 'ar'
                  ? 'إغلاق خيارات واتساب'
                  : 'Close WhatsApp options'
                : locale === 'ar'
                  ? 'فتح خيارات واتساب'
                  : 'Open WhatsApp options'
            }
            aria-expanded={whatsappMenuOpen}
            onClick={(event) => {
              event.stopPropagation();
              setWhatsappMenuOpen((open) => !open);
            }}
          >
            <WhatsAppIcon className="whatsapp-order-icon w-9 h-9" />
          </button>
        </div>
      )}
    </div>
  );
};
