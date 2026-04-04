'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Lakshmi S.',
        location: 'Bhimavaram',
        text: 'The curtains from RK Furnishings transformed our living room. The quality of stitching is exceptional and the fabrics are beautiful.',
        rating: 5
    },
    {
        name: 'Krishna V.',
        location: 'Palakollu',
        text: 'Excellent service! They helped us choose the right wallpaper for our bedroom. The installation was quick and professional.',
        rating: 5
    },
    {
        name: 'Dr. Anand Rao',
        location: 'Tanuku',
        text: 'Best collection of sofa fabrics in the region. We are very happy with the bespoke upholstery work done for our clinic.',
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-cream">
            <div className="container-premium">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif mb-4 text-charcoal">Happy Customers</h2>
                    <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
                    <p className="text-gray-600">What our clients say about their experience with RK Furnishings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-sm shadow-md flex flex-col items-center text-center relative"
                        >
                            <Quote className="text-gold opacity-10 w-16 h-16 absolute top-4 left-4" />
                            <div className="flex gap-1 mb-4 text-gold">
                                {[...Array(t.rating)].map((_, idx) => (
                                    <Star key={idx} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                            <div className="mt-auto">
                                <p className="text-charcoal font-bold text-lg">{t.name}</p>
                                <p className="text-gold text-sm font-medium uppercase tracking-wider">{t.location}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
