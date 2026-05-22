import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ provider, service, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Slots state
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Address & details state
    const [address, setAddress] = useState({
        line1: '', line2: '', city: '', state: '', pincode: ''
    });
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch dates (Next 7 days)
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        const fetchAvailableSlots = async () => {
            setLoadingSlots(true);
            try {
                const from = dayjs().format('YYYY-MM-DD');
                const to = dayjs().add(6, 'day').format('YYYY-MM-DD');
                const res = await api.get(`/providers/${provider._id}/slots/range?from=${from}&to=${to}`);
                
                setDates(res.data.days);
                if (res.data.days.length > 0) {
                    setSelectedDate(res.data.days[0].date);
                    setSlots(res.data.days[0].slots);
                }
            } catch (err) {
                console.error('Error fetching slots:', err);
                toast.error('Failed to load availability');
            } finally {
                setLoadingSlots(false);
            }
        };

        if (provider) {
            fetchAvailableSlots();
        }

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [provider]);

    const handleDateChange = (dateStr) => {
        setSelectedDate(dateStr);
        const dayObj = dates.find(d => d.date === dateStr);
        setSlots(dayObj ? dayObj.slots : []);
        setSelectedSlot(null);
    };

    const handleNext = () => {
        if (step === 1 && selectedSlot) {
            setStep(2);
        }
    };

    const handleConfirm = async () => {
        if (!address.line1 || !address.city || !address.state || !address.pincode) {
            toast.error('Please fill all required address fields');
            return;
        }

        setIsSubmitting(true);
        try {
            if (!service || typeof service.basePrice === 'undefined') {
                toast.error('Service pricing information is missing');
                setIsSubmitting(false);
                return;
            }
            const taxes = parseFloat((service.basePrice * 0.18).toFixed(2));
            const total = parseFloat((service.basePrice + taxes).toFixed(2));

            // 1. Create order
            const orderRes = await api.post('/payments/create-order', {
                amount: total,
                receipt: `rcpt_${Date.now()}`
            });
            const { orderId, amount, currency, keyId } = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'SureServe',
                description: `Payment for ${service.name}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const payload = {
                            providerId: provider._id,
                            serviceId: service._id,
                            scheduledDate: selectedDate,
                            slotStart: selectedSlot.start,
                            slotEnd: selectedSlot.end,
                            address,
                            pricing: {
                                baseAmount: service.basePrice,
                                taxes: taxes,
                                total: total
                            },
                            notes
                        };

                        const bookingRes = await api.post('/bookings', payload);
                        const bookingId = bookingRes.data.id || bookingRes.data._id;

                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: bookingId
                        });

                        toast.success('Payment successful & request sent! 🎉');
                        onClose();
                        navigate('/dashboard');
                    } catch (err) {
                        console.error('Payment/Booking Error:', err.response?.data || err);
                        const errorMsg = err.response?.data?.message || err.message || 'Payment verification or booking failed';
                        toast.error(errorMsg);
                        setIsSubmitting(false);
                    }
                },
                theme: { color: '#4F46E5' }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(response.error.description || 'Payment failed');
                setIsSubmitting(false);
            });
            rzp.open();
        } catch (err) {
            console.error('Booking error:', err);
            toast.error(err.response?.data?.message || 'Failed to initialize payment');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-slideUp">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#E8E8E4] flex justify-between items-center bg-[#FAFAF8]">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">Book Service</h2>
                        <p className="text-sm text-[#6B6B6B]">{provider.name} • {service?.name}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
                    
                    {step === 1 && (
                        <div className="animate-fadeIn">
                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <i className="fas fa-calendar-alt text-[#4F46E5]"></i> Select Date & Time
                            </h3>
                            
                            {loadingSlots ? (
                                <div className="py-10 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Dates Horizontal Scroll */}
                                    <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                                        {dates.map((dObj) => {
                                            const isSelected = selectedDate === dObj.date;
                                            const date = dayjs(dObj.date);
                                            return (
                                                <button 
                                                    key={dObj.date}
                                                    onClick={() => handleDateChange(dObj.date)}
                                                    className={`flex-shrink-0 w-20 py-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                                                        isSelected 
                                                        ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-md scale-105' 
                                                        : 'bg-white border-[#E8E8E4] text-[#6B6B6B] hover:border-[#4F46E5]/50'
                                                    }`}
                                                >
                                                    <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-100' : 'text-[#6B6B6B]'}`}>{date.format('ddd')}</span>
                                                    <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>{date.format('DD')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Slots Grid */}
                                    <div className="mb-2">
                                        <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Available Slots</p>
                                        {slots.length === 0 ? (
                                            <div className="text-center py-8 bg-[#FAFAF8] rounded-2xl border border-[#E8E8E4] border-dashed">
                                                <p className="text-[#6B6B6B]">No slots available on this date.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {slots.map((slot, idx) => {
                                                    const isSelected = selectedSlot === slot;
                                                    return (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all border ${
                                                                isSelected 
                                                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' 
                                                                : 'bg-white text-[#1A1A1A] border-[#E8E8E4] hover:border-[#1A1A1A] hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {slot.start}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fadeIn">
                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <i className="fas fa-map-marker-alt text-[#4F46E5]"></i> Service Details
                            </h3>

                            <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E8E4] mb-6 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1">Schedule</p>
                                    <p className="text-[#1A1A1A] font-bold">{dayjs(selectedDate).format('MMMM D, YYYY')} at {selectedSlot.start}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="text-sm font-medium text-[#4F46E5] hover:underline">Edit</button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Address Line 1 *</label>
                                    <input type="text" value={address.line1} onChange={e=>setAddress({...address, line1: e.target.value})} className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all" placeholder="House/Flat No., Building Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Address Line 2</label>
                                    <input type="text" value={address.line2} onChange={e=>setAddress({...address, line2: e.target.value})} className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all" placeholder="Street, Area (Optional)" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">City *</label>
                                        <input type="text" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">State *</label>
                                        <input type="text" value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Pincode *</label>
                                    <input type="text" value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})} className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Additional Notes</label>
                                    <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows="2" className="w-full bg-white border border-[#E8E8E4] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" placeholder="Any specific instructions for the provider..."></textarea>
                                </div>
                            </div>

                            {/* Pricing Summary */}
                            <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white shadow-lg">
                                <h4 className="font-heading font-bold text-lg mb-3 border-b border-gray-700 pb-2">Pricing Summary</h4>
                                <div className="flex justify-between mb-2 text-sm text-gray-300">
                                    <span>Base Service ({service?.name})</span>
                                    <span>₹{service?.basePrice}</span>
                                </div>
                                <div className="flex justify-between mb-3 text-sm text-gray-300">
                                    <span>Taxes (18%)</span>
                                    <span>₹{(service?.basePrice * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                                    <span>Total Amount</span>
                                    <span className="text-[#4F46E5]">₹{(service?.basePrice * 1.18).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#E8E8E4] bg-white flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-full text-sm font-semibold text-[#6B6B6B] hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    {step === 1 ? (
                        <button 
                            onClick={handleNext}
                            disabled={!selectedSlot}
                            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-md ${
                                selectedSlot 
                                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:-translate-y-0.5' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button 
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-full text-sm font-semibold bg-[#1A1A1A] text-white hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Confirming...</>
                            ) : (
                                'Proceed to Payment'
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BookingModal;
