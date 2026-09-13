const fs = require('fs');
const path = 'admin/src/app/(dashboard)/coursespro/tenants/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const uploadInput = `              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Logo</label>
                <div className="flex items-center gap-4">
                  {editTenantData.logo_url ? (
                    <img src={editTenantData.logo_url} alt="Logo" className="w-10 h-10 object-contain bg-slate-50 rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">No Logo</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleUploadLogo}
                    disabled={isUploadingLogo}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {isUploadingLogo && <span className="text-xs text-blue-500">Uploading...</span>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email</label>`;

content = content.replace(/<div className="space-y-1.5">\s*<label className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email<\/label>/, uploadInput);
fs.writeFileSync(path, content);
