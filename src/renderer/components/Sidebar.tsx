import React, { useState } from 'react';
import { FileTreeItem } from '../../shared/types';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Trash2, FolderPlus, RefreshCw } from 'lucide-react';
import '../styles/Sidebar.css';

interface SidebarProps {
  fileTree: FileTreeItem[];
  currentNotePath?: string;
  onNoteSelect: (path: string) => void;
  onNoteDelete: (path: string) => void;
  onCreateFolder: (parentPath: string) => void;
  onRefresh: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  fileTree,
  currentNotePath,
  onNoteSelect,
  onNoteDelete,
  onCreateFolder,
  onRefresh
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const filterTree = (items: FileTreeItem[]): FileTreeItem[] => {
    if (!searchQuery) return items;
    
    return items.filter(item => {
      if (item.type === 'file') {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        const filteredChildren = filterTree(item.children || []);
        return filteredChildren.length > 0 || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }).map(item => {
      if (item.type === 'folder' && item.children) {
        return { ...item, children: filterTree(item.children) };
      }
      return item;
    });
  };

  const renderTreeItem = (item: FileTreeItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isActive = item.path === currentNotePath;

    if (item.type === 'folder') {
      return (
        <div key={item.id} className="tree-item-container">
          <div
            className={`tree-item folder ${isExpanded ? 'expanded' : ''}`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
            <span className="tree-item-name">{item.name}</span>
            <button
              className="tree-item-action"
              onClick={(e) => {
                e.stopPropagation();
                onCreateFolder(item.path);
              }}
              title="Создать папку"
            >
              <FolderPlus size={14} />
            </button>
          </div>
          
          {isExpanded && item.children && (
            <div className="tree-children">
              {item.children.map(child => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`tree-item file ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${level * 16 + 24}px` }}
        onClick={() => onNoteSelect(item.path)}
      >
        <File size={16} />
        <span className="tree-item-name">{item.name.replace('.md', '')}</span>
        <button
          className="tree-item-action delete"
          onClick={(e) => {
            e.stopPropagation();
            onNoteDelete(item.path);
          }}
          title="Удалить"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  const filteredTree = filterTree(fileTree);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input
          type="text"
          className="sidebar-search"
          placeholder="Поиск заметок..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="sidebar-action-btn" onClick={onRefresh} title="Обновить">
          <RefreshCw size={16} />
        </button>
      </div>
      
      <div className="sidebar-tree">
        {filteredTree.length > 0 ? (
          filteredTree.map(item => renderTreeItem(item))
        ) : (
          <div className="no-notes">
            <p>Нет заметок</p>
            <p className="hint">Создайте новую заметку</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

