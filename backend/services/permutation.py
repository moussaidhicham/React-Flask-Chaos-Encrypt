import numpy as np

class PermutationService:
    @staticmethod
    def generate_permutation(al_sequence):
        """
        Génère la Permutation P (taille 256).
        P = argsort(AL[0:255])
        """
        # Take first 256 values
        sub_sequence = al_sequence[:256]
        # Argsort returns the indices that would sort the array
        p_box = np.argsort(sub_sequence).astype(np.uint8)
        return p_box

    @staticmethod
    def generate_sbox(p_box):
        """
        Génère la Table de substitution S-Box (256 x 256).
        S[0] = P
        S[i][j] = S[i-1][(j + i) mod 256]
        """
        s_box = np.zeros((256, 256), dtype=np.uint8)
        s_box[0] = p_box
        
        for i in range(1, 256):
            # Roll shifts elements. To limit manual loops, we use np.roll.
            # Formula: S[i][j] = S[i-1][(j + i) % 256]
            # This effectively shifts S[i-1] to the LEFT by i positions.
            # Example: j=0 -> index i. j=1 -> index i+1.
            # np.roll with negative shift is left shift.
            s_box[i] = np.roll(s_box[i-1], -i)
            
        return s_box

    @staticmethod
    def generate_inverse_sbox(s_box):
        """
        Génère la S-Box inverse pour le déchiffrement.
        Si Y = S[row][X], alors X = S_inv[row][Y].
        """
        s_box_inv = np.zeros((256, 256), dtype=np.uint8)
        for i in range(256):
            # For each row, we invert the permutation
            # If s_box[i][x] = y, then s_box_inv[i][y] = x
            s_box_inv[i][s_box[i]] = np.arange(256, dtype=np.uint8)
            
        return s_box_inv
