const fs = require('fs');
const path = 'admin/src/app/(dashboard)/exampro/tabs/UsersTab.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add fetchExamproPlans import
content = content.replace("import { fetchExamproUsers } from '@/lib/api';", "import { fetchExamproUsers, fetchExamproPlans } from '@/lib/api';");

// Add state for plans
content = content.replace("const [users, setUsers] = useState<any[]>([]);", "const [users, setUsers] = useState<any[]>([]);\n  const [plans, setPlans] = useState<any[]>([]);");

// Add active_plan_id to editForm
content = content.replace("coin_balance: 0", "coin_balance: 0,\n    active_plan_id: ''");

// Load plans
content = content.replace("const data = await fetchExamproUsers();", "const [data, plansData] = await Promise.all([fetchExamproUsers(), fetchExamproPlans()]);\n      setPlans(Array.isArray(plansData) ? plansData : []);");

// Update handleEdit
content = content.replace("coin_balance: user.coinBalance || 0", "coin_balance: user.coinBalance || 0,\n      active_plan_id: user.activePlanId || ''");

// Update handleSave
content = content.replace("coin_balance: Number(editForm.coin_balance)", "coin_balance: Number(editForm.coin_balance),\n          active_plan_id: editForm.active_plan_id || null");

const planTd = `
                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <select value={editForm.active_plan_id} onChange={e => setEditForm({...editForm, active_plan_id: e.target.value})} className="border border-slate-200 rounded p-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="">FREE (No Plan)</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={\`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider \${u.activePlanId ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}\`}>
                        {u.activePlanId ? plans.find(p => p.id === u.activePlanId)?.name || 'PRO' : 'FREE'}
                      </span>
                    )}
                  </td>
`;

const oldPlanTd = `                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <select value={editForm.is_premium ? 'PRO' : 'FREE'} onChange={e => setEditForm({...editForm, is_premium: e.target.value === 'PRO'})} className="border border-slate-200 rounded p-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="PRO">PRO</option>
                        <option value="FREE">FREE</option>
                      </select>
                    ) : (
                      <span className={\`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider \${u.isPremium ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}\`}>
                        {u.isPremium ? 'PRO' : 'FREE'}
                      </span>
                    )}
                  </td>`;

content = content.replace(oldPlanTd, planTd);

fs.writeFileSync(path, content);
