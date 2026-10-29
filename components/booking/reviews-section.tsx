'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import Image from 'next/image';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const publicReviews = reviews.filter(
    (review) => review.status === 'approved' && review.isPublic
  );

  if (publicReviews.length === 0) {
    return null;
  }

  const avgRating =
    publicReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
    publicReviews.length;
  const visible = showAll ? publicReviews : publicReviews.slice(0, 3);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInDays < 7) {
      return diffInDays === 0
        ? 'Today'
        : diffInDays === 1
          ? '1 day ago'
          : `${diffInDays} days ago`;
    }
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    }
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  };

  const renderStars = (rating: number, size = 'w-3.5 h-3.5') => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size} ${
            star <= rating ? 'text-black fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section id="reviews" className="scroll-mt-28 py-10 border-t border-gray-100">
      <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-4">
        Reviews
      </h2>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium">
            {avgRating.toFixed(1)} · {publicReviews.length}{' '}
            {publicReviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        {publicReviews.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm text-black underline underline-offset-2"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {visible.map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <p className="text-gray-800 text-[15px] leading-relaxed mb-3">
              {review.comment || 'Great service!'}
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {review.client?.profilePic ? (
                    <Image
                      src={review.client.profilePic}
                      alt={review.client.name || 'Reviewer'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs font-semibold">
                      {review.client?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-black truncate">
                  {review.client?.name || 'Anonymous'}
                  <span className="font-normal text-gray-500">
                    {' '}
                    · {formatTimeAgo(review.createdAt)}
                  </span>
                </p>
              </div>
              {renderStars(review.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
