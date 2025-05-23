import { useState } from "react";
import imageCompression from "browser-image-compression";
import { getPresignedUrl, uploadPhotosForGuest, uploadToS3 } from "@/api/photo";
import socket from "@/utils/socket";
import { useTranslations } from "next-intl";
import { fetchGuestPhotos } from "@/api/guest";

export default function Upload({
  eventCode,
  guestId,
  onPhotosUploaded,
  usedStorage,
  storageLimit,
}: {
  eventCode: string;
  guestId: string;
  onPhotosUploaded: (newPhotos: { _id: string; url: string }[]) => void;
  usedStorage: number;
  storageLimit: number;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const isLimitReached = usedStorage >= storageLimit;
  const t = useTranslations("upload");

  const MAX_FILES = 10;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const remainingSlots = Math.min(MAX_FILES, storageLimit - usedStorage);
    if (files.length > remainingSlots) {
      alert(t("maxFiles"));
      return;
    }
  
    if (!guestId) {
      alert(t("missingGuestId"));
      return;
    }
  
    setLoading(true);
    setUploadProgress(0);
  
    const optimizedFiles = await Promise.all(
      Array.from(files).map(async (file) =>
        file.type.startsWith("image/")
          ? await imageCompression(file, {
              maxSizeMB: 2,
              maxWidthOrHeight: 1080,
              useWebWorker: true,
              fileType: "image/webp",
            })
          : file
      )
    );
  
    const uploadedFiles: { imageUrl: string; s3Key: string; fileSize: number }[] = [];
  
    for (let i = 0; i < optimizedFiles.length; i++) {
      const file = optimizedFiles[i];
  
      try {
        const { url, publicUrl, key: s3Key } = await getPresignedUrl(file, eventCode, guestId);
        await uploadToS3(file, url);
  
        uploadedFiles.push({
          imageUrl: publicUrl,
          s3Key,
          fileSize: file.size, // ✅ This is crucial for usedStorage
        });
  
        setUploadProgress(Math.round(((i + 1) / optimizedFiles.length) * 100));
      } catch (err) {
        console.error("Upload failed:", err);
        alert(t("uploadFailed"));
        break;
      }
    }
  
    console.log("📦 Sending uploadedFiles to backend:", uploadedFiles);
  
    if (uploadedFiles.length > 0) {
      const saveRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventCode,
          guestId,
          files: uploadedFiles, // ✅ Includes fileSize
        }),
      });
  
      if (saveRes.ok) {
        const updatedPhotos = await fetchGuestPhotos(eventCode, guestId);
        onPhotosUploaded(updatedPhotos.photos?.map((p) => ({ _id: p._id, url: p.imageUrl })) || []);
  
        // ❌ REMOVE this because socket emit is handled by the server
        // socket.emit("photoUploaded", { eventCode, photos: updatedPhotos });
      } else {
        alert(t("uploadFailed"));
        console.error("❌ Saving photo metadata failed");
      }
    }
  
    setLoading(false);
    setUploadProgress(0);
  };
  
  
  

  return (
    <div className="w-full border rounded-lg mx-auto space-y-4">
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
