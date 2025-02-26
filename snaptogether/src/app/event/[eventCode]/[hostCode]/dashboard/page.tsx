"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Import QR Code Generator

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!eventCode || !hostCode) return;

    const fetchEvent = async () => {
      const response = await fetchEventForHost(eventCode, hostCode);

      if (response.status !== 200) {
        setError(response.message);
      } else {
        setEventData(response);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventCode, hostCode]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // ✅ Function to Download QR Code
  const downloadQR = (link: string, filename: string) => {
    const canvas = document.getElementById(filename) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${filename}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">🎉 Host Dashboard for {eventData?.event?.eventName}</h2>
      <p><strong>📅 Event Date:</strong> {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}</p>
      <p><strong>👤 Host Name:</strong> {eventData?.event?.hostFullName}</p>
      <p><strong>📧 Host Email:</strong> {eventData?.event?.hostEmail}</p>

      {/* 🔗 Display Host & Guest Links with QR Codes */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">🔗 Event Links</h3>

        {/* Host Link + QR Code */}
        <div className="flex items-center gap-4 mt-2">
          <div>
            <strong>📌 Host Link: </strong>
            <a href={eventData?.event?.hostLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {eventData?.event?.hostLink}
            </a>
          </div>
          <div className="w-20">
            <QRCodeCanvas id="hostQR" value={eventData?.event?.hostLink || ""} size={80} />
            <button
              onClick={() => downloadQR(eventData?.event?.hostLink || "", "hostQR")}
              className="mt-2 text-sm text-white bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600"
            >
              Download QR
            </button>
          </div>
        </div>

        {/* Guest Link + QR Code */}
        <div className="flex items-center gap-4 mt-2">
          <div>
            <strong>📌 Guest Link: </strong>
            <a href={eventData?.event?.guestLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {eventData?.event?.guestLink}
            </a>
          </div>
          <div className="w-20">
            <QRCodeCanvas id="guestQR" value={eventData?.event?.guestLink || ""} size={80} />
            <button
              onClick={() => downloadQR(eventData?.event?.guestLink || "", "guestQR")}
              className="mt-2 text-sm text-white bg-green-500 px-2 py-1 rounded-md hover:bg-green-600"
            >
              Download QR
            </button>
          </div>
        </div>
      </div>

      {/* Display Photos */}
      <h3 className="mt-6 text-xl font-semibold">📸 Uploaded Photos</h3>
      {eventData?.event?.photos && eventData.event.photos.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 mt-2">
        {eventData?.event?.photos?.map((photo) => (
          <img
            key={photo._id} // ✅ Unique key (_id from MongoDB)
            src={photo.imageUrl} // ✅ Ensure it's a string URL
            alt="Uploaded"
            className="rounded-md shadow-md w-full object-cover"
          />
        ))}
      </div>
      ) : (
        <p className="mt-2 text-gray-600">No photos have been uploaded yet.</p>
      )}

      {/* Display Guests */}
      <h3 className="mt-6 text-xl font-semibold">👥 Guests</h3>
      {eventData?.event?.guests && eventData?.event?.guests?.length > 0 ? (
        <ul className="list-disc ml-6">
          {eventData.event.guests.map((guestId) => (
            <li key={guestId}>Guest ID: {guestId}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-gray-600">No guests have joined yet.</p>
      )}
    </div>
  );
}
