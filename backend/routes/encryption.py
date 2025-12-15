from flask import Blueprint, request, jsonify
from services.encryption_service import EncryptionService
from services.export_service import ExportService
from models.image_processor import ImageProcessor
import os
import time
from PIL import Image
import numpy as np

encryption_bp = Blueprint('encryption', __name__)

# Temp storage for session data (simple in-memory for demo)
# In production, use Redis or database
SESSION_DATA = {}

@encryption_bp.route('/api/encrypt', methods=['POST'])
def encrypt():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    params = request.form.to_dict()
    
    # Parse chaotic params
    try:
        chaos_params = {
            'log_x0': float(params.get('log_x0', 0.1)),
            'log_mu': float(params.get('log_mu', 3.99)),
            'tent_x0': float(params.get('tent_x0', 0.2)),
            'tent_r': float(params.get('tent_r', 1.99)),
            'pwlcm_x0': float(params.get('pwlcm_x0', 0.3)),
            'pwlcm_p': float(params.get('pwlcm_p', 0.254))
        }
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    # Save uploaded file temporarily
    # Use absolute path relative to current file to ensure correct location regardless of CWD works
    base_dir = os.path.dirname(os.path.abspath(__file__)) # .../backend/routes
    backend_dir = os.path.dirname(base_dir) # .../backend
    
    # Preserve extension
    ext = os.path.splitext(file.filename)[1].lower()
    if not ext:
        ext = '.png'
        
    temp_path = os.path.join(backend_dir, 'static', f'temp_upload{ext}')
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    file.save(temp_path)
    
    start_time = time.time()
    
    # Encrypt
    encrypted_img, vectors, maps = EncryptionService.encrypt_image(temp_path, chaos_params)
    
    # Save encrypted image
    enc_path = os.path.join(backend_dir, 'static', 'encrypted.png')
    Image.fromarray(encrypted_img).save(enc_path)
    
    # Generate Charts
    export_service = ExportService(os.path.join(backend_dir, 'static', 'exports'))
    
    # Chaotic Maps
    map_paths = export_service.generate_chaotic_map_plots(*maps)
    
    # S-Box
    sbox_paths = export_service.generate_sbox_heatmap(vectors[5]) # S_Box is index 5
    
    # Store data for analysis step
    SESSION_DATA['original_path'] = temp_path
    SESSION_DATA['encrypted_path'] = enc_path
    SESSION_DATA['params'] = chaos_params
    
    # Return result
    response_data = {
        'status': 'success',
        'time': time.time() - start_time,
        'encrypted_url': '/static/encrypted.png',
        'graphs': {
            'chaotic_maps': map_paths,
            'sbox': sbox_paths
        }
    }
    
    # Cache result for Page Refresh recovery
    SESSION_DATA['last_result'] = response_data
    
    return jsonify(response_data)

@encryption_bp.route('/api/result', methods=['GET'])
def get_last_result():
    """Returns the last encryption result if valid session exists."""
    if 'last_result' in SESSION_DATA:
        return jsonify(SESSION_DATA['last_result'])
    return jsonify({'error': 'No active session'}), 404
