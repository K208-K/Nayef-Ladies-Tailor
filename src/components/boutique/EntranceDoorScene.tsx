import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, DoorOpen, Sparkles } from 'lucide-react';
import { Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { resolveAssetUrl } from '../../data/assets';

interface EntranceDoorSceneProps {
  locale: Locale;
  onDoorsEntered: () => void;
  onStepBackOutside: () => void;
}

export const EntranceDoorScene: React.FC<EntranceDoorSceneProps> = ({
  locale,
  onDoorsEntered,
  onStepBackOutside,
}) => {
  const [doorAngle, setDoorAngle] = useState<number>(0); // 0 to 78 degrees
  const [isAutoEntering, setIsAutoEntering] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const t = UI_COPY[locale].boutique;
  const storefrontImg = resolveAssetUrl('storefront_exterior');
  const interiorImg = resolveAssetUrl('interior_showroom_left');

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const triggerAutoSwingAndEnter = () => {
    if (isAutoEntering) return;
    setIsAutoEntering(true);
    setDoorAngle(78);
    timerRef.current = window.setTimeout(() => {
      onDoorsEntered();
    }, 1300);
  };

  // Normalized progress 0..1 for synchronized camera dolly zoom & interior reveal
  const openRatio = Math.min(1, Math.max(0, doorAngle / 78));
  const cameraScale = 1 + openRatio * 0.28;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#12100E] select-none flex items-center justify-center">
      {/* Ambient Blurred Architectural Aura */}
      <img
        src={storefrontImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#12100E]/70 to-[#12100E]" />

      {/* Top Banner Notice */}
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-[#171512]/92 border border-[#D2B477]/40 text-[#F5F0E7] text-xs flex items-center gap-2 max-w-[92vw] shadow-xl"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D2B477] shrink-0" />
        <span className="truncate">
          {locale === 'ar'
            ? 'مدخل متجر ١٢٨ — اسحبي المقبض أو انقري على الأبواب للدخول'
            : 'Store #128 Entrance — Slide the handle or tap doors to step inside'}
        </span>
      </div>

      {/* Aspect-Ratio-Preserving 1:1 Entrance Canvas */}
      <div className="relative h-full aspect-square max-w-full max-h-full mx-auto flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.85)] border-x sm:border border-[#D2B477]/30">
        {/* Synchronized Camera Dolly Container */}
        <div
          style={{
            transform: `scale(${cameraScale})`,
            transition: isAutoEntering
              ? 'transform 1300ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'transform 120ms ease-out',
          }}
          className="relative w-full h-full will-change-transform"
        >
          {/* Background Layer: Authentic Storefront Framed Over Entrance */}
          <img
            src={storefrontImg}
            alt="خياط عبدالعزيز نايف — خياط نسائي | Abdulaziz Nayef Ladies Tailor Entrance"
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Central Threshold Portal Opening into the Atelier Salon */}
          <div className="absolute left-1/2 top-[48.5%] -translate-x-1/2 w-[34.5%] h-[48%] boutique-perspective">
            {/* Interior Showroom Revealed Directly Behind Open Doors */}
            <div className="absolute inset-0 overflow-hidden border border-[#D2B477]/70 shadow-inner bg-[#171512]">
              <img
                src={interiorImg}
                alt="Interior Marble Showroom View"
                referrerPolicy="no-referrer"
                draggable={false}
                style={{
                  transform: `scale(${1.08 + openRatio * 0.18})`,
                  opacity: 0.5 + openRatio * 0.5,
                  transition: isAutoEntering ? 'all 1200ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                }}
                className="w-full h-full object-cover object-center"
              />
              {/* Warm Golden Interior Chandelier Glow */}
              <div
                style={{ opacity: 0.35 - openRatio * 0.25 }}
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#D2B477]/25 via-transparent to-[#171512]/45"
              />
            </div>

            {/* 3D Hinged Double Glass Doors Assembly */}
            <div
              dir="ltr"
              onClick={triggerAutoSwingAndEnter}
              role="button"
              tabIndex={0}
              aria-label={t.openDoorsBtn}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerAutoSwingAndEnter();
                }
              }}
              className="relative w-full h-full flex preserve-3d cursor-pointer"
            >
              {/* LEFT SWINGING GLASS DOOR (Hinged at outer left) */}
              <div
                style={{
                  transformOrigin: 'left center',
                  transform: `rotateY(${doorAngle}deg)`,
                  transition: isAutoEntering
                    ? 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'transform 90ms ease-out',
                }}
                className="relative w-1/2 h-full border-[2.5px] border-[#C9AA6B] bg-[#F5F0E7]/[0.08] shadow-[inset_0_0_24px_rgba(210,180,119,0.22)] overflow-hidden"
              >
                {/* Top & Bottom Champagne Gold Hydraulic Hinges */}
                <span className="absolute top-2 left-0 w-3.5 h-2.5 bg-gradient-to-r from-[#9B8873] via-[#E5CC94] to-[#B59557] border-b border-[#171512]/40" />
                <span className="absolute bottom-2 left-0 w-3.5 h-2.5 bg-gradient-to-r from-[#9B8873] via-[#E5CC94] to-[#B59557] border-t border-[#171512]/40" />

                {/* Sweeping Specular Glass Reflection */}
                <div
                  style={{
                    transform: `translateX(${-20 + openRatio * 55}%) skewX(-18deg)`,
                  }}
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-3/4 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />

                {/* Inner Gold Bevel Trim */}
                <div className="pointer-events-none absolute inset-1.5 border border-[#D2B477]/35" />

                {/* Sculpted Vertical Champagne Gold Handle */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="w-2 h-1 bg-[#B59557] mb-0.5" />
                  <div className="w-1.5 sm:w-2 h-24 sm:h-32 rounded-full bg-gradient-to-r from-[#8D7548] via-[#F0DCAD] to-[#B59557] shadow-[2px_4px_8px_rgba(0,0,0,0.65)] border border-[#F5F0E7]/40" />
                  <span className="w-2 h-1 bg-[#B59557] mt-0.5" />
                </div>
              </div>

              {/* RIGHT SWINGING GLASS DOOR (Hinged at outer right) */}
              <div
                style={{
                  transformOrigin: 'right center',
                  transform: `rotateY(${-doorAngle}deg)`,
                  transition: isAutoEntering
                    ? 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'transform 90ms ease-out',
                }}
                className="relative w-1/2 h-full border-[2.5px] border-[#C9AA6B] bg-[#F5F0E7]/[0.08] shadow-[inset_0_0_24px_rgba(210,180,119,0.22)] overflow-hidden"
              >
                {/* Top & Bottom Champagne Gold Hydraulic Hinges */}
                <span className="absolute top-2 right-0 w-3.5 h-2.5 bg-gradient-to-l from-[#9B8873] via-[#E5CC94] to-[#B59557] border-b border-[#171512]/40" />
                <span className="absolute bottom-2 right-0 w-3.5 h-2.5 bg-gradient-to-l from-[#9B8873] via-[#E5CC94] to-[#B59557] border-t border-[#171512]/40" />

                {/* Sweeping Specular Glass Reflection */}
                <div
                  style={{
                    transform: `translateX(${20 - openRatio * 55}%) skewX(-18deg)`,
                  }}
                  className="pointer-events-none absolute inset-y-0 -right-1/3 w-3/4 bg-gradient-to-r from-transparent via-white/22 to-transparent"
                />

                {/* Inner Gold Bevel Trim */}
                <div className="pointer-events-none absolute inset-1.5 border border-[#D2B477]/35" />

                {/* Sculpted Vertical Champagne Gold Handle */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="w-2 h-1 bg-[#B59557] mb-0.5" />
                  <div className="w-1.5 sm:w-2 h-24 sm:h-32 rounded-full bg-gradient-to-l from-[#8D7548] via-[#F0DCAD] to-[#B59557] shadow-[-2px_4px_8px_rgba(0,0,0,0.65)] border border-[#F5F0E7]/40" />
                  <span className="w-2 h-1 bg-[#B59557] mt-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Contrast Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512]/70 via-transparent to-[#171512]/30" />
        </div>
      </div>

      {/* Threshold Interactive Controls Overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md bg-[#171512]/95 border border-[#D2B477]/45 px-5 py-4 text-[#F5F0E7] shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <label htmlFor="door-swing-slider" className="text-xs text-[#D2B477] font-medium">
            {t.doorSliderLabel}
          </label>
          <span className="font-mono text-xs tabular-nums text-[#F5F0E7]/85">
            {Math.round(doorAngle)}°
          </span>
        </div>

        <input
          id="door-swing-slider"
          type="range"
          min={0}
          max={78}
          value={doorAngle}
          disabled={isAutoEntering}
          onChange={(e) => setDoorAngle(Number(e.target.value))}
          className="w-full accent-[#D2B477] h-1.5 bg-[#F5F0E7]/20 cursor-pointer mb-3.5"
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onStepBackOutside}
            className="px-3.5 py-2 text-xs text-[#F5F0E7]/80 hover:text-[#D2B477] border border-[#F5F0E7]/20 hover:border-[#D2B477]/50 transition-colors whitespace-nowrap"
          >
            {t.returnExterior}
          </button>

          {doorAngle >= 45 ? (
            <button
              type="button"
              onClick={onDoorsEntered}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-[#D2B477] text-[#171512] hover:bg-[#e3c891] transition-colors whitespace-nowrap shadow-md"
            >
              <span>{t.stepInsideBtn}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerAutoSwingAndEnter}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-[#D2B477] text-[#171512] hover:bg-[#e3c891] transition-colors whitespace-nowrap shadow-md"
            >
              <DoorOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{t.openDoorsBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
