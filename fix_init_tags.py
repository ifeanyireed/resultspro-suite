import re

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "setContent(post.content || '');",
    "setContent(post.content || '');\n            setTags(post.tags || '');"
)

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'w') as f:
    f.write(content)
