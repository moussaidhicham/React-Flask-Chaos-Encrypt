
import os
import time

def clean_static():
    # Adjust this path if needed
    base_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(base_dir, 'static')
    
    print(f"Cleaning directory: {static_dir}")
    
    if not os.path.exists(static_dir):
        print("Static directory does not exist.")
        return

    count = 0
    size_cleared = 0
    
    for f in os.listdir(static_dir):
        f_path = os.path.join(static_dir, f)
        # Target our specific files
        if f.startswith('temp_upload_') or f.startswith('encrypted_') or f.startswith('temp_decrypt'):
            try:
                size = os.path.getsize(f_path)
                os.remove(f_path)
                size_cleared += size
                count += 1
                if count % 100 == 0:
                    print(f"Removed {count} files...")
            except Exception as e:
                print(f"Error removing {f}: {e}")
                
    print(f"DONE. Removed {count} files. Cleared {size_cleared / 1024 / 1024:.2f} MB.")

if __name__ == "__main__":
    clean_static()
