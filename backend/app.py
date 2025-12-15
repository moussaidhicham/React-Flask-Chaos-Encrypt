from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Ensure export directories exist
EXPORT_DIR = os.path.join(app.root_path, 'static', 'exports')
SUBDIRS = ['histograms', 'correlation', 'chaotic_maps', 'sbox', 'metrics']

for subdir in SUBDIRS:
    os.makedirs(os.path.join(EXPORT_DIR, subdir), exist_ok=True)

# Register Blueprints
from routes.encryption import encryption_bp
from routes.decryption import decryption_bp
from routes.analysis import analysis_bp
from routes.export import export_bp

app.register_blueprint(encryption_bp)
app.register_blueprint(decryption_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(export_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
