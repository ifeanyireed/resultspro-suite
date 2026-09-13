const fs = require('fs');
const path = 'admin/src/app/(dashboard)/coursespro/tenants/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const handleUploadCode = `  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
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

  const handleUpdateTenant`;

content = content.replace('  const handleUpdateTenant', handleUploadCode);
fs.writeFileSync(path, content);
