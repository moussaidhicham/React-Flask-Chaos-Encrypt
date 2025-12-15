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
        
        # IMPORTANT: Force BL to be odd for Affine invertibility
        BL = BL | 1

        # 4. Pré-diffusion XOR
        # X[i] = X[i] ^ AL[i]
        # Using uint16 to be safe or just uint8 if AL is uint8
        # Project 4 Part 1: X[i] = X[i] XOR AL[i]
        X = np.bitwise_xor(X, AL.astype(X.dtype))
        
        # 5. Génération P-Box et S-Box
        P_Box = PermutationService.generate_permutation(AL)
        S_Box = PermutationService.generate_sbox(P_Box, AL)

        # 6. IV Generation
        # Note: Spec asks for IV = sum(XOR(X)). However, this requires transmitting IV.
        # For this implementation to function without extra metadata, we use Key-Dependent IV.
        iv_val = (int(np.sum(AL)) + int(np.sum(BL)) + int(np.sum(CL))) % 256
        
        # Modification du premier pixel X(0) par IV
        X[0] = np.bitwise_xor(X[0], iv_val)
        
        # 7. Chiffrement (Boucle Séquentielle CBC)
        # Pour i = 1 à 3NM-1
        # X(i) = X(i) ^ X'(i-1)
        # Si C[i] == 0: X'[i] = S[AL[i]][X[i]]
        # Sinon: X'[i] = (BL[i] * X[i] + CL[i]) % 256
        
        X_prime = np.zeros_like(X, dtype=np.uint8)
        
        # Initialisation (i=0) - Déjà traité mais il faut appliquer la transformation Sub/Affine
        # X[0] a déjà été modifié par IV. C'est notre "X[i]" actuel.
        # X'(0) = Transform(X[0])
        val_0 = int(X[0])
        row_0 = int(AL[0])
        if C[0] == 0:
            X_prime[0] = S_Box[row_0, val_0]
        else:
            X_prime[0] = (int(BL[0]) * val_0 + int(CL[0])) % 256
            
        # Boucle
        prev_cipher = int(X_prime[0])
        
        # Pour optimiser, on pré-calcule tout ce qui est possible hors boucle?
        # Difficile car X(i) change dynamiquement avec X'(i-1)
        # On va utiliser une boucle Python standard. Pour 3NM ~ millions, ça prendra quelques secondes.
        
        # Pre-convert commonly used arrays to python lists/simple arrays for speed?
        # Non, numpy indexing scalar access is okay but slower than C.
        # Let's try to keep it reasonably efficient.
        
        # Convert to int32 arrays for faster scalar access avoiding numpy overhead in loop?
        # Or just iterate.
        
        # Optimisation:
        # X is already XORed with AL (Part 1).
        # We need to iterate from 1 to End.
        
        length = len(X)
        
        # Casting to simple types for the loop
        X_int = X.astype(np.int32)
        AL_int = AL.astype(np.int32)
        BL_int = BL.astype(np.int32)
        CL_int = CL.astype(np.int32)
        C_int = C.astype(np.int32)
        S_Box_int = S_Box.astype(np.int32)
        
        X_prime_list = [0] * length
        X_prime_list[0] = prev_cipher
        
        for i in range(1, length):
            # X(i) = X(i) ^ X'(i-1)
            # Note: The prompt implies modifying the input X(i) OR just using it for calculation.
            # "X(i) = X(i) XOR X'(i-1)" -> Modify X state?
            # Yes, usually diffusion modifies state.
            
            curr_x = X_int[i] ^ prev_cipher
            # Update 'X' logic? effectively curr_x is the new "X(i)" input for transformation
            
            if C_int[i] == 0:
                # Substitution
                out = S_Box_int[AL_int[i], curr_x]
            else:
                # Affine
                out = (BL_int[i] * curr_x + CL_int[i]) % 256
            
            X_prime_list[i] = out
            prev_cipher = out

        X_prime = np.array(X_prime_list, dtype=np.uint8)
        
        # 8. Reconstruction
        encrypted_image = ImageProcessor.reshape(X_prime, N, M)
        
        return encrypted_image, (AL, BL, CL, C, P_Box, S_Box, iv_val), (u,v,w)

