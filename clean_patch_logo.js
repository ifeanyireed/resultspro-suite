const fs = require('fs');
const path = 'admin/src/app/(dashboard)/coursespro/tenants/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add logo_url to newTenantData
content = content.replace(
  "enabled_modules: ['coursepro'] // Default module\n  });",
  "enabled_modules: ['coursepro'], // Default module\n    logo_url: ''\n  });"
);

content = content.replace(
  "setNewTenantData({ name: '', slug: '', contact_email: '', primary_color: '#2563eb', type: 'COURSESPRO', enabled_modules: ['coursepro'] });",
  "setNewTenantData({ name: '', slug: '', contact_email: '', primary_color: '#2563eb', type: 'COURSESPRO', enabled_modules: ['coursepro'], logo_url: '' });"
);

// 2. Add handleNewLogoUpload and handleEditLogoUpload
const newHandlers = `
  const handleEditLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditTenantData({ ...editTenantData, logo_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Something went wrong during upload');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleNewLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewTenantData({ ...newTenantData, logo_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Something went wrong during upload');
    } finally {
      setIsUploadingLogo(false);
    }
  };
`;

content = content.replace(/  const handleUploadLogo = async \([\s\S]*?setIsUploadingLogo\(false\);\n    \}\n  \};/, newHandlers);

// 3. Fix Edit modal to use handleEditLogoUpload
content = content.replace("onChange={handleUploadLogo}", "onChange={handleEditLogoUpload}");

// 4. Inject into Create Modal (carefully find the right place)
// Let's find "CoursesPro Tenant Name" input block, which is inside Create modal
const createModalLogoUI = `
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Logo</label>
                <div className="flex items-center gap-4">
                  {newTenantData.logo_url ? (
                    <img src={newTenantData.logo_url} alt="Logo" className="w-10 h-10 object-contain bg-slate-50 rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">No Logo</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleNewLogoUpload}
                    disabled={isUploadingLogo}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {isUploadingLogo && <span className="text-xs text-blue-500">Uploading...</span>}
                </div>
              </div>
`;

content = content.replace(/              <div className="space-y-1.5">\n                <label className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email<\/label>/, createModalLogoUI + `              <div className="space-y-1.5">\n                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email</label>`);

fs.writeFileSync(path, content);
