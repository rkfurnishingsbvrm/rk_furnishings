'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const InspirationGallery = () => {
    const items = [
        { id: 1, src: '/images/premium/interior_1.png', category: 'Living Room', size: 'large', title: 'Modern Drapery' },
        { id: 2, src: '/images/premium/mattress_1.png', category: 'Bedroom', size: 'small', title: 'Linen Collection' },
        { id: 3, src: '/images/premium/wallpaper_1.png', category: 'Wallpapers', size: 'small', title: 'Textured Walls' },
        { id: 4, src: '/images/premium/blinds_1.png', category: 'Exteriors', size: 'large', title: 'Premium Blinds' },
        { id: 5, src: '/images/premium/sofa_1.png', category: 'Furniture', size: 'small', title: 'Velvet Upholstery' },
        { id: 6, src: '/images/premium/interior_1.png', category: 'Elite Living', size: 'small', title: 'Curated Interiors' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[400px]">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative group overflow-hidden rounded-sm
                        ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}`}
                >
                    <Image
                        src={item.src}
                        alt={item.category}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 z-30">
                        <span className="text-gold text-xs uppercase tracking-widest mb-2 font-bold">{item.category}</span>
                        <h3 className="text-white text-3xl font-serif mb-6">{item.title}</h3>
                        <div className="flex items-center gap-3 text-white font-bold text-sm cursor-pointer">
                            <Plus className="w-5 h-5" />
                            <span>View Details</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default InspirationGallery;
