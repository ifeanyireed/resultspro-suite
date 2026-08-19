import os
import glob
import re

folders = [
    "./service_coursespro/handlers/*.go",
    "./service_tutorspro/handlers/*.go",
    "./service_classroompro/handlers/*.go",
    "./service_resultspro/handlers/*.go",
    "./service_examspro/internal/api/handlers/*.go"
]

for folder in folders:
    for fpath in glob.glob(folder):
        with open(fpath, 'r') as f:
            content = f.read()
        
        # Replace db.DB. with db.WithTenant(c).
        new_content = content.replace("db.DB.", "db.WithTenant(c).")
        # Replace database.DB. with database.WithTenant(c). for examspro
        new_content = new_content.replace("database.DB.", "database.WithTenant(c).")
        
        # Also handle resultspro's db.GormDB.
        new_content = new_content.replace("db.GormDB.", "db.WithTenant(c).")
        
        if content != new_content:
            with open(fpath, 'w') as f:
                f.write(new_content)
            print(f"Updated {fpath}")

