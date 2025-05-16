'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedStepCardProps {
  imageSrc: string;
  title: string;
  description: string;
  index: number;
  scrollPerSection: number;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export const AnimatedStepCard = ({
  imageSrc,
  title,
  description,
  index,
  scrollPerSection,
  wrapperRef,
}: AnimatedStepCardProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const start = index * scrollPerSection;
    const end = start + scrollPerSection;
    const content = section.querySelector('.content');
    const mask = content?.querySelector('.mask-overlay');

    gsap.fromTo(
      content,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `${start + window.innerHeight * 0.25}vh top`,
          end: `${start + scrollPerSection / 2 + window.innerHeight * 0.25}vh top`,
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      content,
      { opacity: 1, scale: 1 },
      {
        opacity: 0,
        scale: 0.8,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `${start + scrollPerSection / 2}px top`,
          end: `${end + window.innerHeight * 0.25}px top`,
          scrub: true,
        },
      }
    );
    

    if (mask) {
      gsap.fromTo(
        mask,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: `${start + scrollPerSection / 2}vh top`,
            end: `${end + window.innerHeight * 0.25}vh top`,
            scrub: true,
          },
        }
      );
    }
  }, [scrollPerSection, index, wrapperRef]);

  return (
    <section
      ref={sectionRef}
      className="fade-section"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <section className="content w-1/2 relative overflow-hidden flex flex-col justify-center items-center gap-10">
        <Image src={imageSrc} alt="Step Image" width={500} height={100} />
        <h1 className="text-white text-2xl text-center relative z-10">{title}</h1>
        <p className="text-white text-center relative z-10">{description}</p>
        <div
          className="mask-overlay absolute left-0 bottom-0 w-full h-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.8) 40%, rgba(15,23,42,0.4) 70%, rgba(15,23,42,0) 100%)',
          }}
        />
      </section>
    </section>
  );
};
