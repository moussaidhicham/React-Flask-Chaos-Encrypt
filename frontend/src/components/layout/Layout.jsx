import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, Settings, Lock, Unlock, BarChart, Users, Info, Menu, X, Sun, Moon } from 'lucide-react';
import logo from '../../assets/logo.png';
import ParticleBackground from './ParticleBackground';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { to: "/", icon: <Home size={18} />, label: "Accueil" },
        { to: "/upload", icon: <Upload size={18} />, label: "Upload" },
        { to: "/parameters", icon: <Settings size={18} />, label: "Paramètres" },
        { to: "/encryption", icon: <Lock size={18} />, label: "Chiffrement" },
        { to: "/decryption", icon: <Unlock size={18} />, label: "Déchiffrement" },
        { to: "/analysis", icon: <BarChart size={18} />, label: "Analyses" },
        { to: "/team", icon: <Users size={18} />, label: "Équipe" },
        { to: "/about", icon: <Info size={18} />, label: "À Propos" },
    ];

    return (
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-text-primary font-sans selection:bg-accent selection:text-white relative z-0">
            <ParticleBackground />
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="ChaosCrypt" className="w-10 h-10 object-cover rounded-full shadow-sm border border-white/10" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            ChaosCrypt
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                {link.icon} {link.label}
                            </NavLink>
                        ))}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-white/10 animate-in slide-in-from-top-2">
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => `block px-4 py-3 rounded-lg flex items-center gap-3 text-base font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                >
                                    {link.icon} {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 container mx-auto px-4 min-h-[calc(100vh-80px)]">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-dark-surface mt-auto py-8 transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 dark:text-gray-500 mb-2">Projet Mini-Projet - Master ENS Meknès</p>
                    <div className="flex justify-center gap-4 text-sm font-semibold text-gray-500 dark:text-gray-300">
                        <span>Hicham Moussaid</span>
                        <span className="text-primary">•</span>
                        <span>Ahmed Bouba</span>
                        <span className="text-primary">•</span>
                        <span>Mohamed Khalidi</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
