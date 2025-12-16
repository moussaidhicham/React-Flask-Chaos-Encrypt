import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

const ImageCompare = ({ leftImage, rightImage, leftLabel = "Chiffrée", rightLabel = "Déchiffrée" }) => {
    const [position, setPosition] = useState(50);
    const containerRef = useRef(null);

    const handleDrag = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const width = rect.width;

        // Clamp between 0 and 100
        const newPos = Math.max(0, Math.min(100, (x / width) * 100));
        setPosition(newPos);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleDrag);
        document.addEventListener('touchend', handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleMouseUp);
    };

    // Calculate dimensions based on first image load?
    // We assume images are same size/aspect ratio for best effect.

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-xl shadow-2xl select-none group cursor-ew-resize"
            style={{ aspectRatio: '16/9' }} // Default aspect ratio, ideal to make dynamic
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Background Image (Right / "After") */}
            <img
                src={rightImage}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain bg-gray-900"
                draggable="false"
            />

            {/* Overlay Image (Left / "Before") - Clip it */}
            <div
                className="absolute inset-0 h-full overflow-hidden bg-gray-900"
                style={{ width: `${position}%` }}
            >
                <img
                    src={leftImage}
                    alt="Before"
                    className="absolute top-0 left-0 max-w-none h-full object-contain"
                    // We need to match the parent width effectively to align pixels
                    // This is tricky with object-contain. 
                    // Better approach: Use background-image to ensure alignment or force exact sizing?
                    // For simplest "pixel perfect" match, we usually force specific width.
                    // Let's rely on CSS object-fit: contain centering logic usually matching if container aspect matches.
                    // To be safe, let's use width: containerWidth.
                    // But container width varies.
                    // Hack: use width: 100 / (position/100) % ? No.
                    // Just set width of this img to the width of the container!
                    style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
                    draggable="false"
                />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
                {leftLabel}
            </div>
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
                {rightLabel}
            </div>

            {/* Drag Handle Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-md cursor-ew-resize z-10 hover:bg-white transition-colors"
                style={{ left: `${position}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-primary">
                    <MoveHorizontal size={16} />
                </div>
            </div>
        </div>
    );
};

export default ImageCompare;
