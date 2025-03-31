import { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadSinglePhoto } from "@/api/photo";
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

    const uploadedUrls: string[] = [];

    const totalFiles = files.length;
    let currentProgress = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];

      // Compress image if needed
      const optimizedFile = file.type.startsWith("image/")
        ? await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: "image/webp",
          })
        : file;

      await uploadSinglePhoto(eventCode, guestId, optimizedFile, (percent) => {
        // Calculate global progress
        const avg = ((i + percent / 100) / totalFiles) * 100;
        setUploadProgress(Math.round(avg));
      }).then((res) => {
        if (res.status === 201 && res.photos && res.photos.length > 0) {
          uploadedUrls.push(res.photos[0].url);
        }
      });
    }

    onPhotosUploaded(uploadedUrls);

    socket.emit("photoUploaded", {
      eventCode,
      photos: uploadedUrls.map((url) => ({
        url,
        type: url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
      })),
    });

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
