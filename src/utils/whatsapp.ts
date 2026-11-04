import { Locale, Order } from '../types/boutique';

export function cleanWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('05') && digits.length === 10) return `966${digits.slice(1)}`;
  return digits || '966500000000';
}

export function buildOrderWhatsAppMessage(order: Order, messageLocale: Locale): string {
  if (messageLocale === 'ar') {
    const measurementBlock =
      order.measurementMethod === 'in-store'
        ? `طريقة القياس: زيارة البوتيك في الرياض\nالتاريخ المفضل: ${order.preferredFittingDate || 'يحدد لاحقاً'} (${order.preferredFittingTime || 'مساءً'})`
        : `طريقة القياس: مقاسات خاصة (${order.measurements?.unit === 'in' ? 'إنش' : 'سم'})\n- الطول: ${order.measurements?.length || '-'} | الصدر: ${order.measurements?.bust || '-'} | الخصر: ${order.measurements?.waist || '-'}\n- الأرداف: ${order.measurements?.hips || '-'} | الكتف: ${order.measurements?.shoulder || '-'} | الكم: ${order.measurements?.sleeve || '-'}`;

    return [
      `مرحباً خياط عبدالعزيز نايف النسائي (متجر ١٢٨) ✨`,
      `أرغب بتأكيد طلب تفصيل خاص عبر الموقع الإلكتروني:`,
      ``,
      `الرقم المرجعي: ${order.reference}`,
      `التصميم: ${order.designName.ar}`,
      `اللون المختار: ${order.selectedColor.ar}`,
      `نوع القماش: ${order.selectedFabric.ar}`,
      order.estimatedPriceSar ? `القيمة التقديرية: ${order.estimatedPriceSar.toLocaleString('en-US')} ر.س` : '',
      ``,
      measurementBlock,
      order.customizationInstructions ? `\nملاحظات التفصيل:\n${order.customizationInstructions}` : '',
      ``,
      `بيانات العميلة:`,
      `الاسم: ${order.customerName}`,
      `الجوال: ${order.customerPhone}`,
      `المدينة: ${order.customerCity}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  const measurementBlock =
    order.measurementMethod === 'in-store'
      ? `Measurements: Private In-Boutique Fitting (Riyadh Store #128)\nPreferred Slot: ${order.preferredFittingDate || 'TBD'} (${order.preferredFittingTime || 'Evening'})`
      : `Measurements (${order.measurements?.unit || 'cm'}):\n- Length: ${order.measurements?.length || '-'} | Bust: ${order.measurements?.bust || '-'} | Waist: ${order.measurements?.waist || '-'}\n- Hips: ${order.measurements?.hips || '-'} | Shoulder: ${order.measurements?.shoulder || '-'} | Sleeve: ${order.measurements?.sleeve || '-'}`;

  return [
    `Greetings Abdulaziz Nayef Ladies Tailor (Store #128),`,
    `I would like to confirm my bespoke tailoring commission:`,
    ``,
    `Order Reference: ${order.reference}`,
    `Design: ${order.designName.en}`,
    `Colorway: ${order.selectedColor.en}`,
    `Fabric: ${order.selectedFabric.en}`,
    order.estimatedPriceSar ? `Estimated Price: SAR ${order.estimatedPriceSar.toLocaleString('en-US')}` : '',
    ``,
    measurementBlock,
    order.customizationInstructions ? `\nCustomization Notes:\n${order.customizationInstructions}` : '',
    ``,
    `Client Details:`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `City: ${order.customerCity}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digits = cleanWhatsAppDigits(whatsappNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
