with open('service_coursespro/main.go', 'r') as f:
    content = f.read()

if 'protected.PUT("/admin/mentors/:id", h.AdminUpdateMentor)' not in content:
    content = content.replace(
        'protected.DELETE("/admin/mentors/:id", h.AdminDeleteMentor)',
        'protected.DELETE("/admin/mentors/:id", h.AdminDeleteMentor)\n\t\tprotected.PUT("/admin/mentors/:id", h.AdminUpdateMentor)'
    )
    with open('service_coursespro/main.go', 'w') as f:
        f.write(content)
