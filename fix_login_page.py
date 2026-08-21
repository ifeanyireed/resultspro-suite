import os

def fix_file(filepath, app_name, desc):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the export default function LoginPage
    start_idx = content.find('export default function LoginPage() {')
    if start_idx == -1:
        return
    
    # We will just replace everything from export default function LoginPage to the end
    new_page = f"""export default function LoginPage() {{
  return (
    <SharedLoginPage brandTitle="{app_name}" brandSubtitle="EDU SUITE" appDescription="{desc}">
      <Suspense fallback={{<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}}>
        <LoginForm />
      </Suspense>
    </SharedLoginPage>
  );
}}
"""
    
    content = content[:start_idx] + new_page
    
    with open(filepath, 'w') as f:
        f.write(content)

fix_file('classroompro/src/app/login/page.tsx', 'ClassroomPRO', 'The Ultimate Learning Management System')
fix_file('tutorspro/src/app/login/page.tsx', 'TutorsPRO', 'The Ultimate Platform for Tutors')
print("Done fixing LoginPage")
