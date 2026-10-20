import { Review } from '@/lib/types';
import Image from 'next/image';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Only show approved and public reviews
  const publicReviews = reviews.filter(
    (review) => review.status === 'approved' && review.isPublic
  );

  if (publicReviews.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInDays < 7) {
      return diffInDays === 0 ? 'Today' : diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    } else {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 ${
              star <= rating ? 'text-[#759CC9] fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-16 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">What our clients say</h2>
        <button className="text-[#759CC9] font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicReviews.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            {/* Stars */}
            <div className="mb-4">{renderStars(review.rating)}</div>

            {/* Comment */}
            <p className="text-gray-700 text-base mb-6 line-clamp-4">
              {review.comment || 'Great service!'}
            </p>

            {/* Client Info */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {review.client?.profilePic ? (
                  <Image
                    src={review.client.profilePic}
                    alt={review.client.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#759CC9] text-white font-semibold text-lg">
                    {review.client?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {review.client?.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">{formatTimeAgo(review.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
