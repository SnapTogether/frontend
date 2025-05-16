import { cardData } from '@/utils/cardData';
import { AnimatedStepCard } from '../AnimatedStepCard/AnimatedStepCard';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export default function AnimatedStepsWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('aboutPage');
  const steps = t.raw('guidanceSteps');
  const scrollPerSection = window.innerHeight * 2;

  return (
    <div style={{ height: `${cardData.length * scrollPerSection}px`, position: 'relative' }} ref={wrapperRef}>
      <div
        className="sections-wrapper"
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        {cardData.map((card, i) => (
          <AnimatedStepCard
            key={i}
            imageSrc={card.imageSrc}
            title={steps[i]?.title || ''}
            description={steps[i]?.description || ''}
            index={i}
            scrollPerSection={scrollPerSection}
            wrapperRef={wrapperRef}
          />
        ))}
      </div>
    </div>
  );
}
