with open('examspro/src/app/settings/tabs/ReferralTab.tsx', 'r') as f:
    content = f.read()

target1 = "const convertedCount = isArray ? referrals.filter(r => r.status === 'converted').length : 0;"
replacement1 = """const convertedCount = isArray ? referrals.filter(r => r.status === 'converted').length : 0;
  const activeCount = isArray ? referrals.filter(r => r.status === 'active' || r.status === 'converted').length : 0; // if converted, they are active too"""

target2 = "grid grid-cols-1 md:grid-cols-3 gap-6"
replacement2 = "grid grid-cols-1 md:grid-cols-4 gap-6"

target3 = """          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCircleCheck className="w-8 h-8 text-[#146ef5] mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{convertedCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Converted</div>
          </div>"""
replacement3 = """          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconUsers className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{activeCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <IconCircleCheck className="w-8 h-8 text-[#146ef5] mb-2 opacity-80" />
            <div className="text-2xl font-black text-slate-900">{convertedCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Converted</div>
          </div>"""

target4 = """                        ref.status === 'converted' ? 'bg-emerald-100 text-emerald-700' : """
replacement4 = """                        ref.status === 'converted' ? 'bg-emerald-100 text-emerald-700' : 
                        ref.status === 'active' ? 'bg-blue-100 text-blue-700' :"""

content = content.replace(target1, replacement1).replace(target2, replacement2).replace(target3, replacement3).replace(target4, replacement4)

with open('examspro/src/app/settings/tabs/ReferralTab.tsx', 'w') as f:
    f.write(content)
