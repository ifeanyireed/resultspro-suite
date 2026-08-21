import os

files_to_fix = [
    'classroompro/src/app/login/page.tsx',
    'tutorspro/src/app/login/page.tsx'
]

for filepath in files_to_fix:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove Logo and duplicate Welcome Back header
    start_str = '<div className="text-center mb-10 flex flex-col items-center">'
    end_str = '</div>\n\n      <div className="p-8'
    
    if start_str in content:
        start_idx = content.find(start_str)
        end_idx = content.find(end_str, start_idx) + len('</div>\n\n      ')
        content = content[:start_idx] + content[end_idx:]

    # 2. Change the dark wrapper to just w-full
    content = content.replace('<div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl shadow-2xl">', '<div className="w-full">')
    content = content.replace('<div className="w-full max-w-[440px] relative z-10">', '<div className="w-full relative z-10">')

    # 3. Change input styles
    old_input = 'className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"'
    new_input = 'className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"'
    content = content.replace(old_input, new_input)
    
    old_mfa_input = 'className="w-full bg-navy border border-white/10 rounded-2xl py-4 text-center text-white text-3xl font-bold tracking-[0.5em] focus:outline-none focus:border-green/50 transition-colors"'
    new_mfa_input = 'className="block w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-900 text-3xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"'
    content = content.replace(old_mfa_input, new_mfa_input)

    # 4. Change Labels
    old_label = 'className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1"'
    new_label = 'className="block text-sm font-semibold text-slate-700"'
    content = content.replace(old_label, new_label)
    
    old_label2 = 'className="text-xs font-bold text-gray-500 uppercase tracking-widest"'
    content = content.replace(old_label2, new_label)

    # 5. Change Button Styles
    old_btn = 'className="w-full py-7 rounded-2xl bg-green text-navy font-bold text-lg flex items-center justify-center gap-2 group"'
    new_btn = 'className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"'
    content = content.replace(old_btn, new_btn)
    
    old_btn2 = 'className="w-full py-7 rounded-2xl bg-green text-navy font-bold text-lg flex items-center justify-center gap-2"'
    new_btn2 = 'className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"'
    content = content.replace(old_btn2, new_btn2)

    # 6. Change SSO buttons
    old_sso1 = 'className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-gray-500 font-bold text-sm opacity-50 cursor-not-allowed"'
    new_sso1 = 'className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-semibold text-sm opacity-50 cursor-not-allowed"'
    content = content.replace(old_sso1, new_sso1)
    
    old_sso2 = 'className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"'
    new_sso2 = 'className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm"'
    content = content.replace(old_sso2, new_sso2)

    # 7. Divider text
    old_divider = 'className="w-full border-t border-white/5"'
    new_divider = 'className="w-full border-t border-slate-200"'
    content = content.replace(old_divider, new_divider)
    
    old_div_text = 'className="bg-[#0d1b2a] px-2 text-gray-500 font-bold tracking-widest"'
    new_div_text = 'className="bg-white px-2 text-slate-500 font-medium"'
    content = content.replace(old_div_text, new_div_text)
    
    # 8. Icons colors
    content = content.replace('text-gray-500', 'text-slate-400')
    content = content.replace('text-white', 'text-slate-900')
    content = content.replace('text-blue', 'text-blue-600')
    
    # Bottom text and MFA fixes
    content = content.replace('text-green font-bold', 'text-blue-600 font-semibold')
    content = content.replace('bg-green/20', 'bg-blue-50')
    content = content.replace('text-green', 'text-blue-600')

    with open(filepath, 'w') as f:
        f.write(content)

print("Done fixing login forms!")
