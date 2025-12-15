import numpy as np
from services.chaotic_maps import ChaoticMaps
from services.permutation import PermutationService
from models.image_processor import ImageProcessor

class DecryptionService:
    @staticmethod
    def get_modular_inverse_table():
        """
        Crée une table de correspondance pour les inverses modulaires modulo 256.
        Seuls les nombres impairs ont un inverse.
        inv_table[x] = x^-1 mod 256
        """
        table = np.zeros(256, dtype=np.uint8)
        for i in range(1, 256, 2): # Iterate only odds
            # pow(i, -1, 256) returns the inverse
            try:
                inv = pow(i, -1, 256)
                table[i] = inv
            except ValueError:
                pass # Should not happen for odd numbers
        return table

    @staticmethod
    def decrypt_image(image_path, params):
        """
        Exécute l'algorithme complet de déchiffrement (Projet 4).
        """
        # 1. Chargement et Vectorisation
        img_array = ImageProcessor.load_image(image_path)
        X_prime, N, M = ImageProcessor.vectorize(img_array)
        total_pixels = 3 * N * M
        
        # 2. Régénération des séquences
        u, v, w = ChaoticMaps.generate_sequences(params, total_pixels)
        AL, BL, CL, C = ChaoticMaps.generate_control_vectors(u, v, w)
        
        # Force BL to be odd (same as encryption)
        # Type casting for safer numpy operations
        BL = BL.astype(np.uint8) | 1
        
        # 3. Génération P-Box et S-Box
        P_Box = PermutationService.generate_permutation(AL)
        S_Box = PermutationService.generate_sbox(P_Box, AL)
        
        # Génération des inverses
        # S-Box Inverse
        Inv_S_Box = np.zeros_like(S_Box)
        for r in range(256):
            Inv_S_Box[r] = np.argsort(S_Box[r])
        Inv_S_Box = Inv_S_Box.astype(np.int32)
        
        # Affine Inverse (BL^-1 mod 256)
        # Using a lookup table for speed since mod is 256
        def modInverse(n):
            return pow(int(n), -1, 256)
        v_modInverse = np.vectorize(modInverse)
        BL_inv = v_modInverse(BL).astype(np.int32)
        
        # 4. IV Generation (Key-Dependent to match Encryption)
        iv_val = (int(np.sum(AL)) + int(np.sum(BL)) + int(np.sum(CL))) % 256
        
        # 5. Déchiffrement CBC (Inverse Loop)
        # X_prime is Ciphertext. X_rec works as diffused-plaintext intermediate.
        
        # Optimisation: Cast arrays to int32 to avoid overflow/wrap during calc
        X_prime_int = X_prime.astype(np.int32)
        AL_int = AL.astype(np.int32)
        CL_int = CL.astype(np.int32)
        C_int = C.astype(np.int32)
        
        X_rec = np.zeros(total_pixels, dtype=np.uint8)
        
        # Loop i from End down to 1
        # X[i] = InvTrans(X'[i]) ^ X'[i-1]
        
        for i in range(total_pixels - 1, 0, -1):
            prev_cipher = X_prime_int[i-1]
            curr_cipher = X_prime_int[i]
            
            if C_int[i] == 0:
                # Inverse Substitution
                temp = Inv_S_Box[AL_int[i], curr_cipher]
            else:
                # Inverse Affine: (y - b) * a^-1
                temp = ((curr_cipher - CL_int[i]) * BL_inv[i]) % 256
                
            # Inverse Diffusion
            X_rec[i] = temp ^ prev_cipher
            
        # Handle i=0
        # X[0] = InvTrans(X'[0]) ^ IV
        curr_cipher = X_prime_int[0]
        if C_int[0] == 0:
            temp = Inv_S_Box[AL_int[0], curr_cipher]
        else:
            temp = ((curr_cipher - CL_int[0]) * BL_inv[0]) % 256
            
        X_rec[0] = temp ^ iv_val
        
        # 6. Inverse Pre-diffusion XOR
        # X_final = X_rec ^ AL
        X_final = np.bitwise_xor(X_rec, AL.astype(np.uint8))
        
        # 7. Reshape
        decrypted_img = ImageProcessor.reshape(X_final, N, M)
        return decrypted_img
