const fs = require('fs');
let content = fs.readFileSync('coursespro/src/app/(admin)/admin/program-builder/[id]/PreviewModal.tsx', 'utf8');

const compilerPreviewBlock = `
                        {block.type === 'COMPILER' && (
                          <div className={\`w-full h-[500px] relative \${isMediaWithoutCard ? 'rounded-xl overflow-hidden shadow-sm' : 'bg-white'}\`}>
                            {block.url ? (
                              <iframe 
                                src={\`https://onecompiler.com/embed/\${block.url}?code=\${encodeURIComponent(block.content || '')}&hideLanguageSelection=true&hideNew=true&hideTitle=true\`}
                                className="w-full h-full border-0 bg-white" 
                                title="Code Compiler" 
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">No language selected</div>
                            )}
                          </div>
                        )}
`;

content = content.replace("{block.type === 'QUIZ' && (", compilerPreviewBlock + "\n                        {block.type === 'QUIZ' && (");

fs.writeFileSync('coursespro/src/app/(admin)/admin/program-builder/[id]/PreviewModal.tsx', content);
