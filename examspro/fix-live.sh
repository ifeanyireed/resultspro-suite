#!/bin/bash
sed -i '' 's/p-8 rounded-\[40px\] bg-white shadow-sm border border-nets-border flex flex-col gap-4/relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white/1' src/app/live/page.tsx
sed -i '' 's/p-8 rounded-\[40px\] bg-white shadow-sm border border-nets-border flex flex-col gap-4/relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-red-500 to-red-900 text-white/1' src/app/live/page.tsx
sed -i '' 's/p-8 rounded-\[40px\] bg-white shadow-sm border border-nets-border flex flex-col gap-4/relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white/1' src/app/live/page.tsx

sed -i '' 's/bg-blue\/10 flex items-center justify-center text-blue/bg-white\/20 flex items-center justify-center text-white/g' src/app/live/page.tsx
sed -i '' 's/bg-amber\/10 flex items-center justify-center text-amber/bg-white\/20 flex items-center justify-center text-white/g' src/app/live/page.tsx
sed -i '' 's/text-sm text-muted/text-sm text-white\/80/g' src/app/live/page.tsx
