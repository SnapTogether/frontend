import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button/Button";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useTranslations } from "next-intl";
import Lightbox from "../Lightbox/Lightbox";
import { usePathname } from "next/navigation";
import { deletePhotoForGuest } from "@/api/photo";

interface Photo {
  _id: string;
  imageUrl: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalPhotos: number;
  eventCode?: string;
  guestId?: string;
  onDelete?: (photoId: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  currentPage,
  setCurrentPage,
  totalPages,
  eventCode,
  guestId,
  onDelete
}) => {


  console.log("Photos", photos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const pathname = usePathname();
  // const isGuestView = pathname.includes("guest");
  
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


  // const handleDelete = async (photoId: string) => {
  //   if (!eventCode || !guestId) {
  //     console.warn("⚠️ Missing eventCode or guestId for deletion");
  //     return;
  //   }
  
  //   const res = await deletePhotoForGuest(eventCode, guestId, photoId);
  
  //   if (res.status === 200) {
    
  //     if (onDelete) {
  //       console.log("📤 Calling onDelete callback");
  //       onDelete(photoId);
  //     }
  //   }
    
  //   else {
  //     console.error("❌ Delete failed:", res.message);
  //   }
  // };
  


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
            {photos.map((photo, index) => {
              const row = Math.floor(index / 3);
              let colSpan = "col-span-4 sm:col-span-4";

              if (row % 2 === 1) {
                colSpan = index % 3 === 0 ? "col-span-4 sm:col-span-2" : "col-span-4 sm:col-span-5";
              }

              const isVideo = photo.imageUrl.match(/\.(mp4|webm|mov)$/i);

              return (
                <div
                  key={index}
                  className={`relative cursor-pointer shadow-md h-full w-full rounded-lg overflow-hidden ${colSpan}`}
                  onClick={() => openModal(index)}
                >
                  {isVideo ? (
                    <video
                      className="h-full w-full object-cover aspect-square md:aspect-3/2"
                      src={photo.imageUrl}
                      controls
                      preload="metadata"
                      key={index}
                    />
                  ) : (
                    <div className="relative">
                      <Image
                        key={index}
                        src={photo.imageUrl}
                        alt="Uploaded"
                        width={300}
                        height={200}
                        unoptimized
                        className="h-full w-full object-cover aspect-square md:aspect-3/2"
                      />
                      {/* {isGuestView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const id = (photo as any).photoId || (photo as any)._id;

                            if (!id) {
                              console.warn("❌ Missing photoId in photo object:", photo);
                              return;
                            }

                            console.log("🧪 Delete button clicked:", {
                              id,
                              eventCode,
                              guestId,
                            });

                            handleDelete(id); // ✅ pass the correct id
                          }}
                          className="absolute top-2 right-2 bg-slate-500 text-white text-sm p-2 rounded-full z-10"
                        >
                          <X size={14} />
                        </button>

                      )} */}

                    </div>
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
      {isModalOpen && selectedImageIndex !== null && (
        <Lightbox
          key={selectedImageIndex} // ✅ force remount when a new image is selected
          isOpen={isModalOpen}
          images={photos}
          selectedIndex={selectedImageIndex}
          onClose={closeModal}
        />
      )}



    </div>
  );
};

export default PhotoGallery;
