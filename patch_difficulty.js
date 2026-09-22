const fs = require('fs');

// 1. Update models.go
let modelsGo = fs.readFileSync('service_coursespro/models/models.go', 'utf8');
modelsGo = modelsGo.replace(
  /LocationType        string    \`gorm:"size:64;default:'Virtual'" json:"location_type"\`/,
  \`LocationType        string    \`gorm:"size:64;default:'Virtual'" json:"location_type"\`
\tDifficultyLevel     string    \`gorm:"size:64;default:'All Levels'" json:"difficulty_level"\`\`
);
fs.writeFileSync('service_coursespro/models/models.go', modelsGo);

// 2. Update schema.sql
let schemaSql = fs.readFileSync('service_coursespro/schema.sql', 'utf8');
schemaSql = schemaSql.replace(
  /location_type VARCHAR\(64\) DEFAULT 'Virtual',/,
  \`location_type VARCHAR(64) DEFAULT 'Virtual',
    difficulty_level VARCHAR(64) DEFAULT 'All Levels',\`
);
fs.writeFileSync('service_coursespro/schema.sql', schemaSql);

// 3. Update seed_fix_tenants.sql
let seedSql = fs.readFileSync('service_coursespro/seed_fix_tenants.sql', 'utf8');
seedSql = seedSql.replace(
  /meeting_time, location_type, created_at, updated_at\)/g,
  'meeting_time, location_type, difficulty_level, created_at, updated_at)'
);
seedSql = seedSql.replace(
  /'Virtual',\n                CURRENT_TIMESTAMP,/g,
  \`'Virtual',
                'Intermediate',
                CURRENT_TIMESTAMP,\`
);
fs.writeFileSync('service_coursespro/seed_fix_tenants.sql', seedSql);

