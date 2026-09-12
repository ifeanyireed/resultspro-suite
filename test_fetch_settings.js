const EXAMS_API = 'https://resultspro-service-examspro.onrender.com';
async function run() {
  try {
    const res = await fetch(`${EXAMS_API}/api/admin/settings?_t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' }, cache: 'no-store' });
    console.log("Settings Status:", res.status);
    console.log(await res.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}
run();
