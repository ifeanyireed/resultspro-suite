import re

with open('landing_page/src/components/PricingSection.tsx', 'r') as f:
    content = f.read()

header = """          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-nets-navy)] mb-4">Suite Bundle Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Unlock the full potential of the ecosystem. Choose a comprehensive bundle plan tailored to your exact requirements.</p>
          </div>
"""

content = content.replace(
    '<div className={styles.tabs}>',
    header + '          <div className={styles.tabs}>'
)

with open('landing_page/src/components/PricingSection.tsx', 'w') as f:
    f.write(content)
