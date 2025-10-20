import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { Note, EditorStats } from '../../shared/types';
import { Clock, FileText, Hash } from 'lucide-react';
import '../styles/Preview.css';
import 'highlight.js/styles/github-dark.css';

interface PreviewProps {
  content: string;
  stats: EditorStats;
  note: Note;
  onContentChange?: (newContent: string) => void;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  }
});

const Preview: React.FC<PreviewProps> = ({ content, stats, note }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    try {
      const rendered = md.render(content);
      setHtmlContent(rendered);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      setHtmlContent('<p>Error rendering content</p>');
    }
  }, [content]);

  return (
    <div className="preview">
      <div className="preview-header">
        <h3>Предпросмотр</h3>
      </div>
      
      <div 
        className="preview-content" 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
      
      <div className="preview-sidebar">
        <div className="preview-stats">
          <h4>Статистика</h4>
          
          <div className="stat-item">
            <FileText size={16} />
            <div>
              <span className="stat-label">Слова</span>
              <span className="stat-value">{stats.words}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <FileText size={16} />
            <div>
              <span className="stat-label">Символы</span>
              <span className="stat-value">{stats.characters}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <FileText size={16} />
            <div>
              <span className="stat-label">Строки</span>
              <span className="stat-value">{stats.lines}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <Clock size={16} />
            <div>
              <span className="stat-label">Время чтения</span>
              <span className="stat-value">{stats.readingTime} мин</span>
            </div>
          </div>
        </div>
        
        {note.tags && note.tags.length > 0 && (
          <div className="preview-tags">
            <h4><Hash size={16} /> Теги</h4>
            <div className="tags-list">
              {note.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="preview-info">
          <h4>Информация</h4>
          <p className="info-item">
            <strong>Создано:</strong><br />
            {new Date(note.created).toLocaleString('ru-RU')}
          </p>
          <p className="info-item">
            <strong>Изменено:</strong><br />
            {new Date(note.modified).toLocaleString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preview;
