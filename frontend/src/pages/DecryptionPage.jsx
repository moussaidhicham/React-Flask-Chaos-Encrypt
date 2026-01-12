import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Unlock, FileUp, Database, CheckCircle2, Key, Image as ImageIcon, Download } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-primary/20 text-blue-700 dark:text-primary px-6 py-2 rounded-full border border-blue-200 dark:border-primary/30">
                    <Unlock size={20} />
                    <span className="font-semibold">Déchiffrement Symétrique</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Restaurer l'Image Originale
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Utilisez exactement les mêmes paramètres que lors du chiffrement pour récupérer l'image originale pixel par pixel.
                </p>
            </div>

            {/* Mode Selection */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setMode('session')}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${mode === 'session'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                            : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                        }`}
                >
                    <Database size={20} />
                    Session Actuelle
                </button>
                <button
                    onClick={() => setMode('upload')}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${mode === 'upload'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                            : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                        }`}
                >
                    <FileUp size={20} />
                    Fichier Externe
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Configuration */}
                <div className="space-y-6">
                    {/* Image Source */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ImageIcon className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Image Source</h2>
                        </div>

                        {mode === 'upload' ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Sélectionnez l'image chiffrée à déchiffrer
                                </p>
                                <FileUpload onFileSelect={setFile} />
                                {file && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-500/30">
                                        <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">{file.name}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 text-center">
                                <Database className="mx-auto mb-3 text-primary" size={32} />
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    Utilisation de l'image chiffrée de la session active
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    L'image générée lors du dernier chiffrement
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Decryption Key */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-accent/10">
                                <Key className="text-accent" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Clé de Déchiffrement</h2>
                        </div>

                        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>⚠️ Important :</strong> Les paramètres doivent être <strong>exactement identiques</strong> à ceux utilisés lors du chiffrement.
                            </p>
                        </div>

                        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            <ChaosParameters params={params} setParams={setParams} />
                        </div>
                    </div>

                    {/* Decrypt Button */}
                    <button
                        onClick={handleDecrypt}
                        disabled={loading || (mode === 'upload' && !file)}
                        className="w-full bg-success hover:bg-success/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all shadow-xl shadow-success/20 hover:shadow-2xl hover:scale-[1.02] disabled:shadow-none disabled:scale-100"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                Déchiffrement en cours...
                            </>
                        ) : (
                            <>
                                <Unlock size={24} />
                                Lancer le Déchiffrement
                            </>
                        )}
                    </button>
                </div>

                {/* Right Column: Result */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Résultat</h2>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <HackingLoader messages={[
                                    "Initialisation du déchiffrement...",
                                    "Inversion de la Matrice S-Box...",
                                    "Calcul de l'inverse modulaire BL...",
                                    "Restauration de la diffusion CBC...",
                                    "Reconstruction de l'image originale..."
                                ]} />
                            </div>
                        ) : decryptedUrl ? (
                            <div className="space-y-6 animate-in zoom-in duration-500">
                                {/* Success Message */}
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                                        <h3 className="font-bold text-green-700 dark:text-green-300">Déchiffrement Réussi !</h3>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        L'image originale a été restaurée avec succès. Récupération à 100%.
                                    </p>
                                </div>

                                {/* Image Comparison */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                                        Comparaison Interactive
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-dark-bg/50 rounded-xl p-2">
                                        <ImageCompare
                                            leftImage={mode === 'upload' && file ? URL.createObjectURL(file) : 'http://localhost:5000/static/encrypted.png'}
                                            rightImage={`http://localhost:5000${decryptedUrl}?t=${Date.now()}`}
                                            leftLabel="Chiffrée"
                                            rightLabel="Restaurée"
                                        />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                                        Glissez le curseur pour comparer
                                    </p>
                                </div>

                                {/* Download Button */}
                                <a
                                    href={`http://localhost:5000${decryptedUrl}`}
                                    download="decrypted_image.png"
                                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Download size={20} />
                                    Télécharger l'Image Originale
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                <Unlock className="text-gray-400 dark:text-gray-600 mb-4" size={48} />
                                <p className="text-gray-500 dark:text-gray-500 font-medium">L'image déchiffrée apparaîtra ici</p>
                                <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
                                    Configurez les paramètres et lancez le déchiffrement
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    {!decryptedUrl && !loading && (
                        <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-500/30">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="text-2xl">🔐</span>
                                Sécurité Cryptographique
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Algorithme symétrique : même clé pour chiffrer et déchiffrer</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Sensibilité extrême : différence de 10⁻¹⁵ = échec total</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Récupération parfaite : 100% des pixels restaurés</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DecryptionPage;
