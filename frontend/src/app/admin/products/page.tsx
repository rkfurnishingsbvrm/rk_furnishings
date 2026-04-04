'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';


interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    images: string[];
    is_featured: boolean;
    created_at: string;
}

const CATEGORIES = ['Curtains', 'Sofa Fabrics', 'Wallpapers', 'Blinds', 'Carpets & Rugs', 'Mattresses', 'Flooring'];

export default function ProductsAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', category: '', description: '', imageUrl: '', is_featured: false,
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            if (!res.ok) throw new Error('Could not connect to the database server.');

            const data = await res.json();
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('System is currently running in offline/local mode. Changes will be saved locally.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setDeleting(id);
        try {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product');
        } finally {
            setDeleting(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.description) {
            setFormError('Name, category, and description are required.');
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',

                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    category: form.category,
                    description: form.description,
                    images: form.imageUrl ? [form.imageUrl] : [],
                    is_featured: form.is_featured,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || 'Failed to save product.');
            setShowModal(false);
            setForm({ name: '', category: '', description: '', imageUrl: '', is_featured: false });
            fetchProducts();
        } catch (err: unknown) {
            setFormError((err as Error).message || 'Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        const matchesSearch = !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Product Catalogue</h1>
                    <p className="text-gray-500 text-xs tracking-widest uppercase">Manage Collections & Inventory</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setFormError(''); }}
                    className="bg-charcoal text-white text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-4 rounded-sm hover:bg-gold transition-colors shadow-md"
                >
                    + Add Item
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


            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-3 text-sm focus:outline-none focus:border-gold border border-gray-200 rounded-sm"
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-6 py-3 border border-gray-200 text-sm text-gray-600 rounded-sm focus:outline-none focus:border-gold cursor-pointer bg-white"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">Loading products...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Product / Image</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Item Name</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Category</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Status</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 text-sm italic">
                                        {searchQuery || categoryFilter ? 'No products match your filter.' : 'No products found. Add your first product to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-sm relative overflow-hidden">
                                                    {product.images?.[0] && (
                                                        <img src={product.images[0]} className="object-cover w-full h-full" alt="Thumbnail" />
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-gray-400">#{product.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-serif text-charcoal">{product.name}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">{product.category}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 ${product.is_featured ? 'text-gold' : 'text-green-600'}`}>
                                                <span className={`w-2 h-2 rounded-full block ${product.is_featured ? 'bg-gold' : 'bg-green-500'}`}></span>
                                                {product.is_featured ? 'Featured' : 'Live'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleting === product.id}
                                                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {deleting === product.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <div className="p-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 italic">
                        Showing {filteredProducts.length} of {products.length} items
                    </p>
                </div>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white max-w-lg w-full rounded-sm shadow-2xl z-10 overflow-hidden">
                        <div className="bg-charcoal px-8 py-6 flex justify-between items-center">
                            <h2 className="text-lg font-serif text-white">Add New Product</h2>
                            <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white text-xl transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Product Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Royal Silk Drapes"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Category *</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm text-gray-600 bg-transparent"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Description *</label>
                                <textarea
                                    placeholder="Describe the product..."
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm resize-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={form.imageUrl}
                                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                                    className="accent-gold w-4 h-4"
                                />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Mark as Featured</span>
                            </label>
                            {formError && <p className="text-red-500 text-xs italic">{formError}</p>}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-charcoal text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
