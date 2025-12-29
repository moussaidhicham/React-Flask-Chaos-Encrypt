import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertTriangle, Download, BarChart3, Unlock, Clock, Image as ImageIcon, Sparkles } from 'lucide-react';
import HackingLoader from '../components/ui/HackingLoader';
import ProcessLog from '../components/ui/ProcessLog';

const EncryptionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        const startEncryption = async () => {
            // Case 1: New Encryption Requested (via Parameters Page)
            if (location.state?.file && location.state?.params) {
                try {
                    const formData = new FormData();
                    formData.append('image', location.state.file);
                    const params = location.state.params;
                    Object.keys(params).forEach(key => formData.append(key, params[key]));

                    const response = await axios.post('http://localhost:5000/api/encrypt', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    if (active) {
                        setResult(response.data);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error(err);
                    if (active) {
                        setError("Erreur lors du chiffrement. Vérifiez le backend.");
                        setLoading(false);
                    }
                }
            }
            // Case 2: Page Refresh (Try to recover last session)
            else {
                try {
                    const response = await axios.get('http://localhost:5000/api/result');
                    if (active) {
                        if (response.data && response.data.status === 'success') {
                            setResult(response.data);
                            setLoading(false);
                        } else {
                            navigate('/upload');
                        }
                    }
                } catch (err) {
                    // No session found, redirect to upload
                    if (active) {
                        navigate('/upload');
                    }
                }
            }
        };

        startEncryption();

        return () => { active = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <HackingLoader messages={[
                    "Initialisation des vecteurs chaotiques...",
                    "Génération des P-Box & S-Box dynamiques...",
                    "Injection de la condition initiale sensible...",
                    "Exécution des itérations de diffusion...",
                    "Application de la transformation affine..."
                ]} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500 space-y-4">
                <AlertTriangle size={64} />
                <h2 className="text-2xl font-bold">{error}</h2>
                <button onClick={() => navigate('/upload')} className="bg-gray-200 dark:bg-white/10 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold">
                    Réessayer
                </button>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-orange-500 space-y-4">
                <AlertTriangle size={64} />
                <h2 className="text-2xl font-bold">État invalide ou session perdue</h2>
                <button onClick={() => navigate('/upload')} className="bg-gray-200 dark:bg-white/10 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold">
                    Recommencer
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Success Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-success/20 text-green-700 dark:text-success px-6 py-2 rounded-full border border-green-200 dark:border-success/30">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Chiffrement Réussi</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Image Chiffrée avec Succès
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Votre image a été chiffrée en utilisant trois cartes chaotiques et une S-Box dynamique.
                    L'image résultante est cryptographiquement sécurisée.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Clock className="text-primary" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Temps d'exécution</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.time.toFixed(3)}s</p>
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-accent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Sparkles className="text-accent" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Cartes Chaotiques</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">3 Maps</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Logistic, Tent, PWLCM</p>
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-success">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-success/10">
                            <ImageIcon className="text-success" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">S-Box Générée</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">256×256</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Table de substitution</p>
                </div>
            </div>

            {/* Main Content - Image and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Encrypted Image - Takes 3 columns */}
                <div className="lg:col-span-3">
                    <div className="glass-card p-6 rounded-2xl h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Image Chiffrée</h2>
                            <a
                                href={`http://localhost:5000${result.encrypted_url}`}
                                download="encrypted_image.png"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-colors"
                            >
                                <Download size={18} />
                                Télécharger
                            </a>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-bg/50 rounded-xl p-4 flex items-center justify-center">
                            <img
                                src={`http://localhost:5000${result.encrypted_url}?t=${Date.now()}`}
                                alt="Encrypted"
                                className="rounded-lg shadow-xl max-h-[500px] object-contain"
                            />
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Note :</strong> L'image chiffrée ressemble à du bruit blanc aléatoire.
                                Aucune information visuelle de l'image originale n'est récupérable sans la clé correcte.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions Panel - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/analysis')}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                <BarChart3 size={24} />
                                Analyse Cryptographique
                            </button>

                            <button
                                onClick={() => navigate('/decryption')}
                                className="w-full bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-white/5 border-2 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
                            >
                                <Unlock size={24} />
                                Tester le Déchiffrement
                            </button>

                            <button
                                onClick={() => navigate('/upload')}
                                className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 py-3 rounded-xl font-medium transition-all"
                            >
                                Nouvelle Image
                            </button>
                        </div>
                    </div>

                    {/* Generated Reports */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rapports Générés</h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Trajectoires chaotiques</strong> : 3 graphiques (u, v, w)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Heatmap S-Box</strong> : Visualisation 256×256</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Métriques</strong> : Disponibles dans l'analyse</span>
                            </li>
                        </ul>
                    </div>

                    {/* Info Card */}
                    <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">💡 Prochaine Étape</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Consultez l'analyse cryptographique pour voir les histogrammes, matrices de corrélation,
                            et métriques de sécurité (Entropie, NPCR, UACI).
                        </p>
                    </div>
                </div>
            </div>

            {/* Process Log */}
            <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Journal du Processus</h2>
                <ProcessLog logs={result.process_log} />
            </div>
        </div>
    );
};

export default EncryptionPage;
