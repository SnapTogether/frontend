"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  images: { _id: string; imageUrl: string }[];
  selectedIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, selectedIndex, onClose, onNext, onPrev }) => {
  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={onClose} // ✅ Close when clicking outside
    >
      {/* Prevents clicks inside from closing the modal */}
      <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="absolute top-5 right-5 text-white text-3xl" onClick={onClose}>
          <X size={30} />
        </button>

        {/* Previous Button */}
        <button
          className="absolute left-4 text-white bg-gray-800 p-3 rounded-full hover:bg-gray-700"
          onClick={onPrev}
        >
          <ChevronLeft size={30} />
        </button>

        {/* Display Current Image */}
        <Image
          src={images[selectedIndex].imageUrl}
          alt="Enlarged"
          width={700}
          height={500}
          className="rounded-lg shadow-lg max-w-full max-h-[90vh]"
        />

        {/* Next Button */}
        <button
          className="absolute right-4 text-white bg-gray-800 p-3 rounded-full hover:bg-gray-700"
          onClick={onNext}
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
