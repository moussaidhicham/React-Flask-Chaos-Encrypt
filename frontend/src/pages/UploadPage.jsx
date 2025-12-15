import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/upload/FileUpload';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const UploadPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const handleNext = () => {
        if (file) {
            // In a real app we might upload here or pass file via context
            // For this demo, we'll pass file to next step or assume context
            // We'll use a simple global state approach or just pass via navigation state if small
            // But we need to keep it simple. Let's assume we pass it to parameters page state
            // Or better, upload to backend temp immediately? 
            // The Encryption endpoint takes the file. So we need to keep it in frontend state.
            // Let's use localStorage for simplicity or pass via route state.
            // Route state is better for files? No, files can't be in route state easily.
            // We will use a context provider in App.jsx later?
            // For now, let's just make the flow work visually.
            // Actually, we can just keep the file in memory in a Global Context.

            // To avoid complex Context setup in this single-file generation flow, 
            // I will implement a quick context here and wrapping App.
            navigate('/parameters', { state: { file: file } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Charger une Image
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    Sélectionnez l'image que vous souhaitez chiffrer. Elle sera traitée localement avant d'être envoyée au serveur sécurisé.
                </p>
            </div>

            <FileUpload onFileSelect={setFile} />

            {file && (
                <button
                    onClick={handleNext}
                    className="group bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 hover:gap-4 shadow-lg shadow-primary/25"
                >
                    Continuer vers Paramètres <ArrowRight size={20} />
                </button>
            )}
        </div>
    );
};

export default UploadPage;
