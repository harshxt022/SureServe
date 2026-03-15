import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8E8E4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-xs font-bold group-hover:rounded-xl transition-all duration-300">
                            S
                        </div>
                        <span className="text-lg font-bold font-heading tracking-tight text-[#1A1A1A]">SureServe</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Home</Link>
                        <Link to="/services" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Services</Link>
                        <Link to="/login" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Login</Link>
                        <Link to="/register-user" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
