import React from 'react';

const ServiceCard = ({ service, onAction, delay = 0 }) => {
    return (
        <div className="card-accent hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] flex flex-col h-full group transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
            <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-3xl mb-5 group-hover:bg-[#4F46E5]/10 transition-colors duration-300">
                {service.icon}
            </div>

            <h3 className="text-lg font-bold font-heading text-[#1A1A1A] mb-2">{service.name}</h3>

            <p className="text-[#6B6B6B] text-sm mb-6 flex-grow leading-relaxed">
                {service.description}
            </p>

            <button
                onClick={onAction}
                className="w-full bg-[#FAFAF8] hover:bg-[#4F46E5] text-[#1A1A1A] hover:text-white border border-[#E8E8E4] hover:border-transparent py-3 rounded-xl text-sm font-semibold transition-all duration-300"
            >
                View Providers
            </button>
        </div>
    );
};

export default ServiceCard;
