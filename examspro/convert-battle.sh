#!/bin/bash
FILE="src/app/battle-mode/page.tsx"

# Main background
sed -i '' 's/bg-navy/bg-white/g' $FILE
# For the main header text: text-white -> text-navy (but only for the header and standard text)
sed -i '' 's/text-4xl md:text-6xl font-display font-black text-white/text-4xl md:text-6xl font-display font-black text-navy/g' $FILE
sed -i '' 's/text-gray-400/text-gray-500/g' $FILE

# The ELO box (currently bg-white/[0.02])
sed -i '' 's/bg-white\/\[0.02\] border border-white\/\[0.05\] border-t-white\/\[0.1\] backdrop-blur-xl backdrop-saturate-\[1.2\] shadow-\[0_8px_32px_0_rgba(0,0,0,0.36)\] shadow-\[inset_0_1px_0_rgba(255,255,255,0.1)\]/bg-slate-50 border border-slate-200 shadow-sm/g' $FILE
sed -i '' 's/text-3xl font-display font-black text-white/text-3xl font-display font-black text-navy/g' $FILE

# Quick Match CTA 
sed -i '' 's/relative bg-navy rounded-\[38px\]/relative bg-white rounded-[38px]/g' $FILE
sed -i '' 's/text-3xl md:text-5xl font-display font-black text-white/text-3xl md:text-5xl font-display font-black text-navy/g' $FILE

# Quick Match Buttons
sed -i '' 's/border-white\/10 bg-white\/5 text-white hover:bg-white\/10 hover:border-white\/20/border-slate-200 bg-white text-navy hover:bg-slate-50 hover:border-slate-300/g' $FILE

# Custom Battle & Active Battles Cards
sed -i '' 's/bg-white\/\[0.02\]/bg-white/g' $FILE
sed -i '' 's/border-white\/\[0.05\] border-t-white\/\[0.1\]/border-nets-border/g' $FILE
sed -i '' 's/text-xl font-display font-bold text-white/text-xl font-display font-bold text-navy/g' $FILE

# Custom Battle sub-buttons
sed -i '' 's/bg-white\/5 border border-white\/\[0.1\] border-t-white\/\[0.15\] text-white hover:bg-white\/10/bg-slate-50 border border-slate-200 text-navy hover:bg-slate-100/g' $FILE

# Active battles grid
sed -i '' 's/text-2xl font-display font-bold text-white/text-2xl font-display font-bold text-navy/g' $FILE
sed -i '' 's/text-lg font-display font-bold text-white/text-lg font-display font-bold text-navy/g' $FILE
sed -i '' 's/bg-white\/10 border-white\/20/bg-slate-100 border-slate-200/g' $FILE

# Active Battles gradient application
# We need to find the map over activeBattles and apply the alternating gradient
# Let's see if we can do this with sed or if it's better to use replace_file_content for the specific map block.
