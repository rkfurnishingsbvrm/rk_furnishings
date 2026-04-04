'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

const ConsultationForm = () => {

    const [formData, setFormData] = useState({
        userName: '',
        phone: '',
        email: '',
        serviceType: '',
        productInterest: '',
        preferredDate: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const services = [
        'Home Styling Consultation',
        'Custom Curtain Stitching',
        'In-Home Measurement',
        'Expert Installation',
        'NRI Setup Services',
    ];

    const productCategories = [
        'Curtains & Drapes',
        'Sofa Fabrics',
        'Wallpapers',
        'Blinds',
        'Carpets & Rugs',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`${API_BASE_URL}/consultations/book`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    userName: '',
                    phone: '',
                    email: '',
                    serviceType: '',
                    productInterest: '',
                    preferredDate: '',
                    message: '',
                });
            } else {
                setError(data.message || 'Error booking consultation');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 text-center text-charcoal shadow-xl rounded-sm border border-gray-100"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="text-green-500 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif mb-4">Request Received!</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Thank you for reaching out. Our design expert will contact you shortly to confirm your consultation.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="bg-charcoal text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gold transition-all"
                >
                    Back to Form
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100">
            <div className="mb-10">
                <h2 className="text-3xl font-serif text-charcoal mb-2">Book a Consultation</h2>
                <div className="w-16 h-1 bg-gold"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                        <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                            <User className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                suppressHydrationWarning
                                className="w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                        <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91"
                                required
                                suppressHydrationWarning
                                className="w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                        <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                suppressHydrationWarning
                                className="w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Service Required</label>
                        <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                                suppressHydrationWarning
                                className="w-full focus:outline-none text-sm bg-transparent"
                            >
                                <option value="">Select Service</option>
                                {services.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Interested In</label>
                        <select
                            name="productInterest"
                            value={formData.productInterest}
                            onChange={handleChange}
                            suppressHydrationWarning
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold text-sm bg-transparent"
                        >
                            <option value="">Select Category</option>
                            {productCategories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Preferred Date</label>
                        <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                required
                                suppressHydrationWarning
                                className="w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Additional details..."
                        rows={2}
                        suppressHydrationWarning
                        className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-gold text-sm resize-none"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className={`w-full py-5 font-bold uppercase tracking-[0.2em] transition-all
                    ${loading ? 'bg-gray-300' : 'bg-charcoal text-white hover:bg-gold'}`}
                >
                    {loading ? 'Submitting...' : 'Book Consultation'}
                </button>
            </form>
        </div>
    );
};

export default ConsultationForm;
