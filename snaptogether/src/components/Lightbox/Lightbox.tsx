"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import Button from "../Button/Button";

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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={onClose} // ✅ Close when clicking outside
    >
      {/* Prevents clicks inside from closing the modal */}
      <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="absolute top-5 right-5 text-white bg-gray-900/20 p-2 rounded-full hover:bg-gray-900/50 transition-all duration-300 ease-in-out" onClick={onClose}>
          <X size={30} />
        </button>

        {/* Download Button */}
        <Button
          className="absolute bottom-full left-full text-white rounded-full"
          onClick={downloadImage}
          iconLeft={<Download size={26} />}
          variant="tertiary"
        />

        {/* Previous Button */}
        <button
          className="absolute left-4 text-white bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out"
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
          className="absolute right-4 text-white bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out"
          onClick={onNext}
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
