const fs = require('fs');
let content = fs.readFileSync('coursespro/src/app/(admin)/admin/program-builder/[id]/page.tsx', 'utf8');

const compilerBlock = `
                            {item.type === 'COMPILER' && (
                              <div className="w-full text-left bg-white p-3 border border-slate-200 rounded-md shadow-sm" onClick={e => e.stopPropagation()}>
                                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                  Programming Language
                                </label>
                                <select 
                                  className="w-full border border-slate-300 rounded-md p-2 text-sm mb-3 outline-none focus:border-blue-500"
                                  value={item.url || ''} 
                                  onChange={e => { 
                                    const i = parseContents(mod); 
                                    i[index].url = e.target.value; 
                                    setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                  }} 
                                  onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })}
                                >
                                  <option value="">-- Select Language --</option>
                                  <option value="python">Python</option>
                                  <option value="javascript">JavaScript</option>
                                  <option value="html">HTML/CSS/JS</option>
                                  <option value="java">Java</option>
                                  <option value="cpp">C++</option>
                                  <option value="c">C</option>
                                  <option value="csharp">C#</option>
                                  <option value="go">Go</option>
                                  <option value="rust">Rust</option>
                                  <option value="php">PHP</option>
                                  <option value="ruby">Ruby</option>
                                </select>
                                
                                <label className="block text-xs font-medium text-slate-700 mb-1">Initial Code Snippet (Optional)</label>
                                <textarea 
                                  className="w-full border border-slate-300 rounded-md p-2 text-sm font-mono" 
                                  rows={5} 
                                  placeholder="def hello_world():\n    print('Hello')"
                                  value={item.content || ''} 
                                  onChange={e => { 
                                    const i = parseContents(mod); 
                                    i[index].content = e.target.value; 
                                    setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); 
                                  }} 
                                  onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })}
                                />
                                
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Title (Optional)</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="e.g. Try it yourself!" value={item.title || ''} onChange={e => { const i = parseContents(mod); i[index].title = e.target.value; setModules(modules.map(m => m.id === mod.id ? { ...m, contents_json: JSON.stringify(i) } : m)); }} onBlur={() => handleUpdateModule(mod.id, { contents_json: JSON.stringify(parseContents(mod)) })} />
                                  </div>
                                </div>
                              </div>
                            )}
`;

content = content.replace("{item.type === 'QUIZ' && (", compilerBlock + "\n                            {item.type === 'QUIZ' && (");

fs.writeFileSync('coursespro/src/app/(admin)/admin/program-builder/[id]/page.tsx', content);
