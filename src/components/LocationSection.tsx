'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const LocationSection = () => {
    return (
        <section id="visit-us" className="py-24 bg-cream">
            <div className="container-premium">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-gold font-bold tracking-[0.2em] uppercase text-sm mb-4">Visit Us</h4>
                        <h2 className="text-4xl md:text-6xl font-serif text-charcoal mb-8">Our Showroom</h2>
                        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                            Experience our products in person and get hands-on with our extensive range of fabrics and furnishing solutions. Our experts are ready to assist you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                    <MapPin className="text-gold w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-charcoal mb-1">Address</h4>
                                    <p className="text-gray-600">
                                        SVR Complex, Mavulamma Temple Square,<br />
                                        Rest House Road, Bhimavaram, AP 534201
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                    <Clock className="text-gold w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-charcoal mb-1">Showroom Hours</h4>
                                    <p className="text-gray-600">Daily: 10:00 AM — 9:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://www.google.com/maps/search/SVR+Complex+Near+Mavulamma+Temple+Rest+House+Road+Bhimavaram+Andhra+Pradesh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-gold text-white px-8 py-4 mt-10 rounded-sm font-bold hover:bg-charcoal transition-all shadow-lg"
                        >
                            <Navigation className="w-5 h-5" />
                            Get Directions
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="h-[500px] relative rounded-sm overflow-hidden shadow-2xl border-4 border-white"
                    >
                        <Image
                            src="/images/premium/interior_1.png"
                            alt="Showroom Map Location"
                            fill
                            sizes="(max-width: 1024px) 100vw, 800px"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm p-6 text-center shadow-2xl">
                                <h3 className="font-serif text-2xl text-charcoal mb-2">RK FURNISHINGS</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Bhimavaram Atelier</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
