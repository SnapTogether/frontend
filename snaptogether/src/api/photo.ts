export interface UploadResponse {
    status: number;
    message: string;
    photos?: { photoId: string; imageUrl: string }[];
    error?: string;
  }
  
  // ✅ API Call: Upload Images for Guest
  export const uploadPhotosForGuest = async (
    eventCode: string,
    guestId: string,
    files: File[]
  ): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file)); // ✅ Ensure key matches backend field
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/upload/${encodeURIComponent(eventCode)}/${encodeURIComponent(guestId)}`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log("📨 Upload API Response:", data); // ✅ Log full response
  
      if (!res.ok) {
        console.error("❌ API Error:", data.message);
        return { status: res.status, message: data.message, error: data.error };
      }
  
      // ✅ Ensure response contains correct data
      return {
        status: res.status,
        message: data.message,
        photos: data.photos || [], // Ensure empty array if no photos
      };
    } catch (error: any) {
      console.error("❌ Network/Server Error:", error.message);
      return {
        status: 500,
        message: "❌ Error uploading photos.",
        error: error.message || "Network error occurred.",
      };
    }
  };
  