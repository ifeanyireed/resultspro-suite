with open('service_users/seed_blog.go', 'r') as f:
    content = f.read()

# Add explicit alter tables before automigrate
alter = """
    // Fix existing schema manually
    db.GormDB.Exec("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PUBLISHED'")
    db.GormDB.Exec("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at DATETIME(3)")
    
    // Ensure tables exist
"""
content = content.replace('// Ensure tables exist', alter)

with open('service_users/seed_blog.go', 'w') as f:
    f.write(content)
