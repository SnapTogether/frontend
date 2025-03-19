"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import TemplateRequestModal from "../TemplateRequestModal/TemplateRequestModal";
import Button from "../Button/Button";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations("template");

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
      <h3 className="text-white text-2xl md:text-2xl font-semibold flex flex-row items-center justify-center gap-3">{t("title")}</h3>

      {/* Image Wrapper */}
      <div className="relative h-[400px] w-[100vw] flex items-center justify-center rounded-lg">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="absolute w-full h-full object-contain rounded-lg p-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <ChevronRight size={24} />
      </button>

      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
      >
        {t("requestBtn")}
      </Button>

      {/* ✅ Modal Component */}
      <TemplateRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}