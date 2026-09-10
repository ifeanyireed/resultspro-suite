import re

with open('admin/src/app/(dashboard)/cms/blog/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>',
    '<Link href={`/cms/blog/create?edit=${post.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</Link>'
)

with open('admin/src/app/(dashboard)/cms/blog/page.tsx', 'w') as f:
    f.write(content)
