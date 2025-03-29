// Backend API URL

// 📝 Interface for Creating an Event
export interface CreateEventData {
  fullName: string;
  email: string;
  eventName: string;
  eventDate: string;
  plan: "free" | "starter" | "pro";
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
  locale?: "en" | "mk" | "sq";
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
  } catch (error) {
    console.error("❌ Network/Server Error:", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error creating event",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

export interface Photo {
  _id: string;
  imageUrl: string;
}
export interface Guest {
  _id: string;
  guestName: string;
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
    guests: Guest[];
    pagination: {
      totalPages: number;
    };
    expirationDate: string;
    photos: Photo[]; // ✅ Define as array of objects, not strings
    // 🔥 Add these 👇
    plan: "free" | "starter" | "pro";
    usedStorage: number;
    storageLimit: number;
    isPaymentConfirmed: boolean;
  };
  error?: string;
}

export const fetchEventForHost = async (
  eventCode: string,
  hostCode: string,
  page: number = 1, // Default: page 1
  limit: number = 3 // Default: 20 photos per request
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

    // ✅ Include `page` and `limit` in the API request
    const apiUrl = `${baseUrl}/api/event/${eventCode}/${hostCode}/dashboard?page=${page}&limit=${limit}`;

    const res = await fetch(apiUrl);
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
  } catch (error) {
    console.error("❌ Network/Server Error:", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error fetching event details.",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};

// 📝 Interface for Requesting a Template
export interface RequestTemplateData {
  name: string;
  mobile: string;
  eventName: string;
  address: string;
  message: string;
  template: string;
}

// 📝 Response Interface for Template Request
export interface RequestTemplateResponse {
  status: number;
  message: string;
  error?: string;
}

// ✅ API Call: Request a Custom Template
export const requestTemplate = async (
  requestData: RequestTemplateData
): Promise<RequestTemplateResponse> => {
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

    const res = await fetch(`${baseUrl}/api/event/request-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API Error:", data.message);
      return {
        status: res.status,
        message: data.message || "Failed to request template.",
        error: data.error || "Unknown error.",
      };
    }

    return {
      status: res.status,
      message: data.message,
    };
  } catch (error) {
    console.error("❌ Network/Server Error:", (error as Error).message);
    return {
      status: 500,
      message: "❌ Error requesting template",
      error: (error as Error).message || "Network error occurred.",
    };
  }
};
