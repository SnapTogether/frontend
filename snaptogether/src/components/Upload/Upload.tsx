import { useState } from "react";
import imageCompression from "browser-image-compression"; // ✅ Install via `npm install browser-image-compression`
import { uploadPhotosForGuest } from "@/api/photo";
import socket from "@/utils/socket";

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
    const optimizedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        if (file.type.startsWith("image/")) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: "image/webp",
          };
          return await imageCompression(file, options);
        }
        // Just return video files as-is
        return file;
      })
    );
    

    console.log("✅ Optimized Images Ready to Upload:", optimizedFiles);

    const response = await uploadPhotosForGuest(eventCode, guestId, optimizedFiles);
    setLoading(false);

    if (response.status === 201) {
      const newPhotoUrls = response.photos!.map((photo) => photo.url);
      onPhotosUploaded(newPhotoUrls); // ✅ Update parent component

      // ✅ Emit WebSocket Event (Tell Host a New Image is Uploaded)
      socket.emit("photoUploaded", {
        eventCode,
        photos: response.photos, // Send uploaded photos
      });
      console.log("📡 WebSocket Event Sent: photoUploaded", response.photos);

    } else {
      alert("❌ Upload failed. Try again!");
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-md mx-auto space-y-4">
      <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" id="file-upload" />
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
