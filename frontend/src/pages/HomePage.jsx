import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, BarChart2, Zap, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-20 pb-20"
        >
            {/* Hero Section */}
            <section className="text-center py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

                <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-accent font-medium text-sm">
                    Master ENS Meknès • S3 Mini-Projet
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent dark:from-primary dark:via-white dark:to-accent">
                        Chiffrement Chaotique
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-white">Avancé</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Une solution de sécurité cryptographique exploitant la puissance du chaos déterministe,
                    les S-Box dynamiques et le chiffrement affine pour une protection absolue.
                </motion.p>

                <motion.button
                    variants={itemVariants}
                    onClick={() => navigate('/upload')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:shadow-2xl hover:shadow-primary/25 transition-all"
                >
                    Commencer l'Expérience <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </section>

            {/* Stats Section */}
            <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                    { label: "Espace Clé", value: "2^299", sub: "Bits" },
                    { label: "Résistance NPCR", value: "99.6%", sub: "Différentielle" },
                    { label: "Entropie", value: "~8.0", sub: "Information" },
                    { label: "Corrélation", value: "0.00", sub: "Statistique" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl text-center border-t-2 border-primary/50">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                        <div className="text-sm font-semibold text-primary mb-1">{stat.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</div>
                    </div>
                ))}
            </motion.section>

            {/* Objectives / Features */}
            <section className="max-w-6xl mx-auto px-4">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Architecture de Sécurité</motion.h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <Shield className="text-accent mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Triple Chaos</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Utilisation simultanée des cartes Logistique, Tente et PWLCM pour générer des séquences pseudo-aléatoires imprévisibles et complexes.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <Lock className="text-primary mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">S-Box Dynamique</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Génération d'une table de substitution unique pour chaque image basée sur la clé chaotique, rendant les attaques par dictionnaire impossibles.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart2 size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <BarChart2 className="text-success mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Analyse Complète</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calcul automatique de plus de 30 métriques et génération de graphiques haute résolution, exportables instantanément pour vos rapports.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Team Preview */}
            <motion.section variants={itemVariants} className="text-center pt-10">
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium uppercase tracking-widest text-xs">Réalisé avec passion par</p>
                <div className="flex justify-center gap-6">
                    {['Hicham Moussaid', 'Ahmed Bouba', 'Mohamed Khalidi'].map((name) => (
                        <span key={name} className="px-6 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                            {name}
                        </span>
                    ))}
                </div>
            </motion.section>
        </motion.div>
    );
};

export default HomePage;
