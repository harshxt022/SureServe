import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreMoreModal from '../components/ExploreMoreModal';

const mockServices = [
    { id: 1, name: 'Electrician', icon: '⚡' },
    { id: 2, name: 'Plumber', icon: '🔧' },
    { id: 3, name: 'AC Repair', icon: '❄️' },
    { id: 4, name: 'Carpenter', icon: '🔨' },
    { id: 5, name: 'House Cleaning', icon: '🧹' },
    { id: 6, name: 'Appliance Repair', icon: '📺' },
];

const Services = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleServiceClick = (serviceName) => {
        navigate(`/providers?service=${encodeURIComponent(serviceName)}`);
    };

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
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="relative mb-16 reveal">
                <span className="section-number absolute -top-8 -left-4 select-none">01</span>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                        Our Services
                    </h1>
                    <p className="text-[#6B6B6B] text-lg max-w-md">
                        Choose a service to find the best providers for your needs.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
                {mockServices.map((service) => (
                    <div
                        key={service.id}
                        className="card-accent hover-lift bg-white rounded-3xl p-8 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
                        onClick={() => handleServiceClick(service.name)}
                    >
                        <span className="text-4xl block mb-5">{service.icon}</span>
                        <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-2">{service.name}</h3>
                        <span className="text-[#4F46E5] text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Providers <i className="fas fa-arrow-right text-xs"></i>
                        </span>
                    </div>
                ))}
            </div>

            {/* Explore more */}
            <div className="text-center mt-14 reveal">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="magnetic-btn bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors shadow-md"
                >
                    Explore More Services
                </button>
            </div>

            <ExploreMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Services;
