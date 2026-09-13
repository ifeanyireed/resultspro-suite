const fs = require('fs');
const path = 'admin/src/app/(dashboard)/coursespro/tenants/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add status to editTenantData
content = content.replace(
  "logo_url: school.logo_url || '',",
  "logo_url: school.logo_url || '',\n                              status: school.status || 'ACTIVE',"
);

// 2. Add Activate/Suspend button in Edit Modal
const toggleStatusCode = `              <div className="space-y-1.5 flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Account Status</label>
                  <span className="text-xs font-medium text-slate-700">{editTenantData.status === 'ACTIVE' ? 'Active' : 'Suspended'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTenantData({ ...editTenantData, status: editTenantData.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                  className={\`px-3 py-1.5 rounded-full text-xs font-medium transition-all \${editTenantData.status === 'ACTIVE' ? 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}\`}
                >
                  {editTenantData.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Name</label>`;

content = content.replace(/<div className="space-y-1.5">\s*<label className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider">Tenant Name<\/label>/, toggleStatusCode);

fs.writeFileSync(path, content);
