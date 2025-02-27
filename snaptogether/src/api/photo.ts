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

      // ✅ Ensure response contains correct data
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
