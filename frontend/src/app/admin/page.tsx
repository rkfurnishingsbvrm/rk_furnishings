'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    totalProducts: number;
    totalBlogPosts: number;
    recentConsultations: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalBlogPosts: 0, recentConsultations: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/stats`);

                if (!res.ok) throw new Error('Failed to fetch stats');
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Collections', count: loading ? '...' : `${stats.totalProducts}`, label: 'Products', icon: '🛋️' },
        { title: 'Active Publications', count: loading ? '...' : `${stats.totalBlogPosts}`, label: 'Blog Posts', icon: '📝' },
        { title: 'Recent Enquiries', count: loading ? '...' : `${stats.recentConsultations}`, label: 'Pending', icon: '✉️' },
    ];

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-serif text-charcoal mb-3">Welcome Back</h1>
                <p className="text-gray-500 text-sm tracking-wide">Manage your collections, publications, and showroom details.</p>
                <div className="w-12 h-0.5 bg-gold mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 text-6xl opacity-5 group-hover:scale-110 transition-transform">{stat.icon}</div>
                        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">{stat.title}</h3>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-serif text-charcoal">{stat.count}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100">
                <h3 className="text-lg font-serif text-charcoal mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a href="/admin/products" className="block border-2 border-dashed border-gray-100 hover:border-gold p-8 text-center rounded-sm transition-colors group">
                        <span className="text-3xl mb-4 block opacity-50 group-hover:opacity-100 transition-opacity">📸</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-charcoal group-hover:text-gold transition-colors">Add New Product</span>
                    </a>
                    <a href="/admin/blog" className="block border-2 border-dashed border-gray-100 hover:border-gold p-8 text-center rounded-sm transition-colors group">
                        <span className="text-3xl mb-4 block opacity-50 group-hover:opacity-100 transition-opacity">✍️</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-charcoal group-hover:text-gold transition-colors">Write Blog Post</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
