import React from 'react';
import { Link } from 'react-router-dom';
import { Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { useStore } from '../../context/StoreContext';
import { Facebook, Instagram, Youtube } from 'lucide-react';

import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  locale: Locale;
}

const SocialIcon: React.FC<{ label: string }> = ({ label }) => {
  if (label === 'Instagram') return <Instagram className="w-4 h-4" aria-hidden="true" />;
  if (label === 'Facebook') return <Facebook className="w-4 h-4" aria-hidden="true" />;
  if (label === 'YouTube') return <Youtube className="w-4 h-4" aria-hidden="true" />;
  if (label === 'TikTok') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="currentColor">
        <path d="M15.5 3c.4 2.2 1.7 3.6 3.8 4v3.2a8.6 8.6 0 0 1-3.8-1.1v6.2a5.7 5.7 0 1 1-4.9-5.7v3.3a2.5 2.5 0 1 0 1.7 2.4V3h3.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 17.5c-1.8-.2-3-1-3.8-2.3 1-.2 1.7-.7 2-1.4-1.2-.5-2-1.4-2.2-2.7.7.1 1.3.1 1.8-.1C4 9.2 4.3 7.4 5.5 6c1.7 2 3.8 3.1 6.5 3.2V8.6c0-1.7 1.4-3 3.1-3 .9 0 1.8.4 2.3 1 .8-.1 1.5-.4 2.2-.8-.3.9-.8 1.5-1.5 2 .7-.1 1.3-.3 1.9-.5-.5.7-1.1 1.3-1.8 1.8v.8c0 4.9-3.7 8.5-8.3 8.5-1.7 0-3.3-.5-4.6-1.4.5.1 1 .1 1.7.1Z" />
    </svg>
  );
};

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const { settings, categories } = useStore();
  const t = UI_COPY[locale].nav;

  const normalizeSocialHref = (platform: string, value: string | undefined): string | undefined => {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (platform === 'instagram' && trimmed.startsWith('@')) {
      return `https://instagram.com/${trimmed.slice(1)}`;
    }
    return `https://${trimmed}`;
  };

  const socialLinks = [
    {
      label: 'Instagram',
      href: normalizeSocialHref('instagram', settings.socialLinks?.instagram) ||
        normalizeSocialHref('instagram', settings.instagramHandle),
    },
    { label: 'Facebook', href: normalizeSocialHref('facebook', settings.socialLinks?.facebook) },
    { label: 'TikTok', href: normalizeSocialHref('tiktok', settings.socialLinks?.tiktok) },
    { label: 'YouTube', href: normalizeSocialHref('youtube', settings.socialLinks?.youtube) },
    { label: 'Snapchat', href: normalizeSocialHref('snapchat', settings.socialLinks?.snapchat) },
  ];

  return (
    <footer className="bg-[#171512] text-[#F5F0E7] border-t border-[#D2B477]/25">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#F5F0E7]/10">
          {/* Brand & Riyadh Salon Address */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to={`/${locale}`}
              className="inline-block hover:opacity-95 transition-opacity mb-2"
              aria-label={settings.boutiqueName[locale]}
            >
              <BrandLogo variant="horizontal" showSubtitle={true} />
            </Link>
            <p className="text-sm text-[#D2B477] font-medium max-w-md leading-relaxed">
              Fashion Stitches Your Story ♡
            </p>
            <p className="text-sm text-[#9B8873] max-w-md leading-relaxed">
              {settings.tagline[locale]}
            </p>
            <p className="text-sm text-[#F5F0E7]/80 max-w-md leading-relaxed pt-1">
              {settings.salonAddress[locale]}
            </p>
            <p className="text-xs text-[#9B8873] leading-relaxed max-w-md">
              {settings.salonHours[locale]}
            </p>
          </div>

          {/* Maison Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-lg text-[#D2B477]">
              {locale === 'ar' ? 'أقسام الدار' : 'The Maison'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F5F0E7]/80">
              <li>
                <Link to={`/${locale}/virtual-boutique`} className="hover:text-[#D2B477] transition-colors">
                  {t.virtualBoutique}
                </Link>
              </li>
              <li>
                <Link to={`/${locale}/collections`} className="hover:text-[#D2B477] transition-colors">
                  {t.collections}
                </Link>
              </li>
              <li>
                <Link to={`/${locale}/services`} className="hover:text-[#D2B477] transition-colors">
                  {t.services}
                </Link>
              </li>
              <li>
                <Link to={`/${locale}/gallery`} className="hover:text-[#D2B477] transition-colors">
                  {t.gallery}
                </Link>
              </li>
              <li>
                <Link to={`/${locale}/about`} className="hover:text-[#D2B477] transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link to={`/${locale}/contact`} className="hover:text-[#D2B477] transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections & Concierge */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-lg text-[#D2B477]">
              {locale === 'ar' ? 'التفصيل والاستشارات الخاصة' : 'Bespoke Concierge'}
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#9B8873]">
              {categories.slice(0, 6).map((cat, idx) => (
                <React.Fragment key={cat.id}>
                  <Link
                    to={`/${locale}/collections?category=${cat.slug}`}
                    className="hover:text-[#F5F0E7] transition-colors"
                  >
                    {cat.name[locale]}
                  </Link>
                  {idx < 5 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="pt-2 space-y-2 text-sm text-[#F5F0E7]/85">
              <p className="font-mono text-xs tabular-nums text-[#D2B477]" dir="ltr">
                {settings.whatsappNumber}
              </p>
              <p className="text-xs text-[#9B8873]">{settings.contactEmail}</p>
            </div>
            <div className="pt-3 flex flex-wrap items-center gap-2">
              {socialLinks.map((social) =>
                social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#D2B477]/35 text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors"
                  >
                    <SocialIcon label={social.label} />
                  </a>
                ) : (
                  <span
                    key={social.label}
                    aria-label={`${social.label} link not configured`}
                    title={`${social.label} link not configured`}
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#F5F0E7]/10 text-[#9B8873]/50"
                  >
                    <SocialIcon label={social.label} />
                  </span>
                )
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/${locale}/custom-order`}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium bg-[#D2B477] text-[#171512] hover:bg-[#e0c58e] transition-colors whitespace-nowrap"
              >
                {t.customOrder}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9B8873]">
          <p>
            © {new Date().getFullYear()} {settings.boutiqueName[locale]}.{' '}
            {locale === 'ar'
              ? 'جميع الحقوق محفوظة · الرياض، المملكة العربية السعودية.'
              : 'All rights reserved · Riyadh, Kingdom of Saudi Arabia.'}
          </p>
          <div className="flex items-center gap-5">
            <a
              href={socialLinks.find((social) => social.label === 'Instagram')?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D2B477] transition-colors"
            >
              {settings.instagramHandle}
            </a>
            <span aria-hidden="true">·</span>
            <Link to={`/${locale}/admin`} className="hover:text-[#D2B477] transition-colors">
              {t.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
