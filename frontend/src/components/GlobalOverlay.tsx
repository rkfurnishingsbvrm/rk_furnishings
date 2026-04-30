'use client';

import React from 'react';
import { useUIStore } from '@/store/useStore';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

const GlobalOverlay: React.FC = () => {
    const { isAuthOpen, toggleAuth, isCartOpen, toggleCart } = useUIStore();

    return (
        <>
            <AuthModal isOpen={isAuthOpen} onClose={() => toggleAuth(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => toggleCart(false)} />
        </>
    )
}

export default GlobalOverlay;
