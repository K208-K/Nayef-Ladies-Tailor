import React, { useRef, useState, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { BoutiqueHotspot, Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { resolveAssetUrl } from '../../data/assets';
import { HotspotPin } from './HotspotPin';

interface InteriorShowroomSceneProps {
  locale: Locale;
  activeWing: 'interior-left' | 'interior-right';
  onWingChange: (wing: 'interior-left' | 'interior-right') => void;
  leftHotspots: BoutiqueHotspot[];
  rightHotspots: BoutiqueHotspot[];
  showHotspots: boolean;
  selectedHotspot: BoutiqueHotspot | null;
  onSelectHotspot: (hotspot: BoutiqueHotspot) => void;
}

export const InteriorShowroomScene: React.FC<InteriorShowroomSceneProps> = ({
  locale,
  activeWing,
  onWingChange,
  leftHotspots,
  rightHotspots,
  showHotspots,
  selectedHotspot,
  onSelectHotspot,
}) => {
  // panProgress: 0 = Full Left Showroom (IMAGE 1), 100 = Full Right Showroom (IMAGE 2)
  const [panProgress, setPanProgress] = useState<number>(
    activeWing === 'interior-right' ? 100 : 0
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; startPan: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const t = UI_COPY[locale].boutique;
  const leftImg = resolveAssetUrl('interior_showroom_left');
  const rightImg = resolveAssetUrl('interior_showroom_right');

  // Sync when dock switches wing explicitly
  useEffect(() => {
    setPanProgress(activeWing === 'interior-right' ? 100 : 0);
  }, [activeWing]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      startPan: panProgress,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 1000;
    const deltaX = e.clientX - dragStartRef.current.clientX;
    // Dragging left moves camera right (increases panProgress)
    const deltaPercent = (-deltaX / width) * 115;
    const next = Math.max(0, Math.min(100, dragStartRef.current.startPan + deltaPercent));
    setPanProgress(next);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    if (panProgress >= 50 && activeWing !== 'interior-right') {
      onWingChange('interior-right');
    } else if (panProgress < 50 && activeWing !== 'interior-left') {
      onWingChange('interior-left');
    }
  };

  // Panoramic ribbon is 200% wide (Left Wing 50% + Right Wing 50%, joined by a champagne-gold marble column divider)
  const translateXPercent = -(panProgress * 0.5);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full overflow-hidden bg-[#171512] select-none touch-pan-y ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Top Subtle Drag Guidance Banner */}
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-[#171512]/80 border border-[#D2B477]/35 text-[#F5F0E7]/90 text-xs flex items-center gap-2 max-w-[92vw]"
      >
        <MoveHorizontal className="w-3.5 h-3.5 text-[#D2B477] shrink-0" />
        <span className="truncate">{t.dragHint}</span>
      </div>

      {/* Coordinated 2-Wing Panoramic Ribbon (IMAGE 1 Left + Architectural Marble Column Seam + IMAGE 2 Right) */}
      <div
        style={{
          width: '200%',
          transform: `translate3d(${translateXPercent}%, 0, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="relative h-full flex will-change-transform"
      >
        {/* SCENE 4: LEFT-SIDE FASHION DISPLAY (IMAGE 1) */}
        <div className="relative w-1/2 h-full shrink-0 overflow-hidden">
          <img
            src={leftImg}
            alt="Amani Couture Left Showroom — Illuminated Arched Abaya Displays"
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512]/55 via-transparent to-[#171512]/20" />

          {showHotspots &&
            leftHotspots.map((hs) => (
              <HotspotPin
                key={hs.id}
                hotspot={hs}
                locale={locale}
                isSelected={selectedHotspot?.id === hs.id}
                onSelect={onSelectHotspot}
              />
            ))}
        </div>

        {/* Architectural Champagne-Gold Pilaster Seam Between Left & Right Showroom Views */}
        <div className="pointer-events-none relative z-10 w-3 -mx-1.5 h-full bg-gradient-to-r from-[#8E7546] via-[#E8D29F] to-[#8E7546] shadow-[0_0_30px_rgba(23,21,18,0.8)]" />

        {/* SCENE 5: RIGHT-SIDE FASHION DISPLAY (IMAGE 2) */}
        <div className="relative w-1/2 h-full shrink-0 overflow-hidden">
          <img
            src={rightImg}
            alt="Amani Couture Right Showroom — Emerald, Navy, Bridal & Burgundy Collections"
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512]/55 via-transparent to-[#171512]/20" />

          {showHotspots &&
            rightHotspots.map((hs) => (
              <HotspotPin
                key={hs.id}
                hotspot={hs}
                locale={locale}
                isSelected={selectedHotspot?.id === hs.id}
                onSelect={onSelectHotspot}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
