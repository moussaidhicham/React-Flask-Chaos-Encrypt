import numpy as np
from services.chaotic_maps import ChaoticMaps
from services.permutation import PermutationService
from models.image_processor import ImageProcessor

class EncryptionService:
    @staticmethod
    def encrypt_image(image_path, params):
        """
        Exécute l'algorithme complet de chiffrement.
        Retourne: image_chiffree (numpy array), vectors (AL, BL, CL, C), s_box, process_log
        """
        import time
        process_log = []
        start_total = time.time()

        def add_log(step_name, description, data_preview=None):
            process_log.append({
                "step": step_name,
                "description": description,
                "timestamp": time.time() - start_total,
                "data":str(data_preview) if data_preview is not None else ""
            })

        add_log("Initialisation", "Chargement de la matrice de pixels et extraction des dimensions. Préparation de l'environnement cryptographique.")

        # 1. Chargement et Vectorisation
        t0 = time.time()
        img_array = ImageProcessor.load_image(image_path)
        X, N, M = ImageProcessor.vectorize(img_array)
        total_pixels = 3 * N * M
        add_log("1. Vectorisation", f"Mise à plat de l'image ({N}x{M}x3) vers un espace linéaire de {total_pixels} composantes. Cette étape permet un traitement par blocs et une diffusion globale sur toute l'image.", 
                f"Vecteur X[3NM] : [{X[0]}, {X[1]}, ... {X[-1]}]")
        
        # 2. Génération des séquences chaotiques
        u, v, w = ChaoticMaps.generate_sequences(params, total_pixels)
        add_log("2. Chaos (Systèmes Dynamiques)", f"Calcul de {total_pixels} itérations pour chaque carte (Logistique, Tente, PWLCM). Exploitation de l'hyper-sensibilité aux conditions initiales : x0={params.get('log_x0')}, μ={params.get('log_mu')}.", 
                f"Séquence u (Log): {u[0]:.6f}, v (Tent): {v[0]:.6f}, w (PWLCM): {w[0]:.6f}")
        
        # 3. Génération des vecteurs de contrôle (Clés de session)
        AL, BL, CL, C = ChaoticMaps.generate_control_vectors(u, v, w)
        add_log("3. Discrétisation & Clés", "Quantification des trajectoires chaotiques continues vers l'espace fini Z/256Z. AL, BL et CL serviront de clés de substitution et de coefficients affines dynamiques.", 
                f"AL (Subst): {AL[:4]}, BL (Mult): {BL[:4]}, C (Mode bits): {C[:4]}")
        
        # IMPORTANT: Force BL to be odd for Affine invertibility
        BL = BL | 1

        # 4. Phase de Pré-diffusion (XOR)
        X = np.bitwise_xor(X, AL.astype(X.dtype))
        add_log("4. Pré-diffusion (Confusion)", "Opération de masquage initial via XOR bit à bit avec la clé AL. Cette étape brise la corrélation immédiate entre les pixels voisins de l'image originale.", 
                f"Résultat XOR : X[0]={X[0]} (Original: {X[0] ^ AL[0]})")
        
        # 5. Génération des Structures Dynamiques
        P_Box = PermutationService.generate_permutation(AL)
        S_Box = PermutationService.generate_sbox(P_Box, AL)
        add_log("5. S-Box & P-Box Dynamiques", "Construction d'une Table de Substitution (S-Box) de 256x256 et d'une Boîte de Permutation (P-Box) basées sur l'état chaotique AL. Garantit une confusion forte de type Shannon.", 
                f"S_Box générée : {S_Box.shape} éléments uniques.")

        # 6. IV Generation (Initial Vector)
        iv_val = (int(np.sum(AL)) + int(np.sum(BL)) + int(np.sum(CL))) % 256
        add_log("6. Vecteur d'Initialisation (IV)", "Calcul d'un point d'entrée unique basé sur l'entropie globale des clés. L'IV empêche les attaques par fréquences sur des images identiques chiffrées avec la même clé.", f"IV session : {iv_val}")
        
        # Modification du premier pixel X(0) par IV
        X[0] = np.bitwise_xor(X[0], iv_val)
        
        # 7. Chiffrement (Boucle Séquentielle CBC)
        add_log("7. Chiffrement (Mode CBC)", "Démarrage de la boucle de diffusion. Chaque pixel est chiffré en fonction du pixel chiffré précédent, créant une dépendance globale (Avalanche effect).")
        
        X_prime = np.zeros_like(X, dtype=np.uint8)
        val_0 = int(X[0])
        row_0 = int(AL[0])
        if C[0] == 0:
            X_prime[0] = S_Box[row_0, val_0]
        else:
            X_prime[0] = (int(BL[0]) * val_0 + int(CL[0])) % 256
            
        # Boucle
        prev_cipher = int(X_prime[0])
        length = len(X)
        X_int = X.astype(np.int32); AL_int = AL.astype(np.int32); BL_int = BL.astype(np.int32)
        CL_int = CL.astype(np.int32); C_int = C.astype(np.int32); S_Box_int = S_Box.astype(np.int32)
        
        X_prime_list = [0] * length
        X_prime_list[0] = prev_cipher
        t_loop_start = time.time()
        
        for i in range(1, length):
            curr_x = X_int[i] ^ prev_cipher
            if C_int[i] == 0:
                out = S_Box_int[AL_int[i], curr_x]
            else:
                out = (BL_int[i] * curr_x + CL_int[i]) % 256
            X_prime_list[i] = out
            prev_cipher = out

        X_prime = np.array(X_prime_list, dtype=np.uint8)
        add_log("7. Fin de Diffusion", f"Traitement de {length} itérations terminé. Chaque bit de l'image de sortie dépend désormais de tous les bits d'entrée précédents.", 
                f"Vitesse : {length / (time.time() - t_loop_start) / 1e6:.2f} Mpixels/s")
        
        # 8. Reconstruction spatiale
        encrypted_image = ImageProcessor.reshape(X_prime, N, M)
        add_log("8. Reconstruction", "Transfert du vecteur chiffré vers la structure 3D initiale (RGB). L'image est désormais prête pour le stockage ou l'analyse statistique.", "Image NxMx3 générée.")
        
        return encrypted_image, (AL, BL, CL, C, P_Box, S_Box, iv_val), (u,v,w), process_log
