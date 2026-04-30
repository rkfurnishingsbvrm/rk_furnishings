'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';


interface Consultation {
    id: string;
    user_name: string;
    phone: string;
    email: string;
    service_type: string;
    product_interest: string | null;
    preferred_date: string;
    message: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
}

const statusColors: Record<string, string> = {
    pending: 'text-amber-500 bg-amber-50 border-amber-200',
    confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
    completed: 'text-green-600 bg-green-50 border-green-200',
    cancelled: 'text-red-500 bg-red-50 border-red-200',
};

const statusDots: Record<string, string> = {
    pending: 'bg-amber-400',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-400',
};

export default function ConsultationsAdmin() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [selected, setSelected] = useState<Consultation | null>(null);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/consultations`);
            if (!res.ok) throw new Error('Could not connect to the database server.');
            const data = await res.json();

            setConsultations(data || []);
        } catch (err) {
            console.error('Error fetching consultations:', err);
            setError('System is currently running in offline/local mode. Bookings are saved locally.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`${API_BASE_URL}/consultations/${id}/status`, {
                method: 'PATCH',

                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            setConsultations(prev =>
                prev.map(c => c.id === id ? { ...c, status: status as Consultation['status'] } : c)
            );
            if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Consultation['status'] } : null);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    const filtered = filterStatus
        ? consultations.filter(c => c.status === filterStatus)
        : consultations;

    const counts = {
        all: consultations.length,
        pending: consultations.filter(c => c.status === 'pending').length,
        confirmed: consultations.filter(c => c.status === 'confirmed').length,
        completed: consultations.filter(c => c.status === 'completed').length,
        cancelled: consultations.filter(c => c.status === 'cancelled').length,
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Consultation Enquiries</h1>
                    <p className="text-gray-500 text-xs tracking-widest uppercase">Manage Bookings & Appointments</p>
                </div>
                <button
                    onClick={fetchConsultations}
                    className="bg-charcoal text-white text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-4 rounded-sm hover:bg-gold transition-colors shadow-md"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 animate-pulse">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-amber-700 font-bold uppercase tracking-widest">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {([
                    { key: '', label: 'All', count: counts.all },
                    { key: 'pending', label: 'Pending', count: counts.pending },
                    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
                    { key: 'completed', label: 'Completed', count: counts.completed },
                    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
                ] as { key: string; label: string; count: number }[]).map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`bg-white p-5 rounded-sm shadow-sm border text-center transition-all ${filterStatus === key
                            ? 'border-gold shadow-md'
                            : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <p className="text-2xl font-serif text-charcoal">{count}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">Loading enquiries...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Client</th>
                                <th className="p-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Service</th>
                                <th className="p-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Date</th>
                                <th className="p-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Status</th>
                                <th className="p-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 text-sm italic">
                                        No consultations found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                                        <td className="p-5">
                                            <p className="font-serif text-charcoal text-sm">{c.user_name}</p>
                                            <p className="text-gray-400 text-xs">{c.email}</p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-600">{c.service_type}</p>
                                            {c.product_interest && (
                                                <p className="text-xs text-gold">{c.product_interest}</p>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-500">{formatDate(c.preferred_date)}</p>
                                            <p className="text-xs text-gray-400 italic">Booked: {formatDate(c.created_at)}</p>
                                        </td>
                                        <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={c.status}
                                                onChange={(e) => updateStatus(c.id, e.target.value)}
                                                disabled={updatingId === c.id}
                                                className={`text-[10px] uppercase tracking-wider font-bold border rounded-full px-3 py-1.5 cursor-pointer focus:outline-none transition-all ${statusColors[c.status]}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                                                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}></div>
                    <div className="relative bg-white max-w-lg w-full rounded-sm shadow-2xl p-10 z-10">
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-charcoal text-xl transition-colors"
                        >✕</button>
                        <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border rounded-full px-3 py-1 mb-6 ${statusColors[selected.status]}`}>
                            <span className={`w-2 h-2 rounded-full ${statusDots[selected.status]}`}></span>
                            {selected.status}
                        </span>
                        <h2 className="text-2xl font-serif text-charcoal mb-1">{selected.user_name}</h2>
                        <p className="text-gray-400 text-sm mb-8">{selected.email} · {selected.phone}</p>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-50 pb-3">
                                <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Service</span>
                                <span className="text-charcoal font-medium">{selected.service_type}</span>
                            </div>
                            {selected.product_interest && (
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Product Interest</span>
                                    <span className="text-gold font-medium">{selected.product_interest}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-b border-gray-50 pb-3">
                                <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Preferred Date</span>
                                <span className="text-charcoal font-medium">{formatDate(selected.preferred_date)}</span>
                            </div>
                            {selected.message && (
                                <div className="pt-2">
                                    <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold mb-2">Message</p>
                                    <p className="text-gray-600 font-light italic leading-relaxed border-l-2 border-gold/30 pl-4">{selected.message}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex gap-3">
                            {(['confirmed', 'completed', 'cancelled'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => updateStatus(selected.id, s)}
                                    disabled={selected.status === s || updatingId === selected.id}
                                    className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-sm border transition-all disabled:opacity-40 ${selected.status === s
                                        ? 'bg-charcoal text-white border-charcoal'
                                        : 'border-gray-200 text-gray-500 hover:border-gold hover:text-gold'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
