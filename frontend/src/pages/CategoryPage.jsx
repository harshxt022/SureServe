import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceCategories } from '../data/serviceCategories';
import ServiceCard from '../components/ServiceCard';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const found = serviceCategories.find(c => c.id === categoryId);
        setCategory(found);
    }, [categoryId]);

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
    }, [category]);

    if (!category) {
        return (
            <div className="flex-grow flex items-center justify-center p-6 min-h-[60vh]">
                <div className="text-center">
                    <div className="text-6xl text-[#E8E8E4] mb-4">🔍</div>
                    <h2 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-2">Category Not Found</h2>
                    <p className="text-[#6B6B6B]">The service category you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    const handleViewProviders = (serviceName) => {
        navigate(`/providers?service=${encodeURIComponent(serviceName)}`);
    };

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
            {/* Header with section number */}
            <div className="relative mb-16 reveal">
                <span className="section-number absolute -top-8 -left-4 select-none">{category.icon}</span>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                        {category.title} <span className="text-[#4F46E5]">Services</span>
                    </h1>
                    <p className="text-[#6B6B6B] text-lg max-w-lg">
                        {category.description}
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 reveal">
                {category.services.map((service, i) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onAction={() => handleViewProviders(service.name)}
                        delay={i * 50}
                    />
                ))}
            </div>
        </main>
    );
};

export default CategoryPage;
