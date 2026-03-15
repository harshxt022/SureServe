import React from 'react';

const CategoryCard = ({ category, onClick }) => {
    return (
        <div
            className="card-accent hover-lift bg-white rounded-2xl p-6 text-center border border-[#E8E8E4] cursor-pointer group transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
            onClick={onClick}
        >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-3xl mb-4 group-hover:bg-[#4F46E5]/10 transition-colors duration-300">
                {category.icon}
            </div>
            <h3 className="text-base font-bold font-heading text-[#1A1A1A] mb-1">{category.title}</h3>
            <p className="text-[#6B6B6B] text-xs line-clamp-2 leading-relaxed">{category.description}</p>
        </div>
    );
};

export default CategoryCard;
