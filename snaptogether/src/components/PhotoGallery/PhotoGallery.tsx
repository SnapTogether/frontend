import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button/Button";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import Lightbox from "@/components/Lightbox/Lightbox";
import { useTranslations } from "next-intl";

interface Photo {
  _id: string;
  imageUrl: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 20; // Adjusted to fit the Masonry layout
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const disablePrev = selectedImageIndex === 0;
  const disableNext = selectedImageIndex === photos.length - 1;


  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && photos.length) {
      setSelectedImageIndex((prev) => (prev! + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && photos.length) {
      setSelectedImageIndex((prev) => (prev! - 1 < 0 ? photos.length - 1 : prev! - 1));
    }
  };

  const t = useTranslations("photoGallery");

  return (
    <div className="photos text-center container mx-auto">
      <h3 className="text-white text-xl md:text-2xl font-semibold my-6 flex items-center justify-center gap-3 capitalize font-mulish">
        <Images size={20} /> {t("title")}
      </h3>
      {photos.length > 0 ? (
        <>
          {/* ✅ Masonry Grid Layout with Repeating Pattern */}
          <div className="grid grid-cols-12 gap-2 mt-2">
            {currentPhotos.map((photo, index) => {
              const row = Math.floor(index / 3);
              let colSpan = "col-span-4 sm:col-span-4";

              if (row % 2 === 1) {
                colSpan = index % 3 === 0 ? "col-span-12 sm:col-span-2" : "col-span-12 sm:col-span-5";
              }

              const isVideo = photo.imageUrl.match(/\.(mp4|webm|mov)$/i);

              return (
                <div
                  key={index}
                  className={`relative cursor-pointer shadow-md h-full w-full max-h-[20em] rounded-lg overflow-hidden ${colSpan}`}
                  onClick={() => openModal(indexOfFirstPhoto + index)}
                >
                  {isVideo ? (
                    <video
                      className="h-full w-full object-cover"
                      src={photo.imageUrl}
                      controls
                      preload="metadata"
                      key={index}
                    />
                  ) : (
                    <Image
                      key={index}
                      src={photo.imageUrl}
                      alt="Uploaded"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center items-center gap-4">
            <Button
              onClick={prevPage}
              variant="tertiary"
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              iconLeft={<ChevronLeft color="white" size={20} />}
            />
            <span className="text-white">
              {currentPage} of {totalPages}
            </span>
            <Button
              onClick={nextPage}
              variant="tertiary"
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              iconLeft={<ChevronRight color="white" size={20} />}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-gray-400">{t("noPhotos")}</p>
      )}

      {/* ✅ Lightbox Component */}
      <Lightbox
        isOpen={isModalOpen}
        images={photos}
        selectedIndex={selectedImageIndex ?? 0}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
        disableNavigation={photos.length <= 1}
        disablePrev={disablePrev}
        disableNext={disableNext}
      />
    </div>
  );
};

export default PhotoGallery;
