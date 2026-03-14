import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { serviceCategories } from '../data/serviceCategories';

const ExploreMoreModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCategoryClick = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-fade-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 sm:px-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Explore All Categories</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a category to view specialized services</p>
                    </div>
                    <button
                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {serviceCategories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={() => handleCategoryClick(category.path)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreMoreModal;
