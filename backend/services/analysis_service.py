import numpy as np
import math

class AnalysisService:
    @staticmethod
    def calculate_entropy(image_array):
        """
        Calcule l'entropie de Shannon pour l'image entière et par canal.
        H(X) = -Σ p(xi) * log2(p(xi))
        """
        if len(image_array.shape) == 3:
            # Flatten to analyze distribution of all pixel values together
            flat = image_array.flatten()
        else:
            flat = image_array
            
        counts = np.bincount(flat, minlength=256)
        probs = counts / len(flat)
        # Avoid log(0)
        probs = probs[probs > 0]
        entropy = -np.sum(probs * np.log2(probs))
        
        return entropy

    @staticmethod
    def calculate_correlation(image_array, num_pairs=3000):
        """
        Calcule les coefficients de corrélation pour les directions H, V, D.
        Retourne un dictionnaire avec les valeurs pour chaque paire.
        """
        H, W, Channels = image_array.shape
        results = {}
        
        # Directions: (dy, dx)
        directions = {
            'Horizontal': (0, 1),
            'Vertical': (1, 0),
            'Diagonal': (1, 1)
        }
        
        channel_names = ['Red', 'Green', 'Blue']
        
        for name, (dy, dx) in directions.items():
            for c_idx, c_name in enumerate(channel_names):
                channel_data = image_array[:, :, c_idx]
                
                # Selectionner des indices aléatoires valides
                # x range: [0, W - 1 - dx]
                # y range: [0, H - 1 - dy]
                max_x = W - 1 - dx
                max_y = H - 1 - dy
                
                if max_x < 0 or max_y < 0:
                    results[f'{name}_{c_name}'] = 0.0
                    continue

                # Vectorized random sampling
                ys = np.random.randint(0, max_y + 1, num_pairs)
                xs = np.random.randint(0, max_x + 1, num_pairs)
                
                val_x = channel_data[ys, xs]
                val_y = channel_data[ys + dy, xs + dx]
                
                # Pearson correlation coefficient
                if len(val_x) > 0:
                    # np.corrcoef returns matrix [[1, r], [r, 1]]
                    r = np.corrcoef(val_x, val_y)[0, 1]
                    if np.isnan(r): r = 0
                else:
                    r = 0
                    
                results[f'{name}_{c_name}'] = r
                
        return results

    @staticmethod
    def calculate_npcr_uaci(c1, c2):
        """
        Calcule NPCR (Number of Pixels Change Rate) et UACI (Unified Average Changing Intensity).
        C1: Première image chiffrée
        C2: Deuxième image chiffrée (après modif 1 pixel originale)
        """
        # Ensure arrays are same shape and int type for diff
        c1 = c1.astype(np.int16)
        c2 = c2.astype(np.int16)
        
        H, W, Channels = c1.shape
        total_pixels = H * W * Channels
        
        # NPCR
        # Count diffs
        diffs = np.sum(c1 != c2)
        npcr = (diffs / total_pixels) * 100
        
        # UACI
        # sum(|C1 - C2|) / 255 / (Total)
        abs_diff = np.abs(c1 - c2)
        uaci = (np.sum(abs_diff) / (255 * total_pixels)) * 100
        
        return npcr, uaci

    @staticmethod
    def get_correlation_data(image_array, direction, channel_idx, num_pairs=3000):
        """
        Helper pour récupérer les données brutes (x, y) pour les scatter plots.
        Pour l'export graphique.
        Direction: 'Horizontal', 'Vertical', 'Diagonal'
        """
        H, W, _ = image_array.shape
        dy, dx = 0, 0
        if direction == 'Horizontal': dx = 1
        elif direction == 'Vertical': dy = 1
        elif direction == 'Diagonal': dx, dy = 1, 1
        
        channel_data = image_array[:, :, channel_idx]
        max_x = W - 1 - dx
        max_y = H - 1 - dy
        
        ys = np.random.randint(0, max_y + 1, num_pairs)
        xs = np.random.randint(0, max_x + 1, num_pairs)
        
        val_x = channel_data[ys, xs]
        val_y = channel_data[ys + dy, xs + dx]
        
        return val_x, val_y
