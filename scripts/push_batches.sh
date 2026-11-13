#!/bin/bash
set -e

# Change to repository root
cd "$(dirname "$0")/.."

echo "=== Current Git Status ==="
git status --short

echo ""
echo "=== Batch 1: TutorsPRO Golden-Yellow Design System ==="
git add tutorspro/src/app/nets.css tutorspro/src/app/globals.css tutorspro/src/components/Navbar.tsx tutorspro/src/app/page.tsx 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "style(tutorspro): harmonize brand theme with golden-yellow #FBBC04 and navy #0D1060"
  echo "✔ Committed Batch 1 (TutorsPRO Design System)"
else
  echo "• No changes to commit for Batch 1"
fi

echo ""
echo "=== Batch 2: ScholarsNG Golden-Yellow Design System ==="
git add scholars_ng/web_app/src/app/globals.css scholars_ng/web_app/src/components/Navbar.tsx scholars_ng/web_app/src/components/Hero.tsx scholars_ng/web_app/src/components/Footer.tsx scholars_ng/web_app/src/app/page.tsx 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "style(scholars_ng): align portal and landing theme to golden-yellow #FBBC04 design system"
  echo "✔ Committed Batch 2 (ScholarsNG Design System)"
else
  echo "• No changes to commit for Batch 2"
fi

echo ""
echo "=== Batch 3: ResultsPRO Reusable Feature Slice & Modules Barrel ==="
git add resultspro/src/components/gradebook/CompactGradebook.tsx resultspro/src/components/ResultCheckerView.tsx resultspro/src/modules.ts 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "feat(resultspro): export CompactGradebook and ResultCheckerView via modules barrel for monorepo embedding"
  echo "✔ Committed Batch 3 (ResultsPRO Reusable Modules)"
else
  echo "• No changes to commit for Batch 3"
fi

echo ""
echo "=== Batch 4: ScholarsNG Monorepo Transpilation Configuration ==="
git add scholars_ng/web_app/next.config.ts 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "chore(scholars_ng): configure external directory transpilation for monorepo package imports"
  echo "✔ Committed Batch 4 (ScholarsNG Next.js Config)"
else
  echo "• No changes to commit for Batch 4"
fi

echo ""
echo "=== Remaining Working Directory Status ==="
git status --short

echo ""
echo "=== Pushing to origin/dev ==="
git push origin dev

echo ""
echo "✔ All batches successfully pushed to origin/dev!"
