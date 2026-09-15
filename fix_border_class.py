import os
import glob
import re

directories = ['admin', 'examspro', 'landing_page', 'tutorspro', 'classroompro', 'schoolhub/web_app', 'resultspro']

for d in directories:
    for root, dirs, files in os.walk(os.path.join(d, 'src')):
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.ts', '.css')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        content = f.read()
                    
                    if 'border-nets-border' in content:
                        new_content = content.replace('border-nets-border', 'border-gray-200')
                        with open(filepath, 'w') as f:
                            f.write(new_content)
                        print(f"Updated {filepath}")
                except Exception as e:
                    pass
