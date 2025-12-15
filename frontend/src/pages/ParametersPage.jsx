import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChaosParameters from '../components/parameters/ChaosParameters';
import { ArrowRight, Play } from 'lucide-react';
import axios from 'axios';

const ParametersPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const file = location.state?.file;

    // Default parameters
    const [params, setParams] = useState({
        log_x0: 0.1, log_mu: 3.99,
        tent_x0: 0.2, tent_r: 1.99,
        pwlcm_x0: 0.3, pwlcm_p: 0.254
    });

    const handleEncrypt = async () => {
        if (!file) {
            alert("Aucune image sélectionnée !");
            navigate('/upload');
            return;
        }

        try {
            // Navigate immediately to Encryption Page to show loading state
            // Passing file and params directly, NOT FormData (which is not serializable in history)
            navigate('/encryption', { state: { file: file, params: params } });
        } catch (error) {
            console.error("Erreur navigation", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">
                    Configuration des Cartes Chaotiques
                </h2>
                <p className="text-gray-400">
                    Ajustez les conditions initiales et les paramètres de contrôle pour générer la clé.
                </p>
            </div>

            <ChaosParameters params={params} setParams={setParams} />

            <div className="flex justify-center mt-8">
                <button
                    onClick={handleEncrypt}
                    className="group bg-gradient-to-r from-accent to-purple-600 hover:scale-105 text-white px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 shadow-xl shadow-accent/20"
                >
                    <Play fill="currentColor" size={20} /> Lancer le Chiffrement
                </button>
            </div>
        </div>
    );
};

export default ParametersPage;
