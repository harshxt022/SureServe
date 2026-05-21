import React, { useState } from 'react';

const CategoryCard = ({ category, onClick }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className="card-accent hover-lift bg-white rounded-2xl border border-[#E8E8E4] cursor-pointer group transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] overflow-hidden"
            onClick={onClick}
        >
            {/* Category Photo */}
            {category.image && !imgError && (
                <div className="h-28 overflow-hidden relative">
                    <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-lg shadow-sm">
                        {category.icon}
                    </div>
                </div>
            )}

            <div className="p-4 text-center">
                {(!category.image || imgError) && (
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-3xl mb-3 group-hover:bg-[#4F46E5]/10 transition-colors duration-300">
                        {category.icon}
                    </div>
                )}
                <h3 className="text-sm font-bold font-heading text-[#1A1A1A] mb-1">{category.title}</h3>
                <p className="text-[#6B6B6B] text-xs line-clamp-2 leading-relaxed">{category.description}</p>
            </div>
        </div>
    );
};

export default CategoryCard;
