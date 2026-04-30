from rembg import remove
from PIL import Image
import os

def process_curtains():
    input_dir = 'raw_assets'
    output_dir = 'assets/curtains'
    
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in os.listdir(input_dir):
        if filename.endswith(('.jpg', '.png', '.jpeg')):
            print(f"Processing {filename}...")
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename.split('.')[0] + '.png')
            
            with open(input_path, 'rb') as i:
                input_data = i.read()
                output_data = remove(input_data)
                
            with open(output_path, 'wb') as o:
                o.write(output_data)
            
            # Optional: Resize to standard ratio 
            img = Image.open(output_path)
            img.thumbnail((1024, 1024))
            img.save(output_path)

if __name__ == "__main__":
    process_curtains()
