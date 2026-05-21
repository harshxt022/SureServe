import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';
import { useSocket } from '../context/SocketContext';

const ChatModal = ({ booking, user, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/chat/${booking._id}`);
            setMessages(res.data);
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    useEffect(() => {
        fetchMessages();

        if (socket) {
            const handleMessage = (msg) => {
                if (msg.bookingId === booking._id) {
                    setMessages(prev => [...prev, msg]);
                    setTimeout(scrollToBottom, 100);
                }
            };

            socket.on('chat:message', handleMessage);
            return () => socket.off('chat:message', handleMessage);
        }
    }, [booking._id, socket]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/chat', {
                bookingId: booking._id,
                text: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 flex flex-col h-[600px] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF8]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold">
                            {(user.role === 'customer' || user.role === 'user') ? booking.providerId?.name?.charAt(0) : booking.customerId?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1A1A]">
                                {(user.role === 'customer' || user.role === 'user') ? booking.providerId?.name : booking.customerId?.name}
                            </h3>
                            <p className="text-xs text-[#6B6B6B]">{booking.serviceId?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FAFAF8] custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-6 h-6 border-2 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-400">No messages yet. Say hi!</p>
                        </div>
                    ) : (
                        messages.map((m, idx) => {
                            const isMine = m.senderRole === user.role;
                            return (
                                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        isMine 
                                        ? 'bg-[#4F46E5] text-white rounded-tr-none' 
                                        : 'bg-white text-[#1A1A1A] border border-gray-100 rounded-tl-none shadow-sm'
                                    }`}>
                                        <p>{m.text}</p>
                                        <p className={`text-[10px] mt-1 opacity-70 ${isMine ? 'text-right' : ''}`}>
                                            {dayjs(m.createdAt).format('HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-gray-50 border-none px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none"
                    />
                    <button 
                        type="submit"
                        className="w-12 h-12 bg-[#4F46E5] text-white rounded-2xl flex items-center justify-center hover:bg-[#4338CA] transition-colors"
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
