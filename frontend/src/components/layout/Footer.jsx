import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-12 bg-[#FAFAF8] border-t border-[#E8E8E4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    <div>
                        <Link to="/" className="text-xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-3 inline-block">
                            SureServe
                        </Link>
                        <p className="text-sm text-[#6B6B6B] mt-2">
                            Your simple, reliable service marketplace.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold font-heading text-[#1A1A1A] tracking-widest uppercase mb-4">Navigate</h4>
                        <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
                            <li><Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link></li>
                            <li><Link to="/services" className="hover:text-[#1A1A1A] transition-colors">Services</Link></li>
                            <li><Link to="/login" className="hover:text-[#1A1A1A] transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold font-heading text-[#1A1A1A] tracking-widest uppercase mb-4">Support</h4>
                        <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
                            <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-[#E8E8E4] text-center text-xs text-[#6B6B6B]">
                    <p>&copy; {new Date().getFullYear()} SureServe. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
