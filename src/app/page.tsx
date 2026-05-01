'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ConsultationForm from '@/components/ConsultationForm';
import ProductGrid from '@/components/ProductGrid';
import InspirationGallery from '@/components/InspirationGallery';
import Testimonials from '@/components/Testimonials';
import { ShowroomScene } from '@/components/Showroom/ShowroomScene';
import WhatsAppButton from '@/components/WhatsAppButton';
import LocationSection from '@/components/LocationSection';
import ServicesSection from '@/components/ServicesSection';
import BlogSection from '@/components/BlogSection';
import { ArrowDown, Instagram, Facebook, Phone, Mail, Play, Pause, ShoppingCart, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { useUIStore, useAuthStore, useCartStore } from '@/store/useStore';
import { API_BASE_URL } from "@/lib/config";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const { toggleAuth, toggleCart } = useUIStore();
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.items);

  const [businessSettings, setBusinessSettings] = useState({
    contactNumber: "8688769487",
    supportEmail: "rkfurnishingsbvrm@gmail.com"
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/settings`);
        if (res.ok) {
          const data = await res.json();
          setBusinessSettings({
            contactNumber: data.contactNumber || "8688769487",
            supportEmail: data.supportEmail || "rkfurnishingsbvrm@gmail.com"
          });
        }
      } catch (err) {
        console.error("Failed to sync business details:", err);
      }
    };
    fetchSettings();
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <main className="min-h-screen bg-white">
      <WhatsAppButton />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-serif font-bold tracking-tight">
                <span className="text-gold">RK</span> <span className="text-charcoal font-black">FURNISHINGS</span>
              </span>
            </div>

            <div className="hidden lg:flex space-x-12 items-center">
              {['About', 'Showroom', 'Collections', 'Services', 'Visit Us'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-600 hover:text-gold transition-all hover:tracking-widest font-medium text-sm capitalize"
                >
                  {item}
                </a>
              ))}
              <Link href="/smart-showroom" className="text-gold hover:tracking-[0.2em] transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Showroom
              </Link>

              <div className="flex items-center gap-8 pl-8 border-l border-gray-100">
                <button
                  onClick={() => toggleCart(true)}
                  className="relative p-2 text-charcoal hover:text-gold transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {mounted && cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {mounted && (user ? (
                  <div className="flex items-center gap-4 group relative">
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-gold font-serif text-sm border-2 border-gold/20 shadow-lg cursor-pointer">
                      {user.name[0]}
                    </div>
                    <div className="absolute top-full right-0 mt-4 w-48 bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform scale-95 group-hover:scale-100 p-6 z-[60]">
                      <p className="text-[9px] font-black uppercase text-gold tracking-widest mb-4">Master Profile</p>
                      <p className="text-xs font-bold text-charcoal mb-6">{user.name}</p>
                      <div className="space-y-4 pt-4 border-t border-gray-50">
                        <Link href="/admin" className="block text-[9px] font-black uppercase tracking-widest text-charcoal hover:text-gold transition-all">Admin Panel</Link>
                        <button onClick={logout} className="w-full flex items-center gap-3 text-red-500 text-[9px] font-black uppercase tracking-widest hover:text-red-600 text-left">
                          <LogOut className="w-4 h-4" /> Terminate
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleAuth(true)}
                    className="bg-charcoal text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-gold transition-all shadow-xl shadow-black/5"
                  >
                    Member Login
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Showroom Section */}
      <section id="showroom" className="relative h-screen w-full bg-black overflow-hidden flex flex-col pt-20">
        {!showGame ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <div className="inline-block px-4 py-1 mb-6 border border-gold/50 rounded-full text-gold text-xs font-bold tracking-widest uppercase bg-gold/5">
                The Interior Metaverse
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
                Step Inside Your <br />
                <span className="text-gold italic">Dream Home</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                Experience our premium collections in a fully immersive 3D environment.
                Walk, interact, and feel the textures of luxury.
              </p>
              <button
                onClick={() => setShowGame(true)}
                className="group relative px-12 py-6 bg-gold text-white font-bold text-lg uppercase tracking-widest overflow-hidden transition-all hover:pr-16 flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]"
              >
                <Play className="fill-white w-5 h-5 group-hover:scale-110 transition-transform" />
                Enter 3D Showroom
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">→</span>
              </button>
            </motion.div>
            <div className="mt-16 flex gap-12 text-white/40 text-xs font-mono tracking-widest">
              <div className="flex flex-col gap-1 items-center"><span>[W][A][S][D]</span><span>MOVE</span></div>
              <div className="flex flex-col gap-1 items-center"><span>[MOUSE]</span><span>LOOK</span></div>
              <div className="flex flex-col gap-1 items-center"><span>[E]</span><span>INTERACT</span></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full relative cursor-none min-h-0">
            <ShowroomScene />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGame(false);
              }}
              className="absolute top-24 right-8 z-[60] bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-2 group transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              Exit 3D View
            </button>
          </div>
        )}

        {/* Background Overlay */}
        {!showGame && (
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/premium/interior_1.png"
              alt="Background"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50 contrast-125"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-cream/30 -skew-x-12 translate-x-1/2" />
        <div className="container-premium relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div {...fadeInUp} className="w-full lg:w-1/2">
              <h4 className="text-gold font-bold tracking-[0.2em] uppercase text-sm mb-6">A Legacy of Design</h4>
              <h2 className="text-4xl md:text-7xl font-serif mb-10 text-charcoal leading-tight">15 Years of Crafting <br />Excellence</h2>
              <p className="text-gray-600 text-xl leading-relaxed mb-10 font-light">
                Since 2010, RK Furnishings has been the cornerstone of luxury interior solutions in Bhimavaram. We believe that every thread tells a story of elegance and comfort.
              </p>
              <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="border-l-2 border-gold/30 pl-6">
                  <h3 className="text-5xl font-serif text-gold mb-2">5,000+</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Residences Transformed</p>
                </div>
                <div className="border-l-2 border-gold/30 pl-6">
                  <h3 className="text-5xl font-serif text-gold mb-2">15+</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Years of Trust</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="w-full lg:w-1/2 relative h-[700px] group">
              <div className="absolute -inset-4 border border-gold/20 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              <Image
                src="/images/premium/interior_1.png"
                alt="Luxury Interior"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-sm shadow-2xl transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Product Categories Section with Flowing Effect */}
      <section id="collections" className="py-32 bg-[#0a0a0a]">
        <div className="container-premium">
          <div className="text-center mb-24">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Curated Selection</span>
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-6">Exquisite Collections</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto"></div>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Inspiration Section */}
      <section id="inspiration" className="py-32 bg-white">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-7xl font-serif text-charcoal mb-6">Design <br />Inspirations</h2>
              <div className="w-20 h-1 bg-gold mb-8"></div>
              <p className="text-gray-500 text-xl font-light">Immerse yourself in our curated gallery showcasing the pinnacle of modern and classic interior aesthetics.</p>
            </div>
          </div>
          <InspirationGallery />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Blog Section */}
      <BlogSection />

      {/* Location Section */}
      <LocationSection />

      {/* Final CTA / Consultation */}
      <section id="booking" className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container-premium relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">Elevate Your Space <br /><span className="text-gold italic">Today</span></h2>
            <p className="text-white/60 text-xl font-light mb-12">
              Our master designers are ready to bring your vision to life. Schedule your complimentary private consultation.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white p-1 md:p-1 shadow-2xl rounded-sm">
            <div className="border border-gray-100 p-8 md:p-16">
              <ConsultationForm />
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto border-t border-white/10 pt-16">
            <a href={`tel:${businessSettings.contactNumber}`} className="flex flex-col items-center gap-6 group cursor-pointer transition-all">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-500 transform group-hover:scale-110">
                <Phone className="text-gold w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Speak With Us</p>
                <span className="text-3xl font-serif text-white group-hover:text-gold transition-colors">{businessSettings.contactNumber}</span>
              </div>
            </a>
            <a href={`mailto:${businessSettings.supportEmail}`} className="flex flex-col items-center gap-6 group cursor-pointer transition-all">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-500 transform group-hover:scale-110">
                <Mail className="text-gold w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Email Inquiries</p>
                <span className="text-3xl font-serif text-white group-hover:text-gold transition-colors">{businessSettings.supportEmail}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black text-white/40 border-t border-white/5">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-3xl font-serif font-bold mb-8">
                <span className="text-gold">RK</span> FURNISHINGS
              </h3>
              <p className="max-w-md mb-10 leading-relaxed text-lg font-light">
                Setting the standard for luxury living in Andhra Pradesh since 2010. Excellence, integrity, and timeless design in every stitch.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-white/60 hover:text-gold transition-all transform hover:scale-110"><Instagram size={24} /></a>
                <a href="#" className="text-white/60 hover:text-gold transition-all transform hover:scale-110"><Facebook size={24} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-[0.3em] text-xs">Navigation</h4>
              <ul className="space-y-5 text-sm uppercase tracking-widest font-medium">
                <li><a href="#about" className="hover:text-gold transition-colors">The Atelier</a></li>
                <li><a href="#showroom" className="hover:text-gold transition-colors">Metaverse View</a></li>
                <li><a href="#collections" className="hover:text-gold transition-colors">Curated Catalog</a></li>
                <li><a href="#visit-us" className="hover:text-gold transition-colors">Flagship Store</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-[0.3em] text-xs">Headquarters</h4>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li>SVR Complex, Main Road<br />Mavulamma Temple Square<br />Bhimavaram, AP 534201</li>
                <li className="text-gold font-black pt-4">MON - SUN: 10AM - 9PM</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs tracking-widest">© {mounted ? new Date().getFullYear() : '2025'} RK FURNISHINGS CO. ALL RIGHTS RESERVED - BY ARTISANS FOR ARTISANS.</p>
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
