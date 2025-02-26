"use client";

import { useState } from "react";
import { uploadPhotosForGuest } from "@/api/photo";

export default function Upload({ eventCode, guestId }: { eventCode: string; guestId: string }) {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // 📌 Automatically Upload Files When Selected
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

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
    <div className="p-4 border rounded-lg shadow-md max-w-lg mx-auto space-y-4">
      <h2 className="text-lg font-semibold">📤 Upload Photos</h2>

      {/* ✅ Native Upload - Triggers Upload Immediately */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full p-3 border border-dashed cursor-pointer rounded-md hover:bg-gray-100"
      >
        <span className="text-gray-600">{loading ? "Uploading..." : "Choose Images"}</span>
      </label>

      {/* ✅ Show Uploaded Photos */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {uploadedPhotos.map((url, index) => (
            <img key={index} src={url} alt="Uploaded" className="w-24 h-24 rounded-md shadow-md object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
