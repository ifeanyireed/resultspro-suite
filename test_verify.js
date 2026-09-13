async function run() {
  const res = await fetch("https://resultspro-service-users.onrender.com/api/v1/tenants/verify/9a3d58de-26da-4714-a6f9-964199039e84", {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: "VERIFIED" })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}
run();
