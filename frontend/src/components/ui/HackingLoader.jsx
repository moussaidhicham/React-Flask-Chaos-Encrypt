import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

const HackingLoader = ({ messages = [] }) => {
    const defaultMessages = [
        "Initialisation des vecteurs chaotiques...",
        "Génération des S-Box dynamiques...",
        "Calcul des orbites de Lyapunov...",
        "Diffusion des pixels...",
        "Application de la transformation affine...",
        "Vérification de l'intégrité..."
    ];

    const currentMessages = messages.length > 0 ? messages : defaultMessages;
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % currentMessages.length);
        }, 800);
        return () => clearInterval(interval);
    }, [currentMessages]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <Cpu size={24} />
                </div>
            </div>

            <div className="font-mono text-sm text-primary animate-pulse text-center min-h-[1.5rem]">
                {`> ${currentMessages[msgIndex]}`}
            </div>

            <div className="flex gap-2 text-xs text-gray-500 font-mono">
                <span>ENCRYPT_MODE: ON</span>
                <span>•</span>
                <span>SECURE_LAYER: ACTIVE</span>
            </div>
        </div>
    );
};

export default HackingLoader;
