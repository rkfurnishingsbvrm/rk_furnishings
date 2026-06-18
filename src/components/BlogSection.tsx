'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const posts = [
    {
        title: 'How to Choose the Right Curtains for Your Living Room',
        category: 'Interior Tips',
        image: '/images/premium/interior_1.png',
        date: 'March 10, 2026'
    },
    {
        title: 'Top 5 Wallpaper Trends for 2026',
        category: 'Trends',
        image: '/images/premium/wallpaper_1.png',
        date: 'March 05, 2026'
    },
    {
        title: 'Caring for Your Bespoke Sofa Fabrics',
        category: 'Maintenance',
        image: '/images/premium/sofa_1.png',
        date: 'February 28, 2026'
    }
];


const BlogSection = () => {
    return (
        <section id="blog" className="py-24 bg-white">
            <div className="container-premium">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-serif mb-4 text-charcoal">Decor Blog</h2>
                        <div className="w-20 h-1 bg-gold mb-6"></div>
                        <p className="text-gray-500 text-lg">Helpful tips and trends from our interior styling experts.</p>
                    </div>
                    <button className="hidden md:block border-2 border-charcoal text-charcoal px-8 py-3 font-bold hover:bg-charcoal hover:text-white transition-all uppercase tracking-wider text-sm mt-8" suppressHydrationWarning>
                        View All Posts
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-64 mb-6 overflow-hidden rounded-sm">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs mb-3 font-medium">{post.date}</p>
                            <h3 className="text-2xl font-serif text-charcoal mb-4 group-hover:text-gold transition-colors">{post.title}</h3>
                            <a href="#" className="inline-flex items-center gap-2 text-gold font-bold text-sm">
                                Read More <span className="text-lg">→</span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
