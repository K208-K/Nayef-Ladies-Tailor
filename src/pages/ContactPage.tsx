import React, { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { Locale } from '../types/boutique';
import { UI_COPY } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { LuxuryImage } from '../components/common/LuxuryImage';

interface ContactPageProps {
  locale: Locale;
}

export const ContactPage: React.FC<ContactPageProps> = ({ locale }) => {
  const { settings } = useStore();
  const t = UI_COPY[locale].contact;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+966');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Bridal Couture Fitting');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, serviceType, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to submit request.');
      }
      setSubmitted(true);
      setName('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const waUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    locale === 'ar'
      ? 'مرحباً دار أماني كوتور، أود حجز موعد استشارة وقياس في بوتيك الرياض.'
      : 'Greetings Amani Couture, I would like to schedule a private fitting appointment at your Riyadh boutique.'
  );

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl space-y-3 pb-12 border-b border-[#171512]/10">
          <p className="text-xs text-[#9B8873]">{t.kicker}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Salon Details & Storefront Photograph */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[16/10] bg-white border border-[#171512]/10 overflow-hidden">
              <LuxuryImage
                srcKeyOrUrl="storefront_exterior"
                alt={settings.boutiqueName[locale]}
                className="w-full h-full"
              />
            </div>

            <div className="p-6 bg-white border border-[#171512]/10 space-y-4">
              <div>
                <span className="block text-xs text-[#9B8873] mb-1">
                  {locale === 'ar' ? 'عنوان الصالون' : 'Riyadh Flagship Address'}
                </span>
                <p className="text-sm text-[#171512] leading-relaxed">
                  {settings.salonAddress[locale]}
                </p>
              </div>

              <div>
                <span className="block text-xs text-[#9B8873] mb-1">
                  {locale === 'ar' ? 'ساعات الاستقبال' : 'Salon Hours'}
                </span>
                <p className="text-xs text-[#171512]/80 leading-relaxed">
                  {settings.salonHours[locale]}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#171512]/10">
                <span className="font-mono text-sm tabular-nums text-[#171512]" dir="ltr">
                  {settings.whatsappNumber}
                </span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.directWhatsapp}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Appointment Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#171512]/10 p-6 sm:p-10">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171512] mb-6">
                {t.formTitle}
              </h2>

              {submitted ? (
                <div className="p-6 bg-[#F5F0E7] border border-[#D2B477] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#171512]">
                    <Check className="w-4 h-4 text-[#9B8873]" />
                    <span>{t.submittedMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs underline text-[#171512]/75 hover:text-[#171512]"
                  >
                    {locale === 'ar' ? 'إرسال استفسار آخر' : 'Send another inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <p className="text-xs text-red-800 bg-red-50 border border-red-200 px-4 py-2.5">
                      {error}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.phoneLabel} *
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.serviceLabel}
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      >
                        <option value="Bridal Couture Fitting">
                          {locale === 'ar' ? 'قياس واستشارة فستان زفاف' : 'Bridal Couture Fitting'}
                        </option>
                        <option value="Bespoke Abaya Commission">
                          {locale === 'ar' ? 'تفصيل عباية خاصة' : 'Bespoke Abaya Commission'}
                        </option>
                        <option value="Evening Gown Measurement">
                          {locale === 'ar' ? 'تفصيل فستان سهرة' : 'Evening Gown Measurement'}
                        </option>
                        <option value="General Inquiry">
                          {locale === 'ar' ? 'استفسار عام' : 'General Salon Inquiry'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1.5">
                      {t.messageLabel} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3.5 text-xs font-medium bg-[#171512] text-[#F5F0E7] hover:bg-[#D2B477] hover:text-[#171512] transition-colors disabled:opacity-50"
                  >
                    {submitting ? '...' : t.submitBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
