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

    if (!category) {
        return (
            <div className="flex-grow flex items-center justify-center p-4 pt-24 min-h-[60vh]">
                <div className="text-center">
                    <div className="text-6xl text-gray-300 dark:text-gray-700 mb-4"><i className="fas fa-search-minus"></i></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Category Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400">The service category you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    const handleViewProviders = (serviceName) => {
        navigate(`/providers?service=${encodeURIComponent(serviceName)}`);
    };

    return (
        <main className="flex-grow pt-24 pb-24 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-[100px] mix-blend-multiply opacity-70"></div>
                <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[100px] mix-blend-multiply opacity-70"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Area */}
                <div className="text-center mb-16 animate-fade-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 text-4xl mb-6 relative">
                        <span className="relative z-10">{category.icon}</span>
                        <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-md"></div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 font-heading">
                        {category.title} <span className="text-gradient">Services</span>
                    </h1>

                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {category.description}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    {category.services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onAction={() => handleViewProviders(service.name)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default CategoryPage;
