"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "../footer/page";
import { faqItems } from "@/utils/faqItems";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Mockup from "@/../public/logo/mockup.png";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeInUpItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations(); // ✅ Use full root to access all keys (including faq)
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="relative h-[100vh] w-full">
          <Image src={Mockup} alt="Mockup" width={400} height={400} className="object-cover absolute h-full w-full" />
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
                {t("helpPage.title")}
              </motion.h1>
            </motion.div>
        </div>

      <motion.div
        ref={containerRef}
        className="container mx-auto max-w-2xl px-4 py-12 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              variants={fadeInUpItem}
              className="border border-white/10 rounded-xl bg-white/10 backdrop-blur"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left px-4 py-4 font-semibold text-white flex justify-between items-center"
              >
                {t(item.questionKey)}
                <span
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </span>
              </button>

              <div
                className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 py-2" : "max-h-0"
                }`}
              >
                <p className="text-white/90 text-sm">{t(item.answerKey)}</p>
              </div>
            </motion.div>
          );
        })}

        <div className="text-center pt-10">
          <p className="text-white/80 text-md font-medium">
            {t("helpPage.contactPrompt")}
          </p>
          <a
            href="mailto:snaptogether25@gmail.com"
            className="text-blue-400 underline"
          >
            {t("helpPage.contactEmail")}
          </a>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
