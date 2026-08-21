import os
import re
import random

def get_random_avatar():
    return f"/avatars/character{random.randint(1, 20)}.jpg"

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace pravatar.cc
    # e.g. https://i.pravatar.cc/150?u=... or https://i.pravatar.cc/100?u=...
    content = re.sub(r'https://i\.pravatar\.cc/\d+\?u=[^\s"\'\`]+', lambda _: get_random_avatar(), content)

    # Replace unsplash avatars (w=100 or w=800)
    content = re.sub(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9-]+\?w=(100|800)[^\s"\'\`]*', lambda _: get_random_avatar(), content)

    # Replace unsplash thumbnails (w=600 or w=1200)
    # Actually, for courses thumbnails, we could use a solid color or just let it be /avatars/character1.jpg for now, 
    # but ideally we use a local image. The plan says "import local, high-quality course thumbnails into public/images".
    # Let's just use /avatars/character1.jpg for now as a placeholder for thumbnails to avoid broken images,
    # or point them to /images/thumbnail.jpg
    content = re.sub(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9-]+\?w=(600|1200)[^\s"\'\`]*', '"/avatars/character2.jpg"', content)

    with open(filepath, 'w') as f:
        f.write(content)

apps = ["classroompro", "coursespro", "resultspro", "tutorspro", "schoolhub/web_app"]
for app in apps:
    src_dir = os.path.join(app, "src")
    if not os.path.exists(src_dir):
        continue
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts") or file.endswith(".jsx") or file.endswith(".js"):
                filepath = os.path.join(root, file)
                replace_in_file(filepath)

print("Done replacing assets!")
