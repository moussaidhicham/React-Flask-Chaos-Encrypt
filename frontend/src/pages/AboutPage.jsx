import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    À Propos de l'Algorithme
                </h2>
                <p className="text-gray-400">
                    Détails mathématiques et cryptographiques du système.
                </p>
            </div>

            <section className="glass-card p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-bold text-white border-l-4 border-primary pl-4">1. Génération de Clés Chaotiques</h3>
                <p className="text-gray-300">
                    Trois cartes chaotiques sont utilisées pour générer les séquences pseudo-aléatoires nécessaires à la confusion et la diffusion.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-dark-bg/50 p-6 rounded-xl">
                        <h4 className="font-bold text-blue-400 mb-4">Carte Logistique</h4>
                        <BlockMath math="X_{n+1} = \mu \cdot X_n \cdot (1 - X_n)" />
                        <p className="text-sm text-gray-500 mt-2">Avec <InlineMath math="\mu \in [3.57, 4]" />.</p>
                    </div>

                    <div className="bg-dark-bg/50 p-6 rounded-xl">
                        <h4 className="font-bold text-green-400 mb-4">Carte Tente</h4>
                        <BlockMath math="X_{n+1} = \begin{cases} r \cdot X_n & X_n < 0.5 \\ r \cdot (1 - X_n) & X_n \ge 0.5 \end{cases}" />
                    </div>
                </div>

                <div className="bg-dark-bg/50 p-6 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-4">Carte PWLCM</h4>
                    <BlockMath math="X_{n+1} = \begin{cases} X_n / p & 0 \le X_n < p \\ (X_n - p) / (0.5 - p) & p \le X_n < 0.5 \\ f(1 - X_n, p) & 0.5 \le X_n < 1 \end{cases}" />
                </div>
            </section>

            <section className="glass-card p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-bold text-white border-l-4 border-accent pl-4">2. Processus de Chiffrement</h3>

                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-200">Vecteur de Contrôle</h4>
                    <p className="text-gray-400">
                        Un vecteur <InlineMath math="C" /> détermine dynamiquement l'opération à appliquer pour chaque pixel :
                    </p>
                    <BlockMath math="C[i] = (AL[i] + BL[i] + CL[i]) \pmod 2" />

                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Si <InlineMath math="C[i] = 0" /> : Substitution par <strong>S-Box</strong> dynamique.</li>
                        <li>Si <InlineMath math="C[i] = 1" /> : <strong>Chiffrement Affine</strong>.</li>
                    </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Formule Globale</h4>
                    <BlockMath math="X'[i] = \begin{cases} S[AL[i]][X[i]] & \text{si } C[i]=0 \\ (BL[i] \cdot X[i] + CL[i]) \pmod{256} & \text{si } C[i]=1 \end{cases}" />
                </div>
            </section>

            <section className="glass-card p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4">3. Processus de Déchiffrement</h3>
                <p className="text-gray-300">
                    Le déchiffrement applique les opérations inverses dans l'ordre inverse, garantissant la restauration bit à bit de l'image originale.
                </p>

                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-200">Opérations Inverses</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li><strong>Inverse Affine</strong> : Utilise l'inverse modulaire de <InlineMath math="BL[i]" />.</li>
                        <li><strong>Inverse S-Box</strong> : Utilise la S-Box inversée <InlineMath math="S^{-1}" />.</li>
                        <li><strong>Inverse Diffusion</strong> : XOR inverse avec décalage pour annuler l'effet d'avalanche.</li>
                    </ul>
                    <BlockMath math="X[i] = \begin{cases} S^{-1}[AL[i]][X'[i]] & \text{si } C[i]=0 \\ (X'[i] - CL[i]) \cdot BL[i]^{-1} \pmod{256} & \text{si } C[i]=1 \end{cases}" />
                </div>
            </section>

            <section className="glass-card p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-bold text-white border-l-4 border-success pl-4">4. Analyse de Sécurité</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">2<sup>299</sup></div>
                        <div className="text-sm text-gray-400 uppercase tracking-widest">Espace Clé</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">~8.0</div>
                        <div className="text-sm text-gray-400 uppercase tracking-widest">Entropie (bits)</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">&gt;99.6%</div>
                        <div className="text-sm text-gray-400 uppercase tracking-widest">NPCR</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
