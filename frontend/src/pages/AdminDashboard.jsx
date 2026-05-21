import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [providers, setProviders] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [serviceForm, setServiceForm] = useState({ name: '', description: '', category: '', basePrice: '', icon: '', durationMinutes: 60 });
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
        fetchProviders();
        fetchServices();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data.stats);
            setRecentBookings(res.data.recentBookings);
        } catch (err) { toast.error('Failed to load stats'); }
        finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try { const res = await api.get('/admin/users'); setUsers(res.data.data); } catch (err) {}
    };

    const fetchProviders = async () => {
        try { const res = await api.get('/admin/providers'); setProviders(res.data.data); } catch (err) {}
    };

    const fetchServices = async () => {
        try { const res = await api.get('/services'); setServices(res.data); } catch (err) {}
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingServiceId) {
                await api.put(`/admin/services/${editingServiceId}`, serviceForm);
                toast.success('Service updated');
            } else {
                await api.post('/admin/services', serviceForm);
                toast.success('Service created');
            }
            setShowServiceModal(false);
            setServiceForm({ name: '', description: '', category: '', basePrice: '', icon: '', durationMinutes: 60 });
            setEditingServiceId(null);
            fetchServices();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to save service'); }
    };

    const handleEditService = (s) => {
        setServiceForm({ name: s.name, description: s.description, category: s.category, basePrice: s.basePrice, icon: s.icon, durationMinutes: s.duration_minutes || 60 });
        setEditingServiceId(s._id);
        setShowServiceModal(true);
    };

    const handleDeleteService = async (id) => {
        if(!window.confirm('Delete this service? (Will fail if active bookings exist)')) return;
        try {
            await api.delete(`/admin/services/${id}`);
            toast.success('Service deleted');
            fetchServices();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete service'); }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 min-h-[60vh] items-center">
                <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative min-h-[80vh]">
            <h1 className="text-3xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-8 border-b border-[#E8E8E4] pb-2 custom-scrollbar">
                {['overview', 'customers', 'providers', 'services'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#1A1A1A] text-white shadow-md' : 'bg-white text-[#6B6B6B] border border-[#E8E8E4] hover:bg-gray-50 hover:text-[#1A1A1A]'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
                <div className="animate-fadeIn">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E8E4] shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                                <i className="fas fa-users"></i>
                            </div>
                            <div>
                                <p className="text-sm text-[#6B6B6B] font-medium">Total Customers</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalUsers}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E8E4] shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
                                <i className="fas fa-user-tie"></i>
                            </div>
                            <div>
                                <p className="text-sm text-[#6B6B6B] font-medium">Total Providers</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalProviders}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-[#E8E8E4] shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div>
                                <p className="text-sm text-[#6B6B6B] font-medium">Total Bookings</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalBookings}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-[#E8E8E4] shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-2xl">
                                <i className="fas fa-wallet"></i>
                            </div>
                            <div>
                                <p className="text-sm text-[#6B6B6B] font-medium">Total Platform Value</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">₹{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E8E8E4] bg-[#FAFAF8]">
                            <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Activity</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E8E8E4] text-xs uppercase tracking-wider text-[#6B6B6B]">
                                        <th className="px-6 py-4 font-bold">Service</th>
                                        <th className="px-6 py-4 font-bold">Customer</th>
                                        <th className="px-6 py-4 font-bold">Provider</th>
                                        <th className="px-6 py-4 font-bold">Date</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E8E4]">
                                    {recentBookings.map(b => (
                                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-[#1A1A1A]">{b.serviceName}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">{b.customerName}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">{b.providerName}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B] text-sm">{dayjs(b.date).format('MMM D, YYYY HH:mm')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                    b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#1A1A1A] text-right">₹{b.price}</td>
                                        </tr>
                                    ))}
                                    {recentBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-[#6B6B6B]">No recent bookings found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
                <div className="animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E8E8E4] bg-[#FAFAF8] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#1A1A1A]">Customers Directory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E8E8E4] text-xs uppercase tracking-wider text-[#6B6B6B]">
                                        <th className="px-6 py-4 font-bold">Name</th>
                                        <th className="px-6 py-4 font-bold">Email</th>
                                        <th className="px-6 py-4 font-bold">Phone</th>
                                        <th className="px-6 py-4 font-bold">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E8E4]">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#1A1A1A]">{u.name}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">{u.email}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">{u.phone || 'N/A'}</td>
                                            <td className="px-6 py-4 text-[#6B6B6B] text-sm">{dayjs(u.createdAt).format('MMM D, YYYY')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* PROVIDERS TAB */}
            {activeTab === 'providers' && (
                <div className="animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E8E8E4] bg-[#FAFAF8] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#1A1A1A]">Providers Directory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E8E8E4] text-xs uppercase tracking-wider text-[#6B6B6B]">
                                        <th className="px-6 py-4 font-bold">Provider Info</th>
                                        <th className="px-6 py-4 font-bold">Profession</th>
                                        <th className="px-6 py-4 font-bold text-center">Rating</th>
                                        <th className="px-6 py-4 font-bold">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E8E4]">
                                    {providers.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#1A1A1A]">{p.name}</div>
                                                <div className="text-xs text-[#6B6B6B]">{p.email} • {p.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">
                                                {p.profession} <br/>
                                                <span className="text-xs">{p.experience} yrs exp</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md flex items-center justify-center gap-1 w-max mx-auto">
                                                    <i className="fas fa-star text-[10px]"></i> {p.rating?.toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[#6B6B6B] text-sm">{dayjs(p.createdAt).format('MMM D, YYYY')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
                <div className="animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E8E8E4] bg-[#FAFAF8] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#1A1A1A]">Service Catalog</h2>
                            <button 
                                onClick={() => { setServiceForm({ name: '', description: '', category: '', basePrice: '', icon: '', durationMinutes: 60 }); setEditingServiceId(null); setShowServiceModal(true); }}
                                className="bg-[#4F46E5] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4338CA] transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-plus"></i> Add Service
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {services.map(s => (
                                <div key={s._id} className="border border-[#E8E8E4] rounded-2xl p-5 hover:border-[#4F46E5] transition-colors bg-[#FAFAF8] relative">
                                    <div className="text-3xl mb-3">{s.icon}</div>
                                    <h3 className="font-bold text-[#1A1A1A] mb-1">{s.name}</h3>
                                    <p className="text-xs text-[#6B6B6B] mb-3 line-clamp-2">{s.description}</p>
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="bg-gray-200 text-[#1A1A1A] text-xs font-bold px-2 py-1 rounded-md">{s.category}</span>
                                        <span className="font-bold text-[#4F46E5]">₹{s.basePrice}</span>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-[#E8E8E4]">
                                        <button onClick={() => handleEditService(s)} className="flex-1 bg-white border border-[#E8E8E4] py-2 rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors">Edit</button>
                                        <button onClick={() => handleDeleteService(s._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowServiceModal(false)}></div>
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 p-8 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">{editingServiceId ? 'Edit Service' : 'New Service'}</h2>
                            <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleServiceSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Name</label>
                                    <input type="text" required value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm, name: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Description</label>
                                    <textarea required rows="2" value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm, description: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Category</label>
                                    <input type="text" required value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm, category: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Icon (Emoji)</label>
                                    <input type="text" required value={serviceForm.icon} onChange={e=>setServiceForm({...serviceForm, icon: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Base Price (₹)</label>
                                    <input type="number" required value={serviceForm.basePrice} onChange={e=>setServiceForm({...serviceForm, basePrice: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#1A1A1A]">Duration (Mins)</label>
                                    <input type="number" required value={serviceForm.durationMinutes} onChange={e=>setServiceForm({...serviceForm, durationMinutes: e.target.value})} className="w-full border border-[#E8E8E4] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowServiceModal(false)} className="px-6 py-3 rounded-full text-sm font-semibold text-[#6B6B6B] bg-gray-100 hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA]">Save Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
};

export default AdminDashboard;
