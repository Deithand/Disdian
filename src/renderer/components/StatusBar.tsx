import React from 'react';
import { Note, EditorStats } from '../../shared/types';
import { FileText, Moon, Sun } from 'lucide-react';
import '../styles/StatusBar.css';

interface StatusBarProps {
  stats: EditorStats;
  currentNote: Note | null;
  theme: 'light' | 'dark';
}

const StatusBar: React.FC<StatusBarProps> = ({ stats, currentNote, theme }) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        {currentNote ? (
          <>
            <span className="status-item">
              <FileText size={14} />
              {currentNote.title}
            </span>
            <span className="status-separator">|</span>
            <span className="status-item">{stats.words} слов</span>
            <span className="status-separator">|</span>
            <span className="status-item">{stats.characters} символов</span>
            <span className="status-separator">|</span>
            <span className="status-item">{stats.lines} строк</span>
          </>
        ) : (
          <span className="status-item">Нет открытой заметки</span>
        )}
      </div>
      
      <div className="status-right">
        <span className="status-item">
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          {theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;

