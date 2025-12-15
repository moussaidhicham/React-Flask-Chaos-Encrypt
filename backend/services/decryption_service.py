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
        Exécute l'algorithme complet de déchiffrement.
        """
        # 1. Chargement et Vectorisation de l'image chiffrée
        # Note: Image chiffrée est sauvegardée en PNG (lossless), donc les pixels sont exacts.
        img_array = ImageProcessor.load_image(image_path)
        X_prime, N, M = ImageProcessor.vectorize(img_array)
        total_pixels = 3 * N * M
        
        # 2. Régénération des séquences (Mêmes paramètres)
        u, v, w = ChaoticMaps.generate_sequences(params, total_pixels)
        AL, BL, CL, C = ChaoticMaps.generate_control_vectors(u, v, w)
        
        # Force BL to be odd (same as encryption)
        BL = BL | 1
        
        # 3. Génération S-Box et Inverse
        P_Box = PermutationService.generate_permutation(AL)
        S_Box = PermutationService.generate_sbox(P_Box)
        S_Box_Inv = PermutationService.generate_inverse_sbox(S_Box)
        
        # 4. IV
        iv_val = (int(np.sum(AL)) + int(np.sum(BL)) + int(np.sum(CL))) % 256
        
        # 5. Déchiffrement Contrôlé (Inverse de l'étape 7 du chiffrement)
        X = np.zeros_like(X_prime, dtype=np.uint8)
        
        # Prepare Inverse Table for Affine
        inv_table = DecryptionService.get_modular_inverse_table()
        
        # Masks
        mask_sbox = (C == 0)
        mask_affine = (C == 1)
        
        # Exclude index 0
        mask_sbox[0] = False
        mask_affine[0] = False
        
        # S-Box Inverse Substitution
        # Encryption: X'[i] = S[AL[i]][X[i]]
        # Decryption: X[i] = S_inv[AL[i]][X'[i]]
        target_indices_sbox = np.where(mask_sbox)[0]
        if len(target_indices_sbox) > 0:
            rows = AL[target_indices_sbox]
            cols = X_prime[target_indices_sbox].astype(np.uint8)
            X[target_indices_sbox] = S_Box_Inv[rows, cols]
            
        # Affine Inverse
        # Encryption: X'[i] = (BL[i] * X[i] + CL[i]) mod 256
        # Decryption: X[i] = (X'[i] - CL[i]) * BL_inv[i] mod 256
        target_indices_affine = np.where(mask_affine)[0]
        if len(target_indices_affine) > 0:
            y_vals = X_prime[target_indices_affine].astype(np.uint32)
            cl_vals = CL[target_indices_affine].astype(np.uint32)
            bl_vals = BL[target_indices_affine] # These are values
            
            # Lookup inverses
            bl_invs = inv_table[bl_vals].astype(np.uint32)
            
            # (Y - CL) mod 256. 
            # In python (a-b)%m handles negatives correctly.
            # But with numpy uint, simpler to add 256 before mod if negative? 
            # Actually standard modular arithmetic: (y - cl) * inv
            diff = (y_vals + 256 * 2 - cl_vals) # Add multiples of 256 to ensure positivity before mod? 
            # Actually just cast to int32 before subtract, then mod.
            # Or: (y - cl) * inv mod 256
            # In finite field: (y - cl) is same as (y + (256 - cl%256))
            
            # Let's do:
            steps = (y_vals - cl_vals) * bl_invs 
            X[target_indices_affine] = (steps % 256).astype(np.uint8)

        # 6. Inverse First Pixel
        # X'[0] = (X[0] ^ IV) mod 256  -> X[0] = X'[0] ^ IV
        # Wait, encryption was: X'[0] = (X[0] ^ IV) mod 256
        # Since XOR and mod 256 with values < 256 are commutative if IV < 256?
        # NO. (a ^ b) % 256. If a, b < 256, then a^b < 256 usually? 
        # Yes, XOR of two 8-bit numbers is 8-bit. So mod 256 is redundant but harmless.
        # So X[0] = X'[0] ^ IV.
        X[0] = (X_prime[0] ^ iv_val)
        
        # 7. Inverse Diffusion & Pre-diffusion
        
        # INVERSE ACCUMULATED XOR (Avalanche)
        # The encryption was: X = accumulate(X)
        # The inverse is: X[i] = X_curr[i] ^ X_curr[i-1]
        X = X.astype(np.uint16)
        
        X_shifted = np.roll(X, 1)
        X_shifted[0] = 0
        X = np.bitwise_xor(X, X_shifted)
        
        # INVERSE PRE-DIFFUSION
        # X[i] = X[i] ^ AL[i]
        X = np.bitwise_xor(X, AL.astype(np.uint16))
        X = X.astype(np.uint8)
        
        # 8. Reconstruct
        decrypted_image = ImageProcessor.reshape(X, N, M)
        return decrypted_image
