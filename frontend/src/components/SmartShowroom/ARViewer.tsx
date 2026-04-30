// @ts-nocheck
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, Box } from 'lucide-react';
import { motion } from 'framer-motion';



// Model viewer registration is handled at the top level in the page component



interface ARViewerProps {
  modelUrl: string;
  poster?: string;
  alt?: string;
  id?: string;
  name?: string;
  placement?: 'floor' | 'wall'; // Added for environmental awareness
}

const ARViewer: React.FC<ARViewerProps> = ({ modelUrl, poster, alt, name, placement = 'floor' }) => {
  const [showAR, setShowAR] = useState(false);

  return (
    <div 
        className="relative w-full aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden group border border-gray-100 shadow-inner"
    >
      {/* Primary 3D Visualization */}
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        ar-placement={placement}
        poster={poster} // Still pass if available, but optional
        alt={alt || "3D Product Preview"}
        className="w-full h-full bg-transparent"
        style={{ '--poster-color': 'transparent' }}
      >
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
             <div className="flex flex-col items-center gap-4 opacity-20">
                 <Box className="w-12 h-12 text-charcoal" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Loading 3D Twin...</p>
             </div>
        </div>

        <button
          slot="ar-button"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-charcoal/90 backdrop-blur-md text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[8px] shadow-2xl hover:bg-gold transition-all flex items-center gap-2 border border-white/10 active:scale-95 z-40"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          AR VIEW
        </button>
      </model-viewer>

      <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest uppercase text-charcoal shadow-sm border border-gold/10 italic">RK Premier // Virtual Twin</span>
      </div>
      
      {/* Visual Inspect Label */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          <p className="bg-charcoal/10 backdrop-blur-sm text-charcoal px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] border border-charcoal/5 flex items-center gap-2">
            <ZoomIn className="w-2.5 h-2.5" /> 3D ORBIT
          </p>
      </div>
    </div>
  );
};


export default ARViewer;
