"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import Button from "../Button/Button";
import { Photo } from "@/api/event";
import { downloadSinglePhotoByS3Key } from "@/api/photo";

interface LightboxProps {
  isOpen: boolean;
  images: Photo[];
  selectedIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, selectedIndex, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(selectedIndex);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: selectedIndex,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: false,
  });

  useEffect(() => {
    if (isOpen && instanceRef.current) {
      instanceRef.current.moveToIdx(selectedIndex, true);
      setCurrentSlide(selectedIndex); // ✅ force update currentSlide as well
    }
  }, [isOpen, selectedIndex, instanceRef]);
  

  if (!isOpen || !images.length) return null;

  const downloadImage = async () => {
    const image = images[currentSlide];
    const url = new URL(image.imageUrl);
    const s3Key = url.pathname.slice(1);
    await downloadSinglePhotoByS3Key(s3Key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div className="relative w-full max-w-screen-lg" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 z-10 right-5 text-white bg-gray-900/20 p-2 rounded-full hover:bg-gray-900/50 transition"
          onClick={onClose}
        >
          <X size={30} />
        </button>

        <Button
          className="absolute bottom-full right-0 sm:left-full text-white rounded-full"
          onClick={downloadImage}
          iconLeft={<Download size={26} />}
          variant="tertiary"
        />

        <div ref={sliderRef} className="keen-slider max-w-screen-md mx-auto">
        {images.map((image, idx) => {
          const isVideo = image.imageUrl.match(/\.(mp4|webm|mov)$/i);
          return (
            <div key={idx} className="keen-slider__slide flex justify-center">
              {isVideo ? (
                <video
                  src={image.imageUrl}
                  controls
                  preload="metadata"
                  className="rounded-lg shadow-lg max-w-full max-h-[55vh] my-auto"
                />
              ) : (
                <Image
                  src={image.imageUrl}
                  alt={`Image ${idx + 1}`}
                  width={700}
                  height={500}
                  className="rounded-lg shadow-lg max-w-full max-h-[55vh] object-contain my-auto"
                />
              )}
            </div>
          );
        })}

        </div>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-gray-800/80 hover:bg-gray-700 transition"
          onClick={() => instanceRef.current?.prev()}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-gray-800/80 hover:bg-gray-700 transition"
          onClick={() => instanceRef.current?.next()}
          disabled={currentSlide === images.length - 1}
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
