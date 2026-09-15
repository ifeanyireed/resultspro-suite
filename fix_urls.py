import os
import re

directories = ['admin', 'examspro', 'landing_page', 'tutorspro', 'classroompro', 'schoolhub', 'resultspro']

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # 1. Remove fallbacks like ` || 'https://resultspro-service-....'`
    content = re.sub(r"\s*\|\|\s*['\"](https|wss)://resultspro-service-[a-zA-Z0-9-]+\.onrender\.com[^'\"]*['\"]", "", content)

    # 2. Replace direct string literals like `'https://resultspro-service-....'` with process.env
    # e.g., baseURL: 'https://resultspro-service-users.onrender.com/api' -> baseURL: process.env.NEXT_PUBLIC_API_URL
    # Actually wait, `schoolhub/web_app/src/lib/api.ts` has:
    # `baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-users.onrender.com/api'`
    # The first regex will handle the fallback.

    # 3. For schoolhub/web_app/src/app/layout.tsx:
    # const res = await fetch(`https://resultspro-service-users.onrender.com/api/public/tenant/resolve?domain=${searchDomain}`, {
    content = re.sub(
        r"`https://resultspro-service-users\.onrender\.com/api/(.*?)`",
        r"`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_USERS_API + '/api'}/\1`",
        content
    )
    # Wait, the prompt says "do not have API URLS hardcoded at all"
    content = re.sub(
        r"`https://resultspro-service-[a-zA-Z0-9-]+\.onrender\.com/(.*?)`",
        r"`${process.env.NEXT_PUBLIC_API_URL || ''}/\1`",  # Generic replacement, better to use specific if possible
        content
    )

    # Specific schoolhub fixes:
    content = content.replace(
        "`wss://resultspro-service-coursespro.onrender.com/api/classroom/ws?room=PeerDirectory&token=${token}&domain=${domain}`",
        "`${process.env.NEXT_PUBLIC_WS_URL || ''}?room=PeerDirectory&token=${token}&domain=${domain}`"
    )

    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed: {filepath}")

for root, dirs, files in os.walk('.'):
    # Skip node_modules, .next, etc.
    if any(skip in root for skip in ['node_modules', '.next', 'out', 'dist', 'build', '.git']):
        continue
    
    # Only process files in our target directories
    if not any(root.startswith(f"./{d}") or root == f"./{d}" for d in directories):
        continue

    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
            fix_file(os.path.join(root, file))

