import React, { useState } from 'react';
import { XMarkIcon, PlayIcon, DocumentTextIcon, VideoCameraIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';


const formatEmbedUrl = (url: string, type: string) => {
  if (!url) return '';
  
  if (url.includes('drive.google.com/file/d/')) {
    if (type === 'PDF') {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const directUrl = `https://docs.google.com/uc?export=download&id=${match[1]}`;
        return `/pdf-viewer.html?url=${encodeURIComponent(`/api/pdf-proxy?url=${encodeURIComponent(directUrl)}`)}`;
      }
    }
    return url.replace(/\/(edit|view).*/, '/preview');
  }
  
  if (url.includes('docs.google.com')) {
    if (url.includes('/presentation/')) {
       return url.replace(/\/(edit|view).*/, '/embed');
    }
    return url.replace(/\/(edit|view).*/, '/embed?rm=minimal');
  }
  
  if (type === 'PPT') {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  
  if (type === 'PDF' && !url.includes('docs.google.com')) {
    return `/pdf-viewer.html?url=${encodeURIComponent(`/api/pdf-proxy?url=${encodeURIComponent(url)}`)}`;
  }
  
  return url;
};

const getDirectMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://docs.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
};




export function PreviewModal({ isOpen, onClose, programTitle, modules }: any) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  if (!isOpen) return null;

  const activeModule = modules[activeModuleIndex];
  const parseContents = (mod: any) => {
    if (!mod || !mod.contents_json) return [];
    try {
      return JSON.parse(mod.contents_json);
    } catch(e) {
      return [];
    }
  };
  const contents = parseContents(activeModule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-50 w-full max-w-6xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <PlayIcon className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Previewing: {programTitle}</h2>
              <p className="text-xs text-gray-500">Student View Simulation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Outline */}
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Journey Modules</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {modules.length === 0 ? (
                <p className="text-sm text-gray-400 p-4 text-center">No modules added yet.</p>
              ) : (
                modules.map((mod: any, index: number) => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(index)}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                      activeModuleIndex === index 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      activeModuleIndex === index ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="truncate">{mod.title || 'Untitled Module'}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 relative p-8">
            <div className="max-w-3xl mx-auto space-y-8 pb-20">
              {activeModule ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeModule.title}</h1>
                    {activeModule.description && (
                      <p className="text-gray-500">{activeModule.description}</p>
                    )}
                  </div>

                  {contents.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 text-center text-gray-400">
                      This module has no content blocks yet.
                    </div>
                  ) : (
                    contents.map((block: any, i: number) => {
                      const isMediaBlock = ['VIDEO', 'AUDIO', 'PDF', 'PPT', 'HTML'].includes(block.type);
                      const hasCardBody = isMediaBlock && !!block.content;
                      const hasTitleOrBody = !!block.title || hasCardBody;
                      const isMediaWithoutCard = ['PDF', 'PPT', 'AUDIO', 'HTML'].includes(block.type) && !hasTitleOrBody;

                      return (
                        <div key={i} className={isMediaWithoutCard ? "py-6" : "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"}>
                          {hasTitleOrBody && (
                            <div className="p-6 border-b border-gray-100 bg-white">
                               {block.title && <h3 className="text-lg font-bold text-gray-900 mb-2">{block.title}</h3>}
                               {hasCardBody && <p className="text-gray-600 whitespace-pre-wrap text-sm">{block.content}</p>}
                            </div>
                          )}

                          {block.type === 'TEXT' && (
                            <div 
                              className="p-8 prose prose-blue max-w-none text-gray-700 bg-white"
                              dangerouslySetInnerHTML={{ __html: block.content || '<i>Empty text block</i>' }}
                            />
                          )}
                          
                          {block.type === 'VIDEO' && (
                            <div className="bg-white aspect-video flex items-center justify-center text-gray-500 relative overflow-hidden rounded-b-xl">
                              {block.url ? (
                                (block.url.includes('youtube.com') || block.url.includes('youtu.be')) ? (
                                  <iframe 
                                    src={block.url.includes('youtube.com/embed') ? block.url : `https://www.youtube.com/embed/${block.url.split('v=')[1]?.split('&')[0] || block.url.split('youtu.be/')[1]?.split('?')[0]}`} 
                                    className="w-full h-full border-0 absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video src={getDirectMediaUrl(block.url)} controls className="w-full h-full object-contain absolute inset-0 rounded-b-xl bg-black" />
                                )
                              ) : (
                                <span>No video uploaded</span>
                              )}
                            </div>
                          )}

                          {block.type === 'AUDIO' && (
                            <div className={`p-6 flex flex-col items-center justify-center gap-4 ${isMediaWithoutCard ? '' : 'bg-white'}`}>
                              {block.url ? (
                                <audio controls className="w-full max-w-md bg-gray-50 rounded-full shadow-sm">
                                  <source src={`/api/audio-proxy?url=${encodeURIComponent(getDirectMediaUrl(block.url))}`} type="audio/mpeg" />
                                  <source src={`/api/audio-proxy?url=${encodeURIComponent(getDirectMediaUrl(block.url))}`} type="audio/wav" />
                                  Your browser does not support the audio element.
                                </audio>
                              ) : (
                                <span className="text-sm text-gray-500">No audio uploaded</span>
                              )}
                            </div>
                          )}

                          {block.type === 'HTML' && (() => {
                            const isProxyRequired = block.url && (block.url.includes('cloudinary.com') || block.url.includes('drive.google.com') || block.url.includes('docs.google.com'));
                            const iframeSrc = isProxyRequired ? `/api/html-proxy?url=${encodeURIComponent(getDirectMediaUrl(block.url))}` : block.url;
                            return (
                              <div className={`w-full h-[600px] relative ${isMediaWithoutCard ? 'rounded-xl overflow-hidden shadow-sm' : 'bg-white'}`}>
                                {block.url ? (
                                  <iframe src={iframeSrc} className="w-full h-full border-0 bg-white" title="HTML Content" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">No HTML uploaded</div>
                                )}
                              </div>
                            );
                          })()}

                          {block.type === 'PPT' && (
                            <div className={`w-full h-[500px] relative flex flex-col ${isMediaWithoutCard ? 'py-4' : 'p-4 bg-white'}`}>
                              {block.url ? (
                                <iframe 
                                  src={formatEmbedUrl(block.url, 'PPT')} 
                                  className={`w-full flex-1 border ${isMediaWithoutCard ? 'border-none shadow-none rounded-none' : 'border-gray-200 rounded-lg shadow-inner bg-white'}`} 
                                  title="PPT Content"
                                />
                              ) : (
                                <div className={`flex-1 flex items-center justify-center text-gray-400 border border-dashed rounded-lg ${isMediaWithoutCard ? 'border-gray-300' : 'border-gray-200 bg-white'}`}>No Presentation uploaded</div>
                              )}
                            </div>
                          )}

                          {block.type === 'PDF' && (() => {
                            const embedUrl = formatEmbedUrl(block.url, 'PDF');
                            const isDocsViewer = embedUrl.includes('docs.google.com/viewer');
                            return (
                              <div className={`w-full h-[600px] ${isMediaWithoutCard ? 'py-4' : 'p-4 bg-white'}`}>
                                {block.url ? (
                                  <div className={`w-full h-full relative overflow-hidden ${isMediaWithoutCard ? 'rounded-none' : 'rounded-lg border border-gray-200 bg-white'}`}>
                                    <iframe 
                                      src={embedUrl} 
                                      className={`absolute left-0 w-full border-0 ${isMediaWithoutCard ? '' : 'bg-white'} ${isDocsViewer ? 'top-[-50px] h-[calc(100%+50px)]' : 'top-0 h-full'}`} 
                                      title="PDF Document" 
                                    />
                                  </div>
                                ) : (
                                  <div className={`flex-1 h-full flex items-center justify-center text-gray-400 border border-dashed rounded-lg ${isMediaWithoutCard ? 'border-gray-300' : 'border-gray-200 bg-white'}`}>No PDF uploaded</div>
                                )}
                              </div>
                            );
                          })()}

                        
                        {block.type === 'COMPILER' && (
                          <div className={`w-full h-[500px] relative ${isMediaWithoutCard ? 'rounded-xl overflow-hidden shadow-sm' : 'bg-white'}`}>
                            {block.url ? (
                              <iframe 
                                src={`https://onecompiler.com/embed/${block.url}?code=${encodeURIComponent(block.content || '')}&hideLanguageSelection=true&hideNew=true&hideTitle=true`}
                                className="w-full h-full border-0 bg-white" 
                                title="Code Compiler" 
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">No language selected</div>
                            )}
                          </div>
                        )}

                        {block.type === 'QUIZ' && (
                          <div className="p-8">
                            <div className="bg-pink-50 border border-pink-100 text-pink-800 rounded-lg p-4 text-center">
                              <h3 className="font-semibold mb-1">Interactive Quiz Block</h3>
                              <p className="text-sm text-pink-600">
                                {block.url ? `Linked Quiz ID: ${block.url}` : 'No quiz selected.'}
                              </p>
                              <div className="mt-4 text-xs text-pink-500 italic">
                                In the real app, the Assessment Engine will render the interactive quiz here.
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {block.type === 'ASSIGNMENT' && (() => {
                          const subType = block.url || 'TEXT';
                          let btnText = 'Submit Assignment';
                          if (subType === 'TEXT') btnText = 'Write Submission';
                          else if (subType === 'LINK') btnText = 'Attach Link';
                          else if (subType === 'FILE') btnText = 'Upload File';

                          return (
                            <div className="p-8">
                              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                                <h3 className="font-semibold text-indigo-900 mb-2">Assignment Task</h3>
                                <p className="text-indigo-800 text-sm mb-4 whitespace-pre-wrap">{block.content || 'No instructions provided.'}</p>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-indigo-100/50">
                                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium shadow-sm" disabled>
                                    {btnText}
                                  </button>
                                  <span className="text-xs text-indigo-500 italic">Submissions disabled in preview mode</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                    })
                  )}

                  {/* Navigation footer */}
                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                    <button 
                      onClick={() => setActiveModuleIndex(Math.max(0, activeModuleIndex - 1))}
                      disabled={activeModuleIndex === 0}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" /> Previous Module
                    </button>
                    
                    <button 
                      onClick={() => setActiveModuleIndex(Math.min(modules.length - 1, activeModuleIndex + 1))}
                      disabled={activeModuleIndex === modules.length - 1}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#146ef5] rounded-lg hover:bg-[#105bd1] disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
                    >
                      Next Module <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full pt-32 text-gray-400">
                  <PlayIcon className="w-16 h-16 stroke-1 text-gray-300 mb-4" />
                  <p>Select a module to preview.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
