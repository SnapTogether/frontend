"use client";

import { Card } from "@/components/Card/Card";
import Navbar from "@/components/Navbar/Navbar";
import { cardData } from "@/utils/cardData";
import Image, { StaticImageData } from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

// Images
import CircleImage from "../../../../public/about/about-avatar.png";
import CircleImage2 from "../../../../public/about/scan-qr.png";
import CircleImage3 from "../../../../public/about/about-avatar3.png";
import Mockup from "../../../../public/logo/mockup-gold.png";
import Footer from "../footer/page";


type Section = {
    title: string;
    description: string;
  };
  
// Animation config
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const fadeInUpItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const AboutSection = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: StaticImageData;
}) => (
  <motion.div
    variants={fadeInUpItem}
    className="flex flex-col items-center justify-center gap-4 text-center"
  >
    <div>
      <h2 className="text-lg text-white font-bold mb-1">{title}</h2>
      <p className="text-md text-white">{description}</p>
    </div>
    <Image src={image} alt={title} width={150} height={150} />
  </motion.div>
);

export default function AboutPage() {
  const t = useTranslations("aboutPage");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const images = [CircleImage, CircleImage2, CircleImage3, CircleImage]; // reuse for now
  const steps = t.raw("guidanceSteps");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="mx-auto text-center flex flex-col items-center justify-center gap-9 pb-8">
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
                {t("subtitle")}
              </motion.p>
            </motion.div>
        </div>
        <motion.div
          ref={containerRef}
          className="about-text flex flex-col items-center justify-center gap-12 text-white text-center px-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
        {(t.raw("sections") as Section[]).map((section, index) => (
        <AboutSection
            key={index}
            title={section.title}
            description={section.description}
            image={images[index]}
        />
        ))}
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 py-8 bg-[#141c25]">
        <h1 className="text-3xl font-bold text-white text-center">
          {t("guidanceTitle")}
        </h1>
        <div className="flex flex-wrap gap-6 justify-center items-center pb-[120px]">
        {cardData.map((card, idx) => (
        <motion.div
            key={idx}
            className="mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: idx * 0.2, // stagger per index
            }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <Card
            imageSrc={card.imageSrc}
            badgeText={card.badgeText}
            title={steps[idx]?.title || ""}
            description={steps[idx]?.description || ""}
            />
        </motion.div>
        ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
}
