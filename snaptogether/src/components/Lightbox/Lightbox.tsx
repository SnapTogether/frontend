"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import Button from "../Button/Button";
import { Photo } from "@/api/event";

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


const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, selectedIndex, onClose, disablePrev, disableNext }) => {
  // ✅ Ensure Hook is Always Called
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Avoid Rendering Instead of Returning Null Early
  if (!isOpen || !images || images.length === 0) {
    return <div className="hidden" />;
  }

  const downloadImage = async () => {
    const imageUrl = images[selectedIndex].imageUrl;
    const imageName = `photo_${images[selectedIndex]._id}.jpg`;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Failed to download image:", error);
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
  
    // Wait for layout to be ready
    const timeout = setTimeout(() => {
      const scrollTo = scrollRef.current!.clientWidth * selectedIndex;
      scrollRef.current!.scrollTo({ left: scrollTo, behavior: "auto" });
    }, 0); // delay until after paint
  
    return () => clearTimeout(timeout);
  }, [selectedIndex, isOpen]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={onClose}>
      <div className="relative flex flex-col items-center w-full max-w-screen-lg" onClick={(e) => e.stopPropagation()}>
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

          {images.map((image) => {
            const isVideo = image.imageUrl.match(/\.(mp4|webm|mov)$/i);

            return (
              <div key={image._id} className="flex-shrink-0 w-full flex justify-center snap-center">
                {isVideo ? (
                  <video
                    src={image.imageUrl}
                    controls
                    preload="metadata"
                    className="rounded-lg shadow-lg max-w-full max-h-[90vh]"
                  />
                ) : (
                  <Image
                    src={image.imageUrl}
                    alt="Enlarged"
                    width={700}
                    height={500}
                    className="rounded-lg shadow-lg max-w-full max-h-[90vh] object-cover"
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
