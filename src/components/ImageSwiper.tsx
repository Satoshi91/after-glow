'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ImageSwiperProps {
  images: Array<{
    id: string
    storage_url: string
    original_filename: string | null
  }>
  currentImageId: string
}

export default function ImageSwiper({ images, currentImageId }: ImageSwiperProps) {
  const router = useRouter()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isTapMode, setIsTapMode] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const currentIndex = images.findIndex(img => img.id === currentImageId)
  const currentImage = images[currentIndex]
  const prevImage = images[currentIndex - 1]
  const nextImage = images[currentIndex + 1]

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    if (isTapMode) return
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
    setSwipeOffset(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (isTapMode) return
    const currentTouch = e.targetTouches[0].clientY
    setTouchEnd(currentTouch)
    setIsSwiping(true)

    if (touchStart) {
      const offset = currentTouch - touchStart
      setSwipeOffset(offset)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTapMode) return

    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > minSwipeDistance

    if (isSwipe) {
      if (distance > 0 && nextImage) {
        // 上スワイプ（次の画像へ）
        router.push(`/image/${nextImage.id}`)
      } else if (distance < 0 && prevImage) {
        // 下スワイプ（前の画像へ）
        router.push(`/image/${prevImage.id}`)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsSwiping(false)
    setSwipeOffset(0)
  }

  const onImageTap = () => {
    setIsTapMode(!isTapMode)
  }

  return (
    <div
      className="fixed inset-0 bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full">
        {/* 前の画像 */}
        {prevImage && (
          <div 
            className="absolute inset-0 transition-transform duration-300"
            style={{
              transform: `translateY(${swipeOffset > 0 ? 100 : 0}%)`,
              zIndex: swipeOffset > 0 ? 10 : 0
            }}
          >
            <Image
              src={prevImage.storage_url}
              alt={prevImage.original_filename || '画像'}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* 現在の画像 */}
        <div 
          className={`absolute inset-0 transition-transform duration-300 ${isSwiping ? 'scale-95' : 'scale-100'}`}
          style={{
            transform: `translateY(${swipeOffset}px)`,
            zIndex: 20
          }}
          onClick={onImageTap}
        >
          <Image
            src={currentImage.storage_url}
            alt={currentImage.original_filename || '画像'}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 次の画像 */}
        {nextImage && (
          <div 
            className="absolute inset-0 transition-transform duration-300"
            style={{
              transform: `translateY(${swipeOffset < 0 ? -100 : 0}%)`,
              zIndex: swipeOffset < 0 ? 10 : 0
            }}
          >
            <Image
              src={nextImage.storage_url}
              alt={nextImage.original_filename || '画像'}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* 戻るボタン - タップモードでないときのみ表示 */}
        {!isTapMode && (
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 z-30 bg-black/50 text-white p-2 rounded-full"
          >
            ←
          </button>
        )}

        {/* タップモードのヒント - 初回のみ表示 */}
        {!isTapMode && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-30">
            画像をタップして拡大表示
          </div>
        )}
      </div>
    </div>
  )
} 