// Backend API URL

// 📝 Interface for Creating an Event
export interface CreateEventData {
  name: string;
  surname: string;
  email: string;
  eventName: string;
  eventDate: string;
}

// 📝 Response Interface for Event Creation
export interface CreateEventResponse {
  status: number;
  message: string;
  eventCode?: string;
  hostCode?: string;
  hostLink?: string;
  guestLink?: string;
  error?: string;
}

// ✅ API Call: Create a New Event
export const createEvent = async (
  eventData: CreateEventData
): Promise<CreateEventResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/event/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API Error:", data.message);
      return {
        status: res.status,
        message: data.message || "Failed to create event.",
        error: data.error || "Unknown error.",
      };
    }

    return {
      status: res.status,
      message: data.message,
      eventCode: data.eventCode,
      hostCode: data.hostCode,
      hostLink: data.hostLink,
      guestLink: data.guestLink,
    };
  } catch (error: any) {
    console.error("❌ Network/Server Error:", error.message);
    return {
      status: 500,
      message: "❌ Error creating event",
      error: error.message || "Network error occurred.",
    };
  }
};

export interface Photo {
  _id: string;
  imageUrl: string;
}

export interface EventResponse {
  status: number;
  message: string;
  event?: {
    _id: string;
    eventName: string;
    hostEmail: string;
    hostFullName: string;
    eventCode: string;
    eventDate: string;
    hostLink: string;
    guestLink: string;
    guests: string[];
    photos: Photo[]; // ✅ Define as array of objects, not strings
  };
  error?: string;
}

// ✅ API Call: Fetch Event Details for Host
export const fetchEventForHost = async (
  eventCode: string,
  hostCode: string
): Promise<EventResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

    if (!baseUrl) {
      console.error("❌ ERROR: `NEXT_PUBLIC_SERVER_BASE_URL` is missing.");
      return {
        status: 500,
        message: "❌ Backend API URL is missing.",
        error: "Check .env.local",
      };
    }

    const apiUrl = `${baseUrl}/api/event/${eventCode}/${hostCode}/dashboard`;

    const res = await fetch(apiUrl);

    // ✅ Log raw response before parsing JSON
    const text = await res.text();

    try {
      const data = JSON.parse(text);

      if (!res.ok) {
        console.error("❌ API Error:", data.message);
        return { status: res.status, message: data.message, error: data.error };
      }

      return {
        status: res.status,
        message: data.message,
        event: data.event,
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
  } catch (error: any) {
    console.error("❌ Network/Server Error:", error.message);
    return {
      status: 500,
      message: "❌ Error fetching event details.",
      error: error.message || "Network error occurred.",
    };
  }
};
