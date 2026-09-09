import re

with open('examspro/src/app/dashboard/settings/page.tsx', 'r') as f:
    content = f.read()

# Add useState
content = content.replace("import { WidgetCard } from '@/components/ui/Cards';", "import { WidgetCard } from '@/components/ui/Cards';\nimport { useState } from 'react';")

# Add activeTab state
content = content.replace("export default function SettingsPage() {\n  const sections =", "export default function SettingsPage() {\n  const [activeTab, setActiveTab] = useState('Account');\n  const sections =")

# Add the tabs UI
tabs_ui = """      {/* Horizontal Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 overflow-x-auto">
        {sections.map(s => (
          <button 
            key={s.title}
            onClick={() => setActiveTab(s.title)}
            className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all whitespace-nowrap ${
              activeTab === s.title 
                ? 'bg-[#146ef5] text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sections.filter(s => s.title === activeTab).map((section, i) => ("""

# Replace the sections map
content = content.replace("""      <div className="space-y-6">
        {sections.map((section, i) => (""", tabs_ui)

with open('examspro/src/app/dashboard/settings/page.tsx', 'w') as f:
    f.write(content)
