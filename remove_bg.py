import sys
from PIL import Image

def remove_white(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    threshold = 210
    for item in data:
        # Check if the pixel is close to white
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Make it fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved exact logo to {output_path}")

if __name__ == '__main__':
    remove_white(r"c:\Users\HP\Desktop\Veridrop\WhatsApp Image 2026-06-11 at 21.25.12 (1).jpeg", r"c:\Users\HP\Desktop\Veridrop\veridrop_exact_transparent.png")
