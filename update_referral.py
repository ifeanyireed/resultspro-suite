import re

with open('examspro/src/app/referral/page.tsx', 'r') as f:
    content = f.read()

# Replace dark mode classes with light mode classes
replacements = {
    'bg-navy': 'bg-slate-50',
    'text-white': 'text-slate-900',
    'bg-white/[0.02]': 'bg-white',
    'border-white/[0.05]': 'border-slate-200',
    'border-t-white/[0.1]': 'shadow-sm',
    'shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]': 'shadow-md',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]': '',
    'text-gray-400': 'text-slate-600',
    'text-gray-300': 'text-slate-700',
    'text-gray-500': 'text-slate-500',
    'bg-white/5': 'bg-slate-100',
    'border-white/10': 'border-slate-200',
    'border-white/[0.1]': 'border-slate-200',
    'border-t-white/[0.15]': '',
    'hover:border-white/10': 'hover:border-slate-300',
    'text-white/5': 'text-slate-100',
    'group-hover:text-blue/10': 'group-hover:text-blue-100',
    'bg-gray-800': 'bg-slate-200',
    'text-gray-600': 'text-slate-400',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('examspro/src/app/referral/page.tsx', 'w') as f:
    f.write(content)

print("Done")
