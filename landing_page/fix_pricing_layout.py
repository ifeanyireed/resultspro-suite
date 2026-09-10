import re

with open('src/app/(marketing)/pricing/Pricing.module.css', 'r') as f:
    css = f.read()

# Remove flex: 1 from .card and add width: 100%
css = css.replace('.card {\n  flex: 1;\n', '.card {\n  width: 100%;\n')

# Define .revealWrapper before .card
css = css.replace('.card {\n', '.revealWrapper {\n  flex: 1;\n  display: flex;\n}\n\n.card {\n', 1)

# Fix media queries
css = css.replace('''@media (max-width: 1024px) {
  .grid {
    flex-wrap: wrap;
  }
  
  .card {
    min-width: 300px;
    flex: 1 1 calc(50% - 2rem);
  }
}''', '''@media (max-width: 1024px) {
  .grid {
    flex-wrap: wrap;
  }
  
  .revealWrapper {
    min-width: 300px;
    flex: 1 1 calc(50% - 2rem);
  }
}''')

css = css.replace('''@media (max-width: 768px) {
  .grid {
    flex-direction: column;
  }
  
  .card {
    min-width: 100%;
    transform: none !important;
  }''', '''@media (max-width: 768px) {
  .grid {
    flex-direction: column;
  }
  
  .revealWrapper {
    min-width: 100%;
  }
  
  .card {
    transform: none !important;
  }''')

with open('src/app/(marketing)/pricing/Pricing.module.css', 'w') as f:
    f.write(css)
