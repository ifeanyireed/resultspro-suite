import os

src = 'src/app/(app)/layout.tsx'
dest = 'src/app/(mentor)/layout.tsx'

with open(src, 'r') as f:
    content = f.read()

new_links = """            {/* Menu Sections */}
            <div className="px-6 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENTOR OS</p>
              
              <Link href="/mentor" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor') && pathname === '/mentor' ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Squares2X2Icon className="w-6 h-6" />
                Overview
              </Link>

              <Link href="/mentor/reviews" className={`flex items-center justify-between text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor/reviews') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                  Reviews
                </div>
                <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">12 Pending</span>
              </Link>

              <Link href="/mentor/cohorts" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor/cohorts') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <UserGroupIcon className="w-6 h-6" />
                My Cohorts
              </Link>
              
              <Link href="/mentor/sessions" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor/sessions') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <CalendarIcon className="w-6 h-6" />
                1:1 Sessions
              </Link>
              
              <Link href="/mentor/earnings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor/earnings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BriefcaseIcon className="w-6 h-6" />
                Earnings
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link href="/mentor/settings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/mentor/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Cog6ToothIcon className="w-6 h-6" />
                  Settings
                </Link>
                <Link href="/" className="flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  Logout
                </Link>
              </div>
            </div>"""

start = content.find('{/* Menu Sections */}')
end = content.find('{/* Bottom App Promo */}')

content = content[:start] + new_links + '\n\n          ' + content[end:]

import re
content = re.sub(
    r'const isActive =[\s\S]*?return \(',
    '''const isActive = (path: string) => {
    if (path === '/mentor') return pathname === '/mentor';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (''',
    content
)

with open(dest, 'w') as f:
    f.write(content)
