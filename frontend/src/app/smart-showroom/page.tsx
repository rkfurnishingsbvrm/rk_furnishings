'use client';

import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Sparkles, Box, Layout, ArrowRight, Share2, ZoomIn, Info, Play, Pause } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import AIRoomAnalysis from '@/components/SmartShowroom/AIRoomAnalysis';

import ARViewer from '@/components/SmartShowroom/ARViewer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import Image from 'next/image';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
};

const SmartShowroomPage: React.FC = () => {
    const [arProducts, setArProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();

                
                const mappedProducts = data.slice(0, 100).map((p: any, i: number) => {
                    const isFabricBased = p.category === 'Curtains' || p.category === 'Blinds' || p.category === 'Wallpapers' || p.category === 'Sofa Fabrics';
                    
                    // Replaced all previously confusing chairs/lanterns with Structured Material Cubes
                    // This provides the 3D 'orbit' rotation the user expects while remaining professional
                    const displayModel = isFabricBased 
                        ? "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxTextured/glTF-Binary/BoxTextured.glb"
                        : "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb";

                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        url: displayModel,
                        poster: isFabricBased 
                            ? `/images/curtains/${(i % 15) + 1}.jpeg` 
                            : (p.images?.[0] || "/images/sofa.png"),
                        price: "Consult Stylist",
                        desc: p.description || `Signature ${p.category} piece crafted for elegance across Bhimavaram interiors.`,
                        placement: isFabricBased ? 'wall' : 'floor'
                    };
                });
                setArProducts(mappedProducts);






            } catch (err) {
                console.error('Error fetching AR products:', err);
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

            {/* Navigation (Simple) */}
            <nav className="fixed w-full z-50 px-10 py-10 flex justify-between items-center mix-blend-difference text-white">
                <a href="/" className="text-2xl font-serif font-black tracking-tighter">
                    <span className="text-gold">RK</span> FURNISHINGS
                </a>
                <div className="flex gap-12 font-black uppercase tracking-[0.4em] text-[8px]">
                    <a href="/" className="hover:text-gold transition-colors">Return to Home</a>
                    <a href="#analyze" className="hover:text-gold transition-colors">Start Analysis</a>
                    <a href="#ar-catalog" className="hover:text-gold transition-colors">Virtual Catalog</a>
                </div>
            </nav>

            {/* Premium Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
                
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/premium/interior_1.png"
                        alt="Hero"
                        fill
                        className="object-cover opacity-30 grayscale-[0.5] contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

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
                            Experience the convergence of Artificial Intelligence and Augmented Reality. 
                            From room analysis to virtual placement, your dream space starts here.
                        </p>

                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <a 
                                href="#analyze"
                                className="px-16 py-8 bg-gold text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-charcoal transition-all shadow-[0_30px_60px_-15px_rgba(212,175,55,0.4)] hover:shadow-[0_45px_90px_-20px_rgba(212,175,55,0.6)]"
                            >
                                Analyze My Room
                            </a>
                            <a 
                                href="#ar-catalog"
                                className="px-16 py-8 border border-white/20 text-white font-black uppercase tracking-[0.4em] text-xs backdrop-blur-md hover:bg-white hover:text-charcoal transition-all"
                            >
                                Explore AR Catalog
                            </a>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-20 left-10 flex gap-10 text-white/20 font-mono text-[8px] animate-pulse">
                    <span>WEBXR PROTOCOL ENBALED</span>
                    <span>AI VISION 1.5 FLASH READY</span>
                    <span>RK SIGNATURE ARCHITECTURE</span>
                </div>
            </section>

            {/* AI Analysis Module Section */}
            <section id="analyze" className="py-44 relative bg-gray-50/30">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <AIRoomAnalysis />
            </section>

            {/* Interactive Catalog Section */}
            <section id="ar-catalog" className="py-44 bg-white relative">
                 <div className="container-premium">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
                        <div className="max-w-3xl">
                            <h4 className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-8">Virtual Collection</h4>
                            <h2 className="text-6xl md:text-8xl font-serif text-charcoal italic mb-8">The AR <br/>Series</h2>
                            <p className="text-gray-400 text-xl font-light leading-relaxed font-sans max-w-xl italic">
                                Our most exclusive pieces, ready to be visualized in your actual living space. 
                                No applications needed—just point your camera and witness perfection.
                            </p>
                        </div>
                        <div className="hidden lg:flex flex-col items-end gap-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-widest text-charcoal mb-2">Technical Standards</span>
                            <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
                                <Box className="w-6 h-6 text-charcoal" />
                                <Layout className="w-6 h-6 text-charcoal" />
                                <ZoomIn className="w-6 h-6 text-charcoal" />
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {arProducts.map((item, i) => (
                            <motion.div 
                                key={`ar-product-item-${i}-${item.name}`}
                                {...fadeInUp}
                                className="group relative"
                            >
                                <div className="mb-8">
                                    <ARViewer modelUrl={item.url} poster={item.poster} alt={item.name} placement={item.placement} />
                                </div>

                                <div className="space-y-4">
                                     <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-serif text-charcoal italic">{item.name}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">{item.price}</span>
                                     </div>
                                     <div className="w-12 h-[1px] bg-gold group-hover:w-full transition-all duration-700" />
                                     <p className="text-gray-500 font-light text-sm leading-relaxed max-w-sm line-clamp-2">{item.desc}</p>
                                     
                                     <div className="flex gap-6 mt-8">
                                        <button 
                                            onClick={() => alert(`Product Technical Specifications:\n\n- Name: ${item.name}\n- Category: ${item.category}\n- Composition: Premium Drape/Sofa Fabric Series\n- AR Engine: WebXR Scaled v4\n- Source: RK Bhimavaram Curated Collection`)}
                                            className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-charcoal hover:text-gold transition-all"
                                        >
                                            Product Specs <Info className="w-3 h-3" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: `RK Furnishings - ${item.name}`,
                                                        text: `Check out this ${item.category} I found at RK Furnishings Smart Showroom!`,
                                                        url: window.location.href
                                                    }).catch(console.error);
                                                } else {
                                                    alert("Share URL copied to clipboard! Share it with your stylist.");
                                                    navigator.clipboard.writeText(window.location.href);
                                                }
                                            }}
                                            className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-charcoal hover:text-gold transition-all"
                                        >
                                            Share Discovery <Share2 className="w-3 h-3" />
                                        </button>
                                     </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && [1, 2, 3].map(n => <div key={`skeleton-loader-${n}`} className="h-96 bg-gray-100 animate-pulse rounded-2xl" />)}
                    </div>


                 </div>
            </section>

            {/* Architecture / How it Works Section */}
            <section className="py-44 bg-charcoal text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>

                <div className="container-premium relative z-10">
                    <div className="max-w-4xl mb-44">
                        <h4 className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-10">The Ecosystem</h4>
                        <h2 className="text-6xl md:text-[100px] font-serif italic text-white leading-none mb-12">How Perfection <br />Is Processed</h2>
                        <div className="w-44 h-1 bg-gold opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                        {[
                            { num: "01", title: "Capture & Detect", desc: "Our AI identifies floor planes, wall colors, and ambient lighting using depth data." },
                            { num: "02", title: "Intelligent Matching", desc: "Gemini Pro Vision matches your space with our 10,000+ proprietary textures and 3D assets." },
                            { num: "03", title: "Immersive Placement", desc: "WebXR anchors photorealistic 3D models into your physical environment with scale-accuracy." }
                        ].map((step, i) => (
                            <div key={`eco-step-${i}`} className="group relative pt-12 border-t border-white/10 hover:border-gold transition-all cursor-crosshair">
                                <span className="absolute top-4 left-0 text-7xl font-serif text-white/5 group-hover:text-gold/20 transition-all duration-700">{step.num}</span>
                                <h3 className="text-2xl font-serif text-white italic mb-6 relative z-10 group-hover:translate-x-4 transition-all">{step.title}</h3>
                                <p className="text-white/40 font-light leading-relaxed relative z-10">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-44 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex gap-16">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Uptime Reliability</p>
                                <span className="text-2xl font-serif text-gold">99.9%</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">AR Supported Devices</p>
                                <span className="text-2xl font-serif text-gold">2.4 Billion</span>
                            </div>
                        </div>
                        <button className="px-12 py-5 bg-white text-charcoal font-black uppercase tracking-[0.4em] text-[10px] hover:bg-gold hover:text-white transition-all shadow-2xl">
                            Request SDK Token
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder for visual consistency */}
            <footer className="py-20 bg-black text-white/20 border-t border-white/5">
                <div className="container-premium text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.8em]">RK FURNISHINGS CO // BHIMAVARAM // ANDHRA PRADESH</p>
                    <p className="mt-4 text-[8px] tracking-[0.4em] opacity-40">ESTABLISHED 2010. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </main>
    );
};

export default SmartShowroomPage;
