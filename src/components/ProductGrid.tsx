'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ChevronRight, Info, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

import { useStore, useCartStore } from '@/store/useStore';
import FlowingMenu from './FlowingMenu';


interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    images: string[];
    isFeatured: boolean;
    style: string;
    price: number;
    colors?: string[];
    materials?: string;
}

const categoriesList = ['Sofa Fabrics', 'Wallpapers', 'Blinds', 'Carpets & Rugs', 'Mattresses', 'Flooring'];
const swatchColors = ['#AF8B44', '#2C2C2C', '#E5E4E2', '#C0C0C0', '#4169E1', '#800000', '#2E8B57'];

const categoryImages = {
    'Sofa Fabrics': [
        '/images/sofa.png',
        '/images/premium/sofa_1.png',
        '/images/premium/fabrics_1.png'
    ],
    Wallpapers: [
        '/images/wallpaper.png',
        '/images/premium/wallpaper_1.png',
        '/images/premium/fabrics_1.png'
    ],
    Blinds: [
        '/images/curtains.png',
        '/images/premium/blinds_1.png',
        '/images/curtains.png'
    ],
    'Carpets & Rugs': [
        '/images/inspiration1.png',
        '/images/premium/carpet_1.png',
        '/images/premium/carpet_2.png'
    ],
    Mattresses: [
        '/images/inspiration2.png',
        '/images/premium/mattress_1.png',
        '/images/inspiration2.png'
    ],
    Flooring: [
        '/images/hero.png',
        '/images/premium/flooring_1.png',
        '/images/premium/interior_1.png'
    ],
};


