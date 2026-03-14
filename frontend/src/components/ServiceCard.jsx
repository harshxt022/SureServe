import React from 'react';

const ServiceCard = ({ service, onAction }) => {
    // Generate theme colors based on service name
    const getThemeColors = (name) => {
        const hash = name.charCodeAt(0) % 5;
        const themes = [
            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-400',
            'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400',
            'bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400',
        ];
        return themes[hash];
    };

    const themeColors = getThemeColors(service.name);

    return (
        <div className="hover-lift bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-smooth border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col h-full group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform ${themeColors}`}>
                {service.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-2">{service.name}</h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 flex-grow leading-relaxed">
                {service.description}
            </p>

            <button
                onClick={onAction}
                className="w-full bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200 hover:text-white border border-gray-200 dark:border-gray-600 hover:border-transparent py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
            >
                View Providers
            </button>
        </div>
    );
};

export default ServiceCard;
