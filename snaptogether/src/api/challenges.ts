export interface ChallengeSubmission {
    guestId: string;
    photoId: string;
    imageUrl: string;
    votes: string[]; // guestIds
  }
  
  export interface PhotoChallenge {
    _id: string;
    eventId: string;
    eventCode: string;
    title: string;
    description?: string;
    isActive: boolean;
    submissions: ChallengeSubmission[];
    createdAt: string; // ISO date
  }
  
  export async function getChallengesByEventCode(eventCode: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/by-code/${eventCode}`);
    if (!res.ok) throw new Error("Failed to fetch challenges");
    return res.json();
  }
 
  export async function createChallenge(eventCode: string, title: string, description: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/by-code/${eventCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create challenge");
    }
  
    return res.json();
  }
  
  export async function submitPhotoToChallenge(
    challengeId: string,
    guestId: string,
    photoId: string,
    imageUrl: string
  ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guestId, photoId, imageUrl }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to submit photo");
    }
  
    return res.json();
  }
  
  export async function voteForPhoto(
    challengeId: string,
    guestId: string,
    photoId: string
  ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}/vote`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guestId, photoId }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to vote");
    }
  
    return res.json();
  }
  