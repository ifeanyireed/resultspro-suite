import os
import re

files_to_process = {
    "./service_tutorspro/db/db.go": "DB",
    "./service_coursespro/db/db.go": "DB",
    "./service_classroompro/db/db.go": "DB",
    "./service_resultspro/db/db.go": "GormDB",
    "./service_examspro/internal/database/db.go": "DB"
}

import_statement = '\t"github.com/gin-gonic/gin"\n'

for fpath, db_var in files_to_process.items():
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r') as f:
        content = f.read()
    
    # Check if WithTenant is already there
    if 'func WithTenant' in content:
        continue
        
    func_def = f"""
// WithTenant safely scopes the GORM {db_var} instance to the current request's Tenant ID
func WithTenant(c *gin.Context) *gorm.DB {{
	tenantID, exists := c.Get("tenant_id")
	if exists && tenantID != "" {{
		return {db_var}.Where("tenant_id = ?", tenantID)
	}}
	return {db_var}
}}
"""
    # Inject gin import if not exists
    if '"github.com/gin-gonic/gin"' not in content:
        content = re.sub(r'import\s+\(', f'import (\n{import_statement}', content, count=1)

    new_content = content + "\n" + func_def
    
    with open(fpath, 'w') as f:
        f.write(new_content)
        
    print(f"Injected into {fpath}")
