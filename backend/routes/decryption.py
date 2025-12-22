from flask import Blueprint, request, jsonify
from services.decryption_service import DecryptionService
import os
from PIL import Image
import numpy as np
import time
import traceback

decryption_bp = Blueprint('decryption', __name__)

from shared_state import SESSION_DATA

@decryption_bp.route('/api/decrypt', methods=['POST'])
def decrypt():
    try:
        file = None
        if 'image' in request.files:
            file = request.files['image']
            params = request.form.to_dict()
        else:
            if request.is_json:
                params = request.json
            else:
                params = request.form.to_dict()

        base_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(base_dir)
        
        # Default fallback
        enc_path = os.path.join(backend_dir, 'static', 'encrypted.png')
        
        path_to_decrypt = None

        if file:
            # Case A: User uploaded a file to decrypt
            ext = os.path.splitext(file.filename)[1].lower()
            if not ext: ext = '.png'
            enc_path = os.path.join(backend_dir, 'static', f'temp_decrypt{ext}')
            file.save(enc_path)
            path_to_decrypt = enc_path
        else:
            # Case B: Session Mode (Decrypt last encrypted)
            if 'encrypted_path' in SESSION_DATA and os.path.exists(SESSION_DATA['encrypted_path']):
                path_to_decrypt = SESSION_DATA['encrypted_path']
            elif os.path.exists(enc_path):
                 path_to_decrypt = enc_path
            
            if not path_to_decrypt:
                 return jsonify({'error': 'No encrypted image found. Please upload one or encrypt an image first.'}), 404

        # Parse chaotic params
        # If session mode and no params provided, try to use session params
        if not params and 'params' in SESSION_DATA:
            chaos_params = SESSION_DATA['params']
        else:
            # Use provided params or defaults
            try:
                chaos_params = {
                    'log_x0': float(params.get('log_x0', 0.1)),
                    'log_mu': float(params.get('log_mu', 3.99)),
                    'tent_x0': float(params.get('tent_x0', 0.2)),
                    'tent_r': float(params.get('tent_r', 1.99)),
                    'pwlcm_x0': float(params.get('pwlcm_x0', 0.3)),
                    'pwlcm_p': float(params.get('pwlcm_p', 0.254))
                }
            except ValueError as e:
                # If these failed and we have session params, fallback?
                if 'params' in SESSION_DATA:
                     chaos_params = SESSION_DATA['params']
                else:
                    return jsonify({'error': 'Invalid parameters and no session params found'}), 400

        # Decrypt
        decrypted_img_array = DecryptionService.decrypt_image(path_to_decrypt, chaos_params)
        
        # Save decrypted
        dec_path = os.path.join(backend_dir, 'static', 'decrypted.png')
        Image.fromarray(decrypted_img_array).save(dec_path)
        
        return jsonify({
            'status': 'success',
            'decrypted_url': '/static/decrypted.png'
        })

    except Exception as e:
        print("Decryption CRITICAL Error:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
