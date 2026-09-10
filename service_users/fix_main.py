with open('main.go', 'r') as f:
    content = f.read()

content = content.replace(
    '}\n\t\t// --- 8. Blog CMS Management ---',
    '}\n\t})\n\n\t// --- 8. Blog CMS Management ---'
)

with open('main.go', 'w') as f:
    f.write(content)
