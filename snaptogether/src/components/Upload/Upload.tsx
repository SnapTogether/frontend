import { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadPhotosForGuest } from "@/api/photo";
import socket from "@/utils/socket";
import { useTranslations } from "next-intl";

export default function Upload({
  eventCode,
  guestId,
  onPhotosUploaded,
  usedStorage,
  storageLimit,
}: {
  eventCode: string;
  guestId: string;
  onPhotosUploaded: (newPhotos: string[]) => void;
  usedStorage: number;
  storageLimit: number;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const isLimitReached = usedStorage >= storageLimit;
  const t = useTranslations("upload");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    if (!guestId) {
      alert("❌ Guest ID is required to upload images.");
      return;
    }
  
    setLoading(true);
    setUploadProgress(0);
  
    // ✅ Compress images
    const optimizedFiles = await Promise.all(
      Array.from(files).map(async (file) =>
        file.type.startsWith("image/")
          ? await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1080,
              useWebWorker: true,
              fileType: "image/webp",
            })
          : file
      )
    );
  
    // ✅ Upload all files at once
    const response = await uploadPhotosForGuest(eventCode, guestId, optimizedFiles, (percent) =>
      setUploadProgress(percent)
    );
  
    if (response.status === 201 && response.photos && response.photos.length > 0) {
      const uploadedUrls = response.photos.map((p) => p.url);
      onPhotosUploaded(uploadedUrls);
    
      socket.emit("photoUploaded", {
        eventCode,
        photos: response.photos,
      });
    } else {
      alert("❌ Upload failed. Try again!");
    }
    
  
    setLoading(false);
    setUploadProgress(0);
  };
  

  return (
    <div className="w-full border rounded-lg shadow-md mx-auto space-y-4">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isLimitReached}
      />

      <label
        htmlFor="file-upload"
        className={`text-md font-medium flex items-center justify-center w-full cursor-pointer rounded-md !m-0 p-4 
          ${isLimitReached ? "bg-gray-500 cursor-not-allowed" : "bg-transparent hover:bg-white text-white hover:text-black"} 
          transition-all duration-300 ease-in-out`}
      >
      <span className="w-full h-full !rounded-none">
        {isLimitReached
          ? t("storageFull")
          : loading
          ? `${t("uploading")}... ${uploadProgress}%`
          : t("chooseImages")}
      </span>
      </label>

      {loading && (
        <div className="w-full bg-white/20 rounded h-2 overflow-hidden">
          <div
            className="bg-blue-400 h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
