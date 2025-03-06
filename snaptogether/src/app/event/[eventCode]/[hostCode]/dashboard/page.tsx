"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Import QR Code Generator
import Image from "next/image";
import Button from "@/components/Button/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 10;

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

  // ✅ Photo Pagination
  const photos = eventData?.event?.photos || [];
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const paginatedPhotos = photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col items-center gap-8 p-6">

      <h2 className="text-white text-center text-2xl font-semibold">🎉 Host Dashboard for <b>{eventData?.event?.eventName}</b></h2>
      <div className="event-info text-center flex flex-col items-center gap-4">
        <p><strong>📅 Event Date:</strong> {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}</p>
        <p><strong>👤 Host Name:</strong> {eventData?.event?.hostFullName}</p>
        <p><strong>📧 Host Email:</strong> {eventData?.event?.hostEmail}</p>
      </div>

      {/* 🔗 Display Host & Guest Links with QR Codes */}
      <div className="qr-codes">
        <h3 className="text-white text-lg font-semibold">🔗 Event Links</h3>

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

      {/* 🔥 Photos with Pagination */}
      <div className="photos text-center">
        <h3 className="text-white text-xl font-semibold">📸 Uploaded Photos</h3>
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {paginatedPhotos.map((photo) => (
                <Image
                  key={photo._id}
                  src={photo.imageUrl}
                  alt="Uploaded"
                  width={300}
                  height={200}
                  className="rounded-md shadow-md max-w-[20em] max-h-[15em] w-full object-cover"
                />
              ))}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="mt-4 flex justify-center items-center gap-4">
              <Button
                onClick={prevPage}
                variant="tertiary"
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                iconLeft={<ChevronLeft color="white" size={20} />}
              />
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={nextPage}
                variant="tertiary"
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                iconLeft={<ChevronRight color="white" size={20} />}
              />
            </div>
          </>
        ) : (
          <p className="mt-2 text-gray-400">No photos have been uploaded yet.</p>
        )}
      </div>

      {/* Guests Section (Unchanged) */}
      <div className="guests text-center">
        <h3 className="text-white text-xl font-semibold">👥 Guests</h3>
        {eventData?.event?.guests && eventData.event.guests.length > 0 ? (
          <ul className="list-disc ml-6">
            {eventData.event.guests.map((guest) => (
              <li key={guest._id}>Guest: {guest.guestName}</li> 
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-400">No guests have joined yet.</p>
        )}
      </div>
    </div>
  );
}
