"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyGuest, GuestResponse, submitGuestMessage, fetchGuestMessages } from "@/api/guest";
import Upload from "@/components/Upload/Upload";
import Navbar from "@/components/Navbar/Navbar";
import Button from "@/components/Button/Button";
import "./guest.css";
import { useTranslations } from "next-intl";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import GuestMessages, { Message } from "@/components/GuestMessages/GuestMessages";
import socket from "@/utils/socket";
import { Divider } from "@/components/Divider/Divider";
import { getStoredGuestSession } from "@/utils/getStoredGuestSession";

export default function GuestDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;

  const [guestName, setGuestName] = useState<string>("");
  const [guestData, setGuestData] = useState<GuestResponse | null>(null);
  const [usedStorage, setUsedStorage] = useState<number>(0);
  const [storageLimit, setStorageLimit] = useState<number>(0);
  const [eventName, setEventName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 20;

  const totalPages = Math.ceil((guestData?.photos?.length || 0) / photosPerPage);
  const totalPhotos = guestData?.photos?.length || 0;
  

  const t = useTranslations("guestDashboard");

  useEffect(() => {
    const stored = getStoredGuestSession();
  
    if (stored?.eventCode === eventCode && stored.guestName) {
      setGuestName(stored.guestName);
  
      verifyGuest(stored.eventCode, stored.guestName).then(async (response) => {
        if (response.status === 200 && response.guest?.guestId) {
          setGuestData(response);
          setUsedStorage(Number(response.usedStorage) || 0);
          setStorageLimit(Number(response.storageLimit) || 0);
          setEventName(response.eventName || "");
  
          const messagesRes = await fetchGuestMessages(stored.eventCode, stored.guestId);
          if (messagesRes.status === 200 && messagesRes.messages) {
            setGuestMessages(
              messagesRes.messages.map((msg, idx) => ({
                _id: String(idx),
                text: msg,
              }))
            );
          }
  
          // ✅ Only delete localStorage after expiration (do nothing else)
          if (stored.expiresAt) {
            const remainingTime = stored.expiresAt - Date.now();
            if (remainingTime > 0) {
              setTimeout(() => {
                localStorage.removeItem("snaptogether-guest"); // 🧹 Just this
                console.log("✅ Session expired: localStorage cleared");
              }, remainingTime);
            }
          }
        }
      });
    }
  }, [eventCode]);
  

  const handleVerifyGuest = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!guestName.trim()) {
      setError(t("error"));
      return;
    }

    setLoading(true);
    setError("");

    const response = await verifyGuest(eventCode, guestName);

    if (response.status === 200) {
      if (!response.guest?.guestId) {
        setError("Guest ID not found.");
        setLoading(false);
        return;
      }

      setGuestData(response);
      setUsedStorage(Number(response.usedStorage) || 0);
      setStorageLimit(Number(response.storageLimit) || 0);
      setEventName(response.eventName || "");
      console.log("🚀 Event Name:", response);

      // 🔥 Fetch guest messages
      const messagesRes = await fetchGuestMessages(eventCode, response.guest.guestId);
      if (messagesRes.status === 200 && messagesRes.messages) {
        setGuestMessages(
          messagesRes.messages.map((msg, idx) => ({
            _id: String(idx),
            text: msg,
          }))
        );
      }

    }

    else {
      setError(response.message);
    }

    setLoading(false);
  };

  const handleDeleteMessage = (text: string) => {
    setGuestMessages((prev) => prev.filter((msg) => msg.text !== text));
  };


  // ✅ Function to update guestData when new photos are uploaded
  const handlePhotosUploaded = (newPhotos: { _id: string; url: string }[]) => {
    if (!guestData) return;
  
    setGuestData((prev) => {
      if (!prev) return null;
  
      return {
        ...prev,
        photos: newPhotos.map((photo) => ({
          _id: photo._id,
          imageUrl: photo.url,
        })),
      };
    });
  };

  useEffect(() => {
    if (!guestData?.guest?.guestId || !eventCode) return;

    const room = `${eventCode}-${guestData.guest.guestId}`;
    socket.emit("join", room);

    socket.on("newMessage", ({ message }) => {
      setGuestMessages((prev) => [
        ...prev,
        { _id: String(Date.now()), text: message },
      ]);
    });

    socket.on("messageDeleted", ({ text }) => {
      setGuestMessages((prev) => prev.filter((msg) => msg.text !== text));
    });

    return () => {
      socket.emit("leave", room);
      socket.off("newMessage");
      socket.off("messageDeleted");
    };
  }, [eventCode, guestData?.guest?.guestId]);
  
 
  return (
    <div className="guest-dashboard relative h-full flex flex-col">
      <Navbar />
      <div className="w-[95%] mb-[10vh] sm:w-full flex flex-col items-center justify-center pt-[13vh] mx-auto space-y-4">
        <h2 className="text-white text-2xl font-semibold text-center flex flex-col items-center justify-center gap-3"><p>{t("title")}</p>{" "} <p>{guestData?.guest?.guestName}</p></h2>
        <p className="text-center">{t("subtitle")}</p>

        <h2 className="text-white text-2xl font-semibold text-center flex flex-col items-center justify-center italic">{eventName}</h2>

        {!guestData ? (
          <form onSubmit={handleVerifyGuest} className="max-w-[40em] container mx=auto space-y-3 p-6 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg">
            <p className="text-gray-300 text-center">{t("instruction")}</p>
            <input
              type="text"
              placeholder={t("inputPlaceholder")}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-black"
            />
            <Button
              type="submit"
              className="w-full bg-[rgba(120,128,181,0.8)]"
              disabled={loading}
              variant="primary"
            >
              {loading ? t("verifying") : t("verifyButton")}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-center container mx-auto max-w-[40em]">
            <div className="flex flex-col gap-6 text-center p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg w-full">
              <h3 className="text-lg font-semibold text-slate-50">{t("photosTitle")}</h3>

              {/* ✅ Scrollable Image/Video Grid */}
              {guestData.photos && guestData.photos.length > 0 ? (
                <div className="relative w-full">
                  <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 p-2">
                    {guestData.photos && guestData.photos.length > 0 ? (
                      <PhotoGallery photos={guestData.photos}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        totalPhotos={totalPhotos}
                        eventCode={eventCode}
                        guestId={guestData?.guest?.guestId}
                      />
                    ) : (
                      <p className="text-gray-300">{t("noPhotos")}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{t("noPhotos")}</p>
              )}

              {/* ✅ Upload Component */}
              <Upload
                eventCode={eventCode}
                guestId={guestData?.guest?.guestId || ""}
                onPhotosUploaded={handlePhotosUploaded}
                usedStorage={usedStorage}
                storageLimit={storageLimit}
              />
            <p className="text-gray-300 text-center">{t("maxFiles")}</p>

            </div>

            <Divider width="full" border={true} />

            <div className="mx-auto w-full box-border p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg">
              <h2 className="text-white text-md font-medium mb-2">{t("leaveMessage")}</h2>
              <textarea
                className="w-full rounded-md p-3 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:border-blue-500 min-h-[100px]"
                placeholder={t("messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="mt-3 w-full !bg-[rgba(120,128,181,0.8)]"
                variant="primary"
                disabled={submitting || !message.trim()}
                onClick={async () => {
                  setSubmitting(true);

                  const res = await submitGuestMessage(eventCode.toString(), guestData?.guest?.guestId || "", message.trim());

                  if (res.status === 200) {
                    setMessage(""); // Clear input

                    setGuestMessages((prev) => [
                      ...prev,
                      {
                        _id: String(Date.now()),
                        text: message.trim(),
                      },
                    ]);
                  }


                  setSubmitting(false);
                }}
              >
                {submitting ? t("sending") : t("send")}
              </Button>

            </div>

            <GuestMessages
              messages={guestMessages}
              eventCode={eventCode}
              guestId={guestData?.guest?.guestId || ""}
              onDeleteMessage={handleDeleteMessage}
            />

          </div>
        )}
      </div>
    </div>
  );
}
