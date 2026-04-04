'use client';

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, useProgress } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useStore } from "../../store/useStore";
import { Player } from "./Player";
import { ShowroomItem } from "./ShowroomItem";
import { InfiniteGallery } from "./InfiniteGallery";

// Ultra-Stable Industrial Lighting
const Lighting = () => {
    return (
        <group>
            <ambientLight intensity={3.5} />
            <pointLight position={[15, 20, -15]} intensity={5000} color="#fff1d4" />
            <pointLight position={[-15, 20, -15]} intensity={5000} color="#fff1d4" />
            <pointLight position={[40, 20, 40]} intensity={5000} color="#fff1d4" />
            <pointLight position={[-40, 20, 40]} intensity={5000} color="#fff1d4" />
            <pointLight position={[0, 20, 0]} intensity={3000} color="#ffffff" />
            <directionalLight position={[0, 40, 0]} intensity={5} castShadow />
        </group>
    );
};



// Pure Stable Matte Floor
const StableFloor = () => {
    const [ref] = usePlane(() => ({ 
        rotation: [-Math.PI / 2, 0, 0], 
        position: [0, 0, 0] 
    }));
    
    return (
        <mesh ref={ref as any} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.1} />
        </mesh>
    );
};

// Stable Walls 
const GalleryWall = ({ position, rotation, size, color = "#111111" }: { position: [number, number, number], rotation: [number, number, number], size: [number, number, number], color?: string }) => {
    const [ref] = useBox(() => ({ type: "Static", position, rotation, args: size }));
    return (
        <mesh ref={ref as any} receiveShadow castShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} roughness={1} />
        </mesh>
    );
};

