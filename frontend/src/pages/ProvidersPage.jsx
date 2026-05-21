import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { IMAGES } from '../data/serviceCategories';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProvidersPage = () => {
    const [searchParams] = useSearchParams();
    const serviceName = searchParams.get('service');
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(null);

    // Filters state
    const [filters, setFilters] = useState({
        minRating: '',
        experience: '',
        maxPrice: '',
        sort: 'rating'
    });

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams({
                    service: serviceName || '',
                    ...filters
                }).toString();
                const res = await api.get(`/public/providers?${query}`);
                setProviders(res.data);
            } catch (err) {
                console.error('Error fetching providers:', err);
                toast.error('Failed to load providers.');
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [serviceName, filters]);

    // Scroll reveal
    useEffect(() => {
        const els = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('visible'), i * 80);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [providers]);

    const handleBookNow = (provider) => {
        if (!isAuthenticated) {
            toast.error('Please log in to book a service');
            navigate('/login');
            return;
        }
        if (user?.role === 'provider') {
            toast.error('Providers cannot book services');
            return;
        }
        setSelectedProvider(provider);
    };

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative min-h-[80vh]">
            {/* Header */}
            <div className="relative mb-16 reveal">
                <span className="section-number absolute -top-8 -left-4 select-none">🛠️</span>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                        Available <span className="text-[#4F46E5]">Providers</span>
                    </h1>
                    <p className="text-[#6B6B6B] text-lg max-w-lg">
                        {serviceName 
                            ? `Showing top-rated professionals for ${serviceName}.` 
                            : 'Browse our highly vetted professionals.'}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-10 border border-[#E8E8E4] flex flex-wrap gap-4 items-center reveal shadow-sm">
                <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                    <i className="fas fa-star text-[#F59E0B]"></i>
                    <select name="minRating" value={filters.minRating} onChange={handleFilterChange} className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer">
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.0">3.0+ Stars</option>
                    </select>
                </div>
                <div className="w-px h-8 bg-[#E8E8E4] hidden md:block"></div>
                <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                    <i className="fas fa-briefcase text-[#4F46E5]"></i>
                    <select name="experience" value={filters.experience} onChange={handleFilterChange} className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer">
                        <option value="">Any Experience</option>
                        <option value="1">1+ Years</option>
                        <option value="3">3+ Years</option>
                        <option value="5">5+ Years</option>
                        <option value="10">10+ Years</option>
                    </select>
                </div>
                <div className="w-px h-8 bg-[#E8E8E4] hidden md:block"></div>
                <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                    <i className="fas fa-tag text-green-600"></i>
                    <select name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer">
                        <option value="">Any Price</option>
                        <option value="500">Under ₹500</option>
                        <option value="1000">Under ₹1000</option>
                        <option value="2000">Under ₹2000</option>
                    </select>
                </div>
                <div className="w-px h-8 bg-[#E8E8E4] hidden md:block"></div>
                <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                    <i className="fas fa-sort text-gray-500"></i>
                    <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer">
                        <option value="rating">Sort by Rating</option>
                        <option value="experience">Sort by Experience</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                </div>
            ) : providers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E4] border-dashed">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-2">No providers found</h3>
                    <p className="text-[#6B6B6B]">We couldn't find any providers matching your criteria right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
                    {providers.map((provider) => (
                        <div key={provider._id} className="bg-white rounded-3xl p-6 border border-[#E8E8E4] shadow-sm hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col hover:-translate-y-1">
                            <div 
                                className="flex justify-between items-start mb-4 cursor-pointer"
                                onClick={() => navigate(`/providers/${provider._id}`)}
                            >
                                <img 
                                    src={provider.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`} 
                                    alt={provider.name} 
                                    className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100" 
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`;
                                    }}
                                />
                                <div className="bg-[#FAFAF8] text-[#1A1A1A] px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-[#E8E8E4]">
                                    <i className="fas fa-star text-[#F59E0B] text-xs"></i> 
                                    {provider.avg_rating ? provider.avg_rating.toFixed(1) : 'New'}
                                    <span className="text-[#6B6B6B] font-normal text-xs ml-1">({provider.rating_count || 0})</span>
                                </div>
                            </div>
                            
                            <h3 
                                className="text-xl font-bold font-heading text-[#1A1A1A] cursor-pointer hover:text-[#4F46E5] transition-colors"
                                onClick={() => navigate(`/providers/${provider._id}`)}
                            >
                                {provider.name}
                            </h3>
                            <p className="text-[#4F46E5] font-medium text-sm mb-3">{provider.main_profession || 'Professional'}</p>
                            
                            <p className="text-[#6B6B6B] text-sm line-clamp-2 mb-4 flex-grow">
                                {provider.bio || 'Experienced professional ready to help with your home needs.'}
                            </p>

                            <div className="flex items-center gap-2 mb-5 flex-wrap">
                                {provider.servicesOffered?.map(s => (
                                    <span key={s._id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                                        {s.icon} {s.name} (₹{s.basePrice})
                                    </span>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleBookNow(provider)}
                                disabled={!provider.isAcceptingBookings}
                                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex justify-center items-center gap-2 ${
                                    provider.isAcceptingBookings 
                                    ? 'bg-[#1A1A1A] hover:bg-[#4F46E5] text-white shadow-md hover:shadow-lg' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {provider.isAcceptingBookings ? (
                                    <>Book Now <i className="fas fa-arrow-right"></i></>
                                ) : (
                                    'Currently Unavailable'
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedProvider && (
                <BookingModal 
                    provider={selectedProvider} 
                    service={selectedProvider?.servicesOffered?.find(s => 
                        s.name?.toLowerCase().includes((serviceName || '').toLowerCase()) || 
                        s.category?.toLowerCase().includes((serviceName || '').toLowerCase())
                    ) || (selectedProvider?.servicesOffered?.length > 0 ? selectedProvider.servicesOffered[0] : null)}
                    onClose={() => setSelectedProvider(null)} 
                />
            )}
        </main>
    );
};

export default ProvidersPage;
