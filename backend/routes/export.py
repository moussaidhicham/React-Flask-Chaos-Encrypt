from flask import Blueprint, jsonify, send_file
import os
import shutil

export_bp = Blueprint('export', __name__)

@export_bp.route('/api/export/zip', methods=['GET'])
def export_zip():
    """Crée un ZIP de tout le dossier exports et l'envoie."""
    # Use absolute path
    base_dir = os.path.dirname(os.path.abspath(__file__)) # .../backend/routes
    backend_dir = os.path.dirname(base_dir) # .../backend
    
    src_dir = os.path.join(backend_dir, 'static', 'exports')
    
    if not os.path.exists(src_dir):
        return jsonify({'error': 'No exports found'}), 404
        
    # shutil.make_archive creates the zip file. 
    # root_dir is the directory whose contents will be at the root of the archive.
    # base_name is the name of the file to create (without extension).
    # We want to create it in specific location to avoid clutter/permissions issues.
    output_path = os.path.join(backend_dir, 'output_graphs')
    shutil.make_archive(output_path, 'zip', src_dir)
    
    # Send the file
    return send_file(output_path + '.zip', as_attachment=True)
