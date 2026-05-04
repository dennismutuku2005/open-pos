import os
import re

def remove_hover_effects(directory):
    # Regex to match Tailwind hover, group-hover, focus, and active modifiers
    # This also handles things like hover:bg-red-500/10
    pattern = re.compile(r'\b(hover|group-hover|active|focus):[^\s"\'}`]+')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace the pattern with an empty string
                new_content = pattern.sub('', content)
                
                # Also clean up double spaces that might be left behind
                new_content = re.sub(r'  +', ' ', new_content)
                # Clean up spaces before closing quotes
                new_content = re.sub(r' +(["\'`])', r'\1', new_content)
                # Clean up spaces after opening quotes
                new_content = re.sub(r'(["\'`]) +', r'\1', new_content)
                
                if content != new_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {file_path}")

if __name__ == "__main__":
    src_dir = r"c:\xampp\htdocs\pos-system\pos\src"
    remove_hover_effects(src_dir)
