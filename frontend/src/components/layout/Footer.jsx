import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-12 bg-[#FAFAF8] border-t border-[#E8E8E4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    <div>
                        <Link to="/" className="text-xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-3 inline-block">
                            SureServe
                        </Link>
                        <p className="text-sm text-[#6B6B6B] mt-2">
                            Your simple, reliable service marketplace.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold font-heading text-[#1A1A1A] tracking-wider uppercase mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/page/about" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">About Us</Link></li>
                            <li><Link to="/services" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Browse Services</Link></li>
                            <li><Link to="/page/terms" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Providers */}
                    <div>
                        <h4 className="text-sm font-bold font-heading text-[#1A1A1A] tracking-wider uppercase mb-6">Providers</h4>
                        <ul className="space-y-4">
                            <li><Link to="/register-provider" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Become a Provider</Link></li>
                            <li><Link to="/page/about" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Provider Guidelines</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold font-heading text-[#1A1A1A] tracking-wider uppercase mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link to="/page/contact" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Contact Us</Link></li>
                            <li><Link to="/page/privacy" className="text-[#6B6B6B] hover:text-[#4F46E5] transition-colors text-sm font-medium">Privacy Policy</Link></li>
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
