'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ProductImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative w-full bg-slate-800 rounded-lg overflow-hidden aspect-square">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - View ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index ? 'border-orange-500' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
