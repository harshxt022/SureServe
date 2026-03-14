import React from 'react';

const CategoryCard = ({ category, onClick }) => {
    // Generate a subtle background color based on the title to match landing page aesthetics
    const getThemeColors = (title) => {
        const hash = title.charCodeAt(0) % 5;
        const themes = [
            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600',
            'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600',
            'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-500',
            'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 group-hover:bg-rose-500',
            'bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 group-hover:bg-orange-500',
        ];
        return themes[hash];
    };

    const themeColors = getThemeColors(category.title);

    return (
        <div
            className="group hover-lift bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer transition-all duration-300"
            onClick={onClick}
        >
            <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:text-white transition-colors duration-300 shadow-inner ${themeColors}`}
            >
                {category.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading mb-2">{category.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{category.description}</p>
        </div>
    );
};

export default CategoryCard;
