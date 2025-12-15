from flask import Blueprint, jsonify
from services.analysis_service import AnalysisService
from services.export_service import ExportService
from models.image_processor import ImageProcessor
from services.encryption_service import EncryptionService
import os
import numpy as np

analysis_bp = Blueprint('analysis', __name__)

# Access SESSION_DATA from encryption module (in real app, use proper session store)
from .encryption import SESSION_DATA

@analysis_bp.route('/api/analysis', methods=['GET'])
def analyze():
    if 'original_path' not in SESSION_DATA or 'encrypted_path' not in SESSION_DATA:
         return jsonify({'error': 'No session data. Encrypt an image first.'}), 400
         
    orig_path = SESSION_DATA['original_path']
    enc_path = SESSION_DATA['encrypted_path']
    params = SESSION_DATA['params']
    
    orig_img = ImageProcessor.load_image(orig_path)
    enc_img = ImageProcessor.load_image(enc_path)
    
    # 1. Histograms
    # Use absolute path for export service
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    export_service = ExportService(os.path.join(base_dir, 'static', 'exports'))
    
    hist_paths = export_service.generate_histograms(orig_img, enc_img)
    
    # 2. Correlation
    corr_paths = export_service.generate_correlation_plots(orig_img, enc_img)
    corr_coeffs_orig = AnalysisService.calculate_correlation(orig_img)
    corr_coeffs_enc = AnalysisService.calculate_correlation(enc_img)
    
    # 3. Entropy
    ent_orig = AnalysisService.calculate_entropy(orig_img)
    ent_enc = AnalysisService.calculate_entropy(enc_img)
    
    # 4. NPCR & UACI (Differential Attack Test)
    # Need to generate C2 from Image with 1 pixel changed
    # Modify FIRST pixel of original (avalanche effect test)
    orig_mod = orig_img.copy()
    orig_mod[0, 0, 0] = (orig_mod[0, 0, 0] + 1) % 256
    
    # Save temp mod
    mod_path = os.path.join(base_dir, 'static', 'temp_mod.png')
    # Save/Reload to ensure format consistency
    from PIL import Image
    Image.fromarray(orig_mod).save(mod_path)
    
    # Encrypt modified image with SAME params
    enc_mod_img, _, _ = EncryptionService.encrypt_image(mod_path, params)
    
    npcr, uaci = AnalysisService.calculate_npcr_uaci(enc_img, enc_mod_img)
    
    # Generate Metrics Plots
    metric_paths = export_service.generate_metrics_plots(npcr, uaci, ent_orig, ent_enc)
    
    return jsonify({
        'status': 'success',
        'metrics': {
            'entropy': {'original': ent_orig, 'encrypted': ent_enc},
            'npcr': npcr,
            'uaci': uaci,
            'correlation_original': corr_coeffs_orig,
            'correlation_encrypted': corr_coeffs_enc,
            'key_space': '2^299'
        },
        'graphs': {
            'histograms': hist_paths,
            'correlation': corr_paths,
            'metrics': metric_paths
        }
    })
