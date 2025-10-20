import React, { useState, useEffect } from 'react';
import { SearchResult } from '../../shared/types';
import { X, Search as SearchIcon } from 'lucide-react';
import '../styles/Modal.css';

const { ipcRenderer } = window.require('electron');

interface SearchModalProps {
  onClose: () => void;
  onNoteSelect: (path: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onNoteSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsSearching(true);
        const searchResults = await ipcRenderer.invoke('search-notes', query);
        setResults(searchResults);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelectNote = (noteId: string) => {
    onNoteSelect(noteId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="search-input-container">
            <SearchIcon size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по заметкам..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body search-results">
          {isSearching ? (
            <div className="search-loading">Поиск...</div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.noteId}
                className="search-result-item"
                onClick={() => handleSelectNote(result.noteId)}
              >
                <h4>{result.title}</h4>
                <p>{result.content.substring(0, 150)}...</p>
                <span className="search-matches">{result.matches} совпадений</span>
              </div>
            ))
          ) : query.trim().length > 0 ? (
            <div className="search-empty">
              <p>Ничего не найдено</p>
            </div>
          ) : (
            <div className="search-empty">
              <p>Введите запрос для поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

