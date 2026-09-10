import os

directories = ["schoolhub", "resultspro", "examspro", "classroompro", "tutorspro", "coursespro", "puzzlepro"]
base_path = "src/app/(marketing)/{}/page.tsx"

for directory in directories:
    file_path = base_path.format(directory)
    with open(file_path, "r") as f:
        content = f.read()

    # 1. Import
    if "import HeroAnimationWrapper" not in content:
        lines = content.split("\n")
        lines.insert(0, "import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';")
        content = "\n".join(lines)

    # 2. Change background colors
    colors = ["emerald", "purple", "amber", "rose", "cyan", "orange"]
    for c in colors:
        content = content.replace(f"bg-{c}-600/10", "bg-blue-600/10")

    # 3. Add HeroAnimationWrapper open tag
    old_open = '''        <div className="container-nets relative z-10">
          <div className="max-w-3xl">'''
    new_open = '''        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">'''
    
    if old_open in content:
        content = content.replace(old_open, new_open, 1) # Only replace the first occurrence (Hero)

    # 4. Add HeroAnimationWrapper close tag
    old_close = '''          </div>
        </div>
      </section>'''
    new_close = '''          </div>
          </HeroAnimationWrapper>
        </div>
      </section>'''
    
    if old_close in content:
        content = content.replace(old_close, new_close, 1)

    with open(file_path, "w") as f:
        f.write(content)
        
    print(f"Updated {file_path}")
