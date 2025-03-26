const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/admin`;

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Admin login to get JWT token
 */
export const adminLogin = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return await res.json(); // { token: "..." }
};

/**
 * Fetch all events (requires Authorization)
 */
export const fetchAllEvents = async (page = 1) => {
    const res = await fetch(`${API_BASE_URL}/events?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
  
    return await res.json(); // returns { events, pagination }
  };
  

/**
 * Approve payment for a specific event by ID (requires Authorization)
 */
export const approveEventPayment = async (eventCode: string) => {
    const res = await fetch(`${API_BASE_URL}/events/${eventCode}/confirm-payment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to approve payment");
    }
  
    return await res.json();
  };
  
