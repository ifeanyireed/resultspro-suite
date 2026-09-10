with open('landing_page/src/components/BlogPostContent.tsx', 'r') as f:
    content = f.read()

# Fix types and hydration
content = content.replace(
    'id: number;',
    'id: string | number;'
)
content = content.replace(
    'comments: Comment[];',
    'comments?: Comment[];\n  cover_image?: string;\n  published_at?: string;'
)

content = content.replace(
    'subtitle={`By ${post.author} — ${new Date(post.created_at).toLocaleDateString()}`}',
    'subtitle={`By ${post.author} — ${new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}'
)

content = content.replace(
    'image="/photo08.jpeg"',
    'image={post.cover_image || "/photo08.jpeg"}'
)

with open('landing_page/src/components/BlogPostContent.tsx', 'w') as f:
    f.write(content)
