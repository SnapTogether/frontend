import { useState } from "react";
import { uploadPhotosForGuest } from "@/api/photo";
import Image from "next/image";
import Button from "../Button/Button";

export default function Upload({ eventCode, guestId }: { eventCode: string; guestId: string }) {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // ✅ Log guestId before making the API call
  console.log("📤 Upload Component: Event Code:", eventCode, "Guest ID:", guestId);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // ✅ Log guestId before calling the upload function
    console.log("📤 Sending Upload Request: Guest ID:", guestId);

    if (!guestId) {
      console.error("❌ Error: guestId is missing!");
      alert("❌ Error: Guest ID is required to upload images.");
      return;
    }

    setLoading(true);
    const response = await uploadPhotosForGuest(eventCode, guestId, Array.from(files));
    setLoading(false);

    if (response.status === 201) {
      setUploadedPhotos((prev) => [...prev, ...response.photos!.map((photo) => photo.imageUrl)]);
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
                      bg-transparent hover:bg-white transition-all duration-300 ease-in-out"
      >
        <span className="w-full h-full !rounded-none">{loading ? "Uploading..." : "Choose Images"}</span>
      </label>

      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {uploadedPhotos.map((url, index) => (
            <Image key={index} src={url} alt="Uploaded" width={96} height={96} className="rounded-md shadow-md object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
