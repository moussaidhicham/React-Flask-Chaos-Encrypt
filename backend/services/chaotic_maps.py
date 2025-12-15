import numpy as np

class ChaoticMaps:
    @staticmethod
    def logistic_map(x0, mu, length):
        """
        Génère une séquence chaotique utilisant la carte Logistique.
        Xn+1 = μ * Xn * (1 - Xn)
        """
        sequence = np.zeros(length)
        x = x0
        for i in range(length):
            x = mu * x * (1 - x)
            sequence[i] = x
        return sequence

    @staticmethod
    def tent_map(x0, r, length):
        """
        Génère une séquence chaotique utilisant la carte Tente.
        Xn+1 = r * Xn          si Xn < 0.5
             = r * (1 - Xn)    si Xn >= 0.5
        """
        sequence = np.zeros(length)
        x = x0
        for i in range(length):
            if x < 0.5:
                x = r * x
            else:
                x = r * (1 - x)
            sequence[i] = x
        return sequence

    @staticmethod
    def pwlcm_map(x0, p, length):
        """
        Génère une séquence chaotique utilisant la carte PWLCM.
        Piecewise Linear Chaotic Map
        """
        sequence = np.zeros(length)
        x = x0
        for i in range(length):
            if 0 <= x < p:
                x = x / p
            elif p <= x < 0.5:
                x = (x - p) / (0.5 - p)
            elif 0.5 <= x < 1:
                # Exploiting symmetry: f(1-x, p) is equivalent to processing 1-x with the first two conditions
                # Essentially PWLCM is symmetric around 0.5
                temp_x = 1 - x
                if 0 <= temp_x < p:
                    x = temp_x / p
                elif p <= temp_x < 0.5:
                    x = (temp_x - p) / (0.5 - p)
                else: 
                     # Should not happen if x is in [0.5, 1) -> 1-x in (0, 0.5]
                     pass
            sequence[i] = x
        return sequence

    @staticmethod
    def generate_sequences(params, length):
        """
        Génère les 3 séquences chaotiques (u, v, w) basées sur les paramètres.
        Params dict doit contenir: 'log_x0', 'log_mu', 'tent_x0', 'tent_r', 'pwlcm_x0', 'pwlcm_p'
        """
        u = ChaoticMaps.logistic_map(params['log_x0'], params['log_mu'], length)
        v = ChaoticMaps.tent_map(params['tent_x0'], params['tent_r'], length)
        w = ChaoticMaps.pwlcm_map(params['pwlcm_x0'], params['pwlcm_p'], length)
        return u, v, w

    @staticmethod
    def generate_control_vectors(u, v, w):
        """
        Génère les vecteurs AL, BL, CL et le vecteur de contrôle C.
        AL[i] = floor(mod((u[i] + v[i]) * 10^14, 256))
        BL[i] = floor(mod((v[i] + w[i]) * 10^14, 256))
        CL[i] = floor(mod((u[i] + w[i]) * 10^14, 256))
        C[i]  = mod(AL[i] + BL[i] + CL[i], 2)
        """
        # Utilisation de numpy pour vectorisation rapide ici
        factor = 1e14
        
        # Calcul vectorisé
        al = np.floor(np.mod((u + v) * factor, 256)).astype(np.uint8)
        bl = np.floor(np.mod((v + w) * factor, 256)).astype(np.uint8)
        cl = np.floor(np.mod((u + w) * factor, 256)).astype(np.uint8)
        
        c = np.mod(al.astype(np.uint16) + bl.astype(np.uint16) + cl.astype(np.uint16), 2).astype(np.uint8)
        
        return al, bl, cl, c
