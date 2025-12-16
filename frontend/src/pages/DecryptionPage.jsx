
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Unlock, FileUp, Database, ArrowRight } from 'lucide-react';
import FileUpload from '../components/upload/FileUpload';
import ChaosParameters from '../components/parameters/ChaosParameters';
import HackingLoader from '../components/ui/HackingLoader';
import ImageCompare from '../components/ui/ImageCompare';

const DecryptionPage = () => {
    const [mode, setMode] = useState('session'); // 'session' or 'upload'
    const [file, setFile] = useState(null);
    const [decryptedUrl, setDecryptedUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Default parameters (same as ParametersPage defaults)
    const [params, setParams] = useState({
        log_x0: 0.1, log_mu: 3.99,
        tent_x0: 0.2, tent_r: 1.99,
        pwlcm_x0: 0.3, pwlcm_p: 0.254
    });

    // Load session params if available
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/result');
                if (response.data && response.data.params) {
                    setParams(response.data.params);
                }
            } catch (err) {
                // No session or error, keep defaults
                console.log("No active session params found");
            }
        };
        if (mode === 'session') {
            fetchSession();
        }
    }, [mode]);

    const handleDecrypt = async () => {
        if (mode === 'upload' && !file) {
            alert("Veuillez sélectionner une image chiffrée.");
            return;
        }

        setLoading(true);
        setDecryptedUrl(null);

        try {
            const formData = new FormData();

            // If upload mode, append file
            if (mode === 'upload' && file) {
                formData.append('image', file);
            }

            // Append parameters (always needed for proper decryption)
            Object.keys(params).forEach(key => formData.append(key, params[key]));

            const response = await axios.post('http://localhost:5000/api/decrypt', formData, {
                headers: mode === 'upload' ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
            });

            if (response.data.decrypted_url) {
                setDecryptedUrl(response.data.decrypted_url);
            }
        } catch (error) {
            console.error("Decryption error", error);
            alert("Erreur lors du déchiffrement. Vérifiez la clé ou le fichier.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Déchiffrement</h2>
                <p className="text-gray-500 dark:text-gray-400">Restaurer l'image originale en utilisant la clé symétrique.</p>
            </div>

            {/* Mode Selection */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setMode('session')}
                    className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all ${mode === 'session' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-gray-200 dark:bg-dark-surface text-gray-600 dark:text-gray-400'}`}
                >
                    <Database size={18} /> Session Actuelle
                </button>
                <button
                    onClick={() => setMode('upload')}
                    className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all ${mode === 'upload' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-gray-200 dark:bg-dark-surface text-gray-600 dark:text-gray-400'}`}
                >
                    <FileUp size={18} /> Fichier Externe
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Inputs */}
                <div className="space-y-8">
                    {mode === 'upload' && (
                        <div className="space-y-4 animate-in slide-in-from-left-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileUp className="text-primary" /> Image Chiffrée
                            </h3>
                            <FileUpload onFileSelect={setFile} />
                        </div>
                    )}

                    {mode === 'session' && (
                        <div className="glass-card p-6 rounded-xl border border-primary/20 bg-primary/5 text-center py-12">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Le système utilisera la dernière image chiffrée générée lors de cette session.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Unlock className="text-accent" /> Clé de Déchiffrement
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Assurez-vous d'utiliser exactement les mêmes paramètres que lors du chiffrement.
                        </p>
                        <div className="h-96 overflow-y-auto pr-2 custom-scrollbar"> {/* Scrollable params area */}
                            <ChaosParameters params={params} setParams={setParams} />
                        </div>
                    </div>

                    <button
                        onClick={handleDecrypt}
                        disabled={loading || (mode === 'upload' && !file)}
                        className="w-full bg-success hover:bg-success/90 text-white px-8 py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-xl shadow-success/20 hover:-translate-y-1"
                    >
                        {loading ? "Déchiffrement en cours..." : <><Unlock size={24} /> Lancer le Déchiffrement</>}
                    </button>
                </div>

                {/* Right Column: Result */}
                <div className="flex flex-col items-center justify-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 self-start flex items-center gap-2">
                        <ArrowRight className="text-gray-400" /> Résultat
                    </h3>

                    {loading ? (
                        <div className="glass-card p-10 rounded-xl w-full flex justify-center items-center">
                            <HackingLoader messages={[
                                "Initialisation du déchiffrement...",
                                "Inversion de la Matrice S-Box...",
                                "Calcul de l'inverse modulaire BL...",
                                "Restauration de la diffusion CBC...",
                                "Reconstruction de l'image originale..."
                            ]} />
                        </div>
                    ) : decryptedUrl ? (
                        <div className="w-full space-y-4 animate-in zoom-in duration-500">
                            {/* Compare Image */}
                            <div className="glass-card p-2 rounded-xl">
                                <h4 className="text-center text-sm mb-2 text-gray-500">Glissez pour comparer (Chiffrée vs Restaurée)</h4>
                                <ImageCompare
                                    leftImage={mode === 'upload' && file ? URL.createObjectURL(file) : 'http://localhost:5000/static/encrypted.png'}
                                    rightImage={`http://localhost:5000${decryptedUrl}?t=${Date.now()}`}
                                    leftLabel="Cryptée"
                                    rightLabel="Restaurée"
                                />
                            </div>

                            {/* Download */}
                            <div className="glass-card p-4 rounded-xl text-center">
                                <a
                                    href={`http://localhost:5000${decryptedUrl}`}
                                    download="decrypted_image.png"
                                    className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold underline cursor-pointer"
                                >
                                    💾 Télécharger l'image originale
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card w-full h-64 flex items-center justify-center rounded-xl border-dashed border-2 border-gray-700">
                            <p className="text-gray-500">L'image déchiffrée apparaîtra ici</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DecryptionPage;
