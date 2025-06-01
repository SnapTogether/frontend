export const getStoredGuestSession = () => {
    if (typeof window === "undefined") return null;
  
    const raw = localStorage.getItem("snaptogether-guest");
    if (!raw) return null;
  
    try {
      return JSON.parse(raw) as {
        eventCode: string;
        guestId: string;
        guestName: string;
        eventName?: string;
        usedStorage?: number;
        storageLimit?: number;
      };
    } catch {
      return null;
    }
  };
  