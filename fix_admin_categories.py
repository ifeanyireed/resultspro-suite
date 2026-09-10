import re

with open('admin/src/app/(dashboard)/cms/blog/page.tsx', 'r') as f:
    content = f.read()

# 1. Add categories state
content = content.replace(
    'const [posts, setPosts] = useState<any[]>([]);',
    'const [posts, setPosts] = useState<any[]>([]);\n  const [categories, setCategories] = useState<any[]>([]);'
)

# 2. Add categories fetch in useEffect
content = content.replace(
    'const data = await fetchBlogPosts();',
    'const data = await fetchBlogPosts();\n      try {\n        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || "https://resultspro-service-users.onrender.com";\n        const catRes = await fetch(`${USERS_API}/api/v1/cms/blog/categories`);\n        if (catRes.ok) {\n          setCategories(await catRes.json());\n        }\n      } catch (e) {}'
)

# 3. Add handleCreateCategory
content = content.replace(
    'const totalPosts = posts.length;',
    'const totalPosts = posts.length;\n\n  const handleCreateCategory = async () => {\n    const name = window.prompt("Enter category name:");\n    if (!name) return;\n    try {\n      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || "https://resultspro-service-users.onrender.com";\n      const res = await fetch(`${USERS_API}/api/v1/cms/blog/categories`, {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ name })\n      });\n      if (res.ok) {\n        const newCat = await res.json();\n        setCategories([...categories, newCat]);\n      }\n    } catch (e) {\n      console.error(e);\n    }\n  };\n'
)

# 4. Attach onClick to Add Category button
content = content.replace(
    '<button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm">',
    '<button onClick={activeTab === "categories" ? handleCreateCategory : undefined} className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">'
)

# 5. Render categories in the table
categories_render = """              <tbody className="divide-y divide-slate-100">
                {categories.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No categories found. Add one to get started.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-slate-500">-</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-rose-600 hover:text-rose-800 text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>"""

content = re.sub(r'<tbody className="divide-y divide-slate-100">.*?<\/tbody>', categories_render, content, flags=re.DOTALL)

with open('admin/src/app/(dashboard)/cms/blog/page.tsx', 'w') as f:
    f.write(content)
