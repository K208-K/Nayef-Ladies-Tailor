import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { useStore } from '../../context/StoreContext';

import { BrandLogo } from '../common/BrandLogo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface NavbarProps {
  locale: Locale;
}

export const Navbar: React.FC<NavbarProps> = ({ locale }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [whatsappMenuOpen, setWhatsappMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useStore();
  const t = UI_COPY[locale].nav;
  const directWhatsAppHref = buildWhatsAppUrl(
    settings.whatsappNumber,
    locale === 'ar'
      ? 'مرحباً، أود التواصل مباشرة مع خياط عبدالعزيز نايف النسائي.'
      : 'Greetings, I would like to speak directly with Abdulaziz Nayef Ladies Tailor.'
  );

  const targetLocale: Locale = locale === 'en' ? 'ar' : 'en';
  const switchedPath = location.pathname.replace(/^\/(en|ar)/, `/${targetLocale}`) || `/${targetLocale}`;

  const primaryLinks: { to: string; label: string; exact?: boolean }[] = [
    { to: `/${locale}`, label: t.home, exact: true },
    { to: `/${locale}/collections`, label: t.collections },
    { to: `/${locale}/virtual-boutique`, label: t.virtualBoutique },
    { to: `/${locale}/about`, label: t.about },
    { to: `/${locale}/contact`, label: t.contact },
  ];

  const mobileExtraLinks: { to: string; label: string; exact?: boolean }[] = [
    { to: `/${locale}/services`, label: t.services },
    { to: `/${locale}/gallery`, label: t.gallery },
    { to: `/${locale}/admin`, label: t.admin },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path || location.pathname === `${path}/`;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] sm:h-20 bg-[#171512]/98 text-[#F5F0E7] border-b border-[#D2B477]/25 shadow-md">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Authentic Signboard Brand Logo & Wordmark */}
        <Link
          to={`/${locale}`}
          className="hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 py-1"
          aria-label={settings.boutiqueName[locale]}
        >
          <div className="hidden sm:block">
            <BrandLogo variant="horizontal" showSubtitle={true} />
          </div>
          <div className="sm:hidden">
            <BrandLogo variant="compact" showSubtitle={false} />
          </div>
        </Link>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm" aria-label="Main Navigation">
          {primaryLinks.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'text-[#D2B477] font-medium after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-[#D2B477]'
                    : 'text-[#F5F0E7]/80 hover:text-[#F5F0E7]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Primary WhatsApp Order Action */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to={switchedPath}
            className="inline-flex items-center gap-1.5 text-xs text-[#F5F0E7]/80 hover:text-[#D2B477] transition-colors duration-150 whitespace-nowrap shrink-0 py-1.5 px-2"
            aria-label={t.switchLang}
          >
            <Globe className="w-3.5 h-3.5 text-[#D2B477]" />
            <span>{t.switchLang}</span>
          </Link>

          <div
            className="hidden sm:flex relative items-center"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setWhatsappMenuOpen(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse') setWhatsappMenuOpen(false);
            }}
          >
            {whatsappMenuOpen && (
              <div
                className="absolute top-full end-0 flex flex-col gap-1 min-w-52 p-2 bg-[#171512] border border-[#D2B477]/45 shadow-xl"
                aria-label={locale === 'ar' ? 'خيارات واتساب' : 'WhatsApp options'}
              >
                <Link
                  to={`/${locale}/custom-order`}
                  className="min-h-11 px-4 py-3 text-sm text-start text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                  onClick={() => setWhatsappMenuOpen(false)}
                >
                  {locale === 'ar' ? 'طلب مخصص' : 'Custom Order'}
                </Link>
                <a
                  href={directWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 px-4 py-3 text-sm text-start text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                  onClick={() => setWhatsappMenuOpen(false)}
                >
                  {locale === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}
                </a>
              </div>
            )}
            <button
              type="button"
              className="whatsapp-order-button inline-flex items-center justify-center w-12 h-12 shrink-0"
              title={t.customOrder}
              aria-label={t.customOrder}
              aria-expanded={whatsappMenuOpen}
              onClick={() => setWhatsappMenuOpen((open) => !open)}
            >
              <WhatsAppIcon className="whatsapp-order-icon w-7 h-7" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-[#F5F0E7] hover:text-[#D2B477] transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#171512] border-b border-[#D2B477]/25 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {[...primaryLinks, ...mobileExtraLinks].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-base border-b border-[#F5F0E7]/10 transition-colors ${
                  isActive(item.to, item.exact) ? 'text-[#D2B477] font-medium' : 'text-[#F5F0E7]/85'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Link
              to={`/${locale}/custom-order`}
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-medium bg-[#D2B477] text-[#171512]"
            >
              {t.customOrder}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
