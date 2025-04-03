interface UploadedPhoto {
  photoId: string;
  url: string;
  type: "image" | "video";
}

export interface UploadResponse {
  status: number;
  message: string;
  photos?: UploadedPhoto[];
  error?: string;
  skippedDuplicates?: string[];
}


export interface DownloadResponse {
  status: number;
  message: string;
  downloadUrl?: string;
  error?: string;
}
export interface RawPhoto {
  _id: string;
  imageUrl?: string;
  videoUrl?: string;
}

import axios from "axios";

// ✅ API Call: Upload Images for Guest and return progress
export const uploadPhotosForGuest = async (
  eventCode: string,
  guestId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  if (!guestId) {
    return {
      status: 400,
      message: "Guest ID is missing",
      error: "Missing guestId",
    };
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("media", file));

  try {
    const res = await axios.post(
      `${
        process.env.NEXT_PUBLIC_SERVER_BASE_URL
      }/api/photos/upload/${encodeURIComponent(eventCode)}/${encodeURIComponent(
        guestId
      )}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const total = progressEvent.total ?? 1; // fallback to prevent division by 0
            const percent = Math.round((progressEvent.loaded * 100) / total);
            onProgress(percent);
          }
        },
      }
    );

    return {
      status: res.status,
      message: res.data.message,
      photos:
        res.data.photos?.map((photo: RawPhoto) => ({
          photoId: photo._id,
          url: photo.imageUrl || photo.videoUrl,
          type: photo.imageUrl ? "image" : "video",
        })) || res.data.uploaded || [],
      skippedDuplicates: res.data.skippedDuplicates || [],
    };
    
  } catch (error: unknown) {
    const err = error as Error & { message: string };
    console.error("Upload error", err);
    return {
      status: 500,
      message: "Upload failed",
      error: err.message,
    };
  }
  
  
};

// ✅ API Call: Request ZIP Download for Guest
export const downloadPhotosForGuest = async (
  eventCode: string
): Promise<void> => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_BASE_URL
      }/api/photos/download/${encodeURIComponent(eventCode)}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`❌ API Error: ${res.status} ${res.statusText}`);
    }

    // ✅ Read response as a binary ZIP file
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // ✅ Create a temporary link & trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapTogether-${eventCode}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Network/Server Error:", error);
  }
};

export const downloadSinglePhotoByS3Key = async (
  s3Key: string
): Promise<DownloadResponse> => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_BASE_URL
      }/api/photos/download-photo/${encodeURIComponent(s3Key)}`
    );

    if (!res.ok) {
      return {
        status: res.status,
        message: "❌ Failed to generate download link.",
        error: await res.text(),
      };
    }

    const { downloadUrl } = await res.json();

    // Trigger download
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = s3Key.split("/").pop() || "download.jpg"; // get filename from key
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();

    return {
      status: 200,
      message: "✅ Download started.",
      downloadUrl,
    };
  } catch (error) {
    console.error("❌ Download error:", error);
    return {
      status: 500,
      message: "❌ Could not download image.",
      error: (error as Error).message,
    };
  }
};
