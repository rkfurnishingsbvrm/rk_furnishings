'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Box, Layout, ArrowRight, Share2, ZoomIn, Info, Play, MessageCircle, DollarSign, Ruler } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import AIRoomAnalysis from '@/components/SmartShowroom/AIRoomAnalysis';
import RoomMeasurer from '@/components/SmartShowroom/RoomMeasurer';
import ARViewer from '@/components/SmartShowroom/ARViewer';
import RoomVisualizer from '@/components/SmartShowroom/RoomVisualizer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import Image from 'next/image';
import Link from 'next/link';

const fadeInUp: any = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const SmartShowroomPage: React.FC = () => {
    const [arProducts, setArProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchArProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();
                
                const mappedProducts = data.slice(0, 100).map((p: { id: string, name: string, category: string, images?: string[], description?: string }, i: number) => {
                    const isFabricBased = p.category === 'Wallpapers' || p.category === 'Sofa Fabrics' || p.category === 'Blinds' || p.category === 'Curtains';
                    
                    const displayModel = isFabricBased 
                        ? "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxTextured/glTF-Binary/BoxTextured.glb"
                        : "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb";

                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        url: displayModel,
                        poster: undefined, // Removing all images as requested
                        desc: p.description || `Signature ${p.category} piece crafted for elegance across Bhimavaram interiors.`,
                        placement: isFabricBased ? 'wall' : 'floor'
                    };
                });
                setArProducts(mappedProducts);
            } catch (err) {
                console.error('Error fetching AR products:', err);
                // Fallback to mock products if API is offline
                const fallbackData = Array.from({length: 12}, (_, i) => ({
                    id: `mock-ar-${i}`,
                    name: `Signature Collection ${i + 1}`,
                    category: i % 2 === 0 ? 'Wallpapers' : 'Sofa Fabrics',
                    description: 'A premium selection for your modern home.',
                    images: [i % 2 === 0 ? '/images/wallpaper.png' : '/images/sofa.png']
                }));
                
                const mappedProducts = fallbackData.map((p, i) => {
                    const isFabricBased = p.category === 'Wallpapers' || p.category === 'Sofa Fabrics' || p.category === 'Blinds' || p.category === 'Curtains';
                    const displayModel = isFabricBased 
                        ? "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxTextured/glTF-Binary/BoxTextured.glb"
                        : "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb";

                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        url: displayModel,
                        poster: undefined, // Removing all images as requested
                        desc: p.description,
                        placement: isFabricBased ? 'wall' : 'floor'
                    };
                });
                setArProducts(mappedProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchArProducts();
    }, []);

    return (
        <main className="min-h-screen bg-[#fafafa] relative overflow-hidden">
            <CustomCursor />
            <WhatsAppButton />

            {/* AI Stylist Chat Assistant */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-32 right-10 w-96 h-[500px] bg-white rounded-3xl shadow-2xl z-[60] border border-gray-100 overflow-hidden flex flex-col"
                    >
                        <div className="bg-charcoal p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-serif italic">RK AI Assistant</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gold opacity-80">Online // Expert Stylist Mode</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white">✕</button>
                        </div>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                            <div className="bg-white p-10 rounded-[40px] shadow-2xl space-y-10 border border-gray-50">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-gold tracking-[0.4em] mb-8">Spatial Metadata</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Surface Pattern Matching', value: 'High' },
                                            { label: 'Material Texture Analysis', value: 'Enabled' },
                                            { label: 'Room Cohesion Index', value: '0.94' }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                                <span className="text-xs font-black text-charcoal">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h3 className="text-xs font-black uppercase text-gold tracking-[0.4em] mb-6">Expert Stylist Note</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed italic">
                                        &quot;Our system focuses on material cohesion. Every recommendation here is curated to thrive in your detected lighting environment.&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                            <button className="text-gray-300 hover:text-gold transition-all">
                                <Sparkles className="w-5 h-5" />
                            </button>
                            <input type="text" placeholder="Type your style query..." className="flex-1 bg-gray-50 px-4 py-3 rounded-full text-xs outline-none border border-transparent focus:border-gold transition-all" />
                            <button className="bg-charcoal text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-gold transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-10 right-28 bg-charcoal text-white h-16 w-16 rounded-full flex items-center justify-center shadow-2xl z-[50] hover:bg-gold transition-all group overflow-hidden border border-white/10"
            >
                <MessageCircle className={`w-6 h-6 transition-transform duration-500 ${isChatOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                <div className={`absolute inset-0 flex items-center justify-center font-black text-xs transition-transform duration-500 ${isChatOpen ? 'translate-y-0' : 'translate-y-20'}`}>
                    AI
                </div>
            </button>

            {/* Navigation */}
            <nav className="fixed w-full z-50 px-10 py-10 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="text-2xl font-serif font-black tracking-tighter">
                    <span className="text-gold">RK</span> FURNISHINGS
                </Link>
                <div className="flex gap-12 font-black uppercase tracking-[0.4em] text-[8px]">
                    <Link href="/" className="hover:text-gold transition-colors">Return to Home</Link>
                    <a href="#measure" className="hover:text-gold transition-colors">01. Measure</a>
                    <a href="#analyze" className="hover:text-gold transition-colors">02. Stylist</a>
                    <a href="#visualize" className="hover:text-gold transition-colors">03. Virtualize</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
                <div className="relative z-10 text-center px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className="space-y-12"
                    >
                         <div className="inline-flex items-center gap-6 px-10 py-4 border border-gold/40 rounded-full bg-gold/10 backdrop-blur-3xl text-gold text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                            <Sparkles className="w-4 h-4" />
                            Next-Gen Smart Showroom
                        </div>

                        <h1 className="text-7xl md:text-[140px] font-serif text-white leading-[0.8] mix-blend-lighten pointer-events-none mb-12">
                            The New <br />
                            <span className="text-gold italic font-medium">Digital Reality</span>
                        </h1>

                        <p className="text-white/60 text-xl md:text-2xl font-light font-sans max-w-2xl mx-auto mb-16 leading-relaxed">
                            A seamless pipeline from measurement to style analysis. 
                            Experience high-fidelity material overlays with spatial accuracy.
                        </p>

                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <a href="#visualize" className="px-16 py-8 bg-gold text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-charcoal transition-all shadow-[0_30px_60px_-15px_rgba(212,175,55,0.4)]">Visualizer Tool</a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div id="measure">
                <RoomMeasurer />
            </div>

            <section id="analyze" className="py-44 relative bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 mb-20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-2">Style Refinement</h4>
                        <h3 className="text-4xl font-serif text-charcoal italic">Recommendation Filters</h3>
                    </div>
                </div>
                <AIRoomAnalysis />
            </section>

            <div id="visualize">
                <RoomVisualizer />
            </div>

            {/* AR Product Catalog */}
            <section className="py-44 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
                        <div className="max-w-xl">
                            <span className="text-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Interactive Library</span>
                            <h2 className="text-5xl md:text-8xl font-serif text-charcoal leading-tight">Master <br/><span className="text-gold italic font-medium">Assets</span></h2>
                        </div>
                        <div className="flex items-center gap-6 pb-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 italic">V2.0 Engine</p>
                                <p className="text-xs font-bold text-charcoal">Synced with Bhimavaram Inventory</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-gold animate-pulse">
                                <Box className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-3xl" />
                            ))
                        ) : (
                            arProducts.map((product) => (
                                <motion.div 
                                    key={product.id}
                                    {...fadeInUp}
                                    className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-xl group hover:shadow-2xl transition-all"
                                >
                                    <ARViewer 
                                        modelUrl={product.url} 
                                        name={product.name} 
                                        placement={product.placement} 
                                    />
                                    <div className="mt-10 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gold tracking-widest mb-2">{product.category}</p>
                                                <h3 className="text-2xl font-serif text-charcoal italic">{product.name}</h3>
                                            </div>
                                            <div className="h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-gold transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed italic">{product.desc}</p>
                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">Ready for AR</span>
                                            </div>
                                            <button className="text-[9px] font-black uppercase tracking-widest text-charcoal flex items-center gap-2 group-hover:text-gold transition-colors">
                                                Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>


            <footer className="py-20 bg-black text-white/20 border-t border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.8em]">RK FURNISHINGS CO // BHIMAVARAM</p>
            </footer>
        </main>
    );
};

export default SmartShowroomPage;
