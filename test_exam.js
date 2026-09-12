const USERS_API = "https://resultsproserviceusers.vercel.app";
const EXAMS_API = "https://resultspro-service-examspro.onrender.com";
async function run() {
  const loginRes = await fetch(`${USERS_API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "superadmin@resultspro.ng", password: "Admin@123" })
  });
  const data = await loginRes.json();
  const token = data.access_token;
  const overviewRes = await fetch(`${EXAMS_API}/api/admin/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Status:", overviewRes.status);
  console.log("Data:", await overviewRes.json());
}
run();
