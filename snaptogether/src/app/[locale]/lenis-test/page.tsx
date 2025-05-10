'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VI from '../../../../public/vi.webp';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function LenisTestPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sectionsCount = 3;
  const scrollPerSection = window.innerHeight * 2;
  const totalScrollPx = sectionsCount * scrollPerSection;

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray('.fade-section');

    sections.forEach((section: any, index) => {
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
            start: `${start + window.innerHeight * 0.25}vh top`, // delayed entrance
            end: `${start + scrollPerSection / 2 + window.innerHeight * 0.25}vh top`,
            scrub: true,
          },
        }
      );
      

      gsap.to(content, {
        opacity: 0,
        scale: 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `${start + scrollPerSection / 2}vh top`,
          end: `${end}vh top`,
          scrub: true,
        },
      });
      

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
              end: `${end + window.innerHeight * 0.25}vh top`, // 👈 add 25% more scroll range as delay
              scrub: true,
            },
          }
        );
        
      }
    });
  }, [scrollPerSection]);

  return (
    <div style={{ height: `${totalScrollPx}px`, position: 'relative' }} ref={wrapperRef}>
      <div
        className="sections-wrapper"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: sectionsCount }, (_, i) => (
          <section
            key={i}
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
            <Image src={VI} alt="VI" width={500} height={100} />
              <h1 className="text-white text-2xl text-center relative z-10">
                
                Jason and Lucia have always known the deck is stacked against them. But when an
                easy score goes wrong, they find themselves on the darkest side of the sunniest
                place in America, in the middle of a criminal conspiracy stretching across the
                state of Leonida — forced to rely on each other more than ever if they want to
                make it out alive. {i + 1}
              </h1>
              <div className="mask-overlay absolute left-0 bottom-0 w-full h-0 z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.8) 40%, rgba(15,23,42,0.4) 70%, rgba(15,23,42,0) 100%)',
                }}
              />
            </section>
          </section>
        ))}
      </div>
    </div>
  );
}
