"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGuestPhotos, GuestPhoto } from "@/api/guest";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Loader/Loader";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import Button from "@/components/Button/Button";
import { ChevronLeft } from "lucide-react";

export default function GuestPhotosPage() {
  const { eventCode, guestId } = useParams(); // ✅ Extract eventCode & guestId from URL

  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [guestName, setGuestName] = useState<string>(""); // ✅ Store guestName in state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!eventCode || !guestId) {
      console.warn("⚠️ Missing eventCode or guestId, skipping API call.");
      return;
    }

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchGuestPhotos(eventCode.toString(), guestId.toString());
        // console.log("📨 API Response:", response);

        if (response.error) {
          setError(response.error);
        } else {
          setPhotos(response.photos || []);
          setGuestName(response.guest?.guestName || "Guest");
        }
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
      }

      setLoading(false);
    };

    fetchPhotos();
  }, [eventCode, guestId]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 mt-16">
        <Button iconLeft={<ChevronLeft/>} onClick={() => window.history.back()} className="mb-4">
          Back to Guests
        </Button>

        <h1 className="text-white text-2xl font-semibold text-center mb-6 capitalize">{guestName} Photos</h1>

        {loading && <Loader />}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <>
            {photos.length > 0 ? (
              <PhotoGallery photos={photos} />
            ) : (
              <p className="text-gray-400 text-center">No photos uploaded by this guest.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
