'use client'

import { useState, useEffect } from 'react'

export function VideoPlayer({ src, poster, productName }: { src: string; poster?: string; productName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if video file exists
    const checkVideo = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' })
        if (!response.ok) {
          setHasError(true)
        }
      } catch {
        setHasError(true)
      }
    }

    checkVideo()
  }, [src])

  if (hasError) {
    return (
      <div className="relative w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center border border-slate-700">
        <div className="text-center space-y-4 p-8">
          <svg className="w-16 h-16 text-orange-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-white font-semibold text-lg">Product Demo Video</h3>
            <p className="text-slate-400 mt-2 text-sm">
              {productName ? `Watch the ${productName} in action!` : 'See the product in action'}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-slate-500 text-xs">
              High-quality 3D product demonstration and fit showcase
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
      <video
        className="w-full h-full"
        controls
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <button
            onClick={(e) => {
              const video = (e.currentTarget.closest('.relative') as HTMLElement)?.querySelector('video') as HTMLVideoElement
              video?.play()
            }}
            className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
