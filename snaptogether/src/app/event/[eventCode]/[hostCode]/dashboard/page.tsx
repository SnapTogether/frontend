"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import dynamic from "next/dynamic";
const QRCodeCanvas = dynamic(async () => {
  const mod = await import("qrcode.react");
  return mod.QRCodeCanvas; // ✅ Correctly return named export
}, { ssr: false });
import Image from "next/image";
import Button from "@/components/Button/Button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Lightbox from "@/components/Lightbox/Lightbox";
import { downloadQR } from "@/utils/qrCode";
import Navbar from "@/components/Navbar/Navbar";
import DownloadZip from "@/components/DownloadZip/DownloadZip";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const photosPerPage = 20;

  // ✅ Lightbox State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);


  useEffect(() => {
    if (!eventCode || !hostCode) return;
  
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
  
      const response = await fetchEventForHost(eventCode, hostCode, currentPage, photosPerPage);
      
      if (response.status !== 200) {
        setError(response.message);
      } else {
        setEventData(response);
        setTotalPages(response.event?.pagination?.totalPages || 1);
        console.log("📨 Total Pages:", response.event?.pagination?.totalPages);
      }
  
      setLoading(false);
    };
  
    fetchEvent();
  }, [eventCode, hostCode, currentPage]); // ✅ Now it refetches when `currentPage` changes!
  

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;


    // ✅ Open Modal and Set Selected Image
    const openModal = (index: number) => {
      setSelectedImageIndex(index);
      setIsModalOpen(true);
    };
  
    // ✅ Close Modal
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedImageIndex(null);
    };
  
    // ✅ Navigate Next Image
    const nextImage = () => {
      if (selectedImageIndex !== null && eventData?.event?.photos?.length) {
        setSelectedImageIndex((prev) => (prev! + 1) % eventData.event!.photos!.length);
      }
    };

    // ✅ Navigate Previous Image
    const prevImage = () => {
      if (selectedImageIndex !== null && eventData?.event?.photos?.length) {
        setSelectedImageIndex((prev) =>
          prev! - 1 < 0 ? eventData.event!.photos!.length - 1 : prev! - 1
        );
      }
    };


  // ✅ Next & Previous Page Functions
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Navbar/>
      <div className="mt-20 flex flex-col items-center gap-8 p-6">
        <DownloadZip eventCode={eventCode}/>
        <h2 className="text-white text-center text-2xl font-semibold">🎉 Host Dashboard for <b>{eventData?.event?.eventName}</b></h2>
        <div className="event-info gradient-background p-7 rounded-md w-fit text-center flex flex-col items-center gap-4 text-white">
        <p className="text-white"><strong>📅 Event Date:</strong> {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}</p>
          <p className="text-white"><strong>👤 Host Name:</strong> {eventData?.event?.hostFullName}</p>
          <p className="text-white"><strong>📧 Host Email:</strong> {eventData?.event?.hostEmail}</p>
        </div>

        <h3 className="text-white text-center text-3xl font-semibold">🔗 Event Links</h3>

        {/* 🔗 Display Host & Guest Links with QR Codes */}
        <div className="qr-codes w-full flex-col flex md:flex-row gap-6">
          {/* Host Link + QR Code */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-4 mt-2">
            <div className="w-full text-center">
              <strong>📌 Host Link: </strong>
              <a href={eventData?.event?.hostLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-words">
                {eventData?.event?.hostLink}
              </a>
            </div>
            <div className="flex">
              <QRCodeCanvas id="hostQR" size={200} value={eventData?.event?.hostLink || ""} />
              <Button
                onClick={() => downloadQR(eventData?.event?.hostLink || "", "hostQR")}
                className="h-fit w-fit text-sm text-white bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600"
                iconRight={<Download size={20} />}
              />
            </div>
          </div>

          {/* Guest Link + QR Code */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-4 mt-2">
            <div className="w-full text-center">
              <strong>📌 Guest Link: </strong>
              <a href={eventData?.event?.guestLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-words">
                {eventData?.event?.guestLink}
              </a>
            </div>
            <div className="flex">
              <QRCodeCanvas id="guestQR" size={200} value={eventData?.event?.guestLink || ""} />
              <Button
                onClick={() => downloadQR(eventData?.event?.guestLink || "", "guestQR")}
                className="h-fit w-fit text-sm text-white bg-green-500 px-2 py-1 rounded-md hover:bg-green-600"
                iconRight={<Download size={20} />}
              />
            </div>
          </div>
        </div>

        {/* 🔥 Photos with Pagination */}
        <div className="photos text-center">
          <h3 className="text-white text-2xl md:text-3xl font-semibold my-6">📸 Uploaded Photos</h3>
          {eventData?.event?.photos && eventData?.event?.photos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mt-2">
                {eventData.event.photos.map((photo, index) => (
                  <Image
                    key={photo._id}
                    src={photo.imageUrl}
                    alt="Uploaded"
                    width={300}
                    height={200}
                    className="cursor-pointer shadow-md h-full w-full max-w-[20em] max-h-[15em] object-cover"
                    onClick={() => openModal(index)} // ✅ Open modal on click
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

        {/* ✅ Lightbox Component */}
        <Lightbox
          isOpen={isModalOpen}
          images={eventData?.event?.photos || []}
          selectedIndex={selectedImageIndex ?? 0}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </>
  );
}
