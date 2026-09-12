const EXAMS_API = 'https://resultspro-service-examspro.onrender.com';
async function run() {
  try {
    const res = await fetch(`${EXAMS_API}/api/admin/overview`);
    console.log("Status:", res.status);
    if (!res.ok) throw new Error('Failed to fetch exams overview');
    console.log(await res.json());
  } catch (error) {
    console.error('Error fetching exams overview:', error.message);
  }
}
run();
