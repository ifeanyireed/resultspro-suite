import sqlite3
import re
import uuid
import os

db_path = 'service_examspro/dev.db'
out_path = 'service_examspro/examspro_seed.sql'

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
all_tables = [row['name'] for row in cursor.fetchall()]

# Only include content-related tables
allowed_tables = ['exams', 'subjects', 'topics', 'questions', 'question_options', 'system_settings']
tables = [t for t in all_tables if t in allowed_tables]

# These are the bad IDs we want to replace with actual UUIDs
dummy_mapping = {
    'dummy-ref-1': '00000000-0000-0000-0000-000000000001',
    'dummy-ref-2': '00000000-0000-0000-0000-000000000002',
    'USR-001': '00000000-0000-0000-0000-000000000003',
}

# Find other bad IDs starting with 'ref-' and map them
cursor.execute("SELECT id FROM referrals")
for row in cursor.fetchall():
    rid = row['id']
    if rid and rid.startswith('ref-'):
        if rid not in dummy_mapping:
            dummy_mapping[rid] = str(uuid.uuid4())

def sanitize_value(val):
    if val is None:
        return 'NULL'
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, str):
        # Replace bad IDs
        for bad_id, good_id in dummy_mapping.items():
            if val == bad_id:
                val = good_id
        # Escape single quotes and backslashes for MySQL
        val = val.replace('\\\\', '\\\\\\\\').replace("'", "''")
        return f"'{val}'"
    # Fallback
    return f"'{str(val)}'"

with open(out_path, 'w', encoding='utf-8') as f:
    f.write("SET FOREIGN_KEY_CHECKS=0;\n")
    f.write("START TRANSACTION;\n\n")

    for table in tables:
        cursor.execute(f"PRAGMA table_info(`{table}`)")
        columns_info = cursor.fetchall()
        col_names = [info['name'] for info in columns_info]
        
        # Rename 'name' to 'full_name' for users table to match service_users schema
        mapped_col_names = []
        for c in col_names:
            if table == 'users' and c == 'name':
                mapped_col_names.append('full_name')
            elif table == 'users' and c == 'password':
                mapped_col_names.append('password_hash')
            else:
                mapped_col_names.append(f"`{c}`")
                
        col_str = ", ".join(mapped_col_names)

        cursor.execute(f"SELECT * FROM `{table}`")
        rows = cursor.fetchall()

        if rows:
            f.write(f"-- Data for {table}\n")
            # MySQL allows bulk inserts, let's group them by 100
            batch_size = 100
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                f.write(f"INSERT INTO `{table}` ({col_str}) VALUES\n")
                
                values_list = []
                for row in batch:
                    vals = [sanitize_value(row[c]) for c in col_names]
                    values_list.append("(" + ", ".join(vals) + ")")
                
                f.write(",\n".join(values_list) + ";\n")
            f.write("\n")

    f.write("SET FOREIGN_KEY_CHECKS=1;\n")
    f.write("COMMIT;\n")

print(f"Successfully generated {out_path} with explicit column names and fixed UUIDs!")
