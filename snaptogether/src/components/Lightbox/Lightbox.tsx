"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import { ChevronLeft, ChevronRight, X, Download } from "lucide-react"
import Button from "../Button/Button"
import type { Photo } from "@/api/event"
import { downloadSinglePhotoByS3Key } from "@/api/photo"

interface LightboxProps {
  isOpen: boolean
  images: Photo[]
  selectedIndex: number
  onClose: () => void
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, selectedIndex, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(selectedIndex)
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: selectedIndex,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    loop: false,
  })

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && instanceRef.current) {
      instanceRef.current.moveToIdx(selectedIndex, true)
      setCurrentSlide(selectedIndex)
    }
  }, [isOpen, selectedIndex, instanceRef])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !images.length || !mounted) return null

  const downloadImage = async () => {
    const image = images[currentSlide]
    const url = new URL(image.imageUrl)
    const s3Key = url.pathname.slice(1)
    await downloadSinglePhotoByS3Key(s3Key)
  }

  const lightboxContent = (
<div
  ref={overlayRef}
  className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
  onClick={(e) => {
    if (e.currentTarget === e.target) {
      onClose()
    }
  }}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
  }}
>

      {/* Content container */}
      <div
        className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()} // 👈 prevent inner clicks from closing
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 py-2 px-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X size={24} />
        </button>

        {/* Download button */}
        <Button
          className="absolute top-4 right-20 z-10 text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          onClick={downloadImage}
          iconLeft={<Download size={20} />}
          variant="tertiary"
          aria-label="Download image"
        />

        {/* Image counter */}
        <div className="absolute top-4 left-4 z-10 text-white bg-black/50 px-3 py-2 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1} / {images.length}
        </div>

        {/* Slider container */}
        <div ref={sliderRef} className="keen-slider w-full h-full max-h-[90vh]">
          {images.map((image, idx) => {
            const isVideo = image.imageUrl.match(/\.(mp4|webm|mov)$/i)
            return (
              <div key={idx} className="keen-slider__slide flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={image.imageUrl}
                    controls
                    preload="metadata"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                  />
                ) : (
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`Image ${idx + 1}`}
                    width={1200}
                    height={800}
                    unoptimized
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => instanceRef.current?.prev()}
              disabled={currentSlide === 0}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => instanceRef.current?.next()}
              disabled={currentSlide === images.length - 1}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Thumbnail navigation for small galleries */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  idx === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Use portal to render at document root level
  return createPortal(lightboxContent, document.body)
}

export default Lightbox
