import matplotlib
matplotlib.use('Agg') # Backend non-interactif
import matplotlib.pyplot as plt
import numpy as np
import os
from services.analysis_service import AnalysisService

class ExportService:
    def __init__(self, export_dir='static/exports'):
        # Ensure export directory is absolute to avoid relative path issues
        if not os.path.isabs(export_dir):
             # Get the directory where app.py is located (one level up from services/)
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            export_dir = os.path.join(base_dir, export_dir)
            
        self.export_dir = export_dir
        self.categories = ['histograms', 'correlation', 'chaotic_maps', 'sbox', 'metrics']
        self._ensure_directories()

    def _ensure_directories(self):
        for category in self.categories:
            os.makedirs(os.path.join(self.export_dir, category), exist_ok=True)

    def save_plot(self, fig, subdir, filename):
        """Sauvegarde une figure dans le sous-dossier spécifié."""
        path = os.path.join(self.export_dir, subdir, filename)
        fig.savefig(path, dpi=300, bbox_inches='tight')
        plt.close(fig)
        return f"/static/exports/{subdir}/{filename}"

    def generate_histograms(self, original_img, encrypted_img):
        """Génère et sauvegarde 6 histogrammes."""
        channels = ['Red', 'Green', 'Blue']
        colors = ['red', 'green', 'blue']
        
        paths = []
        
        # Original
        for i, color in enumerate(colors):
            fig, ax = plt.subplots(figsize=(6, 4))
            ax.hist(original_img[:,:,i].flatten(), bins=256, range=(0, 256), color=color, alpha=0.7)
            ax.set_title(f"Histogramme {channels[i]} (Original)")
            ax.set_xlabel("Valeur Pixel")
            ax.set_ylabel("Fréquence")
            paths.append(self.save_plot(fig, 'histograms', f'hist_orig_{color}.png'))

        # Encrypted
        for i, color in enumerate(colors):
            fig, ax = plt.subplots(figsize=(6, 4))
            ax.hist(encrypted_img[:,:,i].flatten(), bins=256, range=(0, 256), color=color, alpha=0.7)
            ax.set_title(f"Histogramme {channels[i]} (Chiffré)")
            ax.set_xlabel("Valeur Pixel")
            ax.set_ylabel("Fréquence")
            paths.append(self.save_plot(fig, 'histograms', f'hist_enc_{color}.png'))
            
        return paths

    def generate_correlation_plots(self, original_img, encrypted_img):
        """Génère et sauvegarde 18 scatter plots (9 orig + 9 enc)."""
        directions = ['Horizontal', 'Vertical', 'Diagonal']
        channels = ['Red', 'Green', 'Blue']
        colors = ['red', 'green', 'blue']
        
        paths = []
        
        # Helper internal function
        def plot_corr(img, prefix, title_suffix):
            for d in directions:
                for i, c in enumerate(channels):
                    val_x, val_y = AnalysisService.get_correlation_data(img, d, i)
                    
                    fig, ax = plt.subplots(figsize=(5, 5))
                    ax.scatter(val_x, val_y, s=1, c=colors[i])
                    ax.set_title(f"{c} {d} ({title_suffix})")
                    ax.set_xlabel("Pixel (x, y)")
                    ax.set_ylabel(f"Pixel voisin")
                    ax.set_xlim(0, 255)
                    ax.set_ylim(0, 255)
                    
                    filename = f"corr_{prefix}_{d.lower()}_{c.lower()}.png"
                    paths.append(self.save_plot(fig, 'correlation', filename))

        plot_corr(original_img, 'orig', 'Original')
        plot_corr(encrypted_img, 'enc', 'Chiffré')
        
        return paths

    def generate_chaotic_map_plots(self, u, v, w):
        """Génère les plots des 3 cartes chaotiques (1000 premières itérations)."""
        limit = 1000
        maps = [('Logistique', u, 'blue'), ('Tente', v, 'green'), ('PWLCM', w, 'purple')]
        paths = []
        
        for name, data, color in maps:
            fig, ax = plt.subplots(figsize=(10, 4))
            ax.plot(data[:limit], '.', markersize=1, color=color)
            ax.set_title(f"Carte {name} (1000 premières itérations)")
            ax.set_xlabel("n")
            ax.set_ylabel("Xn")
            paths.append(self.save_plot(fig, 'chaotic_maps', f'map_{name.lower()}.png'))
            
        return paths

    def generate_sbox_heatmap(self, sbox):
        """Génère la heatmap de la S-Box."""
        fig, ax = plt.subplots(figsize=(10, 8))
        im = ax.imshow(sbox, cmap='viridis', interpolation='nearest')
        fig.colorbar(im, ax=ax)
        ax.set_title("Visualisation S-Box (256x256)")
        path = self.save_plot(fig, 'sbox', 'sbox_heatmap.png')
        return [path]
    
    def generate_metrics_plots(self, npcr, uaci, entropy_orig, entropy_enc):
        """Génère les graphes pour NPCR/UACI et Entropie."""
        paths = []
        
        # NPCR/UACI Bar Chart
        fig, ax = plt.subplots(figsize=(8, 5))
        metrics = ['NPCR', 'UACI']
        values = [npcr, uaci]
        ideals = [99.6094, 33.4635]
        
        x = np.arange(len(metrics))
        width = 0.35
        
        rects1 = ax.bar(x - width/2, values, width, label='Calculé', color='blue')
        rects2 = ax.bar(x + width/2, ideals, width, label='Idéal', color='green', alpha=0.5)
        
        ax.set_ylabel('Pourcentage (%)')
        ax.set_title('Test Analyse Différentielle')
        ax.set_xticks(x)
        ax.set_xticklabels(metrics)
        ax.legend()
        
        paths.append(self.save_plot(fig, 'metrics', 'npcr_uaci_comparison.png'))
        
        # Entropy Comparison
        fig, ax = plt.subplots(figsize=(6, 5))
        labels = ['Original', 'Chiffré', 'Idéal (8)']
        e_vals = [entropy_orig, entropy_enc, 8.0]
        colors = ['red', 'blue', 'green']
        
        ax.bar(labels, e_vals, color=colors)
        ax.set_ylabel('Entropie (bits)')
        ax.set_title('Comparaison Entropie')
        ax.set_ylim(0, 8.5)
        
        # Add text labels on bars
        for i, v in enumerate(e_vals):
            ax.text(i, v + 0.1, f"{v:.4f}", ha='center')
            
        paths.append(self.save_plot(fig, 'metrics', 'entropy_comparison.png'))
        
        return paths
