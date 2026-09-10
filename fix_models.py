import re

with open('service_users/models/blog.go', 'r') as f:
    content = f.read()

content = content.replace(
    'AuthorID    string     `json:"author_id"`',
    'AuthorID    string     `json:"author_id" gorm:"type:varchar(191)"`'
)

content = content.replace(
    'CategoryID  *string    `json:"category_id"`',
    'CategoryID  *string    `json:"category_id" gorm:"type:varchar(191)"`'
)

with open('service_users/models/blog.go', 'w') as f:
    f.write(content)
