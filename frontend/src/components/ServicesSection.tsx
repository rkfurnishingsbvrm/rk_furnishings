'use client';

import { motion } from 'framer-motion';
import {
    Home,
    Scissors,
    Ruler,
    Settings,
    Sparkles,
    Globe,
    ArrowRight
} from 'lucide-react';

const services = [
    {
        title: 'Home Styling',
        description: 'Personalized interior design advice to help you choose the perfect fabrics and styles for your home.',
        icon: Home,
    },
    {
        title: 'Custom Stitching',
        description: 'Expert curtain stitching and upholstery services tailored to your exact measurements.',
        icon: Scissors,
    },
    {
        title: 'Free Measurement',
        description: 'Professional doorstep measurement services to ensure a perfect fit for every window.',
        icon: Ruler,
    },
    {
        title: 'Expert Installation',
        description: 'Hassle-free installation by our trained technicians for all window treatments.',
        icon: Settings,
    },
    {
        title: 'NRI Services',
        description: 'Complete interior furnishing setup for NRI homes with remote progress tracking.',
        icon: Globe,
    },
    {
        title: 'Total Interior Setup',
        description: 'End-to-end furnishing solutions from wallpapers to flooring for a cohesive look.',
        icon: Sparkles,
    },
];

const ServicesSection = () => {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container-premium">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif mb-4 text-charcoal">Design & Support Services</h2>
                    <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        We offer end-to-end furnishing services to make your home transformation smooth and stress-free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-cream p-10 rounded-sm hover:shadow-xl transition-all group"
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-gold transition-colors">
                                <service.icon className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-2xl font-serif text-charcoal mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {service.description}
                            </p>
                            <a href="#booking" className="text-gold font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                Learn More <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
