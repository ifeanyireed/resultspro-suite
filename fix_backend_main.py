import re

with open('service_users/main.go', 'r') as f:
    content = f.read()

content = content.replace(
    'handlers.HandleCreatePost(w, r)',
    'handlers.HandleCreatePost(w, r)\n		} else if r.Method == http.MethodPut {\n			handlers.HandleUpdatePost(w, r)'
)

with open('service_users/main.go', 'w') as f:
    f.write(content)
