import requests

API_URL = "http://localhost:7001/api/v1/cms/blog"

# Create Categories
categories = [
    {"name": "Education", "slug": "education"},
    {"name": "Exams", "slug": "exams"},
    {"name": "Product", "slug": "product"}
]
cat_map = {}
for c in categories:
    res = requests.post(f"{API_URL}/categories", json=c)
    if res.status_code == 201:
        cat_map[c['name']] = res.json()['id']
        print(f"Created category: {c['name']}")

# Create Author (dummy user if doesn't exist, wait, author_id is a foreign key to users. I should just get a random user from DB)
