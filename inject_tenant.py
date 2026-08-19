import os
import re

files_to_process = [
    "./service_tutorspro/models/models.go",
    "./service_coursespro/models/models.go",
    "./service_examspro/internal/models/exam.go",
    "./service_examspro/internal/models/user.go",
    "./service_examspro/internal/models/notification.go",
    "./service_examspro/internal/models/live.go",
    "./service_examspro/internal/models/admin.go",
    "./service_examspro/internal/models/battle.go",
    "./service_examspro/internal/models/study.go",
    "./service_examspro/internal/models/blog.go",
    "./service_resultspro/models/scratch_card.go",
    "./service_resultspro/models/result.go",
    "./service_classroompro/models/models.go"
]

struct_pattern = re.compile(r'^(type\s+\w+\s+struct\s*\{)$', re.MULTILINE)
tenant_field = '\tTenantID string `gorm:"size:64;index" json:"tenant_id"`'

for fpath in files_to_process:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r') as f:
        content = f.read()
    
    # Check if TenantID is already there
    if 'TenantID string' in content:
        continue
        
    # Replace
    new_content = struct_pattern.sub(r'\1\n' + tenant_field, content)
    
    with open(fpath, 'w') as f:
        f.write(new_content)
        
    print(f"Injected into {fpath}")
