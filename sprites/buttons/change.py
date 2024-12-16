from PIL import Image
import os

# Directory containing the images
input_folder = "sprites/buttons"
output_image_path = "sprites/buttons/image.png"

# List to store cropped images
cropped_images = []

# Iterate through all files in the folder
for file_name in os.listdir(input_folder):
    file_path = os.path.join(input_folder, file_name)
    try:
        with Image.open(file_path) as img:
            # Check if the image is 480x480
            if img.size == (480, 480):
                # Crop the image to center height of 240px
                top = (480 - 240) // 2
                bottom = top + 240
                cropped_img = img.crop((0, top, 480, bottom))
                cropped_images.append(cropped_img)
    except Exception as e:
        print(f"Skipping {file_name}: {e}")

# Combine all cropped images vertically
if cropped_images:
    total_height = sum(img.height for img in cropped_images)
    combined_image = Image.new("RGBA", (480, total_height))

    y_offset = 0
    for cropped_img in cropped_images:
        combined_image.paste(cropped_img, (0, y_offset))
        y_offset += cropped_img.height

    # Save the combined image
    combined_image.save(output_image_path)
    print(f"Combined image saved to {output_image_path}")
else:
    print("No valid images found in the folder.")
