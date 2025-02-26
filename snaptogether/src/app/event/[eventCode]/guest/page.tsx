"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { verifyGuest, GuestResponse } from "@/api/guest";
import Upload from "@/components/Upload/Upload";
import Image from "next/image";

export default function GuestDashboard() {
    const params = useParams();
    const eventCode = params.eventCode as string;

    const [guestName, setGuestName] = useState<string>("");
    const [guestData, setGuestData] = useState<GuestResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // ✅ Handle guest verification
    const handleVerifyGuest = async () => {
        if (!guestName.trim()) {
            setError("❌ Please enter your full name.");
            return;
        }

        setLoading(true);
        setError("");

        const response = await verifyGuest(eventCode, guestName);

        if (response.status === 200) {
            setGuestData(response);
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

    const cloudinaryLoader = ({ src }: { src: string }) => {
        return src; // Cloudinary already provides optimized URLs
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">🎟️ Guest Login</h2>
            {!guestData ? (
                <>
                    <p className="text-gray-600">Enter your name to see your uploaded photos.</p>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                    <button
                        onClick={handleVerifyGuest}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify Guest"}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </>
            ) : (
                <div>
                    <h3 className="text-lg font-semibold">📸 Your Uploaded Photos</h3>
                    {guestData.photos && guestData.photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {guestData.photos.map((photo, index) => {
                                console.log(`Photo ID: ${photo.photoId}`); // ✅ Debugging log
                                return (
                                    <Image
                                        key={photo.photoId || index}
                                        loader={cloudinaryLoader}
                                        src={photo.imageUrl}
                                        alt="Guest Upload"
                                        width={500}
                                        height={500}
                                        className="rounded-md shadow-md object-cover"
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-600">No photos found for this guest.</p>
                    )}


                    {/* ✅ Upload Component Outside Grid */}
                    <Upload eventCode={eventCode} guestId={guestData?.guestId || ""} />
                </div>
            )}
        </div>
    );
}
