import re

with open('examspro/src/app/battle-mode/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'bg-[conic-gradient(from_0deg,#dc2626,#2563eb,#9333ea,#dc2626)]',
    'bg-[conic-gradient(from_0deg,transparent_0_200deg,#dc2626_260deg,#2563eb_310deg,#9333ea_360deg)]'
)

with open('examspro/src/app/battle-mode/page.tsx', 'w') as f:
    f.write(content)
