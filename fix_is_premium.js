const fs = require('fs');
const path = 'admin/src/app/(dashboard)/exampro/tabs/UsersTab.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("is_premium: editForm.is_premium,", "is_premium: !!editForm.active_plan_id,");

fs.writeFileSync(path, content);
