import React, { useState } from 'react';
import { DoorOpen, ZoomIn, RotateCcw, Sparkles } from 'lucide-react';
import { BoutiqueHotspot, Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { resolveAssetUrl } from '../../data/assets';
import { HotspotPin } from './HotspotPin';

interface ExteriorSceneProps {
  locale: Locale;
  hotspots: BoutiqueHotspot[];
  showHotspots: boolean;
  selectedHotspot: BoutiqueHotspot | null;
  onSelectHotspot: (hotspot: BoutiqueHotspot) => void;
  onEnterThreshold: () => void;
}

type CameraPreset = 'full' | 'signboard' | 'marquee' | 'interior' | 'west-window' | 'east-window';

interface PresetConfig {
  id: CameraPreset;
  labelEn: string;
  labelAr: string;
  scale: number;
  xPercent: number; // translation in % of canvas
  yPercent: number;
}

const CAMERA_PRESETS: PresetConfig[] = [
  { id: 'full', labelEn: 'Full Facade', labelAr: 'الواجهة كاملة', scale: 1, xPercent: 0, yPercent: 0 },
  { id: 'signboard', labelEn: 'Signboard & Emblems', labelAr: 'اللوحة الملكية والشعار', scale: 1.95, xPercent: 0, yPercent: 28 },
  { id: 'marquee', labelEn: '5 Craft Disciplines', labelAr: 'الأقسام الخمسة', scale: 1.75, xPercent: 0, yPercent: 11 },
  { id: 'interior', labelEn: 'Atelier Salon', labelAr: 'داخل الصالة والشعار', scale: 2.3, xPercent: 0, yPercent: -27 },
  { id: 'west-window', labelEn: 'Evening Window', labelAr: 'واجهة السهرة', scale: 2.05, xPercent: 30, yPercent: -20 },
  { id: 'east-window', labelEn: 'Bridal Window', labelAr: 'واجهة العرائس', scale: 2.05, xPercent: -30, yPercent: -20 },
];

export const ExteriorScene: React.FC<ExteriorSceneProps> = ({
  locale,
  hotspots,
  showHotspots,
  selectedHotspot,
  onSelectHotspot,
  onEnterThreshold,
}) => {
  const [activePreset, setActivePreset] = useState<CameraPreset>('full');
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const t = UI_COPY[locale].boutique;
  const exteriorSrc = resolveAssetUrl('storefront_exterior');

  const currentPreset = CAMERA_PRESETS.find((p) => p.id === activePreset) || CAMERA_PRESETS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply subtle mouse parallax when viewing full facade to keep zoomed view stable
    if (activePreset !== 'full') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: -normX * 8, y: -normY * 5 });
  };

  const handleResetParallax = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#12100E] select-none flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleResetParallax}
    >
      {/* Ambient Blurred Architectural Aura (Fills widescreen black bars with authentic golden warmth) */}
      <img
        src={exteriorSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#12100E]/70 to-[#12100E]" />

      {/* Top Camera Focal Selector Bar */}
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-1.5 p-1 bg-[#171512]/92 border border-[#D2B477]/40 shadow-2xl max-w-[96vw] overflow-x-auto scrollbar-none"
      >
        <span className="hidden md:inline-flex items-center gap-1 px-2 text-[10px] uppercase tracking-wider text-[#D2B477]/90 font-medium whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-[#D2B477]" />
          <span>{locale === 'ar' ? 'زووم الكاميرا' : 'Camera Focus'}</span>
        </span>

        {CAMERA_PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset.id)}
              className={`px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#D2B477] text-[#171512] shadow-sm font-semibold'
                  : 'text-[#F5F0E7]/80 hover:text-[#D2B477] hover:bg-[#F5F0E7]/5'
              }`}
            >
              {locale === 'ar' ? preset.labelAr : preset.labelEn}
            </button>
          );
        })}

        {activePreset !== 'full' && (
          <button
            type="button"
            onClick={() => setActivePreset('full')}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-[#D2B477] hover:text-[#F5F0E7] border-s border-[#D2B477]/30 transition-colors whitespace-nowrap"
            title={locale === 'ar' ? 'إعادة ضبط الكاميرا' : 'Reset Camera'}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{locale === 'ar' ? 'الواجهة' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Aspect-Ratio-Preserving 1:1 Architectural Canvas */}
      <div className="relative h-full aspect-square max-w-full max-h-full mx-auto flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.85)] border-x sm:border border-[#D2B477]/30">
        {/* Animated Camera Dolly & Pan Container */}
        <div
          style={{
            transform: `translate3d(calc(${currentPreset.xPercent}% + ${parallax.x}px), calc(${currentPreset.yPercent}% + ${parallax.y}px), 0) scale(${currentPreset.scale})`,
            transformOrigin: '50% 50%',
          }}
          className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        >
          {/* Authentic Storefront Image */}
          <img
            src={exteriorSrc}
            alt="خياط عبدالعزيز نايف — خياط نسائي | Abdulaziz Nayef Ladies Tailor Storefront #128"
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Measured Contrast Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512]/60 via-transparent to-[#171512]/30" />

          {/* Precision Interactive Hotspots */}
          {showHotspots &&
            hotspots.map((hs) => (
              <HotspotPin
                key={hs.id}
                hotspot={hs}
                locale={locale}
                isSelected={selectedHotspot?.id === hs.id}
                onSelect={onSelectHotspot}
              />
            ))}

          {/* Central Glass Entrance Threshold Trigger (Directly above "Welcome" Mat) */}
          {(activePreset === 'full' || activePreset === 'interior') && (
            <div className="absolute left-1/2 top-[76.5%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <button
                type="button"
                onClick={onEnterThreshold}
                className="group relative flex flex-col items-center gap-1 sm:gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#171512]/92 hover:bg-[#171512] border-2 border-[#D2B477] text-[#F5F0E7] shadow-[0_4px_24px_rgba(0,0,0,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(210,180,119,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B477]"
              >
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-[#D2B477] whitespace-nowrap">
                  <DoorOpen className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{t.enterBoutiqueBtn}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#F5F0E7]/80 whitespace-nowrap">
                  {t.approachThreshold}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
