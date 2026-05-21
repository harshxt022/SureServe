import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../api/axios';
import NotificationDropdown from '../NotificationDropdown';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchUnread = async () => {
            try {
                const res = await api.get('/notifications');
                setUnreadCount(res.data.filter(n => !n.read).length);
            } catch (err) {}
        };
        fetchUnread();

        if (socket) {
            socket.on('notification:new', () => {
                setUnreadCount(prev => prev + 1);
            });
        }
        return () => {
            if (socket) socket.off('notification:new');
        };
    }, [isAuthenticated, socket]);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8E8E4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-xs font-bold group-hover:rounded-xl transition-all duration-300">
                            S
                        </div>
                        <span className="text-lg font-bold font-heading tracking-tight text-[#1A1A1A]">SureServe</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Home</Link>
                        <Link to="/services" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Services</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                                    Dashboard
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                                <Link to="/bookings" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                                    My Bookings
                                </Link>
                                
                                <div className="relative ml-2 flex items-center">
                                    <button 
                                        onClick={() => setShowNotifs(!showNotifs)}
                                        className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#6B6B6B] hover:bg-gray-100 transition-colors"
                                    >
                                        <i className="fas fa-bell text-lg"></i>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>
                                    
                                    {showNotifs && (
                                        <NotificationDropdown 
                                            onClose={() => setShowNotifs(false)} 
                                            onCountUpdate={setUnreadCount}
                                        />
                                    )}
                                </div>

                                <div className="relative group ml-2">
                                    <div className="w-8 h-8 rounded-full bg-[#E8E8E4] flex items-center justify-center text-[#1A1A1A] text-sm font-bold cursor-pointer shadow-sm hover:bg-[#D6D6D6] transition-colors">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="absolute right-0 top-full w-full h-2"></div>
                                    <div className="absolute right-0 top-[calc(100%+0.5rem)] w-48 bg-white rounded-xl shadow-lg py-2 border border-[#E8E8E4] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                                        <div className="px-4 py-2 border-b border-[#E8E8E4] mb-1">
                                            <p className="text-sm font-bold text-[#1A1A1A] truncate">{user?.name}</p>
                                            <p className="text-xs text-[#6B6B6B] capitalize">{user?.role}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors">
                                            <i className="fas fa-user mr-2 text-[#6B6B6B]"></i> View Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Login</Link>
                                <Link to="/register-user" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {isAuthenticated && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifs(!showNotifs)}
                                    className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#6B6B6B] hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fas fa-bell text-lg"></i>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </button>
                                {showNotifs && (
                                    <NotificationDropdown 
                                        onClose={() => setShowNotifs(false)} 
                                        onCountUpdate={setUnreadCount}
                                    />
                                )}
                            </div>
                        )}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-[#1A1A1A] focus:outline-none w-8 h-8 flex items-center justify-center"
                        >
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-[#E8E8E4] px-6 py-4 space-y-4 animate-slideDown shadow-lg absolute w-full">
                    <Link to="/" onClick={closeMenu} className="block text-base font-medium text-[#1A1A1A]">Home</Link>
                    <Link to="/services" onClick={closeMenu} className="block text-base font-medium text-[#1A1A1A]">Services</Link>
                    
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" onClick={closeMenu} className="block text-base font-medium text-[#1A1A1A]">Dashboard</Link>
                            <Link to="/bookings" onClick={closeMenu} className="block text-base font-medium text-[#1A1A1A]">My Bookings</Link>
                            <Link to="/profile" onClick={closeMenu} className="block text-base font-medium text-[#1A1A1A]">Profile</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" onClick={closeMenu} className="block text-base font-medium text-[#4F46E5]">Admin Panel</Link>
                            )}
                            <button onClick={handleLogout} className="block w-full text-left text-base font-medium text-red-500">Logout</button>
                        </>
                    ) : (
                        <div className="pt-2 flex flex-col gap-3">
                            <Link to="/login" onClick={closeMenu} className="block w-full text-center bg-gray-100 text-[#1A1A1A] py-3 rounded-xl font-semibold">Login</Link>
                            <Link to="/register-user" onClick={closeMenu} className="block w-full text-center bg-[#4F46E5] text-white py-3 rounded-xl font-semibold">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
