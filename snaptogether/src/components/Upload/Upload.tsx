import { useState } from "react";
import imageCompression from "browser-image-compression"; // ✅ Install via `npm install browser-image-compression`
import { uploadPhotosForGuest } from "@/api/photo";

export default function Upload({
  eventCode,
  guestId,
  onPhotosUploaded,
}: {
  eventCode: string;
  guestId: string;
  onPhotosUploaded: (newPhotos: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  console.log("📤 Upload Component: Event Code:", eventCode, "Guest ID:", guestId);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log("📤 Sending Upload Request: Guest ID:", guestId);

    if (!guestId) {
      console.error("❌ Error: guestId is missing!");
      alert("❌ Error: Guest ID is required to upload images.");
      return;
    }

    setLoading(true);

    // ✅ Optimize images before upload
    const optimizedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const options = {
          maxSizeMB: 1, // Max size: 1MB
          maxWidthOrHeight: 1080, // Resize if larger than 1080px
          useWebWorker: true, // Speed up compression
          fileType: "image/webp", // Convert to WebP
        };
        return await imageCompression(file, options);
      })
    );

    console.log("✅ Optimized Images Ready to Upload:", optimizedImages);

    const response = await uploadPhotosForGuest(eventCode, guestId, optimizedImages);
    setLoading(false);

    if (response.status === 201) {
      const newPhotoUrls = response.photos!.map((photo) => photo.imageUrl);
      onPhotosUploaded(newPhotoUrls); // ✅ Update parent component
    } else {
      alert("❌ Upload failed. Try again!");
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-md mx-auto space-y-4">
      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
      <label
        htmlFor="file-upload"
        className="text-md font-medium flex items-center justify-center w-full cursor-pointer rounded-md !m-0 p-4 
                      bg-transparent hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
      >
        <span className="w-full h-full !rounded-none">{loading ? "Uploading..." : "Choose Images"}</span>
      </label>
    </div>
  );
}
