with open('examspro/src/app/practice/[examId]/syllabus/SyllabusClient.tsx', 'r') as f:
    content = f.read()

import re

# Add useAuthStore import
content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { useAuthStore } from '@/store/useAuthStore';\nimport { Lock } from 'lucide-react';")
# Lucide-react might not have Lock, tabler-icons-react has IconLock
content = content.replace("import { Lock } from 'lucide-react';", "")
content = content.replace("IconTarget as Target, IconAlertCircle as AlertCircle } from '@tabler/icons-react';", "IconTarget as Target, IconAlertCircle as AlertCircle, IconLock as Lock } from '@tabler/icons-react';")

# Add user to component
content = content.replace("export default function SyllabusClient({ syllabus, examId }: { syllabus: any, examId: string }) {", "export default function SyllabusClient({ syllabus, examId }: { syllabus: any, examId: string }) {\n  const { user } = useAuthStore();")

# Add the block
old_return = r'''  const \{ exam \} = syllabus;

  return \('''
new_return = """  const { exam } = syllabus;

  if (examId === 'ican' && user && !user.hasIcan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-slate-200">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 mb-3">Premium Access Required</h2>
          <p className="text-gray-500 mb-8">
            You need an active ICAN Study Pack subscription to access the ICAN syllabus.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/practice')}
              className="flex-1 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="flex-1 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Go to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return ("""

content = re.sub(old_return, new_return, content)

with open('examspro/src/app/practice/[examId]/syllabus/SyllabusClient.tsx', 'w') as f:
    f.write(content)
print("Patched syllabus client")
