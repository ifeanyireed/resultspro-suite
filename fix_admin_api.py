with open('admin/src/lib/api.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'const res = await fetch(`${EXAMS_API}/api/blog`);',
    'const res = await fetch(`${USERS_API}/api/v1/cms/blog/posts`);'
)

with open('admin/src/lib/api.ts', 'w') as f:
    f.write(content)
