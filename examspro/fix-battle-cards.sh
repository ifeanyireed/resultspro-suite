#!/bin/bash
FILE="src/app/battle-mode/page.tsx"

# Fix filter input
sed -i '' 's/bg-white border border-white\/\[0.1\] border-t-white\/\[0.15\] rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-green\/50/bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-navy focus:outline-none focus:border-blue/g' $FILE

# Fix map to have idx
sed -i '' 's/filteredBattles.map((battle) => (/filteredBattles.map((battle, idx) => (/g' $FILE

# Fix card classes
sed -i '' 's/className="group p-6 rounded-3xl bg-white border border-nets-border hover:border-white\/10 transition-all flex items-center justify-between"/className={`group p-6 rounded-3xl transition-all flex items-center justify-between border-none shadow-sm hover:shadow-lg hover:-translate-y-1 bg-gradient-to-r text-white ${idx % 2 === 0 ? '"'"'from-[#146ef5] to-[#0a2e70]'"'"' : '"'"'from-red-500 to-red-800'"'"'}`}/g' $FILE

# Adjust inside text for readability
sed -i '' 's/text-xs text-gray-500/text-xs text-white\/80/g' $FILE
sed -i '' 's/text-gray-600/text-white\/60/g' $FILE
sed -i '' 's/border-navy/border-transparent/g' $FILE
sed -i '' 's/text-green/text-[#00ff88]/g' $FILE
sed -i '' 's/text-blue/text-white/g' $FILE

