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
            className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden border border-[#E8E8E4]"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 sm:px-8 border-b border-[#E8E8E4]">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">All Categories</h2>
                        <p className="text-sm text-[#6B6B6B] mt-1">Select a category to view specialized services</p>
                    </div>
                    <button
                        className="w-10 h-10 rounded-full bg-[#FAFAF8] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#E8E8E4] transition-colors border border-[#E8E8E4]"
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