// Sub-component to show a loader when things inside suspend
const AssetLoaderOverlay = () => {
    const { active, progress } = useProgress();
    if (!active) return null;
    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 pointer-events-none transition-opacity duration-500">
            <div className="text-gold font-serif text-2xl tracking-widest italic animate-pulse mb-4">
                Refining Luxury... {Math.round(progress)}%
            </div>

            <div className="w-64 h-0.5 bg-white/10 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-gold transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const UIOverlay = () => {
    const { interactable, selectedProduct, setSelectedProduct } = useStore();
    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center font-sans overflow-hidden">
            {!selectedProduct && (
                 <div className="w-1.5 h-1.5 bg-gold rounded-full border border-black/20 pointer-events-none shadow-xl" />
            )}
            <div className="absolute top-24 left-10 text-white bg-black/80 px-8 py-5 rounded-sm border-l-4 border-gold pointer-events-auto shadow-2xl">
                <p className="mb-2 font-black text-gold text-[10px] uppercase tracking-[0.4em]">RK NAVIGATION</p>
                <div className="flex flex-col gap-2 font-medium tracking-widest text-[9px] uppercase opacity-70">
                    <p className="flex justify-between items-center gap-10"><span>WASD</span> <span>Walk</span></p>
                    <p className="flex justify-between items-center gap-10"><span>Mouse</span> <span>Look</span></p>
                    <p className="flex justify-between items-center gap-10"><span>E</span> <span>Inspect</span></p>
                    <p className="flex justify-between items-center gap-10"><span>Esc</span> <span>Unlock</span></p>
                </div>
            </div>
            {interactable && !selectedProduct && (
                <div className="absolute bottom-24 bg-gold text-charcoal px-10 py-5 rounded-sm font-black animate-pulse pointer-events-none text-sm tracking-[0.3em] shadow-2xl uppercase">
                    View Discovery Piece
                </div>
            )}
            {selectedProduct && (
                <div className="w-[450px] bg-white text-charcoal pointer-events-auto p-12 rounded-sm shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] relative border-t-[18px] border-gold animate-in zoom-in-95 duration-500">
                    <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-all">✕</button>
                    <span className="text-gold text-[9px] font-black uppercase tracking-[0.4em] block mb-5 border-b border-gold/10 pb-2 italic">The Interior Metaverse // RK Exclusive</span>
                    <h2 className="text-4xl font-serif mb-6 leading-tight italic tracking-tight font-medium">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mb-10 leading-relaxed text-sm">{selectedProduct.description}</p>
                    <div className="flex justify-between items-center mb-10 bg-gray-50 p-6 rounded-sm">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 opacity-60">Signature Details</p>
                            <span className="text-2xl font-serif text-charcoal font-medium">{selectedProduct.price}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-white shadow-xl italic font-serif text-xs">RK</div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <a 
                            href="/#booking"
                            className="w-full bg-charcoal text-white py-6 font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-charcoal transition-all text-[10px] flex items-center justify-center gap-4 text-center"
                        >
                            Enquire for Bespoke Design <span>→</span>
                        </a>

                        
                        <a 
                            href={`/smart-showroom#ar-catalog`}
                            className="w-full border border-charcoal/10 py-5 font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all text-[9px] flex items-center justify-center gap-4 text-charcoal"
                        >
                            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            Launch AR Visualizer
                        </a>

                        <a 
                            href="/smart-showroom" 
                            className="text-[9px] font-black uppercase tracking-[0.4em] text-gold text-center mt-4 hover:tracking-[0.6em] transition-all"
                        >
                            Try AI Room Analysis ✦
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ShowroomScene = () => {
    const { setLocked, selectedProduct } = useStore();
    const [mounted, setMounted] = React.useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { setKeyboard } = useStore();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => setKeyboard(e.code, true);
        const onKeyUp = (e: KeyboardEvent) => setKeyboard(e.code, false);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [setKeyboard]);

    useEffect(() => {
        setMounted(true);
        return () => {
             try {
                if (document.pointerLockElement) document.exitPointerLock();
             } catch (e) {
                console.warn('Pointer lock exit failed during unmount:', e);
             }
             setLocked(false);
        };
    }, [setLocked]);

    // Handle exiting lock when a product is selected
    useEffect(() => {
        if (selectedProduct && document.pointerLockElement) {
             try {
                document.exitPointerLock();
             } catch (e) {
                console.warn('Pointer lock exit failed during product selection:', e);
             }
        }
    }, [selectedProduct]);


    if (!mounted) return <div className="h-full w-full bg-black" />;

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative overflow-hidden bg-black flex flex-col" 
            id="showroom-container"
        >
            <Canvas 
                shadows 
                gl={{ antialias: true, stencil: false, alpha: false, preserveDrawingBuffer: true }}
                style={{ pointerEvents: selectedProduct ? 'none' : 'auto' }}
            >
                <Suspense fallback={null}>
                    <Lighting />
                    <Physics gravity={[0, -12, 0]}>
                        <Player />
                        <StableFloor />
                        <GalleryWall position={[0, 15, -100]} rotation={[0, 0, 0]} size={[240, 30, 1]} />
                        <GalleryWall position={[0, 15, 100]} rotation={[0, 0, 0]} size={[240, 30, 1]} />
                        <GalleryWall position={[-120, 15, 0]} rotation={[0, Math.PI / 2, 0]} size={[200, 30, 1]} />
                        <GalleryWall position={[120, 15, 0]} rotation={[0, Math.PI / 2, 0]} size={[200, 30, 1]} />
                        <GalleryWall position={[0, 30, 0]} rotation={[Math.PI / 2, 0, 0]} size={[240, 200, 1]} color="#050505" />


                        <InfiniteGallery />

                    </Physics>
                </Suspense>

                {/* Stable Control System - Always mounted for DOM stability */}
                <PointerLockControls 
                    onLock={() => {
                        console.log('🔒 Pointer Locked');
                        setLocked(true);
                    }} 
                    onUnlock={() => {
                        console.log('🔓 Pointer Unlocked');
                        setLocked(false);
                    }} 
                    makeDefault 
                />
            </Canvas>


            <UIOverlay />
            <AssetLoaderOverlay />
        </div>
    );
};
