import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoutiqueHotspot, BoutiqueSceneId, Locale } from '../../types/boutique';
import { UI_COPY } from '../../i18n/translations';
import { useStore } from '../../context/StoreContext';
import { ExteriorScene } from './ExteriorScene';
import { EntranceDoorScene } from './EntranceDoorScene';
import { InteriorShowroomScene } from './InteriorShowroomScene';
import { HotspotDrawer } from './HotspotDrawer';

interface VirtualBoutiqueExperienceProps {
  locale: Locale;
  initialScene?: BoutiqueSceneId;
  embedded?: boolean;
}

export const VirtualBoutiqueExperience: React.FC<VirtualBoutiqueExperienceProps> = ({
  locale,
  initialScene = 'exterior',
  embedded = false,
}) => {
  const { hotspots, designs, categories } = useStore();
  const [scene, setScene] = useState<BoutiqueSceneId>(initialScene);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<BoutiqueHotspot | null>(null);

  const t = UI_COPY[locale].boutique;

  // Keyboard 'H' shortcut for Zen Mode Dock Toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setDockCollapsed((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSelectedHotspot(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeHotspots = hotspots.filter((h) => h.active);
  const exteriorHotspots = activeHotspots.filter((h) => h.sceneId === 'exterior');
  const leftHotspots = activeHotspots.filter((h) => h.sceneId === 'interior-left');
  const rightHotspots = activeHotspots.filter((h) => h.sceneId === 'interior-right');

  const selectedDesign = selectedHotspot
    ? designs.find((d) => d.id === selectedHotspot.designId)
    : undefined;
  const selectedCategory = selectedDesign
    ? categories.find((c) => c.slug === selectedDesign.categorySlug)
    : undefined;

  const switchScene = (next: BoutiqueSceneId) => {
    setSelectedHotspot(null);
    setScene(next);
  };

  const sceneTabs: { id: BoutiqueSceneId; label: string }[] = [
    { id: 'exterior', label: t.sceneExterior },
    { id: 'entrance', label: t.sceneEntrance },
    { id: 'interior-left', label: t.sceneLeftWing },
    { id: 'interior-right', label: t.sceneRightWing },
  ];

  return (
    <div
      className={`relative w-full bg-[#171512] overflow-hidden border-y border-[#D2B477]/25 ${
        embedded ? 'h-[580px] sm:h-[660px]' : 'h-[calc(100vh-4rem)] min-h-[580px]'
      }`}
    >
      {/* Active Spatial Boutique Scene */}
      {scene === 'exterior' && (
        <ExteriorScene
          locale={locale}
          hotspots={exteriorHotspots}
          showHotspots={showHotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          onEnterThreshold={() => switchScene('entrance')}
        />
      )}

      {scene === 'entrance' && (
        <EntranceDoorScene
          locale={locale}
          onDoorsEntered={() => switchScene('interior-left')}
          onStepBackOutside={() => switchScene('exterior')}
        />
      )}

      {(scene === 'interior-left' || scene === 'interior-right') && (
        <InteriorShowroomScene
          locale={locale}
          activeWing={scene}
          onWingChange={(wing) => setScene(wing)}
          leftHotspots={leftHotspots}
          rightHotspots={rightHotspots}
          showHotspots={showHotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
        />
      )}

      {/* Couture Piece Slide-Over Inspector */}
      <HotspotDrawer
        hotspot={selectedHotspot}
        design={selectedDesign}
        category={selectedCategory}
        locale={locale}
        onClose={() => setSelectedHotspot(null)}
      />

      {/* Unified Collapsible Bottom Control Dock (Zero Central Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center max-w-[95vw]">
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] bg-[#171512]/90 text-[#D2B477] border border-b-0 border-[#D2B477]/35 hover:text-[#F5F0E7] transition-colors whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{t.showControls}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{t.hideControls}</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-[#171512]/95 border border-[#D2B477]/40 shadow-2xl">
            {sceneTabs.map((tab) => {
              const active = scene === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchScene(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#D2B477] text-[#171512]'
                      : 'text-[#F5F0E7]/80 hover:text-[#D2B477] hover:bg-[#F5F0E7]/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {scene !== 'entrance' && (
              <button
                type="button"
                onClick={() => setShowHotspots((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F5F0E7]/80 hover:text-[#D2B477] border-s border-[#F5F0E7]/15 whitespace-nowrap shrink-0"
              >
                {showHotspots ? (
                  <Eye className="w-3.5 h-3.5 text-[#D2B477]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#9B8873]" />
                )}
                <span>{t.hotspotsToggle}</span>
              </button>
            )}

            {embedded && (
              <Link
                to={`/${locale}/virtual-boutique`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#D2B477] hover:text-[#F5F0E7] border-s border-[#F5F0E7]/15 whitespace-nowrap shrink-0"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{UI_COPY[locale].home.openFullShowroom}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
