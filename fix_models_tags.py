import re

with open('service_users/models/blog.go', 'r') as f:
    content = f.read()

content = content.replace(
    'UpdatedAt   time.Time  `json:"updated_at"`',
    'UpdatedAt   time.Time  `json:"updated_at"`\n	Tags        string     `json:"tags" gorm:"-"`'
)

with open('service_users/models/blog.go', 'w') as f:
    f.write(content)
