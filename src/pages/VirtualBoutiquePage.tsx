import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { BoutiqueSceneId, Locale } from '../types/boutique';
import { VirtualBoutiqueExperience } from '../components/boutique/VirtualBoutiqueExperience';

interface VirtualBoutiquePageProps {
  locale: Locale;
}

export const VirtualBoutiquePage: React.FC<VirtualBoutiquePageProps> = ({ locale }) => {
  const [searchParams] = useSearchParams();
  const sceneParam = searchParams.get('scene') as BoutiqueSceneId | null;
  const validScene: BoutiqueSceneId =
    sceneParam === 'entrance' ||
    sceneParam === 'interior-left' ||
    sceneParam === 'interior-right'
      ? sceneParam
      : 'exterior';

  return (
    <div className="bg-[#171512]">
      <VirtualBoutiqueExperience locale={locale} initialScene={validScene} />
    </div>
  );
};
