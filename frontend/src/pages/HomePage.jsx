import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, BarChart2, Zap, ArrowRight, Lock, TrendingUp, Eye, Shuffle, Database } from 'lucide-react';
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
                        Chiffrement d'Images
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-white">par Chaos</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4 leading-relaxed">
                    Application full-stack de chiffrement cryptographique exploitant trois cartes chaotiques (Logistique, Tente, PWLCM),
                    des S-Box dynamiques et un mode CBC pour une sécurité maximale des images.
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mb-10">
                    Confusion de Shannon • Diffusion globale • Sensibilité aux conditions initiales • Analyse cryptographique complète
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

            {/* Enhanced Stats Section with Descriptions */}
            <motion.section variants={itemVariants} className="max-w-6xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Métriques Cryptographiques</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: "Entropie de Shannon",
                            value: "7.997",
                            unit: "/ 8.0 bits",
                            icon: Database,
                            color: "text-blue-500",
                            description: "Mesure du caractère aléatoire. Proche de 8.0 = distribution parfaitement uniforme."
                        },
                        {
                            label: "NPCR",
                            value: "99.61%",
                            unit: "Idéal: 99.609%",
                            icon: Shuffle,
                            color: "text-green-500",
                            description: "Taux de changement de pixels. ~100% = effet avalanche optimal."
                        },
                        {
                            label: "UACI",
                            value: "33.42%",
                            unit: "Idéal: 33.464%",
                            icon: TrendingUp,
                            color: "text-purple-500",
                            description: "Intensité moyenne du changement. Proche de 33.5% = diffusion maximale."
                        },
                        {
                            label: "Corrélation",
                            value: "< 0.01",
                            unit: "Pixels adjacents",
                            icon: Activity,
                            color: "text-orange-500",
                            description: "Dépendance entre pixels. ≈0 = structure spatiale complètement brisée."
                        },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="glass-card p-6 rounded-2xl border-t-2 border-primary/50 hover:border-primary transition-all group"
                        >
                            <stat.icon className={`${stat.color} mb-3`} size={32} />
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                            <div className="text-sm font-semibold text-primary mb-2">{stat.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{stat.unit}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                                {stat.description}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* What We Built Section */}
            <motion.section variants={itemVariants} className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Ce que nous avons construit</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                    Une application complète de chiffrement d'images basée sur la théorie du chaos,
                    avec analyse cryptographique en temps réel et visualisations scientifiques.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Shield className="text-primary" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Algorithme de Chiffrement</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>3 cartes chaotiques</strong> : Logistique, Tente, PWLCM pour génération de clés</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>S-Box dynamique 256×256</strong> : Unique pour chaque clé</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Mode CBC</strong> : Diffusion séquentielle avec effet avalanche</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Transformation affine</strong> : Alternance avec S-Box via bit de contrôle</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Espace de clés 2³⁸⁴</strong> : 6 paramètres réels (64 bits chacun)</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-accent/10">
                                <BarChart2 className="text-accent" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analyse & Visualisation</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span><strong>Histogrammes RGB</strong> : Distribution des intensités de pixels</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span><strong>Matrices de corrélation</strong> : Horizontale, verticale, diagonale</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span><strong>Métriques NIST</strong> : Entropie, NPCR, UACI automatiques</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span><strong>Trajectoires chaotiques</strong> : Visualisation des séquences u, v, w</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span><strong>Export 31+ graphiques</strong> : Haute résolution pour rapports</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </motion.section>

            {/* Architecture Section */}
            <section className="max-w-6xl mx-auto px-4">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Architecture Technique</motion.h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <Shield className="text-accent mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Backend Python</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Flask + NumPy pour calculs cryptographiques optimisés. Architecture modulaire avec services spécialisés.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                            <div>• Services : Chaos, Encryption, Analysis</div>
                            <div>• Routes : REST API endpoints</div>
                            <div>• Models : Image processing</div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <Lock className="text-primary mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Frontend React</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Interface moderne avec React, Vite, TailwindCSS. Composants réutilisables et animations fluides.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                            <div>• Pages : Encryption, Analysis, About</div>
                            <div>• Components : Upload, Parameters, Charts</div>
                            <div>• UI : Framer Motion animations</div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart2 size={100} className="text-gray-900 dark:text-white" />
                        </div>
                        <BarChart2 className="text-success mb-6" size={40} />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Analyse Temps Réel</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Calcul automatique de métriques cryptographiques et génération de visualisations scientifiques.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                            <div>• Matplotlib : Graphiques haute qualité</div>
                            <div>• NumPy : Calculs statistiques</div>
                            <div>• Export : PNG haute résolution</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Preview */}
            <motion.section variants={itemVariants} className="text-center pt-10">
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium uppercase tracking-widest text-xs">Réalisé avec passion par</p>
                <div className="flex justify-center gap-6 flex-wrap">
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
