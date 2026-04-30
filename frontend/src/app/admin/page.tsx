'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Package, Users, ShoppingCart, TrendingUp, Plus, Search, MoreVertical, Edit3, Trash2, Bell, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';

const AdminDashboard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: 'Total Revenue', value: '₹12.4L', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Curtains', value: '124', icon: Package, color: 'text-gold' },
    { label: 'Total Stylists', value: '12', icon: Users, color: 'text-blue-500' },
    { label: 'Open Orders', value: '45', icon: ShoppingCart, color: 'text-purple-500' }
  ];

  const mockInventory = [
    { id: 'C001', name: 'Royal Silk Pearl', category: 'Curtains', price: '₹4,500', stock: 24, status: 'In Stock' },
    { id: 'C002', name: 'Vintage Mahogany', category: 'Curtains', price: '₹7,200', stock: 12, status: 'Low Stock' },
    { id: 'C003', name: 'Minimalist Charcoal', category: 'Blinds', price: '₹3,800', stock: 45, status: 'In Stock' },
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-charcoal text-white p-12 flex flex-col gap-12 sticky top-0 h-screen z-50">
        <div className="text-2xl font-serif font-black tracking-tighter">
            <span className="text-gold">RK</span> ADMIN
        </div>

        <nav className="flex-1 space-y-4">
            {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'users', label: 'Stylists', icon: Users },
            ].map(item => (
                <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-6 p-5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all relative ${
                        activeTab === item.id ? 'bg-gold text-charcoal shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)]' : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-charcoal' : 'text-gold/50'}`} />
                    {item.label}
                    {activeTab === item.id && <motion.div layoutId="nav-pill" className="absolute right-4 w-1 h-6 bg-charcoal rounded-full" />}
                </button>
            ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-6">
            <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-6 p-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'settings' ? 'bg-white/10 text-white shadow-inner' : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
            >
                <Settings className="w-5 h-5" /> Settings
            </button>
            <button onClick={logout} className="w-full flex items-center gap-6 p-5 text-red-400/50 hover:text-red-400 transition-all text-[9px] font-black uppercase tracking-widest"><LogOut className="w-5 h-5" /> Terminate Session</button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="p-20 space-y-20 max-w-7xl mx-auto">
            <header className="flex justify-between items-center bg-white -mx-20 -mt-20 px-20 py-10 border-b border-gray-100 sticky top-0 z-40 backdrop-blur-3xl bg-white/80">
                <div className="flex gap-12 items-center">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search Master Records..." className="bg-gray-50 pl-12 pr-10 py-4 rounded-xl text-xs outline-none border border-transparent focus:border-gold w-96 transition-all" />
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <button className="relative p-4 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-charcoal tracking-widest">Master Admin</p>
                            <p className="text-xs text-gray-400 italic">Connected: {mounted ? user?.email : 'N/A'}</p>
                        </div>
                        <div className="w-12 h-12 bg-charcoal rounded-2xl flex items-center justify-center text-gold font-serif text-xl border border-gold/20 shadow-xl shadow-gold/5">
                            {mounted ? user?.name?.[0] : 'A'}
                        </div>
                    </div>
                </div>
            </header>

            <div>
                <span className="text-gold font-black uppercase text-[10px] tracking-[0.5em] mb-4 block">Performance Cluster</span>
                <h1 className="text-6xl font-serif italic text-charcoal mb-4 uppercase leading-none">Command Center</h1>
                <p className="text-gray-400 font-light italic text-lg leading-relaxed">Real-time telemetry and management interface for RK Furnishings ecosystem.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-12 rounded-[50px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-gray-100 group hover:-translate-y-4 transition-all duration-700"
                    >
                        <div className="relative z-10">
                            <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest leading-loose mb-2">{stat.label}</p>
                            <div className="flex items-end gap-3">
                                <p className="text-5xl font-serif italic text-charcoal">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[60px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.06)] p-20 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gold/30" />
                
                <AnimatePresence mode="wait">
                    {activeTab === 'inventory' ? (
                         <motion.div
                            key="inventory-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                         >
                            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
                                <div>
                                    <h3 className="text-4xl font-serif italic mb-3 text-charcoal">Inventory Matrix</h3>
                                    <p className="text-gray-400 text-base font-light">Showing all active interior fabrics synced with AR catalog.</p>
                                </div>
                                <button className="bg-charcoal text-white px-12 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-6 shadow-2xl hover:bg-gold hover:text-white transition-all transform hover:-translate-y-2">
                                    Add New Signature Series <Plus className="w-6 h-6 text-gold" />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 pb-12">
                                            {['Product Twin', 'SKU ID', 'Logic Category', 'Stock Level', 'Master Action'].map(header => (
                                                <th key={`th-${header}`} className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 first:text-left">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {mockInventory.map((item, i) => (
                                            <motion.tr 
                                                key={item.id} 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="hover:bg-gray-50/80 transition-all group"
                                            >
                                                <td className="p-10">
                                                    <div className="flex items-center gap-10">
                                                        <div className="w-20 h-20 rounded-[30px] bg-gray-100 border border-gray-100 shadow-2xl group-hover:scale-110 transition-all duration-700 overflow-hidden relative">
                                                            <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-serif italic text-charcoal">{item.name}</p>
                                                            <span className="text-[10px] font-black uppercase text-gold/60 tracking-widest">{item.status}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-10 text-xs font-mono text-gray-300"># {item.id}</td>
                                                <td className="p-10">
                                                    <span className="px-6 py-3 bg-gray-100 text-charcoal text-[9px] font-black uppercase tracking-widest rounded-full group-hover:bg-gold transition-colors">{item.category}</span>
                                                </td>
                                                <td className="p-10">
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-xl font-bold text-charcoal">{item.stock}</p>
                                                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${item.stock < 15 ? 'bg-red-400 w-1/4' : 'bg-green-400 w-3/4'}`} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-10">
                                                <div className="flex gap-4">
                                                        <button className="p-5 hover:bg-white hover:shadow-2xl rounded-2xl text-gray-300 hover:text-gold transition-all"><Edit3 className="w-5 h-5" /></button>
                                                        <button className="p-5 hover:bg-white hover:shadow-2xl rounded-2xl text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                                                        <button className="p-5 hover:bg-white hover:shadow-2xl rounded-2xl text-gray-300 transition-all"><MoreVertical className="w-5 h-5" /></button>
                                                </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                         </motion.div>
                    ) : activeTab === 'settings' ? (
                        <motion.div
                            key="settings-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-3xl"
                        >
                            <h3 className="text-4xl font-serif italic mb-10 text-charcoal">Portal Master Config</h3>
                            <SettingsContent />
                        </motion.div>
                    ) : (
                        <div className="py-40 text-center opacity-20 italic">Module logic for {activeTab} is currently in calibration.</div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </section>
    </main>
  );
};

const SettingsContent: React.FC = () => {
    const [settings, setSettings] = useState({ contactNumber: '', supportEmail: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetch(`${API_BASE_URL}/admin/settings`)
            .then(res => res.json())
            .then(data => {
                setSettings({ contactNumber: data.contactNumber, supportEmail: data.supportEmail });
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await fetch(`${API_BASE_URL}/admin/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        setSaving(false);
        alert('Global configurations updated successfully.');
    };

    if (loading) return <div className="text-gold animate-pulse tracking-widest">Accessing records...</div>;

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gold tracking-widest">Flagship Contact</label>
                    <input 
                        type="text" 
                        value={settings.contactNumber} 
                        onChange={e => setSettings({...settings, contactNumber: e.target.value})}
                        className="w-full bg-gray-50 border-b-2 border-transparent focus:border-gold p-6 outline-none transition-all text-xl font-serif italic"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gold tracking-widest">Global Support Email</label>
                    <input 
                        type="email" 
                        value={settings.supportEmail} 
                        onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                        className="w-full bg-gray-50 border-b-2 border-transparent focus:border-gold p-6 outline-none transition-all text-xl font-serif italic"
                    />
                </div>
            </div>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-charcoal text-white px-20 py-8 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-gold transition-all disabled:opacity-20"
            >
                {saving ? 'Syncing...' : 'Broadcast Changes'}
            </button>
        </div>
    );
};

export default AdminDashboard;
