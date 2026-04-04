'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface BlogPost {
    id: string;
    title: string;
    author: string;
    content: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

export default function BlogAdmin() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', author: 'Admin', content: '', is_published: false });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Use admin backend API (service key) to see all posts including drafts
            const res = await fetch(`${API_BASE_URL}/blog`);
            if (!res.ok) throw new Error('Could not connect to the database server.');
            const data = await res.json();
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setDeleting(id);
        try {
            const res = await fetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting blog post:', err);
            alert('Failed to delete post');
        } finally {
            setDeleting(null);
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            const newStatus = !post.is_published;
            // Route through backend API (service key bypasses RLS)
            const res = await fetch(`${API_BASE_URL}/blog/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_published: newStatus,
                    published_at: newStatus ? new Date().toISOString() : null,
                }),
            });
            if (!res.ok) throw new Error('Failed to update publish status');
            setPosts(prev =>
                prev.map(p => p.id === post.id
                    ? { ...p, is_published: newStatus, published_at: newStatus ? new Date().toISOString() : null }
                    : p
                )
            );
        } catch (err) {
            console.error('Error toggling publish status:', err);

        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setFormError('Title is required.');
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            // Use backend API (service key) to bypass Supabase RLS
            const res = await fetch(`${API_BASE_URL}/blog`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    author: form.author || 'Admin',
                    content: form.content,
                    is_published: form.is_published,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || 'Failed to save post.');
            setShowModal(false);
            setForm({ title: '', author: 'Admin', content: '', is_published: false });
            fetchPosts();
        } catch (err: unknown) {
            setFormError((err as Error).message || 'Failed to save post.');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Draft';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Blog Publications</h1>
                    <p className="text-gray-500 text-xs tracking-widest uppercase">Manage Content & Articles</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setFormError(''); }}
                    className="bg-charcoal text-white text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-4 rounded-sm hover:bg-gold transition-colors shadow-md"
                >
                    + New Draft
                </button>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">Loading posts...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-6 text-[10px] uppercase tracking-widests text-gray-500 font-bold">Title</th>
                                <th className="p-6 text-[10px] uppercase tracking-widests text-gray-500 font-bold">Author</th>
                                <th className="p-6 text-[10px] uppercase tracking-widests text-gray-500 font-bold">Status</th>
                                <th className="p-6 text-[10px] uppercase tracking-widests text-gray-500 font-bold">Published Date</th>
                                <th className="p-6 text-[10px] uppercase tracking-widests text-gray-500 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 text-sm italic">
                                        No blog posts yet. Create your first post to get started.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <span className="font-serif text-charcoal">{post.title}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-gray-500 text-sm">{post.author}</span>
                                        </td>
                                        <td className="p-6">
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 transition-colors ${post.is_published
                                                    ? 'text-green-600 hover:text-amber-600'
                                                    : 'text-amber-500 hover:text-green-600'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full block ${post.is_published ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                                                {post.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-gray-400 text-xs italic">{formatDate(post.published_at)}</span>
                                        </td>
                                        <td className="p-6 text-right space-x-4">
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deleting === post.id}
                                                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {deleting === post.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* New Draft Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white max-w-2xl w-full rounded-sm shadow-2xl z-10 overflow-hidden">
                        <div className="bg-charcoal px-8 py-6 flex justify-between items-center">
                            <h2 className="text-lg font-serif text-white">New Blog Post</h2>
                            <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white text-xl transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Top Curtain Trends for 2026"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Author</label>
                                <input
                                    type="text"
                                    placeholder="Author name"
                                    value={form.author}
                                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Content</label>
                                <textarea
                                    placeholder="Write your article content here..."
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    rows={6}
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm resize-none"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_published}
                                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                                    className="accent-gold w-4 h-4"
                                />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Publish Immediately</span>
                            </label>
                            {formError && <p className="text-red-500 text-xs italic">{formError}</p>}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-200 text-gray-500 py-4 text-[10px] uppercase tracking-widest font-bold hover:border-charcoal hover:text-charcoal transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-charcoal text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : form.is_published ? 'Publish Post' : 'Save Draft'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
