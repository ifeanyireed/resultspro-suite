import os
import glob

# Find all page.tsx files in the product directories
directories = ["schoolhub", "resultspro", "examspro", "classroompro", "tutorspro", "coursespro", "puzzlepro"]
base_path = "src/app/(marketing)/{}/page.tsx"

for directory in directories:
    file_path = base_path.format(directory)
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, "r") as f:
        content = f.read()
    
    if "import PricingSection" in content:
        print(f"PricingSection already imported in {file_path}")
        continue
    
    # Insert import statement after the last import
    lines = content.split("\n")
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith("import "):
            last_import_idx = i
            
    # However, there might be multi-line imports, so searching for the first blank line after imports or just put it at the very top
    # Just put it at line 1, or after the first line (if it's a 'use client' directive).
    # Since these are server components (no 'use client'), line 0 is `import Link from 'next/link';`
    lines.insert(0, "import PricingSection from '@/components/PricingSection';")
    
    content = "\n".join(lines)
    
    # Insert <PricingSection /> before {/* CTA Section */}
    cta_marker = "{/* CTA Section */}"
    if cta_marker in content:
        content = content.replace(cta_marker, "{/* Pricing Section */}\n      <PricingSection />\n\n      " + cta_marker)
    else:
        print(f"Warning: CTA Section not found in {file_path}. Appending to the end of main.")
        content = content.replace("</main>", "  {/* Pricing Section */}\n      <PricingSection />\n    </main>")
    
    with open(file_path, "w") as f:
        f.write(content)
        
    print(f"Updated {file_path}")
