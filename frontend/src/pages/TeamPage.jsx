import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

// Import assets (You can add your photos to src/assets/)
import hichamImg from '../assets/hicham.jpg';
import ahmedImg from '../assets/H2.jpeg';
import mohamedImg from '../assets/H3.jpeg';

const TeamMember = ({ name, role, image }) => (
    <div className="glass-card p-8 rounded-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300 group">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent p-1 mb-6 shadow-lg shadow-primary/20 relative overflow-hidden">
            {image ? (
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full rounded-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
            ) : null}
            <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                {name[0]}
            </div>
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <p className="text-primary font-bold mb-6 uppercase tracking-wider text-xs">{role}</p>

        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:text-primary text-gray-500 dark:text-gray-400 transition-colors"><Github size={20} /></button>
            <button className="p-2 hover:text-blue-500 text-gray-500 dark:text-gray-400 transition-colors"><Linkedin size={20} /></button>
            <button className="p-2 hover:text-red-500 text-gray-500 dark:text-gray-400 transition-colors"><Mail size={20} /></button>
        </div>
    </div>
);

const TeamPage = () => {
    return (
        <div className="container mx-auto py-12 text-center animate-in fade-in duration-700">
            <div className="mb-16">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
                    L'Équipe du Projet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                    Étudiants du Master ENS Meknès passionnés par la cryptographie et le développement logiciel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <TeamMember name="Hicham Moussaid" role="Développement Frontend" image={hichamImg} />
                <TeamMember name="Ahmed Bouba" role="Cryptographie & Backend" image={ahmedImg} />
                <TeamMember name="Mohamed Khalidi" role="Analyse & Tests" image={mohamedImg} />
            </div>
        </div>
    );
};

export default TeamPage;
