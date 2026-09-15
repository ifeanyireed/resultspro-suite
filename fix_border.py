import os
import glob

# Find all globals.css
files = glob.glob('*/src/app/globals.css') + glob.glob('*/web_app/src/app/globals.css')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace the dark gray border/input with light gray #E5E7EB
    content = content.replace('--border: #374151;', '--border: #E5E7EB;')
    content = content.replace('--input: #374151;', '--input: #E5E7EB;')
    
    with open(f, 'w') as file:
        file.write(content)
    
    print(f"Updated {f}")
