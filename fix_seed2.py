with open('service_users/seed_blog.go', 'r') as f:
    content = f.read()

# Replace db.GormDB.Create(&c) with FirstOrCreate
new_loop = """	for i := range categories {
		c := &categories[i]
		if err := db.GormDB.Where("slug = ?", c.Slug).FirstOrCreate(c).Error; err != nil {
			log.Printf("Failed to create/find cat: %v", err)
		}
		catMap[c.Name] = c.ID
	}"""

import re
content = re.sub(r'for _, c := range categories \{.*?catMap\[c.Name\] = c.ID\n\t\}', new_loop, content, flags=re.DOTALL)

with open('service_users/seed_blog.go', 'w') as f:
    f.write(content)
