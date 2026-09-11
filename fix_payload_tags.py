import re

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'r') as f:
    content = f.read()

payload_str = """      const payload: any = {
        title,
        excerpt,
        content,
        cover_image: coverImage,
        category_id: category || null,
        tags,
        status,
        author_id
      };"""

content = re.sub(
    r'      const payload: any = \{\s*title,\s*excerpt,\s*content,\s*cover_image: coverImage,\s*category_id: category \|\| null,\s*status,\s*author_id\s*\};',
    payload_str,
    content,
    flags=re.DOTALL
)

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'w') as f:
    f.write(content)
