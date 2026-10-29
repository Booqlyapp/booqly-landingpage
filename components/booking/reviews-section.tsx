'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';

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

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5 shrink-0" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? 'text-black fill-current' : 'text-gray-300 fill-current'
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
      <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-3">
        Reviews
      </h2>

      <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-sm text-neutral-700">
          <svg className="w-3.5 h-3.5 fill-current text-black shrink-0" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>
            <span className="font-semibold text-black">{avgRating.toFixed(1)}</span>
            <span className="text-neutral-500">
              {' '}
              · {publicReviews.length}{' '}
              {publicReviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-sm font-semibold text-black underline underline-offset-2 shrink-0"
        >
          {showAll ? 'Show less' : 'View all'}
        </button>
      </div>

      <div>
        {visible.map((review) => (
          <div
            key={review.id}
            className="py-5 border-b border-gray-200 first:pt-0"
          >
            <p className="text-neutral-800 text-[15px] leading-relaxed mb-4">
              {review.comment || 'Great service!'}
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm min-w-0 truncate">
                <span className="font-semibold text-black">
                  {review.client?.name || 'Anonymous'}
                </span>
                <span className="text-neutral-500">
                  {' '}
                  · {formatTimeAgo(review.createdAt)}
                </span>
              </p>
              {renderStars(review.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
