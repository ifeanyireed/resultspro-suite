'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import toast from 'react-hot-toast';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { 
  Bold, Italic, Strikethrough, Code, List, ListOrdered, 
  Quote, Undo, Redo, Heading1, Heading2, Link as LinkIcon, ImageIcon,
  Eye, FileCode, Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const STORAGE_KEY = 'blog_editor_mode';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**'
});

function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(html);
  if (!hasHtml) {
    return html;
  }
  return turndownService.turndown(html);
}

function markdownToHtml(md: string): string {
  if (!md || !md.trim()) return '';
  return marked.parse(md, { async: false }) as string;
}

const WYSIWYGMenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) {
      return;
    }
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const loadingToast = toast.loading('Uploading image...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_path', 'blog/content');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (res.ok && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success('Image added', { id: loadingToast });
        } else {
          toast.error(data.error || 'Upload failed', { id: loadingToast });
        }
      } catch (err) {
        toast.error('Something went wrong', { id: loadingToast });
      }
    };
    
    input.click();
  };

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: 'Italic' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), title: 'Strikethrough' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), isActive: editor.isActive('code'), title: 'Code' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), title: 'Heading 1' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: 'Numbered List' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), title: 'Quote' },
    { icon: LinkIcon, action: toggleLink, isActive: editor.isActive('link'), title: 'Link' },
    { icon: ImageIcon, action: addImage, isActive: false, title: 'Upload Image' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), isActive: false, title: 'Undo' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), isActive: false, title: 'Redo' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return (
          <button
            key={idx}
            type="button"
            title={btn.title}
            onClick={(e) => { e.preventDefault(); btn.action(); }}
            className={`p-1.5 sm:p-2 rounded ${btn.isActive ? 'bg-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'} transition-colors`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  onUploadImage: () => void;
  markdownView: 'write' | 'preview';
  setMarkdownView: (v: 'write' | 'preview') => void;
}

const MarkdownToolbar = ({ onInsert, onUploadImage, markdownView, setMarkdownView }: MarkdownToolbarProps) => {
  const insertLink = () => {
    const url = window.prompt('Enter link URL:');
    if (!url) return;
    const title = window.prompt('Enter link text:') || 'link';
    onInsert(`[${title}](`, `${url})`);
  };

  const mdButtons = [
    { icon: Bold, action: () => onInsert('**', '**', 'bold text'), title: 'Bold (**text**)' },
    { icon: Italic, action: () => onInsert('*', '*', 'italic text'), title: 'Italic (*text*)' },
    { icon: Strikethrough, action: () => onInsert('~~', '~~', 'strikethrough text'), title: 'Strikethrough (~~text~~)' },
    { icon: Code, action: () => onInsert('`', '`', 'code'), title: 'Code (`code`)' },
    { icon: Heading1, action: () => onInsert('# ', '', 'Heading 1'), title: 'Heading 1 (#)' },
    { icon: Heading2, action: () => onInsert('## ', '', 'Heading 2'), title: 'Heading 2 (##)' },
    { icon: List, action: () => onInsert('- ', '', 'List item'), title: 'Bullet List (-)' },
    { icon: ListOrdered, action: () => onInsert('1. ', '', 'Numbered item'), title: 'Numbered List (1.)' },
    { icon: Quote, action: () => onInsert('> ', '', 'Quote'), title: 'Quote (>)' },
    { icon: LinkIcon, action: insertLink, title: 'Insert Link' },
    { icon: ImageIcon, action: onUploadImage, title: 'Upload & Insert Image' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
      <div className="flex bg-slate-200/80 p-0.5 rounded-md text-xs font-semibold mr-1">
        <button
          type="button"
          onClick={() => setMarkdownView('write')}
          className={`px-2.5 py-1 rounded transition-colors ${markdownView === 'write' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMarkdownView('preview')}
          className={`px-2.5 py-1 rounded transition-colors ${markdownView === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Preview
        </button>
      </div>

      {markdownView === 'write' && (
        <div className="flex flex-wrap items-center gap-1 border-l border-slate-200 pl-2">
          {mdButtons.map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button
                key={idx}
                type="button"
                title={btn.title}
                onClick={(e) => { e.preventDefault(); btn.action(); }}
                className="p-1.5 sm:p-2 rounded text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [markdownContent, setMarkdownContent] = useState('');
  const [markdownView, setMarkdownView] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastEmittedHtmlRef = useRef<string>(content || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedHtmlRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Restore persistent mode preference from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY);
      if (savedMode === 'markdown' || savedMode === 'wysiwyg') {
        setMode(savedMode);
        if (savedMode === 'markdown' && content) {
          setMarkdownContent(htmlToMarkdown(content));
        }
      }
    } catch (e) {
      // localStorage may fail in restricted environments
    }
  }, []);

  // Synchronize when external content changes (e.g. initial post fetch)
  useEffect(() => {
    if (content === lastEmittedHtmlRef.current) {
      return;
    }
    lastEmittedHtmlRef.current = content || '';

    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }

    setMarkdownContent(htmlToMarkdown(content || ''));
  }, [content, editor]);

  // Mode switch handler with bidirectional content conversion & persistence
  const handleModeSwitch = (newMode: 'wysiwyg' | 'markdown') => {
    if (newMode === mode) return;

    if (newMode === 'markdown') {
      // Switch from WYSIWYG to Markdown: convert HTML to Markdown
      const currentHtml = editor ? editor.getHTML() : content;
      const md = htmlToMarkdown(currentHtml);
      setMarkdownContent(md);
      lastEmittedHtmlRef.current = currentHtml;
      toast.success('Switched to Markdown mode', { id: 'editor-mode' });
    } else {
      // Switch from Markdown to WYSIWYG: convert Markdown to HTML
      const html = markdownToHtml(markdownContent);
      lastEmittedHtmlRef.current = html;
      onChange(html);
      if (editor) {
        editor.commands.setContent(html);
      }
      toast.success('Switched to WYSIWYG mode', { id: 'editor-mode' });
    }

    setMode(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch (e) {
      // Ignore storage errors
    }
  };

  // Handle typing inside markdown mode
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMd = e.target.value;
    setMarkdownContent(newMd);
    const html = markdownToHtml(newMd);
    lastEmittedHtmlRef.current = html;
    onChange(html);
  };

  // Helper to insert markdown tokens at cursor
  const insertMarkdown = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = markdownContent.substring(0, start) + replacement + markdownContent.substring(end);
    
    setMarkdownContent(newContent);
    const html = markdownToHtml(newContent);
    lastEmittedHtmlRef.current = html;
    onChange(html);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  // Image upload in markdown mode
  const handleMarkdownImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const loadingToast = toast.loading('Uploading image...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_path', 'blog/content');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          insertMarkdown(`\n![Image](${data.url})\n`);
          toast.success('Image added', { id: loadingToast });
        } else {
          toast.error(data.error || 'Upload failed', { id: loadingToast });
        }
      } catch (err) {
        toast.error('Something went wrong', { id: loadingToast });
      }
    };

    input.click();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col transition-all">
      {/* Top Header Bar with Tools & Persistent Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex-1 min-w-[280px]">
          {mode === 'wysiwyg' ? (
            <WYSIWYGMenuBar editor={editor} />
          ) : (
            <MarkdownToolbar 
              onInsert={insertMarkdown}
              onUploadImage={handleMarkdownImageUpload}
              markdownView={markdownView}
              setMarkdownView={setMarkdownView}
            />
          )}
        </div>

        {/* Persistent Mode Toggle Switcher */}
        <div className="flex items-center bg-slate-200/90 p-1 rounded-lg text-xs font-semibold shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => handleModeSwitch('wysiwyg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              mode === 'wysiwyg'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to WYSIWYG Visual Editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>WYSIWYG</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              mode === 'markdown'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to Markdown Editor"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 min-h-[400px]">
        {mode === 'wysiwyg' ? (
          <EditorContent editor={editor} />
        ) : markdownView === 'write' ? (
          <textarea
            ref={textareaRef}
            value={markdownContent}
            onChange={handleMarkdownChange}
            placeholder={placeholder || 'Write your article in Markdown (supports **bold**, *italic*, # headings, links, code, images)...'}
            className="w-full h-full min-h-[420px] p-5 font-mono text-sm leading-relaxed text-slate-800 bg-slate-50/40 focus:bg-white focus:outline-none resize-y placeholder:text-slate-400"
            spellCheck="true"
          />
        ) : (
          <div className="p-6 min-h-[420px] bg-slate-50/20">
            {markdownContent.trim() ? (
              <div 
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) }}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                <FileCode className="w-10 h-10 mb-2 stroke-1 opacity-50" />
                <p>No content to preview yet. Switch to "Write" to start typing.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mode: <strong className="text-slate-700 capitalize">{mode}</strong> (saved to preferences)</span>
        </div>
        <div>
          {mode === 'markdown' 
            ? `${markdownContent.length} characters | ${markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0} words`
            : 'Visual Editor Active'}
        </div>
      </div>
    </div>
  );
}
