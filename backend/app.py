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

def clean_on_startup():
    import os
    import glob
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        static_dir = os.path.join(base_dir, 'static')
        patterns = ['temp_*.png', 'encrypted_*.png', 'decrypted_*.png', 'temp_upload_*.png']
        count = 0
        for p in patterns:
            for f in glob.glob(os.path.join(static_dir, p)):
                try:
                    os.remove(f)
                    count += 1
                except Exception:
                    pass
        print(f"Startup Cleanup: Removed {count} temporary files from static/.")
    except Exception as e:
        print(f"Startup Cleanup Failed: {e}")

if __name__ == '__main__':
    clean_on_startup()
    app.run(debug=True, use_reloader=False, port=5000)
