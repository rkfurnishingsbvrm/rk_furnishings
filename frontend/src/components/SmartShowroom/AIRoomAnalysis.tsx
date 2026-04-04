'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Layout, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { analyzeRoom } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import ARViewer from './ARViewer';
import NextImage from 'next/image';

const AIRoomAnalysis: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const runAnalysis = async () => {
        if (!image) return;
        setResult(null); // Clear old results to show fresh analysis state
        setAnalyzing(true);
        try {
            const analysis = await analyzeRoom(image);

            setResult(analysis);
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-3xl rounded-3xl border border-white shadow-2xl relative overflow-hidden">
             
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
                 <div className="absolute -top-1/2 -right-1/4 w-[150%] h-[150%] bg-gold/10 blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-charcoal text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-xl border border-gold/10">
                    <Sparkles className="w-3 h-3 text-gold" />
                    Autonomous Room Analysis
                </div>
                <h2 className="text-5xl md:text-7xl font-serif text-charcoal mb-8 leading-tight italic">The Smart Stylist <br/>Experience</h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                <p className="max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed font-light font-sans tracking-wide">
                    Upload a photograph of your space. Our AI engine will analyze your existing 
                    palette, lighting, and spatial constraints to recommend the perfect RK signature pieces.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                
                {/* Upload Section */}
                <div className="flex flex-col gap-10">
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className={`relative aspect-[4/3] w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group shadow-inner ${
                            previewUrl ? 'border-transparent' : 'border-gray-200 hover:border-gold hover:bg-gold/5'
                        }`}
                    >
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px] bg-charcoal/80 px-6 py-3 rounded-full border border-white/20">Replace Capture</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-white transition-colors border border-gray-100 shadow-sm">
                                    <Camera className="w-10 h-10 text-gold opacity-50 transition-opacity group-hover:opacity-100" />
                                </div>
                                <p className="text-charcoal font-black text-xs uppercase tracking-widest mb-2">Capture Reality</p>
                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">Upload Image of Your Room</p>
                            </div>
                        )}
                        {previewUrl && analyzing && (
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                {/* Corner Markers */}
                                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                
                                {/* Dynamic Scanning Laser */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_20px_#D4AF37] animate-[scan_3s_ease-in-out_infinite]" />
                                
                                {/* Scanning Grid */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="inline-block px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Building Spatial Mesh...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept="image/*" />
                    </div>

                    <style jsx>{`
                        @keyframes scan {
                            0% { top: 0%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                        }
                    `}</style>


                    <button 
                        onClick={runAnalysis}
                        disabled={!image || analyzing}
                        className={`w-full py-6 font-black uppercase tracking-[0.4em] text-[11px] rounded-lg transition-all flex items-center justify-center gap-4 ${
                            analyzing ? 'bg-gray-200 text-gray-500' : 
                            image ? 'bg-charcoal text-white hover:bg-gold shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-gold/30' : 
                            'bg-gray-50 text-gray-400 border border-gray-100'
                        }`}
                    >
                        {analyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                Analyzing Space...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Recommendations
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="min-h-[500px] flex flex-col pt-4">
                    <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center p-10 bg-gray-50/50 rounded-2xl border border-gray-100 italic font-serif text-gray-400 opacity-60"
                        >
                            <p className="text-lg">Waiting for your space blueprint...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-12"
                        >
                            {/* Analysis Summary */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Layout className="w-4 h-4 text-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Design Identity</span>
                                    </div>
                                    <p className="text-2xl font-serif text-charcoal italic">{result.style}</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Palette className="w-4 h-4 text-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Palette</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {result.colors?.map((c: string, i: number) => (
                                            <div key={`room-color-${i}`} className="w-8 h-4 rounded-sm border border-black/10 shadow-sm" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-12 flex items-center gap-4">
                                    <span className="w-12 h-[1px] bg-gold opacity-50" />
                                    Curated Suggestion
                                    <span className="w-12 h-[1px] bg-gold opacity-50" />
                                </h3>

                                <div className="space-y-8">
                                    {result.recommendations?.map((rec: any, i: number) => {
                                        const isFabricBased = rec.category === 'Curtains' || rec.category === 'Wallpapers';
                                        
                                        // Dynamic Image Mapping: Extract Series Number from name if available
                                        const seriesMatch = rec.name?.match(/Series (\d+)/i);
                                        const seriesNum = seriesMatch ? parseInt(seriesMatch[1]) : (Math.floor(Math.random() * 15) + 1);
                                        
                                        // Final Resolution: Professional Material Blocks for 3D inspection
                                        const displayModel = isFabricBased 
                                            ? "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxTextured/glTF-Binary/BoxTextured.glb"
                                            : "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb";

                                        // Map the Series Number back to our 15-image catalog
                                        const posterIndex = ((seriesNum - 1) % 15) + 1;
                                        const displayPoster = `/images/curtains/${posterIndex}.jpeg`;





                                        return (
                                            <motion.div 
                                                key={`rec-${rec.name}-${i}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.2 }}
                                                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl group hover:shadow-gold/20 hover:border-gold/30 transition-all overflow-hidden relative"
                                            >
                                                <div className="flex flex-col lg:flex-row gap-12 items-center">
                                                    <div className="w-full lg:w-72 shrink-0 h-96 relative rounded-xl overflow-hidden ring-1 ring-gray-100 shadow-inner">
                                                        <ARViewer 
                                                            modelUrl={displayModel} 
                                                            name={rec.name} 
                                                            poster={displayPoster}
                                                        />
                                                    </div>
                                                    <div className="flex-1 pt-2 space-y-6">
                                                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-full text-[9px] font-black tracking-widest uppercase mb-4 border border-green-100">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Verified {rec.category} Recommendation
                                                        </div>
                                                        
                                                        <h3 className="text-3xl font-serif text-charcoal italic">{rec.name}</h3>
                                                        <p className="text-lg font-light leading-relaxed text-gray-500 italic max-w-2xl">{rec.reason}</p>
                                                        
                                                        <div className="flex flex-wrap gap-6 pt-4">
                                                            <button 
                                                                onClick={() => alert(`RK Full Specifications Package for: ${rec.name}\n\nOur stylists recommend this series for high-end residential interiors.`)}
                                                                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-charcoal hover:text-gold transition-all"
                                                            >
                                                                Full Specs <span>+</span>
                                                            </button>
                                                            <a 
                                                                href={`https://wa.me/917382212345?text=Hi, I am interested in the ${rec.name} from your Curated ${rec.category} Collection!`}
                                                                target="_blank"
                                                                className="flex items-center gap-4 bg-green-600 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-charcoal transition-all"
                                                            >
                                                                Consult Stylist <NextImage src="/images/whatsapp.png" width={16} height={16} alt="WA" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AIRoomAnalysis;
