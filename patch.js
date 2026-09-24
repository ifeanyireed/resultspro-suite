const fs = require('fs');
const file = 'coursespro/src/components/RichTextEditor.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { \n  Bold, Italic",
  "import TurndownService from 'turndown';\nimport { marked } from 'marked';\nimport { \n  Bold, Italic"
);

content = content.replace(
  '<div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">',
  '<div className="flex flex-wrap gap-1 p-2">'
);

const newEditorBlock = `export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [mode, setMode] = React.useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [markdownContent, setMarkdownContent] = React.useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML() && mode === 'wysiwyg') {
      editor.commands.setContent(content);
    }
  }, [content, editor, mode]);

  const handleModeSwitch = (newMode: 'wysiwyg' | 'markdown') => {
    if (newMode === 'markdown') {
      const turndownService = new TurndownService();
      setMarkdownContent(turndownService.turndown(content));
    } else {
      const html = marked.parse(markdownContent) as string;
      onChange(html);
      if (editor) {
        editor.commands.setContent(html);
      }
    }
    setMode(newMode);
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value);
    const html = marked.parse(e.target.value) as string;
    onChange(html);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
      <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 pr-4">
        <div className="flex-1">
          {mode === 'wysiwyg' && <MenuBar editor={editor} />}
        </div>
        <div className="flex bg-slate-200 p-1 rounded-md text-sm ml-4 shrink-0">
          <button
            onClick={() => handleModeSwitch('wysiwyg')}
            className={\`px-3 py-1 rounded-sm transition-colors \${mode === 'wysiwyg' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}\`}
          >
            WYSIWYG
          </button>
          <button
            onClick={() => handleModeSwitch('markdown')}
            className={\`px-3 py-1 rounded-sm transition-colors \${mode === 'markdown' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}\`}
          >
            Markdown
          </button>
        </div>
      </div>
      
      <div className="relative flex-1">
        {mode === 'wysiwyg' ? (
          <EditorContent editor={editor} />
        ) : (
          <textarea
            value={markdownContent}
            onChange={handleMarkdownChange}
            className="w-full h-full min-h-[400px] p-4 font-mono text-sm resize-y focus:outline-none bg-slate-50 text-slate-800"
            placeholder="Write in Markdown..."
          />
        )}
      </div>
    </div>
  );
}`;

content = content.replace(
  /export function RichTextEditor\(\{ content, onChange \}: RichTextEditorProps\) \{[\s\S]*\}\n/g,
  newEditorBlock + "\n"
);

fs.writeFileSync(file, content);
