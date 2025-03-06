// 📝 Interface for Fetching Guest Photos
export interface Guest {
  guestId: string;
  guestName: string;
}

export interface GuestResponse {
  status: number;
  message: string;
  guest?: Guest;
  photos?: { photoId: string; imageUrl: string }[];
  error?: string;
}

// ✅ API Call: Verify Guest & Fetch Their Photos
export const verifyGuest = async (
  eventCode: string,
  guestName: string
): Promise<GuestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName }),
      }
    );

    const text = await res.text(); // Read response as text first

    try {
      const data = JSON.parse(text);
      console.log("📨 Guest API Response:", data);

      if (!res.ok) {
        console.error("❌ API Error:", data.message || "Guest not found.");
        return {
          status: res.status,
          message: data.message || "Guest not found.",
          error: "Guest verification failed.",
        };
      }

      if (!data.guestId) {
        console.warn("⚠️ Warning: Guest verification succeeded, but guestId is missing.");
        return {
          status: res.status,
          message: "⚠️ Guest ID missing from response.",
          error: "Guest data was not included in the response.",
        };
      }

      return {
        status: res.status,
        message: data.message,
        guest: {
          guestId: data.guestId, // ✅ Corrected
          guestName: guestName,  // ✅ Using input name since it's missing in response
        },
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
      message: "❌ Error verifying guest.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};
