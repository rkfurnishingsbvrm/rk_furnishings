'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '@/store/useStore';
import { API_BASE_URL } from '@/lib/config';
import { X, Trash2, ArrowRight, ShoppingCart, Loader2, CheckCircle2, MapPin } from 'lucide-react';


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [checkoutState, setCheckoutState] = useState<'idle' | 'address' | 'processing' | 'success'>('idle');
  const [address, setAddress] = useState('');
  const [orderId, setOrderId] = useState('');


  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);


  const handleCheckout = async () => {
    if (!address) {
        setCheckoutState('address');
        return;
    }

    setCheckoutState('processing');
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items,
                shippingAddress: address,
                totalAmount: total,
                userId: user?.id
            })
        });

        const data = await response.json();
        if (response.ok) {
            setOrderId(data.orderId);
            setCheckoutState('success');
            setTimeout(() => {
                clearCart();
                setCheckoutState('idle');
                setAddress('');
                onClose();
            }, 5000);
        } else {
            throw new Error(data.message);
        }
    } catch (err) {
        alert('Checkout failed: ' + (err as Error).message);
        setCheckoutState('idle');
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-5 h-5 text-gold" />
                <h2 className="text-2xl font-serif italic text-charcoal">Your Selection</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-xl transition-all"><X /></button>
            </div>


            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/30">
              {checkoutState === 'address' ? (
                  <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                         <h3 className="text-xl font-serif">Shipping Details</h3>
                      </div>
                      <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Delivery Address</label>
                          <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street, City, Pin Code..."
                            className="w-full h-32 p-6 bg-white border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none shadow-sm"
                          />
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-gold text-white py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-gold/20"
                      >
                          Confirm Selection ✦
                      </button>
                      <button onClick={() => setCheckoutState('idle')} className="w-full text-[10px] uppercase font-bold text-gray-400">Back to Cart</button>
                  </div>
              ) : checkoutState === 'processing' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 px-10">
                    <div className="w-24 h-24 bg-gold/10 rounded-[40px] flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-gold tracking-[0.5em]">RK Secure Selection</p>
                        <h3 className="text-3xl font-serif italic text-charcoal">Processing Selection</h3>
                        <p className="text-gray-400 text-xs italic">Verifying availability and preparing consultation...</p>
                    </div>
                </div>
              ) : checkoutState === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 px-10">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-green-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="space-y-4 text-center">
                        <span className="text-[10px] font-black uppercase text-green-500 tracking-[0.5em]">Identity Verified</span>
                        <h3 className="text-4xl font-serif italic text-charcoal leading-tight">Order Confirmed</h3>
                        <p className="text-gray-400 text-sm leading-relaxed italic max-w-xs mx-auto">Your premium selection is being prepared by our master tailors.</p>
                    </div>
                    <div className="pt-10">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
                            <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest mb-2">Tracking ID</p>
                            <p className="font-mono text-[10px] text-charcoal">{orderId}</p>
                        </div>
                    </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingCart className="w-16 h-16 mb-6" />
                  <p className="text-sm font-light italic">Your design studio is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 items-center group bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt={item.name} />
                    <div className="flex-1 space-y-1">
                        <p className="text-[9px] font-black uppercase text-gold tracking-widest">{item.category || 'Product'}</p>
                        <h4 className="text-sm font-bold text-charcoal line-clamp-1">{item.name}</h4>
                        <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-4 hover:bg-red-50 rounded-xl text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </motion.div>
                ))
              )}
            </div>


            {checkoutState === 'idle' && (
                <div className="p-10 bg-white border-t border-gray-100 space-y-8">
                  <div className="flex justify-between items-center px-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Items in Selection</p>
                    <p className="text-3xl font-serif italic text-charcoal">{items.length}</p>
                  </div>


                  <div className="w-full h-[1px] bg-gray-50" />


                  <button 
                    onClick={() => setCheckoutState('address')}
                    disabled={items.length === 0}
                    className="w-full bg-charcoal text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-gold transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                  >
                    Proceed to Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
