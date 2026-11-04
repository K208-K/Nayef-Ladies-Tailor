import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { Locale, MeasurementMethod, Order } from '../types/boutique';
import { UI_COPY, formatPriceSar } from '../i18n/translations';
import { useStore } from '../context/StoreContext';
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';
import { LuxuryImage } from '../components/common/LuxuryImage';

interface CustomOrderPageProps {
  locale: Locale;
}

export const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ locale }) => {
  const { designs, settings } = useStore();
  const [searchParams] = useSearchParams();
  const t = UI_COPY[locale].order;

  const preselectedId = searchParams.get('design') || designs[0]?.id || '';
  const [designId, setDesignId] = useState<string>(preselectedId);
  const selectedDesign = designs.find((d) => d.id === designId) || designs[0];

  const [colorIdx, setColorIdx] = useState<number>(0);
  const [fabricIdx, setFabricIdx] = useState<number>(0);
  const [customizationInstructions, setCustomizationInstructions] = useState<string>('');

  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('custom');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [length, setLength] = useState('148');
  const [bust, setBust] = useState('96');
  const [waist, setWaist] = useState('78');
  const [hips, setHips] = useState('102');
  const [shoulder, setShoulder] = useState('39');
  const [sleeve, setSleeve] = useState('60');
  const [fittingDate, setFittingDate] = useState('2026-11-12');
  const [fittingTime, setFittingTime] = useState('17:30');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+9665');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState(locale === 'ar' ? 'الرياض' : 'Riyadh');
  const [messageLocale, setMessageLocale] = useState<Locale>(locale);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMessageLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (selectedDesign) {
      const colorParam = searchParams.get('color');
      const foundColorIdx = colorParam
        ? selectedDesign.colors.findIndex((c) => c.id === colorParam)
        : 0;
      setColorIdx(foundColorIdx >= 0 ? foundColorIdx : 0);

      const fabricParam = Number(searchParams.get('fabric'));
      setFabricIdx(
        !Number.isNaN(fabricParam) && fabricParam < selectedDesign.availableFabrics.length
          ? fabricParam
          : 0
      );
    }
  }, [selectedDesign, searchParams]);

  if (!selectedDesign) return null;

  const chosenColor = selectedDesign.colors[colorIdx] || selectedDesign.colors[0];
  const chosenFabric =
    selectedDesign.availableFabrics[fabricIdx] || selectedDesign.availableFabrics[0];

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        designId: selectedDesign.id,
        designName: selectedDesign.name,
        selectedColor: chosenColor?.name || { en: 'Signature', ar: 'اللون الأساسي' },
        selectedFabric: chosenFabric || selectedDesign.fabric,
        customizationInstructions,
        measurementMethod,
        measurements:
          measurementMethod === 'custom'
            ? { unit, length, bust, waist, hips, shoulder, sleeve }
            : undefined,
        preferredFittingDate: measurementMethod === 'in-store' ? fittingDate : undefined,
        preferredFittingTime: measurementMethod === 'in-store' ? fittingTime : undefined,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        locale: messageLocale,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not save order.');
      }

      setSavedOrder(data.order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappSummary = savedOrder
    ? buildOrderWhatsAppMessage(savedOrder, messageLocale)
    : '';
  const whatsappUrl = savedOrder
    ? buildWhatsAppUrl(settings.whatsappNumber, whatsappSummary)
    : '#';

  const handleCopySummary = async () => {
    if (!whatsappSummary) return;
    try {
      await navigator.clipboard.writeText(whatsappSummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div className="py-16 lg:py-24 bg-[#F5F0E7] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl space-y-3 pb-10 border-b border-[#171512]/10">
          <p className="text-xs text-[#9B8873]">{t.kicker}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#171512]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#171512]/75 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* POST-SAVE WHATSAPP CONFIRMATION VIEW */}
        {savedOrder ? (
          <div className="mt-10 bg-white border border-[#171512]/15 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#171512]/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9B8873]">
                  <Check className="w-4 h-4 text-[#171512]" />
                  <span>{t.confirmedTitle}</span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#171512]">
                  {savedOrder.designName[locale]}
                </h2>
              </div>

              <div className="text-start sm:text-end">
                <span className="block text-xs text-[#9B8873]">{t.orderReferenceLabel}</span>
                <span className="font-mono text-xl font-medium tabular-nums text-[#171512]">
                  {savedOrder.reference}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#171512]/80">{t.manualConfirmNotice}</p>
                <div className="flex items-center gap-1 bg-[#F5F0E7] p-1 border border-[#171512]/10">
                  <button
                    type="button"
                    onClick={() => setMessageLocale('en')}
                    className={`px-3 py-1 text-xs font-medium ${
                      messageLocale === 'en' ? 'bg-[#171512] text-[#F5F0E7]' : 'text-[#171512]/70'
                    }`}
                  >
                    English Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageLocale('ar')}
                    className={`px-3 py-1 text-xs font-medium ${
                      messageLocale === 'ar' ? 'bg-[#171512] text-[#F5F0E7]' : 'text-[#171512]/70'
                    }`}
                  >
                    ملخص بالعربية
                  </button>
                </div>
              </div>

              <pre
                dir={messageLocale === 'ar' ? 'rtl' : 'ltr'}
                className="p-5 bg-[#F5F0E7]/70 border border-[#171512]/15 text-xs sm:text-sm text-[#171512] whitespace-pre-wrap leading-relaxed font-sans"
              >
                {whatsappSummary}
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.openWhatsappBtn}</span>
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium border border-[#171512]/25 text-[#171512] hover:border-[#171512] transition-colors whitespace-nowrap"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t.copiedBtn : t.copySummaryBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setSavedOrder(null)}
                className="text-xs text-[#9B8873] hover:text-[#171512] underline underline-offset-4 px-2"
              >
                {t.newOrderBtn}
              </button>
            </div>
          </div>
        ) : (
          /* GUIDED BESPOKE ORDER FORM */
          <form onSubmit={handleSaveOrder} className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-800">
                  {error}
                </div>
              )}

              {/* STEP 1: DESIGN, COLOR & FABRIC */}
              <section className="bg-white border border-[#171512]/10 p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-2xl font-semibold text-[#171512] border-b border-[#171512]/10 pb-3">
                  {t.step1}
                </h2>

                <div>
                  <label className="block text-xs text-[#9B8873] mb-2">
                    {t.chooseDesign}
                  </label>
                  <select
                    value={selectedDesign.id}
                    onChange={(e) => setDesignId(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                  >
                    {designs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name[locale]} — {formatPriceSar(d.priceSar, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Colorway Selection */}
                <div className="space-y-2">
                  <span className="block text-xs text-[#9B8873]">{t.chooseColor}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedDesign.colors.map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColorIdx(idx)}
                        className={`inline-flex items-center gap-2.5 px-3.5 py-2 text-xs border transition-colors ${
                          colorIdx === idx
                            ? 'border-[#171512] bg-[#F5F0E7] font-medium text-[#171512]'
                            : 'border-[#171512]/15 text-[#171512]/75 hover:border-[#171512]/40'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: c.hex }}
                          className="w-3.5 h-3.5 border border-[#171512]/25 shrink-0"
                        />
                        <span>{c.name[locale]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Selection */}
                <div className="space-y-2">
                  <span className="block text-xs text-[#9B8873]">{t.chooseFabric}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDesign.availableFabrics.map((fab, idx) => (
                      <button
                        key={fab.en}
                        type="button"
                        onClick={() => setFabricIdx(idx)}
                        className={`px-3.5 py-2.5 text-start text-xs border transition-colors ${
                          fabricIdx === idx
                            ? 'border-[#171512] bg-[#F5F0E7] font-medium text-[#171512]'
                            : 'border-[#171512]/15 text-[#171512]/75 hover:border-[#171512]/40'
                        }`}
                      >
                        {fab[locale]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Instructions */}
                <div>
                  <label className="block text-xs text-[#9B8873] mb-2">
                    {t.customNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={customizationInstructions}
                    onChange={(e) => setCustomizationInstructions(e.target.value)}
                    placeholder={t.customNotesPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                  />
                </div>
              </section>

              {/* STEP 2: MEASUREMENTS OR IN-STORE FITTING */}
              <section className="bg-white border border-[#171512]/10 p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-2xl font-semibold text-[#171512] border-b border-[#171512]/10 pb-3">
                  {t.step2}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setMeasurementMethod('custom')}
                    className={`p-4 text-start border transition-colors space-y-1 ${
                      measurementMethod === 'custom'
                        ? 'border-[#171512] bg-[#F5F0E7]'
                        : 'border-[#171512]/15 hover:border-[#171512]/40'
                    }`}
                  >
                    <p className="text-sm font-medium text-[#171512]">{t.modeCustom}</p>
                    <p className="text-xs text-[#9B8873] leading-relaxed">{t.modeCustomDesc}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeasurementMethod('in-store')}
                    className={`p-4 text-start border transition-colors space-y-1 ${
                      measurementMethod === 'in-store'
                        ? 'border-[#171512] bg-[#F5F0E7]'
                        : 'border-[#171512]/15 hover:border-[#171512]/40'
                    }`}
                  >
                    <p className="text-sm font-medium text-[#171512]">{t.modeInStore}</p>
                    <p className="text-xs text-[#9B8873] leading-relaxed">{t.modeInStoreDesc}</p>
                  </button>
                </div>

                {measurementMethod === 'custom' ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#9B8873]">{t.unitLabel}</span>
                      <div className="flex items-center gap-1 bg-[#F5F0E7] p-1 border border-[#171512]/10">
                        <button
                          type="button"
                          onClick={() => setUnit('cm')}
                          className={`px-3 py-1 text-xs font-mono ${
                            unit === 'cm' ? 'bg-[#171512] text-[#F5F0E7]' : 'text-[#171512]/70'
                          }`}
                        >
                          cm
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnit('in')}
                          className={`px-3 py-1 text-xs font-mono ${
                            unit === 'in' ? 'bg-[#171512] text-[#F5F0E7]' : 'text-[#171512]/70'
                          }`}
                        >
                          in
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: t.length, val: length, set: setLength },
                        { label: t.bust, val: bust, set: setBust },
                        { label: t.waist, val: waist, set: setWaist },
                        { label: t.hips, val: hips, set: setHips },
                        { label: t.shoulder, val: shoulder, set: setShoulder },
                        { label: t.sleeve, val: sleeve, set: setSleeve },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs text-[#9B8873] mb-1">
                            {field.label} ({unit})
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={field.val}
                            onChange={(e) => field.set(e.target.value)}
                            className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.fittingDate}
                      </label>
                      <input
                        type="date"
                        dir="ltr"
                        value={fittingDate}
                        onChange={(e) => setFittingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9B8873] mb-1.5">
                        {t.fittingTime}
                      </label>
                      <select
                        value={fittingTime}
                        onChange={(e) => setFittingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                      >
                        <option value="16:30">4:30 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </section>

              {/* STEP 3: CUSTOMER DETAILS */}
              <section className="bg-white border border-[#171512]/10 p-6 sm:p-8 space-y-5">
                <h2 className="font-display text-2xl font-semibold text-[#171512] border-b border-[#171512]/10 pb-3">
                  {t.step3}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1.5">
                      {t.clientName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1.5">
                      {t.clientPhone} *
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+9665XXXXXXXX"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1.5">
                      {t.clientCity} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8873] mb-1.5">
                      {t.clientEmail}
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E7]/40 border border-[#171512]/20 focus:outline-none focus:border-[#171512]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-xs text-[#9B8873] mb-2">
                    {t.messageLangLabel}
                  </span>
                  <div className="inline-flex items-center gap-1 bg-[#F5F0E7] p-1 border border-[#171512]/10">
                    <button
                      type="button"
                      onClick={() => setMessageLocale('ar')}
                      className={`px-4 py-1.5 text-xs font-medium ${
                        messageLocale === 'ar'
                          ? 'bg-[#171512] text-[#F5F0E7]'
                          : 'text-[#171512]/70'
                      }`}
                    >
                      العربية (Arabic)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageLocale('en')}
                      className={`px-4 py-1.5 text-xs font-medium ${
                        messageLocale === 'en'
                          ? 'bg-[#171512] text-[#F5F0E7]'
                          : 'text-[#171512]/70'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* STICKY SUMMARY & SUBMIT SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 bg-white border border-[#171512]/10 p-6 space-y-5">
                <div className="aspect-[3/3.6] overflow-hidden border border-[#171512]/10">
                  <LuxuryImage
                    srcKeyOrUrl={selectedDesign.mainImageKey}
                    alt={selectedDesign.name[locale]}
                    className="w-full h-full"
                  />
                </div>

                <div className="space-y-2 border-b border-[#171512]/10 pb-4">
                  <h3 className="font-display text-2xl font-semibold text-[#171512]">
                    {selectedDesign.name[locale]}
                  </h3>
                  <p className="font-mono text-base tabular-nums text-[#171512]">
                    {formatPriceSar(selectedDesign.priceSar, locale)}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#9B8873]">{t.chooseColor}</span>
                    <span className="text-[#171512] font-medium text-end">
                      {chosenColor?.name[locale]}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#9B8873]">{t.chooseFabric}</span>
                    <span className="text-[#171512] font-medium text-end">
                      {chosenFabric?.[locale]}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#9B8873]">{UI_COPY[locale].boutique.leadTime}</span>
                    <span className="font-mono tabular-nums text-[#171512]">
                      {selectedDesign.leadTimeDays} {UI_COPY[locale].boutique.days}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium bg-[#171512] text-[#D2B477] hover:bg-[#D2B477] hover:text-[#171512] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{submitting ? t.saving : t.saveAndGenerate}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
