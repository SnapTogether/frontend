export interface UploadResponse {
  status: number;
  message: string;
  photos?: { photoId: string; imageUrl: string }[];
  error?: string;
}

export interface DownloadResponse {
  status: number;
  message: string;
  downloadUrl?: string;
  error?: string;
}

// ✅ API Call: Upload Images for Guest
export const uploadPhotosForGuest = async (
  eventCode: string,
  guestId: string, // ✅ Ensure guestId is required
  files: File[]
): Promise<UploadResponse> => {
  try {
    if (!guestId) {
      console.error("❌ Error: Guest ID is missing!");
      return {
        status: 400,
        message: "❌ Guest ID is required for uploading.",
        error: "Missing guestId",
      };
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file)); // ✅ Ensure key matches backend

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/upload/${encodeURIComponent(eventCode)}/${encodeURIComponent(guestId)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const text = await res.text(); // ✅ Read response as text first

    try {
      const data = JSON.parse(text);
      console.log("📨 Upload API Response:", data); // ✅ Log full response

      if (!res.ok) {
        console.error("❌ API Error:", data.message);
        return { status: res.status, message: data.message, error: data.error };
      }

      return {
        status: res.status,
        message: data.message,
        photos: data.photos?.map((photo: { _id: string; imageUrl: string }) => ({
          photoId: photo._id, // ✅ Ensure proper mapping
          imageUrl: photo.imageUrl,
        })) || [],
      };
    } catch (jsonError) {
      console.error("❌ JSON Parse Error:", jsonError);
      console.error("📨 Raw Response (Not JSON):", text);
      return {
        status: 500,
        message: "❌ Invalid JSON response from server.",
        error: text,
      };
    }
  } catch (error) {
    console.error("❌ Network/Server Error:", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error uploading photos.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

// ✅ API Call: Request ZIP Download for Guest
export const downloadPhotosForGuest = async (eventCode: string): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/download/${encodeURIComponent(eventCode)}`,
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
