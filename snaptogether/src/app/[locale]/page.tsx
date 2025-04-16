'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PartyPopper } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import Button from '@/components/Button/Button';
import Navbar from '@/components/Navbar/Navbar';
import PageTransition from '@/components/PageTransition/PageTransition';
import FireworksBackground from '@/components/ConfettiBackground/FireworksBackground';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

import Logo from '../../../public/logo/snaptogether-logo-text-peach.svg';

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('home');

  const [transitioning, setTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [t('msg1'), t('msg2'), t('msg3')];
  const locale = useLocale();

  const handleNavigation = () => {
    setTransitioning(true);
    router.push(`/${locale}/form`);
  };

  useEffect(() => {
    if (pathname === '/form') {
      setTransitioning(false);
    }
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [messages.length]);

  const backgroundImages = [
    '/carousel/carousel-1.png',
    '/carousel/carousel-2.png',
    '/carousel/carousel-3.png',
  ];

  return (
    <div className="relative h-[100vh] w-screen home-background">

      <Navbar />

      {/* Carousel Background */}
      {backgroundImages.map((src, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentIndex === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: -10,
          }}
        />
      ))}
      {/* Centered content */}
      <div className="absolute flex flex-col gap-4 items-center justify-center h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[91vw]">

        <motion.div
          className="logo flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Image src={Logo} alt="SnapTogether Logo" width={150} />
        </motion.div>

        <motion.p
          key={currentIndex}
          className="font-mulish text-slate-200 text-md rounded-md m-0 text-center min-h-[32px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
        >
          {messages[currentIndex]}
        </motion.p>

        <Button
          variant="primary"
          className="!bg-[rgba(120,128,181,0.4)]"
          onClick={handleNavigation}
        >
          {t('getStarted')}
        </Button>
      </div>

      <FireworksBackground />
      <LanguageSwitcher className="absolute bottom-4 left-1/2 transform -translate-x-1/2" />
      {transitioning && <PageTransition show={transitioning} />}
    </div>
  );
};

export default Home;
