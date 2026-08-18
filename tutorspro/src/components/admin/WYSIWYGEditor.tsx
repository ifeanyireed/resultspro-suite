"use client";

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo, Link as LinkIcon } from 'lucide-react';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const WYSIWYGEditor = ({ value, onChange, placeholder }: WYSIWYGEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const buttons = [
    { icon: <Heading1 className="w-4 h-4" />, cmd: () => execCommand("formatBlock", "<h1>"), label: "H1" },
    { icon: <Heading2 className="w-4 h-4" />, cmd: () => execCommand("formatBlock", "<h2>"), label: "H2" },
    { icon: <Bold className="w-4 h-4" />, cmd: () => execCommand("bold"), label: "Bold" },
    { icon: <Italic className="w-4 h-4" />, cmd: () => execCommand("italic"), label: "Italic" },
    { icon: <List className="w-4 h-4" />, cmd: () => execCommand("insertUnorderedList"), label: "Bullet List" },
    { icon: <ListOrdered className="w-4 h-4" />, cmd: () => execCommand("insertOrderedList"), label: "Numbered List" },
    { icon: <Quote className="w-4 h-4" />, cmd: () => execCommand("formatBlock", "<blockquote>"), label: "Quote" },
    { icon: <LinkIcon className="w-4 h-4" />, cmd: addLink, label: "Link" },
    { icon: <Undo className="w-4 h-4" />, cmd: () => execCommand("undo"), label: "Undo" },
    { icon: <Redo className="w-4 h-4" />, cmd: () => execCommand("redo"), label: "Redo" },
  ];

  return (
    <div className="w-full border border-white/[0.1] border-t-white/[0.15] rounded-2xl bg-white/5 overflow-hidden focus-within:ring-2 focus:ring-green/50 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-white/5 border-b border-white/[0.1] border-t-white/[0.15]">
        {buttons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.cmd}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[400px] p-6 text-white focus:outline-none prose prose-invert prose-green max-w-none prose-headings:font-display prose-headings:font-black prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300 prose-strong:text-white prose-blockquote:border-green prose-blockquote:bg-green/5 prose-blockquote:p-4 prose-blockquote:rounded-xl"
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #4b5563;
          cursor: text;
        }
      `}</style>
    </div>
  );
};

export default WYSIWYGEditor;
