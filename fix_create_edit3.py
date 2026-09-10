import re

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")
content = content.replace("if (window.tinymce || document.querySelector('.tiptap')) {", "if ((window as any).tinymce || document.querySelector('.tiptap')) {")

with open('admin/src/app/(dashboard)/cms/blog/create/page.tsx', 'w') as f:
    f.write(content)
