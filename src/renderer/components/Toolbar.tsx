import React from 'react';
import { FilePlus, Eye, EyeOff, PanelLeft, Settings, Search } from 'lucide-react';
import '../styles/Toolbar.css';

interface ToolbarProps {
  onNewNote: () => void;
  onTogglePreview: () => void;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onSearch: () => void;
  showPreview: boolean;
  showSidebar: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onNewNote,
  onTogglePreview,
  onToggleSidebar,
  onOpenSettings,
  onSearch,
  showPreview,
  showSidebar
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="app-title">Disdian</h1>
      </div>
      
      <div className="toolbar-center">
        <button className="toolbar-btn" onClick={onNewNote} title="Новая заметка (Ctrl+N)">
          <FilePlus size={20} />
        </button>
        
        <button className="toolbar-btn" onClick={onSearch} title="Поиск (Ctrl+F)">
          <Search size={20} />
        </button>
        
        <button 
          className={`toolbar-btn ${showSidebar ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title="Боковая панель (Ctrl+B)"
        >
          <PanelLeft size={20} />
        </button>
        
        <button 
          className={`toolbar-btn ${showPreview ? 'active' : ''}`}
          onClick={onTogglePreview}
          title="Предпросмотр"
        >
          {showPreview ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      
      <div className="toolbar-right">
        <button className="toolbar-btn" onClick={onOpenSettings} title="Настройки (Ctrl+,)">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

