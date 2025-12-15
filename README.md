[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# ChaosCrypt - Application de Chiffrement d'Images Chaotique

Application web full-stack professionnelle pour le chiffrement d'images utilisant une combinaison de cartes chaotiques (Logistique, Tente, PWLCM), permutation S-Box dynamique et chiffrement affine.

Dévéloppée par : **Hicham, Ahmed, Mohamed**.

## 🚀 Installation & Démarrage

### Pré-requis
- Python 3.10+
- Node.js 16+

### 1. Backend (Flask)

Le backend gère la cryptographie et la génération de graphes (Matplotlib).

```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Le serveur démarrera sur http://localhost:5000*

### 2. Frontend (React)

L'interface utilisateur moderne avec Tailwind CSS.

```bash
cd frontend
npm install
npm run dev
```
*L'interface sera accessible sur http://localhost:5173*

## 🌟 Fonctionnalités Clés

- **Chiffrement Hybride Robuste** : Combinaison de cartes Logistique, Tente et PWLCM avec Substitution-Diffusion (S-Box dynamique + Chiffrement Affine).
- **Interface Moderne & Responsive** : Thème Clair/Sombre, Menu Hamburger, compatible mobile et desktop.
- **Support Multi-Formats** : Compatible avec **PNG, JPG, BMP, TIFF**.
- **Déchiffrement Avancé** : Prise en charge du déchiffrement de session instantané ou par **upload de fichier externe** avec saisie de clé.
- **Analyse Cryptographique** :
  - **Sécurité Maximale** : Espace clé > $2^{299}$ bits.
  - **Résistance aux Attaques** : Corrélation $\approx 0$, Entropie $\approx 8$ bits, NPCR $\approx 99.6\%$.
- **Export Automatique** : Tous les graphes d'analyse sont téléchargeables en ZIP pour vos rapports.

## 📂 Structure des Exports

Les fichiers graphiques générés se trouvent dans `backend/static/exports/` :
- `/chaotic_maps` : Comportement des 3 cartes.
- `/sbox` : Visualisation de la table de substitution.
- `/histograms` : 6 histogrammes (RGB Original vs Chiffré).
- `/correlation` : 18 scatter plots (H/V/D pour chaque canal).
- `/metrics` : Comparaisons Entropie et NPCR/UACI.

## 🛠️ Stack Technique

- **Backend** : Flask, NumPy (Calcul vectoriel), Matplotlib (Graphes).
- **Frontend** : React, Vite, TailwindCSS, Framer Motion.
## Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` à la racine pour le texte complet de la licence.

