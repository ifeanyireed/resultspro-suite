import os

# For blog list
list_path = 'landing_page/src/app/(marketing)/blog/page.tsx'
with open(list_path, 'r') as f:
    list_content = f.read()
if 'export const revalidate' not in list_content:
    list_content = list_content.replace('export const metadata = {', 'export const revalidate = 60;\n\nexport const metadata = {')
with open(list_path, 'w') as f:
    f.write(list_content)

# For blog slug
slug_path = 'landing_page/src/app/(marketing)/blog/[slug]/page.tsx'
with open(slug_path, 'r') as f:
    slug_content = f.read()
if 'export const revalidate' not in slug_content:
    slug_content = slug_content.replace('export async function generateMetadata', 'export const revalidate = 60;\nexport const dynamicParams = true;\n\nexport async function generateMetadata')
with open(slug_path, 'w') as f:
    f.write(slug_content)

