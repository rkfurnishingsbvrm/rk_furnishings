'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';
import { API_BASE_URL } from '@/lib/config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const body = isLogin ? { email, password } : { name, email, password };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
        }

        login(data.user, data.token);
        onClose();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white rounded-[40px] shadow-2xl z-[101] overflow-hidden"
          >
            <div className="bg-charcoal p-12 text-white relative">
                <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all"><X /></button>
                <div className="text-center">
                    <span className="text-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">RK Premier Membership</span>
                    <h2 className="text-4xl font-serif italic mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-white/40 text-xs font-light">Access exclusive collections and AI styling.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                                type="text" placeholder="Johnathan Doe" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl text-sm outline-none border border-transparent focus:border-gold transition-all"
                            />
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                            type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl text-sm outline-none border border-transparent focus:border-gold transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                            type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl text-sm outline-none border border-transparent focus:border-gold transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center animate-shake">
                        {error}
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gold text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-gold/20 flex items-center justify-center gap-4 group disabled:bg-gray-200 disabled:shadow-none transition-all"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {isLogin ? 'Authorize Access' : 'Create Identity'} 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </>
                    )}
                </button>

                <div className="text-center pt-4">
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-bold text-gray-400 hover:text-charcoal transition-all">
                        {isLogin ? "New to RK? Start Your Journey" : "Already a member? Return to Login"}
                    </button>
                </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
