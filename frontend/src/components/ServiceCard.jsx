import React, { useState } from 'react';

const ServiceCard = ({ service, onAction, delay = 0 }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="card-accent hover-lift bg-white rounded-3xl border border-[#E8E8E4] flex flex-col h-full group transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Service Photo */}
            {service.image && !imgError && (
                <div className="h-40 overflow-hidden relative">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-xl shadow-sm">
                        {service.icon}
                    </div>
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                {(!service.image || imgError) && (
                    <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-3xl mb-5 group-hover:bg-[#4F46E5]/10 transition-colors duration-300">
                        {service.icon}
                    </div>
                )}

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
        </div>
    );
};

export default ServiceCard;
