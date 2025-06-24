"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  verifyGuest,
  type GuestResponse,
  submitGuestMessage,
  fetchGuestMessages,
  fetchPublicPhotos,
  fetchPrivatePhotos,
  fetchGuestPhotos,
  GuestPhoto,
} from "@/api/guest"
import Upload from "@/components/Upload/Upload"
import Navbar from "@/components/Navbar/Navbar"
import Button from "@/components/Button/Button"
import "./guest.css"
import { useTranslations } from "next-intl"
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery"
import GuestMessages, { type Message } from "@/components/GuestMessages/GuestMessages"
import socket from "@/utils/socket"
import { Divider } from "@/components/Divider/Divider"
import { getStoredGuestSession } from "@/utils/getStoredGuestSession"
import { CornerRightDown, Lock, Globe, User } from "lucide-react"
import Tabs from "@/components/Tabs/Tabs"

export default function GuestDashboard() {
  const params = useParams()
  const eventCode = params.eventCode as string

  const [guestName, setGuestName] = useState<string>("")
  const [guestData, setGuestData] = useState<GuestResponse | null>(null)
  const [usedStorage, setUsedStorage] = useState<number>(0)
  const [storageLimit, setStorageLimit] = useState<number>(0)
  const [eventName, setEventName] = useState<string>("")

  // Separate upload states for each tab
  const [privateUploadLoading, setPrivateUploadLoading] = useState(false)
  const [privateUploadProgress, setPrivateUploadProgress] = useState(0)
  const [publicUploadLoading, setPublicUploadLoading] = useState(false)
  const [publicUploadProgress, setPublicUploadProgress] = useState(0)

  // Separate photo states for different tabs
  const [privatePhotos, setPrivatePhotos] = useState<GuestPhoto[]>([])
  const [publicPhotos, setPublicPhotos] = useState<GuestPhoto[]>([])
  const [myUploads, setMyUploads] = useState<GuestPhoto[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [guestMessages, setGuestMessages] = useState<Message[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const photosPerPage = 20

  const t = useTranslations("guestDashboard")

  // Load photos for all tabs
  const loadAllPhotos = async (guestId: string) => {
    try {
      const [privateResponse, publicResponse, myUploadsResponse] = await Promise.all([
        fetchPrivatePhotos(eventCode, guestId),
        fetchPublicPhotos(eventCode),
        fetchGuestPhotos(eventCode, guestId),
      ])

      if (privateResponse.status === 200) {
        setPrivatePhotos(privateResponse.photos || [])
      }

      if (publicResponse.status === 200) {
        setPublicPhotos(publicResponse.photos || [])
      }

      if (myUploadsResponse.status === 200) {
        setMyUploads(myUploadsResponse.photos || [])
      }
    } catch (error) {
      console.error("Error loading photos:", error)
    }
  }

  useEffect(() => {
    const stored = getStoredGuestSession()

    if (stored?.eventCode === eventCode && stored.guestName) {
      setGuestName(stored.guestName)

      verifyGuest(stored.eventCode, stored.guestName).then(async (response) => {
        if (response.status === 200 && response.guest?.guestId) {
          setGuestData(response)
          setUsedStorage(Number(response.usedStorage) || 0)
          setStorageLimit(Number(response.storageLimit) || 0)
          setEventName(response.eventName || "")

          // Load photos for all tabs
          await loadAllPhotos(response.guest.guestId)

          const messagesRes = await fetchGuestMessages(stored.eventCode, stored.guestId)
          if (messagesRes.status === 200 && messagesRes.messages) {
            setGuestMessages(
              messagesRes.messages.map((msg, idx) => ({
                _id: String(idx),
                text: msg,
              })),
            )
          }

          if (stored.expiresAt) {
            const remainingTime = stored.expiresAt - Date.now()
            if (remainingTime > 0) {
              setTimeout(() => {
                localStorage.removeItem("snaptogether-guest")
                console.log("✅ Session expired: localStorage cleared")
              }, remainingTime)
            }
          }
        }
      })
    }
  }, [eventCode])

  const handleVerifyGuest = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!guestName.trim()) {
      setError(t("error"))
      return
    }

    setLoading(true)
    setError("")

    const response = await verifyGuest(eventCode, guestName)

    if (response.status === 200) {
      if (!response.guest?.guestId) {
        setError("Guest ID not found.")
        setLoading(false)
        return
      }

      setGuestData(response)
      setUsedStorage(Number(response.usedStorage) || 0)
      setStorageLimit(Number(response.storageLimit) || 0)
      setEventName(response.eventName || "")

      // Load photos for all tabs
      await loadAllPhotos(response.guest.guestId)

      const messagesRes = await fetchGuestMessages(eventCode, response.guest.guestId)
      if (messagesRes.status === 200 && messagesRes.messages) {
        setGuestMessages(
          messagesRes.messages.map((msg, idx) => ({
            _id: String(idx),
            text: msg,
          })),
        )
      }
    } else {
      setError(response.message)
    }

    setLoading(false)
  }

  const handleDeleteMessage = (text: string) => {
    setGuestMessages((prev) => prev.filter((msg) => msg.text !== text))
  }

  const handlePhotosUploaded = async (newPhotos: { _id: string; url: string }[], isPrivate: boolean) => {
    console.log("🔄 Photos uploaded:", { newPhotos, isPrivate })

    // Always refresh my uploads to include the new photos
    if (guestData?.guest?.guestId) {
      const myUploadsResponse = await fetchGuestPhotos(eventCode, guestData.guest.guestId)
      if (myUploadsResponse.status === 200) {
        setMyUploads(myUploadsResponse.photos || [])
        console.log("🔄 Refreshed my uploads")
      }
    }

    // Update the appropriate tab based on upload type
    if (isPrivate) {
      // Refresh private photos
      if (guestData?.guest?.guestId) {
        const privateResponse = await fetchPrivatePhotos(eventCode, guestData.guest.guestId)
        if (privateResponse.status === 200) {
          setPrivatePhotos(privateResponse.photos || [])
          console.log("🔄 Refreshed private photos")
        }
      }
    } else {
      // Refresh public photos
      const publicResponse = await fetchPublicPhotos(eventCode)
      if (publicResponse.status === 200) {
        setPublicPhotos(publicResponse.photos || [])
        console.log("🔄 Refreshed public photos")
      }
    }
  }

  const handlePhotoDelete = async (photoId: string, isPrivate: boolean) => {
    // Remove from appropriate tab
    if (isPrivate) {
      setPrivatePhotos((prev) => prev.filter((p) => p._id !== photoId))
    } else {
      // Refresh public gallery after deletion
      const publicResponse = await fetchPublicPhotos(eventCode)
      if (publicResponse.status === 200) {
        setPublicPhotos(publicResponse.photos || [])
      }
    }

    // Refresh my uploads
    if (guestData?.guest?.guestId) {
      const myUploadsResponse = await fetchGuestPhotos(eventCode, guestData.guest.guestId)
      if (myUploadsResponse.status === 200) {
        setMyUploads(myUploadsResponse.photos || [])
      }
    }
  }

  useEffect(() => {
    if (!guestData?.guest?.guestId || !eventCode) return

    const room = `${eventCode}-${guestData.guest.guestId}`
    socket.emit("join", room)

    socket.on("newMessage", ({ message }) => {
      setGuestMessages((prev) => [...prev, { _id: String(Date.now()), text: message }])
    })

    socket.on("messageDeleted", ({ text }) => {
      setGuestMessages((prev) => prev.filter((msg) => msg.text !== text))
    })

    return () => {
      socket.emit("leave", room)
      socket.off("newMessage")
      socket.off("messageDeleted")
    }
  }, [eventCode, guestData?.guest?.guestId])

  // Tab content components
  const privatePhotosTabContent = (
    <div className="flex flex-col gap-3 text-center p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg w-full">
      <div className="flex items-center justify-center gap-2">
        <Lock className="w-5 h-5" color="white"/>
        <h3 className="text-lg font-semibold text-slate-50">{t("tabs.privateTitle")}</h3>
      </div>

      <p className="text-sm text-gray-300">{t("tabs.privateDesc")}</p>

      {privatePhotos && privatePhotos.length > 0 ? (
        <div className="relative w-full">
          <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 p-2">
            <PhotoGallery
              photos={privatePhotos}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={Math.ceil(privatePhotos.length / photosPerPage)}
              totalPhotos={privatePhotos.length}
              eventCode={eventCode}
              guestId={guestData?.guest?.guestId}
              onDelete={(photoId) => handlePhotoDelete(photoId, true)}
              showDeleteButtons={false}
            />
          </div>
        </div>
      ) : (
        <p className="relative text-sm text-gray-300">
          {t("noPhotos")} <CornerRightDown className="absolute bottom-[-12px] right-0 inline-block w-7 h-7 ml-1" />
        </p>
      )}

      <Upload
        eventCode={eventCode}
        guestId={guestData?.guest?.guestId || ""}
        onPhotosUploaded={(newPhotos) => handlePhotosUploaded(newPhotos, true)}
        usedStorage={usedStorage}
        storageLimit={storageLimit}
        isPrivate={true}
        loading={privateUploadLoading}
        uploadProgress={privateUploadProgress}
        setLoading={setPrivateUploadLoading}
        setUploadProgress={setPrivateUploadProgress}
      />

      <p className="text-sm text-gray-300 text-center">{t("maxFiles")}</p>
    </div>
  )

  const publicPhotosTabContent = (
    <div className="flex flex-col gap-3 text-center p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg w-full">
      <div className="flex items-center justify-center gap-2">
        <Globe className="w-5 h-5" color="white"/>
        <h3 className="text-lg font-semibold text-slate-50">{t("tabs.publicTitle")}</h3>
      </div>

      <p className="text-sm text-gray-300">{t("tabs.publicDesc")}</p>

      {publicPhotos && publicPhotos.length > 0 ? (
        <div className="relative w-full">
          <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 p-2">
            <PhotoGallery
              photos={publicPhotos}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={Math.ceil(publicPhotos.length / photosPerPage)}
              totalPhotos={publicPhotos.length}
              eventCode={eventCode}
              guestId={guestData?.guest?.guestId}
              showDeleteButtons={false}
            />
          </div>
        </div>
      ) : (
        <p className="relative text-sm text-gray-300">
          No public photos yet <CornerRightDown className="absolute bottom-[-12px] right-0 inline-block w-7 h-7 ml-1" />
        </p>
      )}

      <Upload
        eventCode={eventCode}
        guestId={guestData?.guest?.guestId || ""}
        onPhotosUploaded={(newPhotos) => handlePhotosUploaded(newPhotos, false)}
        usedStorage={usedStorage}
        storageLimit={storageLimit}
        isPrivate={false}
        loading={publicUploadLoading}
        uploadProgress={publicUploadProgress}
        setLoading={setPublicUploadLoading}
        setUploadProgress={setPublicUploadProgress}
      />

      <p className="text-sm text-gray-300 text-center">{t("maxFiles")}</p>
    </div>
  )

  const myUploadsTabContent = (
    <div className="flex flex-col gap-3 text-center p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg w-full">
      <div className="flex items-center justify-center gap-2">
        <User className="w-5 h-5" color="white"/>
        <h3 className="text-lg font-semibold text-slate-50">{t("tabs.publicTitle")}</h3>
      </div>

      <p className="text-sm text-gray-300">{t("tabs.myUploadsDesc")}</p>

      {myUploads && myUploads.length > 0 ? (
        <div className="relative w-full">
          <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 p-2">
            <PhotoGallery
              photos={myUploads}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={Math.ceil(myUploads.length / photosPerPage)}
              totalPhotos={myUploads.length}
              eventCode={eventCode}
              guestId={guestData?.guest?.guestId}
              onDelete={async (photoId) => {
                // Remove from my uploads and refresh all tabs
                setMyUploads((prev) => prev.filter((p) => p._id !== photoId))
                setPrivatePhotos((prev) => prev.filter((p) => p._id !== photoId))

                // Refresh public photos to reflect deletion
                const publicResponse = await fetchPublicPhotos(eventCode)
                if (publicResponse.status === 200) {
                  setPublicPhotos(publicResponse.photos || [])
                }
              }}
              showDeleteButtons={true}
            />
          </div>
        </div>
      ) : (
        <p className="relative text-sm text-gray-300">
          {t("tabs.noPublicPhotos")}{" "}
          <CornerRightDown className="absolute bottom-[-12px] right-0 inline-block w-7 h-7 ml-1" />
        </p>
      )}

      <p className="text-sm text-gray-300 text-center">{t("tabs.hintUploadInOtherTabs")}</p>
    </div>
  )

  return (
    <div className="guest-dashboard relative h-full flex flex-col">
      <Navbar />
      <div className="w-[95%] mb-[10vh] sm:w-full flex flex-col items-center justify-center pt-[13vh] mx-auto space-y-4">
        <h2 className="text-white text-2xl font-semibold text-center flex flex-col items-center justify-center gap-3">
          <p>{t("title")}</p>
          <p className="text-sm">{guestData?.guest?.guestName}</p>
        </h2>

        <h2 className="text-white text-2xl font-semibold text-center flex flex-col items-center justify-center italic">
          {eventName}
        </h2>

        {!guestData ? (
          <form
            onSubmit={handleVerifyGuest}
            className="max-w-[40em] container mx-auto space-y-3 p-6 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg"
          >
            <p className="text-gray-300 text-center">{t("instruction")}</p>
            <input
              type="text"
              placeholder={t("inputPlaceholder")}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-black"
            />
            <Button type="submit" className="w-full bg-[rgba(120,128,181,0.8)]" disabled={loading} variant="primary">
              {loading ? t("verifying") : t("verifyButton")}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-center container mx-auto max-w-[40em]">
            <Tabs
              defaultTabId="public"
              tabs={[
                {
                  id: "private",
                  label:  t("tabsLabels.privateTitle"),
                  content: privatePhotosTabContent,
                },
                {
                  id: "public",
                  label: t("tabsLabels.publicTitle"),
                  content: publicPhotosTabContent,
                },
                {
                  id: "my-uploads",
                  label: t("tabsLabels.myUploadsTitle"),
                  content: myUploadsTabContent,
                },
              ]}
            />

            <Divider width="full" border={true} />

            <div className="mx-auto w-full box-border p-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg">
              <h2 className="text-white text-md font-medium mb-2">{t("leaveMessage")}</h2>
              <textarea
                className="w-full rounded-md p-3 bg-white/95 text-gray-800 border border-gray-600 focus:outline-none focus:ring focus:border-blue-500 min-h-[100px]"
                placeholder={t("messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="mt-3 w-full !bg-[rgba(120,128,181,0.8)]"
                variant="primary"
                disabled={submitting || !message.trim()}
                onClick={async () => {
                  setSubmitting(true)

                  const res = await submitGuestMessage(
                    eventCode.toString(),
                    guestData?.guest?.guestId || "",
                    message.trim(),
                  )

                  if (res.status === 200) {
                    setMessage("")

                    setGuestMessages((prev) => [
                      ...prev,
                      {
                        _id: String(Date.now()),
                        text: message.trim(),
                      },
                    ])
                  }

                  setSubmitting(false)
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
  )
}
