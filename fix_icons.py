import glob
import re

files = glob.glob('/Users/ifeanyifelix/Desktop/ReedBreedCC/resultspro-suite/tutorspro/src/**/*.tsx', recursive=True)

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Replace Tabler Icons v2 names with v3
        replacements = {
            'IconUndo2': 'IconArrowBackUp',
            'IconRedo2': 'IconArrowForwardUp',
            'IconUserCircle2': 'IconUserCircle',
            'IconTrash2': 'IconTrash'
        }
        
        for old, new_icon in replacements.items():
            new_content = re.sub(r'\b' + old + r'\b', new_icon, new_content)

        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
    except Exception as e:
        pass
