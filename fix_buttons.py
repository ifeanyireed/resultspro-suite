import os

files_to_fix = [
    'classroompro/src/app/page.tsx',
    'classroompro/src/components/Navbar.tsx',
    'classroompro/src/components/Footer.tsx',
    'tutorspro/src/app/page.tsx',
    'tutorspro/src/components/Navbar.tsx',
    'tutorspro/src/components/Footer.tsx',
    'coursespro/src/app/page.tsx',
    'coursespro/src/components/Navbar.tsx',
    'coursespro/src/components/Footer.tsx',
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
        
    content = content.replace('bg-green hover:bg-green/90 text-navy', 'bg-blue-600 hover:bg-blue-700 text-white')
    content = content.replace('bg-blue hover:bg-blue/90 text-navy', 'bg-blue-600 hover:bg-blue-700 text-white')
    content = content.replace('bg-green text-navy', 'bg-blue-600 text-white')
    content = content.replace('bg-blue text-navy', 'bg-blue-600 text-white')
    content = content.replace('text-green', 'text-blue-600')
    content = content.replace('text-navy', 'text-slate-900')
    
    with open(filepath, 'w') as f:
        f.write(content)
        
print("Buttons fixed!")
