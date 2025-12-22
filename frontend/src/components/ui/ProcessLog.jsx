import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Code, Database, Lock, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';

const ProcessLog = ({ logs }) => {
    const [visibleLogs, setVisibleLogs] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!logs || logs.length === 0) return;

        setVisibleLogs([]);
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                if (logs[i]) {
                    setVisibleLogs(prev => [...prev, logs[i]]);
                }
                i++;
            } else {
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [logs]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [visibleLogs]);

    if (!logs) return null;

    const getIcon = (stepName) => {
        const name = stepName.toLowerCase();
        if (name.includes("vectorisation")) return <Database className="w-5 h-5 text-primary" />;
        if (name.includes("chaos") || name.includes("clés")) return <Cpu className="w-5 h-5 text-accent" />;
        if (name.includes("structures") || name.includes("box")) return <Code className="w-5 h-5 text-yellow-500" />;
        if (name.includes("chiffrement") || name.includes("diffusion")) return <Lock className="w-5 h-5 text-red-500" />;
        if (name.includes("initial") || name.includes("iv")) return <Activity className="w-5 h-5 text-blue-500" />;
        return <ChevronRight className="w-5 h-5 text-gray-400" />;
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 mb-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Activity className="w-6 h-6 text-primary" />
                    Progression du Chiffrement
                </h3>
                <div className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 animate-pulse">
                    En cours
                </div>
            </div>

            <div
                className="glass-card p-6 rounded-2xl h-[450px] overflow-y-auto relative scroll-smooth"
                ref={scrollRef}
            >
                <div className="space-y-6">
                    <AnimatePresence>
                        {visibleLogs.map((log, index) => log && (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative flex gap-4"
                            >
                                {/* Connector Line */}
                                {index < visibleLogs.length - 1 && (
                                    <div className="absolute left-[22px] top-10 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-white/10" />
                                )}

                                {/* Icon Circle */}
                                <div className="z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                                    {getIcon(log.step)}
                                </div>

                                <div className="flex-1 pt-1 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {log.step}
                                        </h4>
                                        <span className="text-[10px] font-mono font-bold text-gray-400">
                                            +{log.timestamp?.toFixed(3) || "0.000"}s
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                        {log.description}
                                    </p>

                                    {log.data && (
                                        <div className="bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-white/5 rounded-lg p-3 text-xs font-mono text-primary dark:text-accent overflow-x-auto">
                                            {log.data}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {visibleLogs.length === logs.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-6 bg-success/10 border border-success/20 rounded-xl flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 text-success">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="font-bold text-success">Chiffrement Terminé avec Succès</h4>
                            <p className="text-xs text-success/70 font-medium">L'image a été sécurisée et les métriques sont prêtes pour l'analyse.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProcessLog;
