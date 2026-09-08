#!/bin/bash
sed -i '' 's/mt-20 p-12 rounded-\[40px\] bg-white shadow-sm border border-nets-border text-center flex flex-col items-center gap-6/relative overflow-hidden mt-20 p-12 rounded-[40px] shadow-2xl text-center flex flex-col items-center gap-6 bg-gradient-to-r from-[#146ef5] to-red-600 text-white/g' src/app/live/page.tsx
sed -i '' 's/w-12 h-12 text-blue opacity-50/w-12 h-12 text-white opacity-50/g' src/app/live/page.tsx
sed -i '' 's/font-bold text-navy">Prefer/font-bold text-white">Prefer/g' src/app/live/page.tsx
sed -i '' 's/text-gray-400 max-w-lg mb-4 text-lg/text-white\/80 max-w-lg mb-4 text-lg/g' src/app/live/page.tsx
sed -i '' 's/rounded-2xl border border-nets-border text-navy px-10 py-6 text-lg font-bold hover:bg-slate-50/rounded-2xl border-none bg-white text-navy px-10 py-6 text-lg font-bold hover:bg-slate-100 shadow-lg/g' src/app/live/page.tsx
