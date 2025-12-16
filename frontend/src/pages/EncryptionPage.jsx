import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertTriangle, FileText, Activity } from 'lucide-react';
import HackingLoader from '../components/ui/HackingLoader';

const EncryptionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
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

                    setResult(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setError("Erreur lors du chiffrement. Vérifiez le backend.");
                    setLoading(false);
                }
            }
            // Case 2: Page Refresh (Try to recover last session)
            else {
                try {
                    const response = await axios.get('http://localhost:5000/api/result');
                    if (response.data && response.data.status === 'success') {
                        setResult(response.data);
                        setLoading(false);
                    } else {
                        navigate('/upload');
                    }
                } catch (err) {
                    // No session found, redirect to upload
                    navigate('/upload');
                }
            }
        };

        startEncryption();
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
                <button onClick={() => navigate('/upload')} className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 text-white">
                    Réessayer
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-1.5 rounded-full mb-4">
                    <CheckCircle size={18} />
                    <span className="font-semibold">Chiffrement Terminé ({result.time.toFixed(3)}s)</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Résultat du Chiffrement</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Encrypted Image */}
                <div className="glass-card p-4 rounded-xl flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Image Chiffrée</h3>
                    <img
                        src={`http://localhost:5000${result.encrypted_url}?t=${Date.now()}`}
                        alt="Encrypted"
                        className="rounded-lg shadow-2xl max-h-[400px] object-contain border border-white/5"
                    />
                </div>

                {/* Quick Stats / Actions */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Activity size={20} className="text-accent" /> Rapports Générés
                        </h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>• Cartes Chaotiques (3 graphiques)</li>
                            <li>• Heatmap S-Box (256x256)</li>
                            <li>• Histogrammes & Corrélations (Calculés à l'étape Analyse)</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate('/analysis')}
                            className="bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
                        >
                            Voir Analyse Complète & Graphes 📊
                        </button>

                        <button
                            onClick={() => navigate('/decryption')}
                            className="bg-dark-surface hover:bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-medium transition-colors"
                        >
                            Tester le Déchiffrement 🔓
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EncryptionPage;
