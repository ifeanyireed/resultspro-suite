import re

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'r') as f:
    content = f.read()

# Make sure useSearchParams is imported
if 'useSearchParams' not in content:
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter, useSearchParams } from 'next/navigation';")

# Add the Suspense wrapper to fix useSearchParams de-opt
wrapper = """export default function CreateBlogPost() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CreateBlogPostContent />
    </React.Suspense>
  );
}

function CreateBlogPostContent() {"""
content = content.replace("export default function CreateBlogPost() {", wrapper)

# Add the edit logic
logic = """  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (editId) {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      fetch(`${USERS_API}/api/v1/cms/blog/posts`)
        .then(res => res.json())
        .then(data => {
          const posts = Array.isArray(data) ? data : (data.posts || []);
          const post = posts.find((p: any) => p.id === editId);
          if (post) {
            setTitle(post.title || '');
            setExcerpt(post.excerpt || '');
            setCategory(post.category || '');
            setContent(post.content || '');
            setCoverImage(post.cover_image || '');
            // Wait a tick for editor to initialize
            setTimeout(() => {
              if (window.tinymce || document.querySelector('.tiptap')) {
                // Not ideal but works for this level of abstraction
              }
            }, 500);
          }
        });
    }
  }, [editId]);
"""

content = content.replace("const router = useRouter();", logic)

# Add title change
content = content.replace(">Create New Post<", ">{editId ? 'Edit Post' : 'Create New Post'}<")
content = content.replace(">Draft Post<", ">{editId ? 'Update Post' : 'Draft Post'}<")
content = content.replace(">Publish Post<", ">{editId ? 'Save & Publish' : 'Publish Post'}<")

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'w') as f:
    f.write(content)
