import re

with open('handlers/blog.go', 'r') as f:
    content = f.read()

# Add encoding/json import
content = content.replace('"math/rand"', '"math/rand"\n\t"encoding/json"')

# Replace ParseJSONBody
content = content.replace('if err := utils.ParseJSONBody(r, &input); err != nil {', 'if err := json.NewDecoder(r.Body).Decode(&input); err != nil {')

with open('handlers/blog.go', 'w') as f:
    f.write(content)
