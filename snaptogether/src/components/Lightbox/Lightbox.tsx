"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { useRef } from "react";
import Button from "../Button/Button";
import { Photo } from "@/api/event";

interface LightboxProps {
  isOpen: boolean;
  images: Photo[];
  selectedIndex: number;
  onClose: () => void;
  onNext?: () => void; // ✅ Add this
  onPrev?: () => void; // ✅ Add this
}


const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, selectedIndex, onClose }) => {
  if (!isOpen || !images || images.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Scroll to next/previous image smoothly
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={onClose}>
      {/* Prevents clicks inside from closing the modal */}
      <div className="relative flex flex-col items-center w-full max-w-screen-lg" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-white bg-gray-900/20 p-2 rounded-full hover:bg-gray-900/50 transition-all duration-300 ease-in-out"
          onClick={onClose}
        >
          <X size={30} />
        </button>

        {/* Download Button */}
        <Button
          className="absolute bottom-full right-0 sm:left-full text-white rounded-full"
          onClick={downloadImage}
          iconLeft={<Download size={26} />}
          variant="tertiary"
        />

        {/* Scrollable Image Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory w-full max-w-screen-md"
          style={{ scrollBehavior: "smooth" }} // Smooth scrolling
        >
          {images.map((image) => (
            <div key={image._id} className="flex-shrink-0 w-full flex justify-center snap-center">
              <Image
                src={image.imageUrl}
                alt="Enlarged"
                width={700}
                height={500}
                className="rounded-lg shadow-lg max-w-full max-h-[90vh]"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out"
          onClick={scrollPrev}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out"
          onClick={scrollNext}
        >
          <ChevronRight size={30} />
        </button>

      </div>
    </div>
  );
};

export default Lightbox;
