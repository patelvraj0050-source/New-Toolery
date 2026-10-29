import sys
import os
import io
from PIL import Image
from rembg import remove, new_session

# Global cached session for sub-second execution
_SESSION = None

def get_session():
    global _SESSION
    if _SESSION is None:
        # u2net is already downloaded and cached locally
        _SESSION = new_session('u2net')
    return _SESSION

def process_image(input_path, output_path):
    try:
        session = get_session()
        with open(input_path, 'rb') as f:
            input_bytes = f.read()

        # Remove background with post_process_mask to clean stray pixels
        output_bytes = remove(
            input_bytes,
            session=session,
            post_process_mask=True,
            alpha_matting=False
        )

        with open(output_path, 'wb') as f:
            f.write(output_bytes)

        return True
    except Exception as e:
        sys.stderr.write(f"Error removing background: {str(e)}\n")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python remove_bg.py <input_path> <output_path>\n")
        sys.exit(1)

    in_file = sys.argv[1]
    out_file = sys.argv[2]

    if not os.path.exists(in_file):
        sys.stderr.write(f"Input file not found: {in_file}\n")
        sys.exit(1)

    success = process_image(in_file, out_file)
    if success:
        sys.exit(0)
    else:
        sys.exit(1)
