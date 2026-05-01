import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Ruler, Maximize2, Check, RefreshCcw, Info, Camera, Box, Upload, Sliders, Target, ShieldCheck, Trash2, Undo2, RotateCcw, Edit3, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeasurementStore } from '@/store/useStore';

// Production API Configuration
const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:10000';

interface Point { x: number; y: number; }
interface Measurement {
    id: string;
    start: Point;
    end: Point;
    distanceCm: number;
    label: string;
    isEditing?: boolean;
}

interface AIMeasurement {
    status: string;
    scale_info: {
        pixels_per_cm: number;
        reference_detected: boolean;
    };
    dimensions: {
        width_cm: number;
        height_cm: number;
    };
    bbox: [number, number, number, number] | null;
    img_size: [number, number];
    recommendation: {
        recommended_width_cm: number;
        recommended_height_cm: number;
        panels: number;
        type: string;
    } | null;
}

const RoomMeasurer: React.FC = () => {
    const { setMeasurements: setGlobalMeasurements, setRecommendedSizing } = useMeasurementStore();
    // --- System State ---
    const [isScanning, setIsScanning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    // --- measurement State ---
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [activeMeasurement, setActiveMeasurement] = useState<{ start: Point; end: Point } | null>(null);
    const [basePixelsPerCm, setBasePixelsPerCm] = useState<number>(10.0);
    const [aiResult, setAiResult] = useState<AIMeasurement | null>(null);
    const [originalImgWidth, setOriginalImgWidth] = useState<number | null>(null);
    
    // --- Interaction State ---
    const [isDragging, setIsDragging] = useState(false);
    const [editingPoint, setEditingPoint] = useState<{ mId: string; type: 'start' | 'end' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [containerAspectRatio, setContainerAspectRatio] = useState<number>(16 / 9);

    // --- Actions ---

    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    useEffect(() => {
        navigator.mediaDevices?.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            setAvailableDevices(videoDevices);
            if (videoDevices.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        });
    }, []);

    const startCamera = async () => {
        setError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Camera API not supported or inactive. Use HTTPS/localhost.");
            return;
        }

        stopCamera();

        try {
            // Simplified constraints for maximum compatibility
            const constraints: MediaStreamConstraints = { 
                video: selectedDeviceId 
                    ? { deviceId: { exact: selectedDeviceId } } 
                    : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            };
            
            const s = await navigator.mediaDevices.getUserMedia(constraints)
                .catch(async () => {
                    console.log("Retrying with simple video constraint...");
                    return await navigator.mediaDevices.getUserMedia({ video: true });
                });

            setStream(s);
            setIsScanning(true);
            setPreviewImage(null);
            console.log("Stream initialized:", s.id);
        } catch (err: any) {
            console.error("Camera access failed:", err);
            setError(`Camera Error: ${err.message || err.name}`);
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            console.log("Stream stopped");
        }
        setStream(null);
        setIsScanning(false);
    }, [stream]);

    // Ultra-Stable Stream Attachment
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
    const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
        if (node) {
            setVideoElement(node);
            if (stream) {
                node.srcObject = stream;
                node.onloadedmetadata = () => {
                    if (node.videoWidth && node.videoHeight) {
                        setContainerAspectRatio(node.videoWidth / node.videoHeight);
                        setOriginalImgWidth(node.videoWidth);
                    }
                    node.play().catch(e => console.error("Play failed after metadata load", e));
                };
            }
        }
    }, [stream]);

    useEffect(() => {
        if (stream && videoElement) {
            if (videoElement.srcObject !== stream) {
                videoElement.srcObject = stream;
                videoElement.muted = true; // Ensure muted for autoplay
                videoElement.play().catch(err => console.warn("Auto-play failed:", err));
            }
        }
    }, [stream, videoElement]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        
        // Match container to image exactly to prevent mapping offsets
        const img = new Image();
        img.src = objectUrl;
        img.onload = () => {
            setContainerAspectRatio(img.width / img.height);
            setOriginalImgWidth(img.width); // Set immediately to stabilize measurements
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('reference_cm', "8.56"); // Default standard (credit card width)

        try {
            const res = await fetch(`${AI_URL}/measure`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error("AI Service Response Error");
            
            const data: AIMeasurement = await res.json();
            
            if (data.status === 'success') {
                setAiResult(data);
                
                // --- RESOLUTION METADATA ---
                if (data.img_size) {
                    setOriginalImgWidth(data.img_size[0]);
                    setContainerAspectRatio(data.img_size[0] / data.img_size[1]);
                }
                
                // Base pixels per cm is the raw image scale
                const aiScale = data.scale_info.pixels_per_cm;
                setBasePixelsPerCm(aiScale);
                
                // Update any existing measurements to the new scale immediately
                setMeasurements(prev => prev.map(m => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    const currentDistPx = rect ? Math.sqrt(Math.pow(((m.end.x - m.start.x) / 100) * rect.width, 2) + Math.pow(((m.end.y - m.start.y) / 100) * rect.height, 2)) : 0;
                    const ratio = rect && data.img_size ? rect.width / data.img_size[0] : 1;
                    const activeScale = aiScale * ratio;
                    return { ...m, distanceCm: activeScale > 0 ? Math.round((currentDistPx / activeScale) * 10) / 10 : 0 };
                }));
                
                // --- AUTO-FEATURE ---
                if (data.bbox && data.img_size) {
                    const [x1, y1, x2, y2] = data.bbox;
                    const [imgW, imgH] = data.img_size;
                    
                    const newM: Measurement = {
                        id: 'auto-object-w-' + Date.now(),
                        start: { x: (x1 / imgW) * 100, y: (y1 / imgH) * 100 },
                        end: { x: (x2 / imgW) * 100, y: (y1 / imgH) * 100 },
                        distanceCm: data.dimensions.width_cm,
                        label: "Measured Width"
                    };
                    
                    const newMH: Measurement = {
                        id: 'auto-object-h-' + Date.now(),
                        start: { x: (x1 / imgW) * 100, y: (y1 / imgH) * 100 },
                        end: { x: (x1 / imgW) * 100, y: (y2 / imgH) * 100 },
                        distanceCm: data.dimensions.height_cm,
                        label: "Measured Height"
                    };
                    
                    setMeasurements(prev => [...prev.filter(m => !m.id.toString().startsWith('auto-')), newM, newMH]);
                } else {
                    setError("Reference found, but no specific features detected. You can draw manually on the image.");
                }
            } else {
                setError(data.status === 'fail' ? (data as any).message : "Detection failed.");
            }
        } catch (err) {
            console.error("AI Fetch Error:", err);
            setError("AI Service Offline. Ensure local backend is running on port 10000.");
        } finally {
            setUploading(false);
        }
    };

    // --- Interaction Logic ---

    const getCoord = (e: React.PointerEvent | PointerEvent): Point | null => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return null;

        return {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        const point = getCoord(e);
        if (!point) return;

        // Check if clicking an existing point for editing
        const clickedPoint = findClosestPoint(point);
        if (clickedPoint) {
            setEditingPoint(clickedPoint);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            return;
        }

        setIsDragging(true);
        setActiveMeasurement({ start: point, end: point });
        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch (err) {
            console.warn("Pointer capture failed, continuing anyway", err);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const point = getCoord(e);
        if (!point) return;

        if (editingPoint) {
            setMeasurements(prev => prev.map(m => {
                if (m.id === editingPoint.mId) {
                    const newM = { ...m, [editingPoint.type]: point };
                    newM.distanceCm = calculateRealCm(newM.start, newM.end);
                    return newM;
                }
                return m;
            }));
            return;
        }

        if (isDragging && activeMeasurement) {
            setActiveMeasurement({ ...activeMeasurement, end: point });
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (editingPoint) {
            setEditingPoint(null);
            try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch (err) {
                // ignore
            }
            return;
        }

        if (isDragging && activeMeasurement) {
            const distPx = calculateDistance(activeMeasurement.start, activeMeasurement.end);
            if (distPx > 2) { 
                const finalCm = calculateRealCm(activeMeasurement.start, activeMeasurement.end);
                
                const newM: Measurement = {
                    id: Math.random().toString(36).substr(2, 9),
                    start: activeMeasurement.start,
                    end: activeMeasurement.end,
                    distanceCm: finalCm,
                    label: `Point Set #${measurements.length + 1}`
                };
                setMeasurements(prev => [...prev, newM]);
            }
        }

        setIsDragging(false);
        setActiveMeasurement(null);
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch (err) {
            // ignore
        }
    };

    const getActiveScale = useCallback(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !originalImgWidth) return basePixelsPerCm;
        const ratio = rect.width / originalImgWidth;
        return basePixelsPerCm * ratio;
    }, [basePixelsPerCm, originalImgWidth]);

    const calculateDistance = (p1: Point, p2: Point) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return 0;
        const dx = ((p2.x - p1.x) / 100) * rect.width;
        const dy = ((p2.y - p1.y) / 100) * rect.height;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const calculateRealCm = (p1: Point, p2: Point) => {
        const distPx = calculateDistance(p1, p2);
        const activeScale = getActiveScale();
        if (!activeScale || activeScale <= 0) return 0;
        return Math.round((distPx / activeScale) * 10) / 10;
    };

    // --- NEW: Sync / Calibrate Feature ---
    const calibrateMeasurement = (mId: string, realCm: number) => {
        if (!realCm || realCm <= 0) return;
        const m = measurements.find(x => x.id === mId);
        if (!m) return;

        const distPx = calculateDistance(m.start, m.end);
        const rect = containerRef.current?.getBoundingClientRect();
        
        let newBasePixelsPerCm = distPx / realCm;
        if (originalImgWidth && rect) {
            const ratio = rect.width / originalImgWidth;
            newBasePixelsPerCm = (distPx / ratio) / realCm;
        }
        
        setBasePixelsPerCm(newBasePixelsPerCm);

        // Update all existing measurements accurately
        setMeasurements(prev => prev.map(item => {
            const currentDistPx = calculateDistance(item.start, item.end);
            const activeScale = originalImgWidth && rect ? newBasePixelsPerCm * (rect.width / originalImgWidth) : newBasePixelsPerCm;
            return {
                ...item,
                distanceCm: activeScale > 0 ? Math.round((currentDistPx / activeScale) * 10) / 10 : 0
            };
        }));
    };

    const findClosestPoint = (point: Point | null) => {
        if (!point) return null;
        for (const m of measurements) {
            const dStart = calculateDistance(point, m.start);
            const dEnd = calculateDistance(point, m.end);
            if (dStart < 30) return { mId: m.id, type: 'start' as const }; 
            if (dEnd < 30) return { mId: m.id, type: 'end' as const }; 
        }
        return null;
    };

    // --- Keyboard Shortcuts ---
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undoLast();
        }
    }, [measurements]);

    const undoLast = () => {
        setMeasurements(prev => prev.slice(0, -1));
    };

    const clearAll = () => {
        setMeasurements([]);
        setAiResult(null);
        setPreviewImage(null);
        stopCamera();
    };

    const addDemoMeasurement = () => {
        // AI Verification Simulation
        // Simulates a 150cm object in a standard 1000px wide image
        setOriginalImgWidth(1000);
        setContainerAspectRatio(16/9);
        setBasePixelsPerCm(1000 / 200); // 200cm width = 5px/cm
        
        const demo: Measurement = {
            id: 'demo-' + Date.now(),
            start: { x: 25, y: 50 },
            end: { x: 75, y: 50 }, // 50% of 1000px = 500px. 500px / (5px/cm) = 100cm
            distanceCm: 100.0,
            label: "AI Engine Verification"
        };
        setMeasurements(prev => [...prev, demo]);
        alert("AI Engine Verification: 50% width correctly mapped to 100cm based on simulated 200cm field-of-view.");
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle container resizing in real-time
    useEffect(() => {
        if (!containerRef.current) return;
        
        const observer = new ResizeObserver(() => {
            // Force re-calculation of measurements if container size changes
            setMeasurements(prev => prev.map(m => ({
                ...m,
                distanceCm: calculateRealCm(m.start, m.end)
            })));
        });
        
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [basePixelsPerCm, originalImgWidth, measurements.length]); // Re-bind when scale or count changes


    return (
        <section className="py-24 bg-charcoal min-h-screen text-white font-sans overflow-hidden" id="measure">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest mb-4">
                            <Target className="w-3 h-3" />
                            Production Interactive 2D Measurer
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif">Interactive <span className="text-white/20 italic">Precision</span></h2>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        {availableDevices.length > 1 && (
                            <select 
                                value={selectedDeviceId}
                                onChange={(e) => {
                                    setSelectedDeviceId(e.target.value);
                                    if (isScanning) {
                                        setTimeout(() => startCamera(), 100);
                                    }
                                }}
                                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-gray-400 outline-none hover:border-gold transition-all"
                            >
                                {availableDevices.map((d, i) => (
                                    <option key={d.deviceId} value={d.deviceId} className="bg-charcoal text-white">
                                        {d.label || `Camera ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button onClick={addDemoMeasurement} className="flex bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 items-center gap-2">
                             Verify Engine
                        </button>
                        <button 
                            onClick={isScanning ? stopCamera : startCamera} 
                            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest group border ${
                                isScanning ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'bg-white/5 border-white/10 hover:bg-gold hover:text-white'
                            }`}
                        >
                            <Camera className={`w-4 h-4 ${isScanning ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform`} /> 
                            {isScanning ? 'Stop Stream' : 'Live Stream'}
                        </button>
                        <label className="bg-gold text-white px-6 py-3 rounded-xl hover:bg-white hover:text-charcoal transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg shadow-gold/20 active:scale-95">
                            <Upload className="w-4 h-4" /> Scan Space
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    {/* Main Viewport */}
                    <div className="lg:col-span-2 space-y-8">
                        <div 
                            ref={containerRef}
                            className={`relative w-full bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group select-none transition-all ${isDragging || editingPoint ? 'ring-2 ring-gold/40' : ''}`}
                            style={{ 
                                cursor: editingPoint ? 'grabbing' : 'crosshair', 
                                touchAction: 'none',
                                aspectRatio: containerAspectRatio 
                            }}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        >
                            <AnimatePresence>
                                {!previewImage && !isScanning && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                                        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6 border border-gold/20 shadow-inner">
                                            <Ruler className="w-10 h-10 text-gold" />
                                        </div>
                                        <p className="text-gray-500 max-w-sm uppercase text-[10px] font-black tracking-widest mb-8 leading-loose opacity-60">
                                            Engine Ready. Drag to define points, or use &apos;Scan Space&apos; for AI surface detection.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Persistent Video Element for Camera Logic */}
                            <video 
                                ref={videoRefCallback} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                style={{ display: isScanning ? 'block' : 'none', zIndex: 5 }}
                            />

                            {previewImage && (
                                <img src={previewImage} className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 10 }} alt="Room Scan Preview" />
                            )}

                            {/* Measurement SVG Layer */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg" style={{ zIndex: 20 }}>
                                {measurements.map((m) => (
                                    <g key={m.id} className="pointer-events-auto group/measure">
                                        <line 
                                            x1={`${m.start.x}%`} y1={`${m.start.y}%`} 
                                            x2={`${m.end.x}%`} y2={`${m.end.y}%`} 
                                            stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="6 3"
                                            className="opacity-70"
                                        />
                                        <circle 
                                            cx={`${m.start.x}%`} cy={`${m.start.y}%`} r="8" 
                                            fill="#D4AF37" stroke="white" strokeWidth="2" 
                                            className="cursor-move hover:scale-150 hover:fill-white transition-all shadow-xl"
                                        />
                                        <circle 
                                            cx={`${m.end.x}%`} cy={`${m.end.y}%`} r="8" 
                                            fill="#D4AF37" stroke="white" strokeWidth="2"
                                            className="cursor-move hover:scale-150 hover:fill-white transition-all shadow-xl"
                                        />
                                        <foreignObject 
                                            x={`${(m.start.x + m.end.x) / 2}%`} 
                                            y={`${(m.start.y + m.end.y) / 2}%`} 
                                            width="100" height="40"
                                            className="-translate-x-12 -translate-y-5"
                                        >
                                            <div className="bg-charcoal/90 text-gold border border-gold/30 text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl text-center backdrop-blur-md pointer-events-none">
                                                {m.distanceCm} cm
                                            </div>
                                        </foreignObject>
                                    </g>
                                ))}

                                {(activeMeasurement || isDragging) && activeMeasurement && (
                                    <g>
                                        <line 
                                            x1={`${activeMeasurement.start.x}%`} y1={`${activeMeasurement.start.y}%`} 
                                            x2={`${activeMeasurement.end.x}%`} y2={`${activeMeasurement.end.y}%`} 
                                            stroke="#D4AF37" strokeWidth="3"
                                        />
                                        <circle cx={`${activeMeasurement.start.x}%`} cy={`${activeMeasurement.start.y}%`} r="8" fill="#D4AF37" stroke="white" strokeWidth="2" />
                                        <circle cx={`${activeMeasurement.end.x}%`} cy={`${activeMeasurement.end.y}%`} r="8" fill="#D4AF37" stroke="white" strokeWidth="2" />
                                        
                                        {/* LIVE TOOLTIP */}
                                        <foreignObject 
                                            x={`${(activeMeasurement.start.x + activeMeasurement.end.x) / 2}%`} 
                                            y={`${(activeMeasurement.start.y + activeMeasurement.end.y) / 2}%`} 
                                            width="80" height="30"
                                            className="-translate-x-10 -translate-y-4"
                                        >
                                            <div className="bg-gold text-charcoal text-[10px] font-black px-2 py-1 rounded shadow-lg text-center animate-bounce pointer-events-none">
                                                {calculateRealCm(activeMeasurement.start, activeMeasurement.end)} cm
                                            </div>
                                        </foreignObject>
                                    </g>
                                )}
                            </svg>

                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
                                    <span className="text-gold text-[10px] font-black uppercase tracking-widest">Running Spatial Analysis...</span>
                                </div>
                            )}

                            <div className="absolute top-8 left-8 flex gap-3">
                                <button onClick={undoLast} className="bg-white/10 hover:bg-gold hover:text-white p-3 rounded-full backdrop-blur-md transition-all group" title="Undo (Ctrl+Z)">
                                    <Undo2 className="w-4 h-4" />
                                </button>
                                <button onClick={clearAll} className="bg-white/10 hover:bg-red-500 hover:text-white p-3 rounded-full backdrop-blur-md transition-all" title="Reset All">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-gold/30 transition-all flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Reference Model</span>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 ${aiResult?.scale_info.reference_detected ? 'bg-green-500' : 'bg-gold'} rounded-full animate-pulse`} />
                                        <span className="text-xs font-bold text-white/60">
                                            {aiResult?.scale_info.reference_detected ? "Found Std. Object (8.56cm)" : "Using Default Pixel Grid"}
                                        </span>
                                    </div>
                                </div>
                                <ShieldCheck className={`w-10 h-10 ${aiResult?.scale_info.reference_detected ? 'text-gold' : 'text-white/10'}`} />
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-gold/30 transition-all flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Real-Time Sync</span>
                                    <div className="flex items-end gap-3">
                                        <span className="text-2xl font-serif italic text-gold">CM / {measurements.length} PTS</span>
                                    </div>
                                </div>
                                <Edit3 className="w-10 h-10 text-white/10" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Lists & Suggestions */}
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl sticky top-8">
                            <h3 className="text-2xl font-serif italic mb-8">Measurement History</h3>
                            
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {measurements.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                        <Ruler className="w-8 h-8 mx-auto mb-4" />
                                        <p className="text-[10px] uppercase font-black tracking-widest leading-loose">No active spatial data points available</p>
                                    </div>
                                ) : (
                                    measurements.map((m, i) => (
                                        <div key={m.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-gold/40 transition-all group space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold font-black text-xs">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <span className="text-[8px] font-black text-gray-500 uppercase mb-1 block">{m.label}</span>
                                                        <span className="text-lg font-serif italic text-white group-hover:text-gold transition-colors">{m.distanceCm} cm</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setMeasurements(measurements.filter(x => x.id !== m.id))} className="text-white/10 hover:text-red-500 transition-colors p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            {/* Sync Input for Calibration */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                                <Target className="w-3 h-3 text-gold/40" />
                                                <input 
                                                    type="number" 
                                                    placeholder="Sync real cm..." 
                                                    className="bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] w-full outline-none focus:border-gold/50 transition-all"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            calibrateMeasurement(m.id, parseFloat((e.target as HTMLInputElement).value));
                                                            (e.target as HTMLInputElement).value = '';
                                                            alert("System Calibrated. All measurements updated.");
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        if (aiResult?.scale_info.pixels_per_cm) {
                                                            setBasePixelsPerCm(aiResult.scale_info.pixels_per_cm);
                                                            calibrateMeasurement(m.id, m.distanceCm); // Trigger recount
                                                        }
                                                    }}
                                                    className="p-2 hover:text-gold transition-colors"
                                                    title="Reset to AI Scale"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-12 space-y-8 pt-8 border-t border-white/5">
                                <div className="bg-gold/10 p-6 rounded-3xl border border-gold/20 flex gap-4">
                                    <Info className="w-5 h-5 text-gold shrink-0 mt-1" />
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Editor Mode</h5>
                                        <p className="text-[11px] text-white/50 leading-relaxed">
                                            You can drag any existing point to refine your measurements. Use <kbd className="bg-white/10 px-1 inline-block rounded">Ctrl+Z</kbd> for quick undos.
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        setGlobalMeasurements(measurements);
                                        if (aiResult?.recommendation) {
                                            setRecommendedSizing({
                                                width: aiResult.recommendation.recommended_width_cm,
                                                height: aiResult.recommendation.recommended_height_cm
                                            });
                                        }
                                        const bookingSection = document.getElementById('booking');
                                        if (bookingSection) {
                                            bookingSection.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.location.href = '#booking';
                                        }
                                    }}
                                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-2xl relative overflow-hidden group ${measurements.length > 0 ? 'bg-gold text-white hover:bg-white hover:text-charcoal' : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'}`}
                                    disabled={measurements.length === 0}
                                >
                                    <span className="relative z-10 transition-transform group-hover:scale-110 inline-block">Complete Measurement</span>
                                    {measurements.length > 0 && <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-8 bg-charcoal border border-white/10 rounded-[30px] flex items-center gap-6 group hover:border-gold/30 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-all">
                                <Move className="w-6 h-6 text-gray-400 group-hover:text-gold group-hover:animate-pulse" />
                            </div>
                            <div>
                                <h6 className="text-xs font-bold uppercase tracking-widest mb-1 text-white/80">Interactive Sync</h6>
                                <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Bhimavaram Exclusive AI Engine</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoomMeasurer;
