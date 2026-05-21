import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
            toast.success('Password reset link generated. Check console.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E8E8E4] shadow-sm">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4F46E5] text-white font-bold text-xl mb-6">
                        S
                    </Link>
                    <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-2">Reset Password</h1>
                    <p className="text-[#6B6B6B] text-sm">
                        {isSent ? "We've sent a link to your email." : "Enter your email to receive a password reset link."}
                    </p>
                </div>

                {isSent ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-check text-2xl"></i>
                        </div>
                        <Link to="/login" className="block w-full bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white py-3.5 rounded-xl font-bold transition-colors">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-xl focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Sending...</>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-bold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                        <i className="fas fa-arrow-left mr-2"></i> Back to login
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;
