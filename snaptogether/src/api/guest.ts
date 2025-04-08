// 📝 Interface for Fetching Guest Photos
export interface Guest {
  guestId: string;
  guestName: string;
}

export interface GuestPhoto {
  _id: string;  // ✅ Ensure _id exists
  photoId: string;

  imageUrl: string;
}


export interface GuestResponse {
  status: number;
  message: string;
  guestName?: string;
  guest?: Guest;
  photos?: GuestPhoto[];
  usedStorage?: number;
  storageLimit?:number;
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
          guestId: data.guestId,
          guestName: guestName,
        },
        photos: data.photos?.map((photo: { _id: string; imageUrl: string }) => ({
          photoId: photo._id,
          imageUrl: photo.imageUrl,
        })) || [],
        usedStorage: data.usedStorage || 0,         // ✅ Add this
        storageLimit: data.storageLimit || 0,       // ✅ Add this
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

export const fetchGuestPhotos = async (
  eventCode: string,
  guestId: string
): Promise<GuestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/${guestId}/photos`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const text = await res.text(); // Read response as text first

    try {
      const data = JSON.parse(text);
      console.log("📨 Fetch Guest Photos API Response:", data);

      if (!res.ok) {
        console.error("❌ API Error:", data.message || "Failed to fetch guest photos.");
        return {
          status: res.status,
          message: data.message || "Failed to fetch guest photos.",
          error: "Error retrieving guest photos.",
        };
      }

      return {
        status: res.status,
        message: data.message,
        guest: {
          guestId: guestId, // ✅ Using provided guestId
          guestName: data.guestName || "", // ✅ If guestName is not included, default to empty
        },
        photos: data.photos?.map((photo: { _id: string; imageUrl: string }) => ({
          photoId: photo._id,
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
      message: "❌ Error fetching guest photos.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

// ✅ API Call: Submit a Message for a Guest
export const submitGuestMessage = async (
  eventCode: string,
  guestId: string,
  message: string
): Promise<GuestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/${guestId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      console.log("💬 Guest Message Response:", data);

      if (!res.ok) {
        return {
          status: res.status,
          message: data.message || "Failed to submit message.",
          error: "Message submission failed.",
        };
      }

      return {
        status: res.status,
        message: data.message,
      };
    } catch (jsonError) {
      console.error("❌ JSON Parse Error (Message):", jsonError);
      console.error("📨 Raw Response (Not JSON):", text);
      return {
        status: 500,
        message: "❌ Invalid JSON response from server.",
        error: text,
      };
    }
  } catch (error) {
    console.error("❌ Network/Server Error (Message):", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error submitting message.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

export interface GuestMessagesResponse {
  status: number;
  message: string;
  guestId?: string;
  guestName?: string;
  messages?: string[];
  error?: string;
}

export const fetchGuestMessages = async (
  eventCode: string,
  guestId: string
): Promise<GuestMessagesResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/${guestId}/messages`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const text = await res.text(); // Read response as raw text

    try {
      const data = JSON.parse(text);
      console.log("💬 Fetch Guest Messages Response:", data);

      if (!res.ok) {
        return {
          status: res.status,
          message: data.message || "Failed to fetch messages.",
          error: "Could not fetch guest messages.",
        };
      }

      return {
        status: res.status,
        message: data.message,
        guestId: data.guestId,
        guestName: data.guestName,
        messages: data.messages || [],
      };
    } catch (jsonError) {
      console.error("❌ JSON Parse Error (Messages):", jsonError);
      return {
        status: 500,
        message: "❌ Invalid JSON from server.",
        error: text,
      };
    }
  } catch (error) {
    console.error("❌ Network/Server Error (Messages):", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error fetching guest messages.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

// ✅ API Call: Delete a specific message from a guest
export const deleteGuestMessageByText = async (
  eventCode: string,
  guestId: string,
  text: string
): Promise<{
  status: number;
  message: string;
  error?: string;
}> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/guest/${eventCode}/${guestId}/messages`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    const result = await res.json();
    return {
      status: res.status,
      message: result.message,
      error: result.error,
    };
  } catch (error) {
    return {
      status: 500,
      message: "❌ Failed to delete message",
      error: (error as Error).message,
    };
  }
};
