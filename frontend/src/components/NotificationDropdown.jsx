import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationDropdown = ({ onClose, onCountUpdate }) => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();

        if (socket) {
            socket.on('notification:new', (notif) => {
                setNotifications(prev => [notif, ...prev]);
            });
        }
        return () => {
            if (socket) socket.off('notification:new');
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleMarkRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => {
                const updated = prev.map(n => n._id === id ? { ...n, read: true } : n);
                if (onCountUpdate) onCountUpdate(updated.filter(n => !n.read).length);
                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            if (onCountUpdate) onCountUpdate(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClick = (notif) => {
        if (!notif.read) handleMarkRead(notif._id);
        if (notif.link) {
            if (notif.link.includes('/bookings/')) {
                navigate('/bookings'); // Default to bookings page as modal links are complex to route directly
            } else {
                navigate(notif.link);
            }
        }
        onClose();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#E8E8E4] overflow-hidden z-50">
            <div className="flex justify-between items-center p-4 border-b border-[#E8E8E4] bg-[#FAFAF8]">
                <h3 className="font-bold text-[#1A1A1A]">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs text-[#4F46E5] font-semibold hover:underline">
                        Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-6 h-6 border-2 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-3xl mb-2">🔕</div>
                        <p className="text-[#6B6B6B] text-sm">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#E8E8E4]">
                        {notifications.map(notif => (
                            <div 
                                key={notif._id} 
                                onClick={() => handleClick(notif)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-[#4F46E5]' : 'bg-transparent'}`}></div>
                                <div>
                                    <p className={`text-sm ${!notif.read ? 'font-bold text-[#1A1A1A]' : 'font-medium text-[#6B6B6B]'}`}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-2">{notif.body}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{dayjs(notif.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
