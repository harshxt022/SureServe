import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreMoreModal from '../components/ExploreMoreModal';
import { serviceCategories } from '../data/serviceCategories';
import CategoryCard from '../components/CategoryCard';

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 reveal">
                {serviceCategories.slice(0, 8).map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onClick={() => handleServiceClick(category.title)}
                    />
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
