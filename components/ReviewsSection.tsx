'use client'

import { useState } from 'react'
import { Review } from '@/lib/products'
import { ReviewCard } from './ReviewCard'
import { StarRating } from './StarRating'

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
}

export function ReviewsSection({ reviews, averageRating }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return b.rating - a.rating
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const percentage = (count / reviews.length) * 100
    return { star, count, percentage }
  })

  return (
    <section className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <div className="text-5xl font-bold text-orange-400 mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-4">
            <StarRating rating={Math.round(averageRating)} size="lg" />
          </div>
          <p className="text-slate-400 text-sm">Based on {reviews.length} verified reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 bg-slate-800 rounded-lg p-8">
          <h3 className="font-semibold text-white mb-6">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 min-w-fit">{star} stars</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm text-slate-400 min-w-fit">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-6">
        <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-700 text-white text-sm rounded-lg px-4 py-2 border border-slate-600 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
    </section>
  )
}
