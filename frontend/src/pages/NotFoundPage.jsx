import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-9xl font-bold font-heading text-[#1A1A1A] tracking-tighter mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">Oops! Page not found.</h2>
            <p className="text-[#6B6B6B] max-w-md mx-auto mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="bg-[#4F46E5] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#4338CA] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
