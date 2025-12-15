import numpy as np
from PIL import Image

class ImageProcessor:
    @staticmethod
    def load_image(filepath):
        """Charge une image et la convertit en tableau numpy RGB."""
        img = Image.open(filepath).convert('RGB')
        return np.array(img)

    @staticmethod
    def vectorize(image_array):
        """
        Convertit l'image (N, M, 3) en vecteur (3*N*M).
        Lecture en profondeur: Red, puis Green, puis Blue.
        """
        if len(image_array.shape) != 3 or image_array.shape[2] != 3:
            raise ValueError("L'image doit être au format RGB (N, M, 3)")
            
        N, M, _ = image_array.shape
        # Transpose to (3, N, M) then flatten to get R1...Rnm, G1...Gnm, B1...Bnm
        # np.transpose((2, 0, 1)) met les canaux en premier: (Channels, Height, Width)
        vector = image_array.transpose(2, 0, 1).flatten()
        return vector, N, M

    @staticmethod
    def reshape(vector, N, M):
        """
        Reconstruit l'image (N, M, 3) à partir du vecteur (3*N*M).
        """
        # Reshape to (3, N, M)
        channels_first = vector.reshape(3, N, M)
        # Transpose back to (N, M, 3)
        image_array = channels_first.transpose(1, 2, 0)
        return image_array
