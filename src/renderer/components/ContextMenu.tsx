import React, { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Quote,
  Minus
} from 'lucide-react';
import '../styles/ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    onAction(action);
    onClose();
  };

  const menuItems = [
    { icon: <Bold size={16} />, label: 'Жирный', action: 'bold', shortcut: 'Ctrl+B' },
    { icon: <Italic size={16} />, label: 'Курсив', action: 'italic', shortcut: 'Ctrl+I' },
    { icon: <Strikethrough size={16} />, label: 'Зачеркнутый', action: 'strikethrough' },
    { icon: <Code size={16} />, label: 'Код', action: 'code', shortcut: 'Ctrl+`' },
    { type: 'separator' },
    { icon: <Heading1 size={16} />, label: 'Заголовок 1', action: 'h1' },
    { icon: <Heading2 size={16} />, label: 'Заголовок 2', action: 'h2' },
    { icon: <Heading3 size={16} />, label: 'Заголовок 3', action: 'h3' },
    { type: 'separator' },
    { icon: <List size={16} />, label: 'Маркированный список', action: 'ul' },
    { icon: <ListOrdered size={16} />, label: 'Нумерованный список', action: 'ol' },
    { icon: <Quote size={16} />, label: 'Цитата', action: 'quote' },
    { type: 'separator' },
    { icon: <Link size={16} />, label: 'Ссылка', action: 'link', shortcut: 'Ctrl+K' },
    { icon: <Minus size={16} />, label: 'Горизонтальная линия', action: 'hr' }
  ];

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="context-menu-separator" />;
        }

        return (
          <button
            key={index}
            className="context-menu-item"
            onClick={() => handleAction(item.action!)}
          >
            <span className="context-menu-icon">{item.icon}</span>
            <span className="context-menu-label">{item.label}</span>
            {item.shortcut && (
              <span className="context-menu-shortcut">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;

