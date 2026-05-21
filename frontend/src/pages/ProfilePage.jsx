import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProfilePage = () => {
    const { token, user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
            setFormData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        try {
            const res = await api.put('/auth/profile', formData);
            
            setProfile(formData);
            setIsEditing(false);
            setSuccessMsg('Profile updated successfully!');
            
            // Sync with global auth state
            updateUser({
                name: formData.name,
                email: formData.email
            });
            
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="bg-white rounded-3xl p-8 border border-[#E8E8E4] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] opacity-10"></div>
                
                <div className="relative z-10 flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#E8E8E4] border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-[#1A1A1A] mb-4">
                        {profile?.name?.charAt(0) || 'U'}
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-[#1A1A1A]">{profile?.name}</h1>
                    <p className="text-sm font-medium text-[#6B6B6B] capitalize">{user?.role} Account</p>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">{error}</div>}
                {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm text-center">{successMsg}</div>}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-heading text-[#1A1A1A]">Personal Details</h2>
                    <button 
                        onClick={() => {
                            if (isEditing) {
                                setFormData(profile); // Reset changes
                            }
                            setIsEditing(!isEditing);
                        }}
                        className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Phone Number</label>
                            <input 
                                type="text" 
                                name="phone" 
                                value={formData.phone || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                placeholder="Not provided"
                                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        {(user?.role === 'customer' || user?.role === 'user') && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Address</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address || ''} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    placeholder="Not provided"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                />
                            </div>
                        )}
                        
                        {user?.role === 'provider' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Main Profession</label>
                                    <input 
                                        type="text" 
                                        name="main_profession" 
                                        value={formData.main_profession || ''} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                        placeholder="Not provided"
                                        className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Experience (Years)</label>
                                    <input 
                                        type="number" 
                                        name="experience_years" 
                                        value={formData.experience_years || ''} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                        placeholder="Not provided"
                                        className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {user?.role === 'provider' && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Bio</label>
                            <textarea 
                                name="bio" 
                                value={formData.bio || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                placeholder="Write something about your experience..."
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                            ></textarea>
                        </div>
                    )}

                    {isEditing && (
                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit"
                                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>

                <hr className="my-8 border-[#E8E8E4]" />

                <div className="flex justify-center">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors px-6 py-3 rounded-full hover:bg-red-50"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
