'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { ShoppingBag, MapPin, Clock, CheckCircle2 } from 'lucide-react';

interface Order {
    id: string;
    items: any[];
    shippingAddress: string;
    totalAmount: number;
    status: string;
    created_at: string;
}

export default function OrdersAdmin() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/orders`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-serif text-charcoal mb-2">Order Management</h1>
                <p className="text-gray-500 text-xs tracking-widest uppercase text-[9px] font-black">Live Transaction Monitoring</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.length === 0 ? (
                        <div className="p-20 text-center bg-white border border-dashed rounded-3xl text-gray-400 italic">No orders yet.</div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-8 hover:shadow-md transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5 px-3 py-1 rounded-full">Order #{order.id}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-4 text-gray-600">
                                        <MapPin className="w-4 h-4 mt-1 text-gold" />
                                        <p className="text-sm font-light leading-relaxed">{order.shippingAddress}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase text-center">x{item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end gap-6">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Value</p>
                                        <p className="text-2xl font-serif italic text-charcoal">₹{order.totalAmount}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-4 py-2 border border-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
