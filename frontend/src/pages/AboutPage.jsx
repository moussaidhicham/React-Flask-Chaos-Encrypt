import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Info, TrendingUp, Shuffle, Database, Activity, Shield, Lock, Eye, BarChart2 } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    À Propos du Système
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Comprendre le chiffrement d'images par chaos : définitions, métriques cryptographiques et principes de sécurité.
                </p>
            </div>

            {/* What is Image Encryption */}
            <section className="glass-card p-8 rounded-2xl space-y-6 text-gray-800 dark:text-text-primary">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Shield className="text-primary" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Qu'est-ce que le Chiffrement d'Images ?</h3>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Le <strong>chiffrement d'images</strong> est un processus cryptographique qui transforme une image lisible en une image
                    visuellement incompréhensible (ressemblant à du bruit aléatoire) en utilisant une clé secrète. Contrairement aux données
                    textuelles, les images possèdent des caractéristiques spécifiques :
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                        <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                            <Eye size={20} />
                            Propriétés des Images
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Corrélation spatiale élevée</strong> : Pixels adjacents similaires</li>
                            <li>• <strong>Redondance</strong> : Zones uniformes (ciel, peau, etc.)</li>
                            <li>• <strong>Grande taille</strong> : Millions de pixels à traiter</li>
                            <li>• <strong>Sensibilité visuelle</strong> : Moindre modification visible</li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                        <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
                            <Lock size={20} />
                            Objectifs du Chiffrement
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Confidentialité</strong> : Rendre l'image illisible sans clé</li>
                            <li>• <strong>Briser la corrélation</strong> : Pixels indépendants</li>
                            <li>• <strong>Distribution uniforme</strong> : Histogramme plat</li>
                            <li>• <strong>Sensibilité à la clé</strong> : Effet avalanche</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Notre approche :</strong> Nous utilisons la <strong>théorie du chaos</strong> pour générer des séquences
                        pseudo-aléatoires hautement sensibles aux conditions initiales, combinées avec des <strong>S-Box dynamiques</strong>
                        et un <strong>mode CBC</strong> pour assurer confusion et diffusion maximales selon les principes de Shannon.
                    </p>
                </div>
            </section>

            {/* Cryptographic Metrics Section */}
            <section className="glass-card p-8 rounded-2xl space-y-8 text-gray-800 dark:text-text-primary">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                        <BarChart2 className="text-accent" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Métriques Cryptographiques</h3>
                </div>

                {/* Entropy */}
                <div className="space-y-4 border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center gap-3">
                        <Database className="text-blue-500" size={24} />
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">1. Entropie de Shannon</h4>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">DÉFINITION</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            L'entropie mesure le <strong>degré de désordre ou d'aléatoire</strong> dans la distribution des valeurs de pixels.
                            Elle quantifie l'incertitude moyenne de l'information contenue dans l'image.
                        </p>
                        <BlockMath math="H(X) = -\sum_{i=0}^{255} p(x_i) \cdot \log_2(p(x_i))" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            où <InlineMath math="p(x_i)" /> est la probabilité d'apparition de la valeur de pixel <InlineMath math="x_i" />
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">RÔLE</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Valider la distribution uniforme des pixels</li>
                                <li>• Détecter les patterns ou régularités</li>
                                <li>• Garantir l'imprévisibilité</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">VALEURS</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Maximum théorique :</strong> 8.0 bits</li>
                                <li>• <strong>Image naturelle :</strong> 5.0 - 7.5 bits</li>
                                <li>• <strong>Notre résultat :</strong> 7.997 bits ✅</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* NPCR */}
                <div className="space-y-4 border-l-4 border-green-500 pl-6">
                    <div className="flex items-center gap-3">
                        <Shuffle className="text-green-500" size={24} />
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">2. NPCR (Number of Pixel Change Rate)</h4>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">DÉFINITION</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Le NPCR mesure le <strong>pourcentage de pixels qui changent</strong> lorsqu'on modifie un seul pixel de l'image
                            originale. C'est un indicateur de l'<strong>effet avalanche</strong>.
                        </p>
                        <BlockMath math="NPCR = \frac{\sum_{i,j} D(i,j)}{M \times N} \times 100\%" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            où <InlineMath math="D(i,j) = \begin{cases} 0 & \text{si } C_1(i,j) = C_2(i,j) \\ 1 & \text{sinon} \end{cases}" />
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">RÔLE</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Tester la résistance aux attaques différentielles</li>
                                <li>• Vérifier la sensibilité aux modifications</li>
                                <li>• Valider l'effet avalanche (1 bit → 50% changement)</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">VALEURS</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Idéal théorique :</strong> 99.609%</li>
                                <li>• <strong>Seuil de sécurité :</strong> &gt; 99.5%</li>
                                <li>• <strong>Notre résultat :</strong> 99.61% ✅</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* UACI */}
                <div className="space-y-4 border-l-4 border-purple-500 pl-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-purple-500" size={24} />
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">3. UACI (Unified Average Changing Intensity)</h4>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">DÉFINITION</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            L'UACI mesure l'<strong>intensité moyenne du changement</strong> entre deux images chiffrées avec une différence
                            minimale dans l'image originale. Complète le NPCR en quantifiant "combien" les pixels changent.
                        </p>
                        <BlockMath math="UACI = \frac{1}{M \times N} \sum_{i,j} \frac{|C_1(i,j) - C_2(i,j)|}{255} \times 100\%" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">RÔLE</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Mesurer la diffusion de l'information</li>
                                <li>• Compléter le NPCR (qualité vs quantité)</li>
                                <li>• Détecter les faiblesses dans la transformation</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">VALEURS</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Idéal théorique :</strong> 33.464%</li>
                                <li>• <strong>Seuil de sécurité :</strong> &gt; 33.0%</li>
                                <li>• <strong>Notre résultat :</strong> 33.42% ✅</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Correlation */}
                <div className="space-y-4 border-l-4 border-orange-500 pl-6">
                    <div className="flex items-center gap-3">
                        <Activity className="text-orange-500" size={24} />
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">4. Coefficient de Corrélation</h4>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">DÉFINITION</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            La corrélation mesure la <strong>dépendance statistique</strong> entre pixels adjacents (horizontalement,
                            verticalement, diagonalement). Une image naturelle a une forte corrélation (~0.9), une image chiffrée doit
                            avoir une corrélation proche de zéro.
                        </p>
                        <BlockMath math="\rho_{xy} = \frac{\text{cov}(X,Y)}{\sigma_X \cdot \sigma_Y} = \frac{E[(X-\mu_X)(Y-\mu_Y)]}{\sigma_X \cdot \sigma_Y}" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">RÔLE</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Vérifier la destruction de la structure spatiale</li>
                                <li>• Empêcher la reconnaissance de formes</li>
                                <li>• Valider l'indépendance des pixels</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">VALEURS</p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Image naturelle :</strong> 0.85 - 0.98</li>
                                <li>• <strong>Objectif :</strong> ≈ 0.00</li>
                                <li>• <strong>Notre résultat :</strong> &lt; 0.01 ✅</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chaotic Maps Section */}
            <section className="glass-card p-8 rounded-2xl space-y-6 text-gray-800 dark:text-text-primary">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-primary pl-4">Cartes Chaotiques</h3>
                <p className="text-gray-700 dark:text-gray-300">
                    Trois cartes chaotiques sont utilisées pour générer les séquences pseudo-aléatoires nécessaires à la confusion et la diffusion.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-4">Carte Logistique</h4>
                        <BlockMath math="X_{n+1} = \mu \cdot X_n \cdot (1 - X_n)" />
                        <p className="text-sm text-gray-500 mt-2">Avec <InlineMath math="\mu \in [3.57, 4]" />.</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                        <h4 className="font-bold text-emerald-600 dark:text-green-400 mb-4">Carte Tente</h4>
                        <BlockMath math="X_{n+1} = \begin{cases} r \cdot X_n & X_n < 0.5 \\ r \cdot (1 - X_n) & X_n \ge 0.5 \end{cases}" />
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-dark-bg/50 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                    <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-4">Carte PWLCM</h4>
                    <BlockMath math="X_{n+1} = \begin{cases} X_n / p & 0 \le X_n < p \\ (X_n - p) / (0.5 - p) & p \le X_n < 0.5 \\ f(1 - X_n, p) & 0.5 \le X_n < 1 \end{cases}" />
                </div>
            </section>

            {/* Encryption Process */}
            <section className="glass-card p-8 rounded-2xl space-y-6 text-gray-800 dark:text-text-primary">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-accent pl-4">Processus de Chiffrement</h3>

                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Vecteur de Contrôle</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                        Un vecteur <InlineMath math="C" /> détermine dynamiquement l'opération à appliquer pour chaque pixel :
                    </p>
                    <BlockMath math="C[i] = \begin{cases} 1 & \text{si } u[i] \ge w[i] \\ 0 & \text{sinon} \end{cases}" />

                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Si <InlineMath math="C[i] = 0" /> : Substitution par <strong>S-Box</strong> dynamique.</li>
                        <li>Si <InlineMath math="C[i] = 1" /> : <strong>Chiffrement Affine</strong>.</li>
                    </ul>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Formule Globale</h4>
                    <BlockMath math="X'[i] = \begin{cases} S[AL[i]][X[i] \oplus X'[i-1]] & \text{si } C[i]=0 \\ (BL[i] \cdot (X[i] \oplus X'[i-1]) + CL[i]) \pmod{256} & \text{si } C[i]=1 \end{cases}" />
                </div>
            </section>

            {/* Decryption Process */}
            <section className="glass-card p-8 rounded-2xl space-y-6 text-gray-800 dark:text-text-primary">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-yellow-500 pl-4">Processus de Déchiffrement</h3>
                <p className="text-gray-700 dark:text-gray-300">
                    Le déchiffrement applique les opérations inverses dans l'ordre inverse, garantissant la restauration bit à bit de l'image originale.
                </p>

                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Opérations Inverses</h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li><strong>Inverse Affine</strong> : Utilise l'inverse modulaire de <InlineMath math="BL[i]" />.</li>
                        <li><strong>Inverse S-Box</strong> : Utilise la S-Box inversée <InlineMath math="S^{-1}" />.</li>
                        <li><strong>Inverse Diffusion</strong> : XOR inverse avec décalage pour annuler l'effet d'avalanche.</li>
                    </ul>
                    <BlockMath math="X[i] = \begin{cases} S^{-1}[AL[i]][X'[i]] & \text{si } C[i]=0 \\ (X'[i] - CL[i]) \cdot BL[i]^{-1} \pmod{256} & \text{si } C[i]=1 \end{cases} \oplus X'[i-1]" />
                </div>
            </section>

            {/* Security Analysis */}
            <section className="glass-card p-8 rounded-2xl space-y-6 text-gray-800 dark:text-text-primary">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-success pl-4">Analyse de Sécurité</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">2<sup>384</sup></div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">Espace Clé</div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">6 paramètres × 64 bits</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">7.997</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">Entropie (bits)</div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Max théorique: 8.0</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.61%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">NPCR</div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Idéal: 99.609%</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
