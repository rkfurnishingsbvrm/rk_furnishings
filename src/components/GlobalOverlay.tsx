'use client';

import React from 'react';
import { useUIStore } from '@/store/useStore';
import AuthModal from './AuthModal';

const GlobalOverlay: React.FC = () => {
    const { isAuthOpen, toggleAuth } = useUIStore();

    return (
        <>
            <AuthModal isOpen={isAuthOpen} onClose={() => toggleAuth(false)} />
        </>
    )
}

export default GlobalOverlay;
