// @ts-nocheck
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
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
        className="relative w-full aspect-[4/5] bg-transparent rounded-xl overflow-hidden group perspective-1000"
    >
      {/* 100% Real Curtain Revolving in 3D Space */}
      <motion.div 
        className="absolute inset-10 z-0"
        animate={{ 
            rotateY: [0, 360],
        }}
        transition={{ 
            duration: 15, repeat: Infinity, ease: "linear"
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {poster && (
          <div className="relative w-full h-full shadow-2xl border-4 border-white rounded-sm overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
              <img 
                  src={poster} 
                  alt={alt || "Product Preview"} 
                  className="w-full h-full object-cover"
                  style={{ backfaceVisibility: 'visible' }}
              />
              {/* Back of the curtain panel */}
              <div 
                className="absolute inset-0 bg-gray-100 flex items-center justify-center opacity-20"
                style={{ transform: 'rotateY(180deg)' }}
              >
                  <p className="text-[6px] font-black uppercase text-charcoal/20">RK Premium Fabric</p>
              </div>
          </div>
        )}
      </motion.div>


      {/* Hidden AR Infrastructure (Only triggers AR mode on click) */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <model-viewer
            src={modelUrl}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement={placement}
            className="w-0 h-0" // Hidden in UI, but provides AR capability
          >
            <button
              slot="ar-button"
              className="bg-charcoal/90 backdrop-blur-md text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-gold transition-all flex items-center gap-3 border border-white/20 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Scan & Place in Your Room
            </button>
          </model-viewer>
      </div>

      <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest uppercase text-charcoal shadow-xl border border-gold/10 italic">RK Premier // Virtual Twin</span>
      </div>
      
      {/* Visual Inspect Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
          <p className="bg-charcoal/60 backdrop-blur-lg text-white px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.4em] shadow-2xl border border-white/10">3D Fabric Visualization</p>
      </div>
    </div>
  );
};


export default ARViewer;
