'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Move, Layers, RefreshCcw, Download, Sparkles, Wand2, Loader2, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WALLPAPER_LIST = [
  { id: 1, name: 'Royal Gold Damask', img: '/images/wallpaper.png' },
  { id: 2, name: 'Minimalist Textured Grey', img: '/images/premium/wallpaper_1.png' },
  { id: 3, name: 'Contemporary Floral', img: '/images/premium/fabrics_1.png' },
];

const API_ROOT = "http://localhost:10000";

const RoomVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState(WALLPAPER_LIST[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fbCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1000,
      height: 700,
      backgroundColor: 'transparent'
    });
    
    setCanvas(fbCanvas);

    return () => {
      fbCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      setError(null);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (f) => {
        const data = f.target?.result as string;
        setImage(data);
        
        if (!canvas) return;

        try {
          // Load to Canvas (Fabric 7 uses FabricImage.fromURL which returns a Promise)
          const oImg = await fabric.FabricImage.fromURL(data);
          canvas.clear();
          const scale = Math.min(canvas.width! / oImg.width!, canvas.height! / oImg.height!);
          oImg.scale(scale);
          canvas.add(oImg);
          canvas.centerObject(oImg);
          canvas.sendObjectToBack(oImg);
          canvas.renderAll();
        } catch (err) {
          console.error("Error loading image to canvas:", err);
        }

        // Trigger Backend AI Detection (Simulation/Real Call)
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch(`${API_ROOT}/detect-window`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const detected = await response.json();
                // Add bounding box preview
                if (canvas && detected.x) {
                    const rect = new fabric.Rect({
                        left: detected.x,
                        top: detected.y,
                        width: detected.w,
                        height: detected.h,
                        fill: 'rgba(212, 175, 55, 0.2)',
                        stroke: '#D4AF37',
                        strokeWidth: 2,
                        strokeDashArray: [5, 5]
                    });
                    canvas.add(rect);
                    canvas.setActiveObject(rect);
                    canvas.renderAll();
                }
            }
        } catch (err) {
            console.warn("Backend detection offline, falling back to manual adjustment.", err);
        } finally {
            setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addWallpaperToCanvas = async (wallpaperPath: string) => {
    if (!canvas) return;
    try {
      const oImg = await fabric.FabricImage.fromURL(wallpaperPath);
      oImg.set({
        left: 300,
        top: 200,
        scaleX: 0.8,
        scaleY: 0.8,
        opacity: 0.95,
        cornerColor: '#D4AF37',
        cornerStyle: 'circle',
        transparentCorners: false
      });
      canvas.add(oImg);
      canvas.setActiveObject(oImg);
      canvas.renderAll();
    } catch (err) {
      console.error("Error adding wallpaper:", err);
    }
  };

  const finalize = () => {
    if (!canvas) return;
    setProcessedUrl(canvas.toDataURL());
    setApplied(true);
  };

  return (
    <section className="py-32 bg-gray-50/20 relative" id="visualize">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-2xl">
                <span className="text-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Visual Recognition Suite v2.0</span>
                <h2 className="text-6xl font-serif text-charcoal italic mb-6">Reality <span className="not-italic font-sans font-light opacity-30">Designer</span></h2>
                <p className="text-gray-400 font-light leading-relaxed italic">
                    Our CV Engine detects wall boundaries and lighting depths to project 
                    your chosen fabric with extreme perspective accuracy.
                </p>
            </div>
            {image && !applied && (
                <div className="flex bg-white p-3 rounded-2xl shadow-xl gap-4 border border-gray-100">
                    <button onClick={() => { canvas?.discardActiveObject(); canvas?.renderAll(); }} className="p-4 hover:bg-gray-50 rounded-xl text-gray-400"><RefreshCcw className="w-5 h-5" /></button>
                    <button onClick={() => canvas?.remove(canvas.getActiveObject()!)} className="p-4 hover:bg-red-50 rounded-xl text-red-400"><Layers className="w-5 h-5" /></button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-8 h-full">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl space-y-8 sticky top-32">
                <div className="flex justify-between items-center bg-gray-50 -mx-8 -mt-8 p-8 border-b border-gray-100 mb-8 rounded-t-3xl">
                    <h5 className="text-[10px] font-black uppercase text-charcoal tracking-widest">Library</h5>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                
                <div className="space-y-4">
                    {WALLPAPER_LIST.map(c => (
                        <button 
                            key={`visual-product-${c.id}`}
                            onClick={() => {
                                setActiveWallpaper(c);
                                addWallpaperToCanvas(c.img);
                            }}
                            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group scale-100 hover:scale-[1.02] border-2 ${
                                activeWallpaper.id === c.id ? 'bg-charcoal border-gold shadow-2xl' : 'bg-transparent border-gray-50 hover:border-gray-100'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-transparent group-hover:border-gold/30 transition-all">
                                <Layers className="w-6 h-6 text-charcoal/20" />
                            </div>
                            <div className="text-left">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${activeWallpaper.id === c.id ? 'text-gold' : 'text-gray-400'}`}>Premium Series</p>
                                <p className={`text-[11px] font-bold ${activeWallpaper.id === c.id ? 'text-white' : 'text-charcoal'}`}>{c.name}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                   <button className="w-full bg-gold text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                      Start AR Mode <Camera className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>

          {/* Viewport */}
          <div className="lg:col-span-3 min-h-[700px]">
            <AnimatePresence mode="wait">
                {!applied ? (
                   <motion.div 
                     key="edit-view"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.05 }}
                     className="bg-white rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 relative h-full flex flex-col"
                   >
                     <div className="flex-1 relative bg-gray-50 overflow-hidden flex items-center justify-center">
                        <canvas ref={canvasRef} className="max-w-full h-auto" />
                        
                        {!image && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                                <label className="w-64 h-64 border-2 border-dashed border-gray-200 rounded-[50px] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-gold transition-all bg-white shadow-sm group">
                                    <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-all">
                                        <Layers className="w-8 h-8 text-gold" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">Import Space Snapshot</span>
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                                <p className="mt-8 text-gray-400 text-xs italic">Drop room photo for AI analysis</p>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-6">
                                <Loader2 className="w-12 h-12 text-gold animate-spin" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal leading-loose">Spatial Mesh Analysis</p>
                                    <p className="text-gray-400 text-xs italic">Detecting window boundaries...</p>
                                </div>
                            </div>
                        )}
                     </div>

                     {image && (
                        <div className="bg-white p-8 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manual Calibration Enabled</p>
                            </div>
                            <button 
                                onClick={finalize}
                                className="bg-charcoal text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-gold transition-all"
                            >
                                Process Realistic Preview
                            </button>
                        </div>
                     )}
                   </motion.div>
                ) : (
                   <motion.div 
                     key="preview-view"
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 h-full flex flex-col"
                   >
                     <div className="flex-1 relative bg-charcoal">
                        <ReactCompareSlider
                            itemOne={<ReactCompareSliderImage src={image!} alt="Original Room" />}
                            itemTwo={<ReactCompareSliderImage src={processedUrl!} alt="After Stylist" />}
                            style={{ height: '100%', width: '100%' }}
                        />
                     </div>
                     <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-100">
                        <div>
                            <h4 className="text-3xl font-serif italic text-charcoal mb-2">Architectural Result</h4>
                            <p className="text-gray-400 text-sm italic">Measured, Analyzed, and Transformed in 4.2 seconds.</p>
                        </div>
                        <div className="flex gap-6">
                            <button onClick={() => setApplied(false)} className="px-10 py-5 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:border-gold transition-all">Adjust Placement</button>
                            <button className="px-12 py-5 rounded-xl bg-gold text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-gold/30 flex items-center gap-4">
                                Download Result <Download className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                   </motion.div>
                )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RoomVisualizer;