const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const addItem = useCartStore((state) => state.addItem);

    const generateMockProducts = useMemo(() => {
        const items: Product[] = [];
        for (let i = 1; i <= 150; i++) {
            const cat = categoriesList[i % categoriesList.length];
            const currentCatImages = categoryImages[cat as keyof typeof categoryImages] || [];
            const imgUrl = currentCatImages[i % currentCatImages.length] || '/images/premium/interior_1.png';


            items.push({
                _id: `prod-${i}`,
                name: `${cat} Series ${i}`,
                category: cat,
                style: i % 2 === 0 ? 'Modern' : 'Classic',
                description: `Exquisite ${cat.toLowerCase()} solution for premium home interiors.`,
                images: [imgUrl],
                price: 499 + (i * 10),
                isFeatured: i <= 12,
                colors: swatchColors.slice(0, 4)
            });
        }
        return items;
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();

                
                if (data && data.length > 0) {
                    setProducts(data.map((p: any) => ({
                        _id: p.id || p._id,
                        name: p.name,
                        category: p.category,
                        description: p.description,
                        price: p.price || 0,
                        images: Array.isArray(p.images) ? p.images : [p.images],
                        isFeatured: p.is_featured || p.isFeatured,
                        style: p.style || 'Bespoke',
                        colors: p.colors
                    })));
                } else {
                    setProducts(generateMockProducts);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setProducts(generateMockProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [generateMockProducts]);

    const filteredProducts = products.filter(p => {
        const matchesCat = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    return (
        <div className="space-y-16">
            {/* Filters */}
            <div className="flex flex-col gap-6 md:gap-8 mb-8">
                <div className="flex justify-end w-full">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-full text-sm outline-none focus:ring-1 focus:ring-gold transition-shadow shadow-inner"
                        />
                    </div>
                </div>

                <div style={{ height: '600px', position: 'relative' }} className="w-full rounded-lg overflow-hidden shadow-2xl">
                    <FlowingMenu 
                        items={['All', ...categoriesList].map(cat => ({
                            text: cat === activeCategory ? `${cat} ✦` : cat,
                            image: cat === 'All' 
                                ? '/images/premium/interior_1.png'
                                : (categoryImages[cat as keyof typeof categoryImages]?.[0] || '/images/premium/interior_1.png'),
                            onClick: () => setActiveCategory(cat)
                        }))}
                        speed={15}
                        textColor="#ffffff"
                        bgColor="#060010"
                        marqueeBgColor="#ffffff"
                        marqueeTextColor="#060010"
                        borderColor="rgba(255,255,255,0.2)"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-gray-100 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {displayedProducts.map(product => (
                        <div
                            key={product._id}
                            className="bg-white border border-gray-100 rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div className="relative h-72 overflow-hidden bg-gray-50">

                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                
                                {/* AR Quick Access Badge */}
                                <div className="absolute bottom-4 right-4 z-10 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                     <div className="bg-charcoal/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl">
                                         <Sparkles className="w-3 h-3 text-gold" />
                                         <span className="text-[7px] font-black uppercase tracking-widest text-white">AI READY // AR</span>
                                     </div>
                                </div>
                                
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-gold text-[10px] font-bold uppercase tracking-widest">{product.category}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(product);
                                                // Trigger AI mode in modal
                                            }}
                                            className="px-2 py-0.5 bg-gold/10 text-gold text-[7px] font-black rounded-full border border-gold/20 uppercase hover:bg-gold hover:text-white transition-all transform hover:scale-110"
                                        >
                                            AI READY
                                        </button>
                                        <a 
                                            href="/smart-showroom#ar-catalog" 
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-2 py-0.5 bg-black/5 text-charcoal/50 text-[7px] font-black rounded-full border border-black/5 uppercase hover:bg-black hover:text-white transition-all transform hover:scale-110"
                                        >
                                            AR
                                        </a>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = '#showroom';
                                                // We can trigger the game mode here if possible, 
                                                // but for now, scroll to showroom
                                            }}
                                            className="px-2 py-0.5 bg-gold/5 text-gold/40 text-[7px] font-black rounded-full border border-gold/10 uppercase hover:bg-gold hover:text-white transition-all transform hover:scale-110"
                                        >
                                            VR
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-serif mb-2">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">{product.style}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2.5 h-2.5 text-gold fill-current" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {visibleCount < filteredProducts.length && (
                <div className="text-center">
                    <button
                        onClick={() => setVisibleCount(v => v + 12)}
                        className="px-10 py-4 border-2 border-charcoal font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all"
                    >
                        Load More Designs
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white max-w-5xl w-full h-[80vh] grid grid-cols-1 md:grid-cols-2 relative z-10"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-white rounded-full z-20 shadow-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="relative h-full">
                                <Image
                                    src={selectedProduct.images[0]}
                                    alt={selectedProduct.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                />
                            </div>                            <div className="p-10 flex flex-col justify-center overflow-y-auto max-h-full">
                                <p className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-gold/5 px-4 py-1 rounded-full w-fit">✦ RK Signature Collection</p>
                                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight italic tracking-tighter">{selectedProduct.name}</h2>
                                <p className="text-gray-600 text-[15px] mb-8 leading-relaxed font-light">
                                    {selectedProduct.description || "A masterfully crafted piece designed for the discerning homeowner."}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="bg-gray-50 p-6 rounded-sm border-l-2 border-gold/40">
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 font-black">Design Style</p>
                                        <p className="font-bold text-sm text-charcoal">{selectedProduct.style || "Bespoke Modern"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-sm border-l-2 border-gold/40">
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 font-black">AI Material</p>
                                        <p className="font-bold text-sm text-charcoal">Gemini Analyzed</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            addItem({
                                                id: selectedProduct._id,
                                                name: selectedProduct.name,
                                                image: selectedProduct.images[0],
                                                price: selectedProduct.price
                                            });
                                            setSelectedProduct(null);
                                        }}
                                        className="bg-charcoal text-white py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-gold transition-all shadow-xl"
                                    >
                                        Add to Collection ✦
                                    </button>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                         <a 
                                            href={`/smart-showroom#ar-catalog`} 
                                            className="text-center py-4 border border-charcoal/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 flex items-center justify-center gap-2 transition-all hover:border-gold group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse group-hover:scale-150 transition-transform" />
                                            Live AR Placement
                                        </a>
                                        <button 
                                            onClick={() => window.location.href = '#showroom'}
                                            className="text-center py-4 border border-charcoal/10 text-charcoal text-[9px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                                        >
                                            VR View
                                        </button>
                                    </div>
                                    <a
                                        href="#booking"
                                        onClick={() => setSelectedProduct(null)}
                                        className="bg-gold/10 text-gold text-center py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-gold hover:text-white transition-all"
                                    >
                                        Enquire For Bespoke Styling
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default ProductGrid;
