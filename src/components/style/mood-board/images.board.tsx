'use client'

import Image from 'next/image'
import { MoodBoardImages } from '@/hooks/use-style'
import { cn } from '@/lib/utils'

interface ImageBoardProps {
  image: MoodBoardImages
  removeImage: (imageId: string) => Promise<void>
  xOffset: number
  yOffset: number
  rotation: number
  zIndex: number
  marginLeft?: string
  marginTop?: string
}

export function ImageBoard({
  image,
  removeImage,
  xOffset,
  yOffset,
  rotation,
  zIndex,
  marginLeft,
  marginTop
}: ImageBoardProps) {
  return (
    <div
      className="absolute transition-transform duration-300 ease-out"
      style={{
        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
        zIndex,
        marginLeft,
        marginTop
      }}
    >
      <div 
        className="relative w-40 h-48 rounded-2xl overflow-hidden bg-white shadow-xl border border-border/20 hover:scale-105 transition-all duration-200 cursor-pointer"
        onClick={() => removeImage(image.id)}
      >
        {image.preview ? (
          <Image 
            src={image.preview}
            alt="Mood board image"
            fill
            className="object-cover"
          />
        ) : null}
        {image.uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  )
}