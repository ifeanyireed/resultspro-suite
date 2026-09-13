async function run() {
  const res = await fetch("https://resultspro-service-users.onrender.com/api/v1/tenants");
  const data = await res.json();
  const t = data.find(x => x.id === "9a3d58de-26da-4714-a6f9-964199039e84");
  console.log("Status:", t.verification_status);
}
run();
