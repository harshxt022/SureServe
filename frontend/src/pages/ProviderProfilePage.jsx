import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

const ProviderProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/public/providers/${id}`);
                setProvider(res.data);
            } catch (err) {
                console.error('Error fetching provider:', err);
                toast.error('Failed to load provider profile.');
                navigate('/providers');
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [id, navigate]);

    const handleBookNow = (service) => {
        if (!isAuthenticated) {
            toast.error('Please log in to book a service');
            navigate('/login');
            return;
        }
        if (user?.role === 'provider') {
            toast.error('Providers cannot book services');
            return;
        }
        setSelectedService(service);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 min-h-[60vh] items-center">
                <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!provider) return null;

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative min-h-[80vh]">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#E8E8E4] shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-12 flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&size=200&background=random`} 
                        alt={provider.name} 
                        className="w-40 h-40 rounded-[2rem] object-cover shadow-lg border border-gray-100 mb-6" 
                    />
                    <h1 className="text-3xl font-bold font-heading text-[#1A1A1A] mb-2">{provider.name}</h1>
                    <p className="text-[#4F46E5] font-semibold text-lg mb-4">{provider.main_profession || 'Professional'}</p>
                    
                    <div className="flex gap-4 mb-6">
                        <div className="bg-[#FAFAF8] px-4 py-2 rounded-2xl border border-[#E8E8E4]">
                            <div className="text-xl font-bold text-[#1A1A1A] flex items-center justify-center gap-1">
                                <i className="fas fa-star text-[#F59E0B]"></i> {provider.avg_rating ? provider.avg_rating.toFixed(1) : 'New'}
                            </div>
                            <div className="text-xs text-[#6B6B6B]">{provider.rating_count} Reviews</div>
                        </div>
                        <div className="bg-[#FAFAF8] px-4 py-2 rounded-2xl border border-[#E8E8E4]">
                            <div className="text-xl font-bold text-[#1A1A1A]">{provider.experience_years || 0}</div>
                            <div className="text-xs text-[#6B6B6B]">Years Exp.</div>
                        </div>
                    </div>

                    {!provider.isAcceptingBookings && (
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold w-full mb-4 border border-red-100">
                            Currently Unavailable
                        </div>
                    )}
                </div>
                
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-4">About Me</h2>
                    <p className="text-[#6B6B6B] leading-relaxed mb-10 text-lg">
                        {provider.bio || 'Experienced professional ready to help with your home needs. I take pride in delivering high-quality work and ensuring customer satisfaction.'}
                    </p>

                    <h2 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">Services Offered</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {provider.servicesOffered?.map(s => (
                            <div key={s._id} className="border border-[#E8E8E4] rounded-2xl p-5 hover:shadow-md transition-shadow bg-[#FAFAF8]">
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <h3 className="font-bold text-[#1A1A1A] text-lg mb-1">{s.name}</h3>
                                <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">{s.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-bold text-[#1A1A1A] text-lg">₹{s.basePrice}</span>
                                    <button 
                                        onClick={() => handleBookNow(s)}
                                        disabled={!provider.isAcceptingBookings}
                                        className="text-sm bg-[#4F46E5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#4338CA] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6 flex items-center gap-2">
                    <i className="fas fa-comments text-[#4F46E5]"></i> Customer Reviews
                </h2>
                
                {provider.reviews?.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center border border-[#E8E8E4] border-dashed">
                        <p className="text-[#6B6B6B]">No reviews yet. Be the first to book and review!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {provider.reviews?.map(r => (
                            <div key={r._id} className="bg-white rounded-2xl p-6 border border-[#E8E8E4]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-bold text-[#1A1A1A]">{r.customerName}</div>
                                        <div className="text-xs text-[#6B6B6B]">{dayjs(r.createdAt).format('MMMM D, YYYY')} • {r.serviceName}</div>
                                    </div>
                                    <div className="flex text-[#F59E0B] text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < r.rating ? '' : 'text-gray-200'}`}></i>
                                        ))}
                                    </div>
                                </div>
                                {r.comment && <p className="text-[#1A1A1A] text-sm italic">"{r.comment}"</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedService && (
                <BookingModal 
                    provider={provider} 
                    service={selectedService}
                    onClose={() => setSelectedService(null)} 
                />
            )}
        </main>
    );
};

export default ProviderProfilePage;
