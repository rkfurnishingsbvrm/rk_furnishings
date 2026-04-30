'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useSpring(0, { damping: 25, stiffness: 250, restDelta: 0.001 });
    const mouseY = useSpring(0, { damping: 25, stiffness: 250, restDelta: 0.001 });

    const outlineX = useSpring(0, { damping: 35, stiffness: 200 });
    const outlineY = useSpring(0, { damping: 35, stiffness: 200 });

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            outlineX.set(e.clientX);
            outlineY.set(e.clientY);

            if (!isVisible) setIsVisible(true);
        };

        const handleHover = () => setIsHovering(true);
        const handleUnhover = () => setIsHovering(false);

        window.addEventListener('mousemove', moveMouse);

        // Listen for all potential interactive elements including ones added dynamically
        const updateInteractiveListeners = () => {
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, .group, [role="button"]');
            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', handleHover);
                el.addEventListener('mouseleave', handleUnhover);
            });
        };

        updateInteractiveListeners();

        // Periodic check for new elements (simpler than MutationObserver for this specific task)
        const interval = setInterval(updateInteractiveListeners, 2000);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            clearInterval(interval);
        };
    }, [mouseX, mouseY, outlineX, outlineY, isVisible]);

    if (!isVisible) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100000 }}>
            <motion.div
                className="cursor-dot"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: '#AF8B44',
                    boxShadow: '0 0 15px rgba(175, 139, 68, 0.8)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    zIndex: 100001
                }}
            />
            <motion.div
                className="cursor-outline"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: outlineX,
                    y: outlineY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.7 : 0.4,
                    backgroundColor: isHovering ? 'rgba(175, 139, 68, 0.1)' : 'transparent',
                    border: '1.5px solid #AF8B44',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    zIndex: 100000
                }}
            />
        </div>
    );
};

export default CustomCursor;
