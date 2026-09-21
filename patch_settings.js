const fs = require('fs');
const file = 'coursespro/src/app/(admin)/admin/settings/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add BanknotesIcon to heroicons import
code = code.replace(/PhotoIcon/g, 'PhotoIcon,\n  BanknotesIcon');

// Add state
const stateAdd = `
  const [coursesSettings, setCoursesSettings] = useState({
    enable_mentor_payouts: true,
    payout_model: 'BASE_PLUS_SLA',
    payout_config_json: '{}'
  });

  const { data: cSettings } = useQuery({
    queryKey: ['courses_settings'],
    queryFn: async () => {
      const res = await api.get('/api/admin/settings');
      return res.data;
    }
  });

  useEffect(() => {
    if (cSettings) {
      setCoursesSettings({
        enable_mentor_payouts: cSettings.enable_mentor_payouts,
        payout_model: cSettings.payout_model || 'BASE_PLUS_SLA',
        payout_config_json: cSettings.payout_config_json || '{}'
      });
    }
  }, [cSettings]);
`;
code = code.replace('const [saving, setSaving] = useState(false);', 'const [saving, setSaving] = useState(false);' + stateAdd);

// Add save logic
const saveAdd = `
      await api.put('/api/admin/settings', {
        tenant_id: tenantId,
        enable_mentor_payouts: coursesSettings.enable_mentor_payouts,
        payout_model: coursesSettings.payout_model,
        payout_config_json: coursesSettings.payout_config_json
      });
`;
code = code.replace('setSaveSuccess(true);', saveAdd + '\n      setSaveSuccess(true);');

// Add UI
const uiAdd = `
        {/* Mentor Payout Config */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Mentor Earnings & Payouts</h3>
              <p className="text-xs text-gray-500">Configure how mentors are compensated for their cohorts.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Enable On-Platform Earnings</p>
                <p className="text-xs text-gray-500 mt-0.5">Toggle off if you handle payments off-platform.</p>
              </div>
              <div 
                className={\`w-12 h-6 rounded-full relative cursor-pointer transition-colors \${coursesSettings.enable_mentor_payouts ? 'bg-[#146ef5]' : 'bg-gray-200'}\`}
                onClick={() => setCoursesSettings({...coursesSettings, enable_mentor_payouts: !coursesSettings.enable_mentor_payouts})}
              >
                <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform \${coursesSettings.enable_mentor_payouts ? 'right-1' : 'left-1 shadow-sm'}\`}></div>
              </div>
            </div>
            
            {coursesSettings.enable_mentor_payouts && (
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Earning Model</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] bg-gray-50/50"
                  value={coursesSettings.payout_model}
                  onChange={e => setCoursesSettings({...coursesSettings, payout_model: e.target.value})}
                >
                  <option value="BASE_PLUS_SLA">Base + SLA Bonus (Recommended)</option>
                  <option value="PAY_PER_ACTION">Pay-Per-Action (Granular)</option>
                  <option value="REVENUE_SHARE">Revenue Share</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {coursesSettings.payout_model === 'BASE_PLUS_SLA' && 'Mentors get a fixed base pay per cohort, plus bonuses for fast reviews.'}
                  {coursesSettings.payout_model === 'PAY_PER_ACTION' && 'Mentors are paid a small fee per submission reviewed and per live class held.'}
                  {coursesSettings.payout_model === 'REVENUE_SHARE' && 'Mentors earn a percentage of the total tuition paid by students in their cohort.'}
                </p>
              </div>
            )}
          </div>
        </div>

`;
code = code.replace('{/* AI Config */}', uiAdd + '\n        {/* AI Config */}');

fs.writeFileSync(file, code);
