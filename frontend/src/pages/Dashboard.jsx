import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import ChatModal from '../components/ChatModal';
import AvailabilityModal from '../components/AvailabilityModal';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeChatBooking, setActiveChatBooking] = useState(null);
    const [showAvailability, setShowAvailability] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const endpoint = user?.role === 'provider' 
                ? '/dashboards/provider/dashboard' 
                : '/dashboards/customer/dashboard';
            const res = await api.get(endpoint);
            setData(res.data);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchDashboard();
    }, [user]);

    const handleProviderAction = async (bookingId, action) => {
        try {
            if (action === 'reject') {
                const reason = prompt('Reason for rejection?');
                if (!reason) return;
                await api.patch(`/provider/bookings/${bookingId}/reject`, { reason });
            } else if (action === 'start') {
                const otp = prompt('Enter 4-digit OTP from customer:');
                if (!otp) return;
                await api.patch(`/provider/bookings/${bookingId}/start`, { otp });
            } else {
                await api.patch(`/provider/bookings/${bookingId}/${action}`);
            }
            toast.success(`Booking ${action}ed successfully`);
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} booking`);
        }
    };

    const handleCustomerCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled');
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const isProvider = user?.role === 'provider';

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#E8E8E4] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#E8E8E4]">
                        <div>
                            <h1 className="text-4xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-2">
                                Welcome back, {user?.name?.split(' ')[0]}
                            </h1>
                            <p className="text-[#6B6B6B]">
                                {isProvider
                                    ? 'Manage your incoming service requests and schedule.'
                                    : 'Manage your home service bookings and address.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isProvider && (
                                <button
                                    onClick={() => setShowAvailability(true)}
                                    className="px-6 py-2.5 rounded-full border border-[#4F46E5]/20 bg-[#4F46E5]/5 text-[#4F46E5] font-semibold text-sm hover:bg-[#4F46E5] hover:text-white transition-all flex items-center gap-2"
                                >
                                    <i className="fas fa-calendar-alt"></i> Schedule Settings
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 rounded-full border border-[#E8E8E4] text-[#1A1A1A] font-semibold text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        {isProvider ? (
                            <>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-clock"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Pending Requests</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">{data?.stats?.pendingRequests || 0}</p>
                                </div>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-calendar-day"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Today's Jobs</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">{data?.stats?.todayJobsCount || 0}</p>
                                </div>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-wallet"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Week Earnings</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">₹{data?.stats?.weekEarnings || 0}</p>
                                </div>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-star"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Avg Rating</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">{data?.stats?.avgRating ? data.stats.avgRating.toFixed(1) : 'New'}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-calendar-check"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Active Bookings</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">{data?.stats?.upcomingCount || 0}</p>
                                </div>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4]">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-history"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Past Services</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">{data?.stats?.completedCount || 0}</p>
                                </div>
                                <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#E8E8E4] col-span-2">
                                    <div className="text-[#4F46E5] text-2xl mb-3"><i className="fas fa-wallet"></i></div>
                                    <h3 className="text-xs font-bold font-heading text-[#6B6B6B] uppercase tracking-wider mb-1">Total Spent</h3>
                                    <p className="text-3xl font-bold text-[#1A1A1A]">₹{data?.stats?.totalSpent || 0}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Lists Section */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        
                        {/* List 1 (Upcoming / Pending) */}
                        <div>
                            <h2 className="text-xl font-bold font-heading text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <i className={`fas ${isProvider ? 'fa-inbox' : 'fa-calendar-alt'} text-[#4F46E5]`}></i> 
                                {isProvider ? 'Pending Requests' : 'Upcoming Bookings'}
                            </h2>
                            
                            <div className="space-y-4">
                                {isProvider ? (
                                    data?.pendingRequests?.length === 0 ? (
                                        <div className="bg-[#FAFAF8] rounded-2xl p-8 text-center border border-[#E8E8E4] border-dashed">
                                            <p className="text-[#6B6B6B]">No pending requests right now.</p>
                                        </div>
                                    ) : (
                                        data?.pendingRequests?.map(b => (
                                            <div key={b._id} className="border border-[#E8E8E4] rounded-2xl p-5 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-[#1A1A1A]">{b.serviceId?.name}</h4>
                                                        <p className="text-sm text-[#6B6B6B]">{dayjs(b.scheduledDate).format('MMM D, YYYY')} @ {b.slotStart}</p>
                                                    </div>
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">PENDING</span>
                                                </div>
                                                <p className="text-sm text-[#6B6B6B] mb-1"><strong>Customer:</strong> {b.customerId?.name} ({b.customerId?.phone})</p>
                                                <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-1"><strong>Address:</strong> {b.address?.line1}, {b.address?.city}</p>
                                                
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleProviderAction(b._id, 'accept')} className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-xl text-sm font-semibold transition-colors">Accept</button>
                                                    <button onClick={() => handleProviderAction(b._id, 'reject')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-semibold transition-colors">Reject</button>
                                                </div>
                                                <button onClick={() => setActiveChatBooking(b)} className="w-full mt-2 text-sm text-[#4F46E5] font-semibold hover:underline">Chat with Customer</button>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    data?.upcoming?.length === 0 ? (
                                        <div className="bg-[#FAFAF8] rounded-2xl p-8 text-center border border-[#E8E8E4] border-dashed">
                                            <p className="text-[#6B6B6B]">No upcoming bookings.</p>
                                            <button onClick={() => navigate('/services')} className="text-[#4F46E5] text-sm font-semibold hover:underline mt-2">Book a Service</button>
                                        </div>
                                    ) : (
                                        data?.upcoming?.map(b => (
                                            <div key={b._id} className="border border-[#E8E8E4] rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                                                {/* Status bar */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${b.status === 'ACCEPTED' ? 'bg-green-500' : b.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                                
                                                <div className="flex justify-between items-start mb-3 ml-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">{b.serviceId?.icon}</div>
                                                        <div>
                                                            <h4 className="font-bold text-[#1A1A1A]">{b.serviceId?.name}</h4>
                                                            <p className="text-sm text-[#6B6B6B]">{dayjs(b.scheduledDate).format('MMM D, YYYY')} @ {b.slotStart}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-[#FAFAF8] p-3 rounded-xl ml-2 mb-3 border border-[#E8E8E4]">
                                                    <p className="text-sm text-[#1A1A1A]"><strong>Provider:</strong> {b.providerId?.name}</p>
                                                    <p className="text-sm text-[#1A1A1A]"><strong>OTP Code:</strong> <span className="tracking-widest font-mono font-bold text-[#4F46E5]">{b.otp}</span></p>
                                                    <p className="text-xs text-[#6B6B6B] mt-1">Share this OTP when the provider arrives.</p>
                                                </div>
                                                <div className="flex items-center gap-3 ml-2 mt-4 pt-4 border-t border-[#E8E8E4]">
                                                    {b.status === 'PENDING' && (
                                                        <button onClick={() => handleCustomerCancel(b._id)} className="text-sm text-red-500 font-medium hover:underline">Cancel Booking</button>
                                                    )}
                                                    <button onClick={() => setActiveChatBooking(b)} className="flex items-center gap-2 text-sm text-[#4F46E5] font-bold hover:text-[#4338CA] transition-colors">
                                                        <i className="fas fa-comment-dots"></i> Chat with Provider
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                                <div className="pt-2 text-center">
                                    <Link to="/bookings" className="text-sm font-semibold text-[#4F46E5] hover:underline">View All Bookings &rarr;</Link>
                                </div>
                            </div>
                        </div>

                        {/* List 2 (Past / Active Jobs) */}
                        <div>
                            <h2 className="text-xl font-bold font-heading text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <i className={`fas ${isProvider ? 'fa-briefcase' : 'fa-check-circle'} text-[#4F46E5]`}></i> 
                                {isProvider ? 'Active & Upcoming Jobs' : 'Past Services'}
                            </h2>
                            
                            <div className="space-y-4">
                                {isProvider ? (
                                    data?.todayJobs?.length === 0 ? (
                                        <div className="bg-[#FAFAF8] rounded-2xl p-8 text-center border border-[#E8E8E4] border-dashed">
                                            <p className="text-[#6B6B6B]">No active jobs scheduled.</p>
                                        </div>
                                    ) : (
                                        data?.todayJobs?.map(b => (
                                            <div key={b._id} className="border border-[#E8E8E4] rounded-2xl p-5 bg-[#FAFAF8] relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${b.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                                <div className="flex justify-between items-start mb-3 ml-2">
                                                    <div>
                                                        <h4 className="font-bold text-[#1A1A1A]">{b.serviceId?.name}</h4>
                                                        <p className="text-sm text-[#6B6B6B]">{dayjs(b.scheduledDate).format('MMM D, YYYY')} @ {b.slotStart}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${b.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {b.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#1A1A1A] ml-2 mb-4"><strong>Customer:</strong> {b.customerId?.name} ({b.customerId?.phone})</p>
                                                
                                                <div className="ml-2">
                                                    {b.status === 'ACCEPTED' && (
                                                        <button onClick={() => handleProviderAction(b._id, 'start')} className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md">Enter OTP to Start</button>
                                                    )}
                                                    {b.status === 'IN_PROGRESS' && (
                                                        <button onClick={() => handleProviderAction(b._id, 'complete')} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"><i className="fas fa-check mr-2"></i> Mark Completed</button>
                                                    )}
                                                    <button onClick={() => setActiveChatBooking(b)} className="w-full mt-2 text-sm text-[#4F46E5] font-semibold hover:underline text-center">Chat with Customer</button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    data?.past?.length === 0 ? (
                                        <div className="bg-[#FAFAF8] rounded-2xl p-8 text-center border border-[#E8E8E4] border-dashed">
                                            <p className="text-[#6B6B6B]">No past services yet.</p>
                                        </div>
                                    ) : (
                                        data?.past?.map(b => (
                                            <div key={b._id} className="border border-[#E8E8E4] rounded-2xl p-4 flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-[#1A1A1A] text-sm">{b.serviceId?.name}</h4>
                                                    <p className="text-xs text-[#4F46E5] font-semibold mb-0.5">{b.providerId?.name}</p>
                                                    <p className="text-xs text-[#6B6B6B]">{dayjs(b.scheduledDate).format('MMM D, YYYY')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#1A1A1A] text-sm">₹{b.pricing?.total}</p>
                                                    {b.status === 'COMPLETED' ? (
                                                        <button onClick={() => setReviewBooking(b)} className="text-xs text-[#4F46E5] font-semibold hover:underline">Leave Review</button>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><i className="fas fa-star text-yellow-400"></i> Reviewed</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                                <div className="pt-2 text-center">
                                    <Link to="/bookings" className="text-sm font-semibold text-[#4F46E5] hover:underline">View All {isProvider ? 'Jobs' : 'History'} &rarr;</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />

            {activeChatBooking && (
                <ChatModal 
                    booking={activeChatBooking} 
                    user={user} 
                    onClose={() => setActiveChatBooking(null)} 
                />
            )}

            {showAvailability && (
                <AvailabilityModal 
                    onClose={() => setShowAvailability(false)} 
                />
            )}

            {reviewBooking && (
                <ReviewModal 
                    booking={reviewBooking} 
                    onClose={() => setReviewBooking(null)} 
                    onSuccess={() => fetchDashboard()}
                />
            )}
        </div>
    );
};

export default Dashboard;
