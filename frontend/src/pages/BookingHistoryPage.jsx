import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import ChatModal from '../components/ChatModal';
import ReviewModal from '../components/ReviewModal';

const BookingHistoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    
    const [activeChatBooking, setActiveChatBooking] = useState(null);
    const [reviewBooking, setReviewBooking] = useState(null);

    const isProvider = user?.role === 'provider';

    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true);
            const endpoint = isProvider ? '/provider/bookings' : '/bookings/me';
            const query = new URLSearchParams({ page, limit: 10 });
            if (statusFilter) query.append('status', statusFilter);
            
            const res = await api.get(`${endpoint}?${query.toString()}`);
            setBookings(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to load bookings:', err);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings(1);
    }, [user, statusFilter]);

    const handleCustomerCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled');
            fetchBookings(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleDownloadInvoice = async (bookingId) => {
        try {
            const res = await api.get(`/payments/invoice/${bookingId}`);
            const invoice = res.data;
            const content = `INVOICE: ${invoice.invoiceNumber}\nDate: ${new Date(invoice.date).toLocaleDateString()}\nStatus: ${invoice.status}\nCustomer: ${invoice.customer.name}\nProvider: ${invoice.provider.name}\nService: ${invoice.service.name}\nAmount: ₹${invoice.pricing.total}`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${invoice.invoiceNumber}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download invoice');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">PENDING</span>;
            case 'ACCEPTED': return <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">ACCEPTED</span>;
            case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">IN_PROGRESS</span>;
            case 'COMPLETED': return <span className="bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full">COMPLETED</span>;
            case 'REVIEWED': return <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-bold px-3 py-1 rounded-full">REVIEWED</span>;
            case 'CANCELLED': 
            case 'EXPIRED':
            case 'REJECTED': return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-[#1A1A1A] tracking-tight">Booking History</h1>
                    <p className="text-[#6B6B6B] mt-1">View and manage all your past and upcoming services.</p>
                </div>

                <div className="flex gap-2 bg-white rounded-xl p-1.5 border border-[#E8E8E4] shadow-sm overflow-x-auto w-full md:w-auto">
                    {['', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#1A1A1A] text-white' : 'text-[#6B6B6B] hover:bg-gray-50'}`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🗓️</div>
                        <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-2">No bookings found</h3>
                        <p className="text-[#6B6B6B]">You don't have any bookings matching this status.</p>
                        {!isProvider && <button onClick={() => navigate('/services')} className="mt-4 text-[#4F46E5] font-bold hover:underline">Book a Service</button>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-[#E8E8E4] bg-[#FAFAF8] text-xs uppercase tracking-wider text-[#6B6B6B]">
                                    <th className="px-6 py-4 font-bold">Service Info</th>
                                    <th className="px-6 py-4 font-bold">{isProvider ? 'Customer' : 'Provider'}</th>
                                    <th className="px-6 py-4 font-bold">Schedule</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E8E4]">
                                {bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1A1A1A]">{b.serviceId?.name}</div>
                                            <div className="text-xs text-[#6B6B6B]">ID: {b.booking_code || b._id.substring(0,8)}</div>
                                            <div className="text-xs font-semibold text-[#4F46E5] mt-1">₹{b.pricing?.total}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1A1A1A]">{isProvider ? b.customerId?.name : b.providerId?.name}</div>
                                            {isProvider && <div className="text-xs text-[#6B6B6B]">{b.customerId?.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[#1A1A1A] text-sm">{dayjs(b.scheduledDate).format('MMM D, YYYY')}</div>
                                            <div className="text-xs text-[#6B6B6B]">{b.slotStart} - {b.slotEnd}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="mb-2">{getStatusBadge(b.status)}</div>
                                            {b.paymentStatus === 'PAID' ? (
                                                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-sm"><i className="fas fa-check-circle"></i> PAID</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">UNPAID</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => setActiveChatBooking(b)} className="text-[#4F46E5] hover:text-[#4338CA]" title="Chat">
                                                <i className="fas fa-comment-dots text-lg"></i>
                                            </button>
                                            
                                            {!isProvider && b.status === 'PENDING' && (
                                                <button onClick={() => handleCustomerCancel(b._id)} className="text-red-500 hover:text-red-700" title="Cancel">
                                                    <i className="fas fa-times-circle text-lg"></i>
                                                </button>
                                            )}
                                            
                                            {!isProvider && b.status === 'COMPLETED' && (
                                                <button onClick={() => setReviewBooking(b)} className="text-[#F59E0B] hover:text-yellow-600 font-bold text-sm bg-yellow-50 px-3 py-1 rounded-md">
                                                    Review
                                                </button>
                                            )}

                                            {b.paymentStatus === 'PAID' && (
                                                <button onClick={() => handleDownloadInvoice(b._id)} className="text-[#6B6B6B] hover:text-[#1A1A1A] ml-2" title="Download Invoice">
                                                    <i className="fas fa-file-invoice text-lg"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => fetchBookings(pagination.page - 1)}
                        className="w-10 h-10 rounded-xl border border-[#E8E8E4] flex items-center justify-center bg-white text-[#1A1A1A] disabled:opacity-50 hover:bg-gray-50"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => fetchBookings(i + 1)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition-colors ${pagination.page === i + 1 ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-[#E8E8E4] bg-white text-[#1A1A1A] hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchBookings(pagination.page + 1)}
                        className="w-10 h-10 rounded-xl border border-[#E8E8E4] flex items-center justify-center bg-white text-[#1A1A1A] disabled:opacity-50 hover:bg-gray-50"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}

            {activeChatBooking && (
                <ChatModal 
                    booking={activeChatBooking} 
                    user={user} 
                    onClose={() => setActiveChatBooking(null)} 
                />
            )}

            {reviewBooking && (
                <ReviewModal 
                    booking={reviewBooking} 
                    onClose={() => setReviewBooking(null)} 
                    onSuccess={() => fetchBookings(pagination.page)}
                />
            )}
        </main>
    );
};

export default BookingHistoryPage;
