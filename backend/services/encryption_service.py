import numpy as np
from services.chaotic_maps import ChaoticMaps
from services.permutation import PermutationService
from models.image_processor import ImageProcessor

class EncryptionService:
    @staticmethod
    def encrypt_image(image_path, params):
        """
        Exécute l'algorithme complet de chiffrement.
        Retourne: image_chiffree (numpy array), vectors (AL, BL, CL, C), s_box
        """
        # 1. Chargement et Vectorisation
        img_array = ImageProcessor.load_image(image_path)
        X, N, M = ImageProcessor.vectorize(img_array)
        total_pixels = 3 * N * M
        
        # 2. Génération des séquences chaotiques
        # On a besoin de vecteurs de taille 3*N*M
        u, v, w = ChaoticMaps.generate_sequences(params, total_pixels)
        
        # 3. Génération des vecteurs de contrôle
        AL, BL, CL, C = ChaoticMaps.generate_control_vectors(u, v, w)
        
        # IMPORTANT: Pour le chiffrement affine, BL doit être inversible modulo 256.
        # Cela signifie que BL doit être impair. On force BL à être impair.
        BL = BL | 1
        
        # 4. Pré-diffusion XOR
        # X[i] = X[i] ^ AL[i]
        X = X.astype(np.uint16) # Avoid overflow during ops before mod, though XOR is fine in uint8
        X = np.bitwise_xor(X, AL.astype(np.uint16))
        
        # ADDED DIFFUSION: Accumulate XOR to propagate changes (Avalanche Effect)
        # X[i] = X[i] ^ X[i-1]
        X = np.bitwise_xor.accumulate(X)
        
        # 5. Génération P-Box et S-Box
        P_Box = PermutationService.generate_permutation(AL)
        S_Box = PermutationService.generate_sbox(P_Box)
        
        # 6. IV Generation
        # IV = mod(sum(AL) + sum(BL) + sum(CL), 256)
        # Use simple python sum to avoid overflow issues with numpy uint8 sum
        iv_val = (int(np.sum(AL)) + int(np.sum(BL)) + int(np.sum(CL))) % 256
        
        # 7. Chiffrement
        # X'[0] = (X[0] ^ IV) mod 256
        X_prime = np.zeros_like(X, dtype=np.uint8)
        
        current_val = (X[0] ^ iv_val) % 256
        X_prime[0] = current_val
        
        # Loop implementiation optimized with numpy is hard due to feedback dependency?
        # Actually, formula is:
        # if C[i] == 0: X'[i] = S[AL[i]][X[i]]
        # else: X'[i] = (BL[i] * X[i] + CL[i]) % 256
        # This is NOT a feedback mode (CBC). X'[i] depends on X[i] (which is pre-diffused original).
        # So we CAN vectorise this! The dependency on previous ciphertext is NOT in the loop provided in the prompt.
        # Prompt: "Pour i = 1 à 3NM-1 ... X'[i] = ..." 
        # It calculates X'[i] from X[i] directly.
        
        # Vectorized implementation for speed:
        
        # Create mask for C
        mask_sbox = (C == 0)
        mask_affine = (C == 1)
        
        # Handle index 0 separately (already done)
        mask_sbox[0] = False
        mask_affine[0] = False
        
        # S-Box Substitution (Vectorized)
        # We need to apply S_Box[AL[i], X[i]] for indices where C[i] == 0
        # Advanced indexing: S_Box[rows, cols]
        target_indices = np.where(mask_sbox)[0]
        if len(target_indices) > 0:
            rows = AL[target_indices]
            cols = X[target_indices].astype(np.uint8) # X is effectively diffused input
            X_prime[target_indices] = S_Box[rows, cols]
            
        # Affine Cipher (Vectorized)
        # X'[i] = (BL[i] * X[i] + CL[i]) mod 256
        target_indices = np.where(mask_affine)[0]
        if len(target_indices) > 0:
            bl_vals = BL[target_indices].astype(np.uint32)
            cl_vals = CL[target_indices].astype(np.uint32)
            x_vals = X[target_indices].astype(np.uint32)
            
            res = (bl_vals * x_vals + cl_vals) % 256
            X_prime[target_indices] = res.astype(np.uint8)
            
        # 8. Reconstruction
        encrypted_image = ImageProcessor.reshape(X_prime, N, M)
        
        return encrypted_image, (AL, BL, CL, C, P_Box, S_Box, iv_val), (u,v,w)

