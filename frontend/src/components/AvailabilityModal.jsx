import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AvailabilityModal = ({ onClose }) => {
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const weekdays = [
        { key: 'mon', label: 'Monday' },
        { key: 'tue', label: 'Tuesday' },
        { key: 'wed', label: 'Wednesday' },
        { key: 'thu', label: 'Thursday' },
        { key: 'fri', label: 'Friday' },
        { key: 'sat', label: 'Saturday' },
        { key: 'sun', label: 'Sunday' }
    ];

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await api.get('/provider/availability');
                setAvailability(res.data);
            } catch (err) {
                console.error('Failed to fetch availability:', err);
                toast.error('Failed to load schedule');
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const handleToggleAccepting = async () => {
        try {
            const newVal = !availability.isAcceptingBookings;
            await api.patch('/provider/availability/accepting', { isAcceptingBookings: newVal });
            setAvailability({ ...availability, isAcceptingBookings: newVal });
            toast.success(newVal ? 'Now accepting bookings' : 'Stopped accepting bookings');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleScheduleChange = (day, index, field, value) => {
        const newWeekly = { ...availability.weeklySchedule };
        newWeekly[day][index][field] = value;
        setAvailability({ ...availability, weeklySchedule: newWeekly });
    };

    const addTimeWindow = (day) => {
        const newWeekly = { ...availability.weeklySchedule };
        if (!newWeekly[day]) newWeekly[day] = [];
        newWeekly[day].push({ start: '09:00', end: '17:00' });
        setAvailability({ ...availability, weeklySchedule: newWeekly });
    };

    const removeTimeWindow = (day, index) => {
        const newWeekly = { ...availability.weeklySchedule };
        newWeekly[day].splice(index, 1);
        setAvailability({ ...availability, weeklySchedule: newWeekly });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/provider/availability', availability);
            toast.success('Schedule updated successfully! 📅');
            onClose();
        } catch (err) {
            console.error('Failed to save availability:', err);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#E8E8E4] flex justify-between items-center bg-[#FAFAF8]">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">Work Schedule</h2>
                        <p className="text-sm text-[#6B6B6B]">Set your weekly availability and booking status.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
                    
                    {/* Accepting Status */}
                    <div className={`p-6 rounded-3xl border mb-8 flex items-center justify-between transition-colors ${availability?.isAcceptingBookings ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${availability?.isAcceptingBookings ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                <i className={`fas ${availability?.isAcceptingBookings ? 'fa-check-circle' : 'fa-pause-circle'}`}></i>
                            </div>
                            <div>
                                <h3 className={`font-bold ${availability?.isAcceptingBookings ? 'text-green-800' : 'text-red-800'}`}>
                                    {availability?.isAcceptingBookings ? 'Currently Accepting Bookings' : 'Paused Bookings'}
                                </h3>
                                <p className={`text-sm ${availability?.isAcceptingBookings ? 'text-green-600' : 'text-red-600'}`}>
                                    {availability?.isAcceptingBookings ? 'Customers can see and book your slots.' : 'Your profile is hidden from search results.'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleToggleAccepting}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                availability?.isAcceptingBookings 
                                ? 'bg-white text-green-700 border border-green-200 hover:bg-green-100' 
                                : 'bg-white text-red-700 border border-red-200 hover:bg-red-100'
                            }`}
                        >
                            {availability?.isAcceptingBookings ? 'Pause' : 'Resume'}
                        </button>
                    </div>

                    <h3 className="text-lg font-bold font-heading text-[#1A1A1A] mb-6 flex items-center gap-2">
                        <i className="fas fa-calendar-week text-[#4F46E5]"></i> Weekly Hours
                    </h3>

                    <div className="space-y-4">
                        {weekdays.map((day) => (
                            <div key={day.key} className="border border-[#E8E8E4] rounded-2xl p-5 hover:border-[#4F46E5]/30 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="w-24">
                                        <span className="font-bold text-[#1A1A1A]">{day.label}</span>
                                    </div>

                                    <div className="flex-grow flex flex-col gap-2">
                                        {(!availability?.weeklySchedule?.[day.key] || availability?.weeklySchedule?.[day.key].length === 0) ? (
                                            <p className="text-sm text-gray-400 italic">No working hours set</p>
                                        ) : (
                                            availability?.weeklySchedule[day.key].map((window, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <input 
                                                        type="time" 
                                                        value={window.start} 
                                                        onChange={(e) => handleScheduleChange(day.key, idx, 'start', e.target.value)}
                                                        className="bg-[#FAFAF8] border border-[#E8E8E4] px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                                                    />
                                                    <span className="text-gray-400">to</span>
                                                    <input 
                                                        type="time" 
                                                        value={window.end} 
                                                        onChange={(e) => handleScheduleChange(day.key, idx, 'end', e.target.value)}
                                                        className="bg-[#FAFAF8] border border-[#E8E8E4] px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                                                    />
                                                    <button 
                                                        onClick={() => removeTimeWindow(day.key, idx)}
                                                        className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <i className="fas fa-trash-alt text-sm"></i>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => addTimeWindow(day.key)}
                                        className="sm:w-32 py-2 px-4 rounded-xl border border-[#4F46E5]/20 text-[#4F46E5] text-xs font-bold hover:bg-[#4F46E5] hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-plus"></i> Add Slot
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#E8E8E4] bg-[#FAFAF8] flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-black transition-all shadow-lg flex items-center gap-2"
                    >
                        {isSaving ? (
                            <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Saving...</>
                        ) : (
                            'Save Schedule'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AvailabilityModal;
