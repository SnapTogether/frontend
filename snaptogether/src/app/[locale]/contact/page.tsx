'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '../footer/page';
import Image from 'next/image';
import Contact from '@/../public/contact.jpg';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contactPage');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="relative h-[100vh] w-full">
          <Image src={Contact} alt="Mockup" width={400} height={400} className="object-cover absolute h-full w-full" />
          <motion.div
              className="absolute -translate-x-1/2 bottom-10 flex flex-col gap-5 text-left w-full container px-5 md:px-0 left-1/2"
            >
              <motion.h1
                className="text-3xl font-bold text-white w-full uppercase"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0,
                }}
              >
                {t("title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.2, // 👈 This creates the stagger effect
                }}
              >
                {t('description')}
              </motion.p>
            </motion.div>
        </div>

      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8 text-white text-center pb-[150px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className='flex flex-col gap-2'
        >
          <h2 className="text-xl font-semibold text-white">{t('emailLabel')}</h2>
          <a
            href="mailto:snaptogether25@gmail.com"
            className="text-blue-400 underline break-all"
          >
            snaptogether25@gmail.com
          </a>
          <a
            href="tel:+38971863999"
            className="text-blue-400 underline break-all"
            >
            +38971863999
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>{t('supportPrompt')}</p>
          <a
            href="/help"
            className="mt-2 inline-block text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition"
          >
            {t('goToFaq')}
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
