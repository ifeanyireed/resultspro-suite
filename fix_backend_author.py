import re

with open('service_users/models/blog.go', 'r') as f:
    content = f.read()

content = content.replace(
    'AuthorID    string     `json:"author_id" gorm:"type:varchar(191)"`',
    'AuthorID    string     `json:"author_id" gorm:"type:varchar(191)"`\n	Author      *User      `json:"author" gorm:"foreignKey:AuthorID"`'
)

with open('service_users/models/blog.go', 'w') as f:
    f.write(content)

with open('service_users/handlers/blog.go', 'r') as f:
    content = f.read()

content = content.replace(
    'db.GormDB.Order("created_at desc").Find(&posts)',
    'db.GormDB.Preload("Author").Order("created_at desc").Find(&posts)'
)

with open('service_users/handlers/blog.go', 'w') as f:
    f.write(content)
