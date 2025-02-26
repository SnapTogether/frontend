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
// ✅ API Call: Verify Guest & Fetch Their Photos
export const verifyGuest = async (
  eventCode: string,
  guestName: string
): Promise<GuestResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName }),
    });

    const data = await res.json();
    console.log("📨 Guest API Response:", data);

    if (!res.ok || !data.guest) {
      console.error("❌ API Error:", data.message || "Guest not found.");
      return {
        status: res.status,
        message: data.message || "Guest not found.",
        error: "Guest verification failed.",
      };
    }

    return {
      status: res.status,
      message: data.message,
      guest: {
        guestId: data.guest._id, // ✅ Correctly map `_id` to `guestId`
        guestName: data.guest.guestName,
      },
      photos: data.photos || [],
    };
  } catch (error: any) {
    console.error("❌ Network/Server Error:", error.message);
    return {
      status: 500,
      message: "❌ Error verifying guest.",
      error: error.message || "Network error occurred.",
    };
  }
};

  