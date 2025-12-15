from flask import Blueprint, request, jsonify
from services.decryption_service import DecryptionService
import os
from PIL import Image
import numpy as np
import time

decryption_bp = Blueprint('decryption', __name__)

@decryption_bp.route('/api/decrypt', methods=['POST'])
def decrypt():
    # Check if we have a file or just params (JSON or Form)
    # If file upload, it's multipart/form-data, so params are in request.form
    # If no file, it might be JSON or Form
    
    file = None
    if 'image' in request.files:
        file = request.files['image']
        params = request.form.to_dict() # Parameters from params form
    else:
        # Try JSON if no file, fallback to form
        if request.is_json:
            params = request.json
        else:
            params = request.form.to_dict()

    # Use absolute path relative to current file to ensure correct location regardless of CWD works
    base_dir = os.path.dirname(os.path.abspath(__file__)) # .../backend/routes
    backend_dir = os.path.dirname(base_dir) # .../backend
    
    enc_path = os.path.join(backend_dir, 'static', 'encrypted.png')
    
    # If user provided a file, save it (overwrite default or use temp)
    if file:
        file.save(enc_path) # Overwrite existing encrypted.png so it becomes the current "session" one
    elif not os.path.exists(enc_path):
         return jsonify({'error': 'No encrypted image found. Please encrypt first or upload one.'}), 404

    # Parse chaotic params or use provided
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
        print(e)
        return jsonify({'error': 'Invalid parameters'}), 400

    start_time = time.time()
    
    # Decrypt
    decrypted_img_array = DecryptionService.decrypt_image(enc_path, chaos_params)
    
    # Save decrypted
    dec_path = os.path.join(backend_dir, 'static', 'decrypted.png')
    Image.fromarray(decrypted_img_array).save(dec_path)
    
    return jsonify({
        'status': 'success',
        'time': time.time() - start_time,
        'decrypted_url': '/static/decrypted.png'
    })
