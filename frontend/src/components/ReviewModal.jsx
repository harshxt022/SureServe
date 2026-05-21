import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            await api.post('/reviews', {
                bookingId: booking._id,
                rating,
                comment
            });
            toast.success('Review submitted successfully');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                <div className="flex justify-between items-center p-6 border-b border-[#E8E8E4]">
                    <h2 className="text-xl font-bold font-heading text-[#1A1A1A]">Leave a Review</h2>
                    <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-[#6B6B6B] mb-6">
                        How was your experience with <strong>{booking.providerId?.name}</strong> for <strong>{booking.serviceId?.name}</strong>?
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={`text-4xl transition-colors ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Comment (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm text-[#1A1A1A] resize-none"
                                placeholder="Share details of your experience..."
                                maxLength="500"
                            ></textarea>
                            <div className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-[#1A1A1A] border border-[#E8E8E4] hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
