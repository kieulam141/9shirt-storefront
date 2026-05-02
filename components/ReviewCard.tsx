'use client'

import { StarRating } from './StarRating'

interface ReviewCardProps {
  customerName: string
  rating: number
  title: string
  text: string
  date: string
  verified: boolean
}

export function ReviewCard({ customerName, rating, title, text, date, verified }: ReviewCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-white">{customerName}</h4>
            {verified && (
              <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Purchase
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{formattedDate}</p>
        </div>
        <StarRating rating={rating} size="md" />
      </div>

      <div className="space-y-2">
        <h5 className="font-semibold text-white text-base">{title}</h5>
        <p className="text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
