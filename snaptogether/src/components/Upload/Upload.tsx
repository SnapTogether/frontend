"use client"

import type React from "react"
import imageCompression from "browser-image-compression"
import { getPresignedUrl, uploadPhotosForGuest, uploadToS3 } from "@/api/photo"
import { useTranslations } from "next-intl"
import { ImageOff, ImagePlus } from "lucide-react"

export default function Upload({
  eventCode,
  guestId,
  onPhotosUploaded,
  usedStorage,
  storageLimit,
  isPrivate,
  loading,
  uploadProgress,
  setLoading,
  setUploadProgress,
}: {
  eventCode: string
  guestId: string
  onPhotosUploaded: (newPhotos: { _id: string; url: string }[]) => void
  usedStorage: number
  storageLimit: number
  isPrivate: boolean
  loading: boolean
  uploadProgress: number
  setLoading: (loading: boolean) => void
  setUploadProgress: (progress: number) => void
}) {
  type SavedPhoto = {
    _id?: string
    photoId?: string
    imageUrl?: string
    videoUrl?: string
  }

  const isLimitReached = usedStorage >= storageLimit
  const t = useTranslations("upload")

  const MAX_FILES = 10

  const getProgressText = (percent: number) => {
    if (percent === 0) return t("startingUpload")
    if (percent < 20) return t("warmingUp")
    if (percent < 40) return t("inProgress")
    if (percent < 60) return t("almostThere")
    if (percent < 80) return t("nearlyDone")
    if (percent < 100) return t("finishingUp")
    return t("done")
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // 🔍 Debug: Log the isPrivate value at the start
    console.log("🔍 Upload component - isPrivate value:", isPrivate)

    const remainingSlots = Math.min(MAX_FILES, storageLimit - usedStorage)
    if (files.length > remainingSlots) {
      alert(t("maxFiles"))
      return
    }

    if (!guestId) {
      alert(t("missingGuestId"))
      return
    }

    setLoading(true)
    setUploadProgress(0)

    const optimizedFiles = await Promise.all(
      Array.from(files).map(async (file) =>
        file.type.startsWith("image/")
          ? await imageCompression(file, {
              maxSizeMB: 2,
              maxWidthOrHeight: 1080,
              useWebWorker: true,
              fileType: "image/webp",
            })
          : file,
      ),
    )

    const uploadedFiles: { imageUrl: string; s3Key: string; fileSize: number }[] = []

    const MAX_DIRECT_UPLOAD_MB = 2.5

    for (let i = 0; i < optimizedFiles.length; i++) {
      const file = optimizedFiles[i]
      const isLargeVideo = file.type.startsWith("video/") && file.size > MAX_DIRECT_UPLOAD_MB * 1024 * 1024

      try {
        if (isLargeVideo) {
          console.log(`📡 Uploading ${file.name} via BACKEND (size: ${(file.size / 1024 / 1024).toFixed(2)} MB)`)

          const { photos } = await uploadPhotosForGuest(eventCode, guestId, [file], (percent) => {
            const totalProgress = ((i + percent / 100) / optimizedFiles.length) * 100
            setUploadProgress(Math.round(totalProgress))
          },isPrivate)

          if (photos && photos.length > 0) {
            uploadedFiles.push({
              imageUrl: photos[0].url,
              s3Key: photos[0].url.split(".amazonaws.com/")[1],
              fileSize: file.size,
            })
          }
        } else {
          console.log(`☁️ Uploading ${file.name} DIRECTLY to S3 (size: ${(file.size / 1024 / 1024).toFixed(2)} MB)`)

          const { url, publicUrl, key: s3Key } = await getPresignedUrl(file, eventCode, guestId)
          await uploadToS3(file, url, (percent) => {
            const totalProgress = ((i + percent / 100) / optimizedFiles.length) * 100
            setUploadProgress(Math.round(totalProgress))
          })

          uploadedFiles.push({
            imageUrl: publicUrl,
            s3Key,
            fileSize: file.size,
          })
        }

        setUploadProgress(Math.round(((i + 1) / optimizedFiles.length) * 100))
      } catch (err) {
        console.error("Upload failed:", err)
        alert(t("uploadFailed"))
        break
      }
    }

    console.log("📦 Sending uploadedFiles to backend:", uploadedFiles)

    if (uploadedFiles.length > 0) {
      // 🔍 Debug: Log the payload being sent to backend
      const payload = {
        eventCode,
        guestId,
        files: uploadedFiles,
        isPrivate,
      }
      console.log("🔍 Backend payload:", payload)

      const saveRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (saveRes.ok) {
        const saved = await saveRes.json()
        console.log("🔍 Backend response:", saved)

        const normalized = (saved.photos || []).map((p: SavedPhoto) => ({
          _id: p._id ?? p.photoId ?? "",
          url: p.imageUrl ?? p.videoUrl ?? "",
        }))

        onPhotosUploaded(normalized)
      } else {
        const errorText = await saveRes.text()
        console.error("❌ Backend error response:", errorText)
        alert(t("uploadFailed"))
        console.error("❌ Saving photo metadata failed")
      }
    }

    setLoading(false)
    setUploadProgress(0)
  }

  // Generate unique ID for each upload component instance
  const uploadId = `file-upload-${isPrivate ? "private" : "public"}`

  // 🔍 Debug: Log component render with isPrivate value
  console.log(`🔍 Upload component rendering - isPrivate: ${isPrivate}, uploadId: ${uploadId}`)

  return (
    <div className="w-full border rounded-lg mx-auto space-y-4">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id={uploadId}
        disabled={isLimitReached}
      />

      <label
        htmlFor={uploadId}
        className={`text-md font-medium flex items-center justify-center w-full cursor-pointer rounded-md !m-0 p-4 
          ${isLimitReached ? "bg-gray-500 cursor-not-allowed" : "bg-slate-100 font-bold hover:bg-slate-300 text-black hover:text-black hover:font-semibold"} 
          transition-all duration-300 ease-in-out`}
      >
        <span className="w-full h-full !rounded-none font-semibold">
          {isLimitReached ? (
            <div className="flex items-center justify-center gap-3">
              <ImageOff width={20} height={20} /> {t("storageFull")}
            </div>
          ) : loading ? (
            `${getProgressText(uploadProgress)} (${uploadProgress}%)`
          ) : (
            <div className="flex items-center justify-center gap-3">
              <ImagePlus width={20} height={20} /> {t("chooseImages")}
              {/* 🔍 Debug indicator */}
            </div>
          )}
        </span>
      </label>

      {loading && (
        <div className="w-full bg-white/20 rounded h-2 overflow-hidden">
          <div className="bg-blue-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}
    </div>
  )
}
