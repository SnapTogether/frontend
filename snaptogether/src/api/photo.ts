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
export const downloadPhotosForGuest = async (eventCode: string): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/generate-zip/${encodeURIComponent(eventCode)}`,
      { method: "POST" }
    );

    const data = await res.json();

    if (!res.ok || !data.downloadUrl) {
      throw new Error(data.message || "Failed to get download URL.");
    }

    window.location.href = data.downloadUrl;
  } catch (error) {
    console.error("❌ ZIP Download Error:", error);
  }
};

export const getPresignedUrl = async (file: File, eventCode: string, guestId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/s3/presigned-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      eventCode,
      guestId,
    }),
  });

  return res.json(); // contains { url, publicUrl, key }
};


export const uploadToS3 = async (file: File, signedUrl: string) => {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) throw new Error("Upload to S3 failed");
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

export const deletePhotoForGuest = async (
  eventCode: string,
  guestId: string,
  photoId: string
): Promise<{
  status: number;
  message: string;
  photoId?: string;
  error?: string;
}> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/delete-photo/${encodeURIComponent(
      eventCode
    )}/${encodeURIComponent(guestId)}/${encodeURIComponent(photoId)}`;

    console.log("📡 DELETE Photo API Call:", {
      url,
      eventCode,
      guestId,
      photoId,
    });

    const res = await fetch(url, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete photo.");
    }

    return {
      status: res.status,
      message: data.message,
      photoId: data.photoId,
    };
  } catch (error) {
    console.error("❌ Delete photo error:", error);
    return {
      status: 500,
      message: "❌ Failed to delete photo",
      error: (error as Error).message,
    };
  }
};

