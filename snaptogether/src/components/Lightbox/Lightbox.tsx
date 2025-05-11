"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import { Photo } from "@/api/event";
import { downloadSinglePhotoByS3Key } from "@/api/photo";

interface LightboxProps {
  isOpen: boolean;
  images: Photo[];
  selectedIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  disableNavigation?: boolean;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  selectedIndex,
  onClose
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedIndex, isOpen]);

  console.log("images", images);

  const disablePrev = currentIndex === 0;
  const disableNext = currentIndex === images.length - 1;

  // ✅ Always called, no early return before this
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;

    const timeout = setTimeout(() => {
      const scrollTo = scrollRef.current!.clientWidth * currentIndex;
      scrollRef.current!.scrollTo({ left: scrollTo, behavior: "auto" });
    }, 0);

    return () => clearTimeout(timeout);
  }, [selectedIndex, isOpen]);

  // ✅ Now safe to do early return
  if (!isOpen || !images || images.length === 0) {
    return <div className="hidden" />;
  }

  const downloadImage = async () => {
    const image = images[currentIndex];

    // Extract key from full URL
    const getS3KeyFromUrl = (fullUrl: string): string => {
      const url = new URL(fullUrl);
      return url.pathname.slice(1); // remove leading slash
    };

    const s3Key = getS3KeyFromUrl(image.imageUrl); // or image.imageUrl

    await downloadSinglePhotoByS3Key(s3Key);
  };


  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollTo = scrollRef.current.clientWidth * index;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };
  
  const scrollNext = () => {
    if (currentIndex < images.length - 1) {
      console.log("Next from", currentIndex, "to", currentIndex + 1);
      scrollToIndex(currentIndex + 1);
    }
  };
  
  const scrollPrev = () => {
    if (currentIndex > 0) {
      console.log("Prev from", currentIndex, "to", currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  };
  
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center w-full max-w-screen-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 text-white bg-gray-900/20 p-2 rounded-full hover:bg-gray-900/50 transition-all duration-300 ease-in-out"
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

        <div
          ref={scrollRef}
          className="flex overflow-x-hidden snap-x snap-mandatory w-full max-w-screen-md"
        >
          {images.map((image, index) => {
            const isVideo = image.imageUrl.match(/\.(mp4|webm|mov)$/i);
            const key = `${image.imageUrl}-${index}`;

            return (
              <div
                key={key}
                className="flex-shrink-0 w-full flex justify-center snap-center"
              >
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
                    alt="Enlarged"
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
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full transition-all duration-300 ease-in-out
            ${disablePrev ? "bg-gray-800/30 opacity-30 cursor-not-allowed" : "bg-gray-800/80 hover:bg-gray-700"}`}
          onClick={disablePrev ? undefined : scrollPrev}
          disabled={disablePrev}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full transition-all duration-300 ease-in-out
            ${disableNext ? "bg-gray-800/30 opacity-30 cursor-not-allowed" : "bg-gray-800/80 hover:bg-gray-700"}`}
          onClick={disableNext ? undefined : scrollNext}
          disabled={disableNext}
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
