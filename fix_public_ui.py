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

replacements = [
    ('bg-navy/95', 'bg-white/95'),
    ('bg-navy/80', 'bg-white/80'),
    ('bg-navy/50', 'bg-slate-50'),
    ('bg-navy/20', 'bg-slate-50'),
    ('bg-navy', 'bg-white'),
    ('border-white/10', 'border-slate-200'),
    ('border-white/5', 'border-slate-100'),
    ('border-white/20', 'border-slate-200'),
    ('text-white', 'text-slate-900'),
    ('text-slate-300', 'text-slate-600'),
    ('text-slate-400', 'text-slate-500'),
    ('bg-white/5', 'bg-slate-100'),
    ('bg-white/10', 'bg-slate-100'),
    ('from-navy', 'from-white'),
    ('to-navy', 'to-white'),
    ('via-navy', 'via-white'),
    ('from-blue/20', 'from-blue-600/10'),
    ('to-green/20', 'to-green-600/10'),
    ('text-blue', 'text-blue-600'),
    ('text-green', 'text-green-600'),
    ('text-amber', 'text-amber-600'),
    ('text-purple', 'text-purple-600'),
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
        
    for old, new in replacements:
        content = content.replace(old, new)
        
    # Specific fixes
    # If the file is Navbar, ensure brand logo text is slate-900
    if 'Navbar' in filepath:
        content = content.replace('text-slate-900 font-bold', 'text-slate-900 font-bold')
        content = content.replace('hover:text-slate-900 hover:bg-slate-100', 'hover:text-blue-600 hover:bg-slate-100')
        content = content.replace('text-slate-600 hover:text-slate-900', 'text-slate-600 hover:text-blue-600')
        
    # Buttons need text-white if they are primary
    content = content.replace('bg-blue-600 hover:bg-blue-700 text-slate-900', 'bg-blue-600 hover:bg-blue-700 text-white')
    content = content.replace('bg-green-600 hover:bg-green-700 text-slate-900', 'bg-green-600 hover:bg-green-700 text-white')

    with open(filepath, 'w') as f:
        f.write(content)
        
print("Done fixing public pages UI!")
