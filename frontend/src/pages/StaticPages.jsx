import React from 'react';
import { useParams, Link } from 'react-router-dom';

const pagesData = {
    'about': {
        title: 'About SureServe',
        content: (
            <>
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">Our Mission</h3>
                <p className="mb-6">At SureServe, we believe finding a reliable home service professional should be as easy as ordering food online. We are committed to connecting homeowners with verified, high-quality professionals instantly.</p>
                
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">Why We Started</h3>
                <p className="mb-6">We noticed the sheer frustration of endlessly calling plumbers and electricians who never showed up on time. SureServe was built to bring transparency, upfront pricing, and guaranteed satisfaction to home maintenance.</p>

                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">Our Values</h3>
                <ul className="list-disc pl-5 mb-6 space-y-2">
                    <li><strong>Trust:</strong> Every professional is background checked.</li>
                    <li><strong>Transparency:</strong> No hidden fees. Official quotes upfront.</li>
                    <li><strong>Quality:</strong> We guarantee the work of our providers.</li>
                </ul>
            </>
        )
    },
    'contact': {
        title: 'Contact Us',
        content: (
            <>
                <p className="mb-8 text-lg">We'd love to hear from you. Reach out to us through any of the channels below.</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#FAFAF8] rounded-2xl border border-[#E8E8E4]">
                        <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-xl flex items-center justify-center mb-4">
                            <i className="fas fa-envelope text-xl text-[#4F46E5]"></i>
                        </div>
                        <h4 className="font-bold text-[#1A1A1A] mb-1">Email Support</h4>
                        <p className="text-[#6B6B6B]">support@sureserve.com</p>
                        <p className="text-xs text-[#6B6B6B] mt-2">Response time: 24 hours</p>
                    </div>
                    <div className="p-6 bg-[#FAFAF8] rounded-2xl border border-[#E8E8E4]">
                        <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-xl flex items-center justify-center mb-4">
                            <i className="fas fa-phone-alt text-xl text-[#4F46E5]"></i>
                        </div>
                        <h4 className="font-bold text-[#1A1A1A] mb-1">Phone Support</h4>
                        <p className="text-[#6B6B6B]">+91 (1800) 123-4567</p>
                        <p className="text-xs text-[#6B6B6B] mt-2">Mon-Fri: 9AM - 6PM</p>
                    </div>
                </div>
            </>
        )
    },
    'terms': {
        title: 'Terms of Service',
        content: (
            <>
                <p className="text-sm text-[#6B6B6B] mb-6">Last updated: May 2026</p>
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">1. Acceptance of Terms</h3>
                <p className="mb-6">By accessing and using SureServe, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">2. User Responsibilities</h3>
                <p className="mb-6">Users agree to provide accurate information when booking services and to be present at the agreed location during the scheduled service window.</p>

                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">3. Payments</h3>
                <p className="mb-6">All payments are securely processed via Razorpay. Services must be paid for in full upon completion unless otherwise specified.</p>
            </>
        )
    },
    'privacy': {
        title: 'Privacy Policy',
        content: (
            <>
                <p className="text-sm text-[#6B6B6B] mb-6">Last updated: May 2026</p>
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">1. Information Collection</h3>
                <p className="mb-6">We collect information from you when you register on our site, place an order, or subscribe to our newsletter. This includes your name, email, phone number, and physical address.</p>
                
                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">2. Use of Information</h3>
                <p className="mb-6">Any of the information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process transactions.</p>

                <h3 className="text-xl font-bold font-heading text-[#1A1A1A] mb-3">3. Data Security</h3>
                <p className="mb-6">We implement a variety of security measures to maintain the safety of your personal information. Your private data will not be sold, exchanged, transferred, or given to any other company.</p>
            </>
        )
    }
};

const StaticPages = () => {
    const { pageId } = useParams();
    const data = pagesData[pageId];

    if (!data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Page Not Found</h2>
                <Link to="/" className="text-[#4F46E5] hover:underline font-semibold">Return Home</Link>
            </div>
        );
    }

    return (
        <main className="min-h-[80vh] bg-[#FAFAF8] py-16 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-[#E8E8E4] shadow-sm">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-10 border-b border-[#E8E8E4] pb-6">
                    {data.title}
                </h1>
                <div className="prose max-w-none text-[#4A4A4A] leading-relaxed">
                    {data.content}
                </div>
            </div>
        </main>
    );
};

export default StaticPages;
