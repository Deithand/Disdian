import React, { useRef, useEffect, useState } from 'react';
import ContextMenu from './ContextMenu';
import '../styles/Editor.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
    
    // Auto-list continuation
    if (e.key === 'Enter') {
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const lines = content.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Check for list markers
      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const [, indent, marker] = listMatch;
        const newMarker = marker.match(/\d+/) 
          ? `${parseInt(marker) + 1}.` 
          : marker;
        const newContent = 
          content.substring(0, start) + 
          `\n${indent}${newMarker} ` + 
          content.substring(target.selectionEnd);
        onChange(newContent);
        
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = 
            start + indent.length + newMarker.length + 2;
        }, 0);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleFormatAction = (action: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let newContent = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        cursorOffset = 2;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        cursorOffset = 1;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        cursorOffset = 4;
        break;
      case 'ul':
        formattedText = `- ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'ol':
        formattedText = `1. ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        cursorOffset = selectedText.length + 3;
        break;
      case 'hr':
        formattedText = `---\n${selectedText}`;
        cursorOffset = 4;
        break;
      default:
        formattedText = selectedText;
    }

    newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + cursorOffset;
      textarea.selectionEnd = start + formattedText.length - cursorOffset;
    }, 0);
  };

  return (
    <div className="editor">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        placeholder="Начните писать..."
        spellCheck={false}
      />
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleFormatAction}
        />
      )}
    </div>
  );
};

export default Editor;

