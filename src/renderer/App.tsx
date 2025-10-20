import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import SettingsModal from './components/SettingsModal';
import SearchModal from './components/SearchModal';
import PromptModal from './components/PromptModal';
import OnboardingScreen from './components/OnboardingScreen';
import { Note, FileTreeItem, AppSettings, EditorStats } from '../shared/types';
import './styles/App.css';

const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [theme] = useState<'light' | 'dark'>('light'); // Только светлая тема
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [promptConfig, setPromptConfig] = useState<{
    show: boolean;
    title: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  } | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [editorStats, setEditorStats] = useState<EditorStats>({
    words: 0,
    characters: 0,
    lines: 0,
    readingTime: 0
  });
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    loadSettings();
    loadFileTree();
    setupMenuListeners();
    checkFirstRun();
  }, []);

  const checkFirstRun = () => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light'); // Всегда светлая тема
  }, []);

  useEffect(() => {
    if (currentNote && settings?.autoSave) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const timeout = setTimeout(() => {
        saveCurrentNote();
      }, settings.autoSaveInterval);
      
      setAutoSaveTimeout(timeout);
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [currentNote?.content, settings?.autoSave]);

  useEffect(() => {
    if (currentNote) {
      updateDiscordPresence();
    }
  }, [currentNote]);

  const loadSettings = async () => {
    const loadedSettings = await ipcRenderer.invoke('get-settings');
    setSettings(loadedSettings);
    // setTheme(loadedSettings.theme); // Убрано - используем только светлую тему
  };

  const loadFileTree = async () => {
    console.log('Loading file tree...');
    try {
      const tree = await ipcRenderer.invoke('read-file-tree');
      console.log('File tree loaded:', tree);
      setFileTree(tree);
    } catch (error) {
      console.error('Error loading file tree:', error);
    }
  };

  const setupMenuListeners = () => {
    ipcRenderer.on('menu-new-note', handleNewNote);
    // ipcRenderer.on('menu-toggle-theme', handleToggleTheme); // Отключено
    ipcRenderer.on('menu-toggle-sidebar', () => setShowSidebar(!showSidebar));
    ipcRenderer.on('menu-settings', () => setShowSettings(true));
    ipcRenderer.on('menu-find', () => setShowSearch(true));
    ipcRenderer.on('menu-show-onboarding', () => setShowOnboarding(true));
  };

  const handleNewNote = () => {
    console.log('[DEBUG] handleNewNote called - showing prompt modal');
    setPromptConfig({
      show: true,
      title: 'Создать новую заметку',
      placeholder: 'Введите название заметки...',
      onConfirm: async (title: string) => {
        console.log('[DEBUG] Creating note with title:', title);
        setPromptConfig(null);
        
        try {
          const notePath = await ipcRenderer.invoke('create-note', '', title);
          console.log('[DEBUG] Note created, path:', notePath);
          
          if (notePath) {
            console.log('[DEBUG] Reloading file tree...');
            await loadFileTree();
            console.log('[DEBUG] Opening note...');
            await openNote(notePath);
            console.log('[DEBUG] Note opened successfully!');
          } else {
            console.error('[DEBUG] Failed to create note - notePath is null');
            alert('Не удалось создать заметку. Проверьте консоль для деталей.');
          }
        } catch (error) {
          console.error('[DEBUG] Error in creating note:', error);
          alert('Ошибка при создании заметки: ' + error);
        }
      }
    });
  };

  const handleToggleTheme = () => {
    // Тема отключена - только светлый режим
  };

  const openNote = async (notePath: string) => {
    console.log('Opening note:', notePath);
    try {
      const note = await ipcRenderer.invoke('read-note', notePath);
      if (note) {
        console.log('Note loaded successfully');
        setCurrentNote(note);
        setStartTime(Date.now());
        updateEditorStats(note.content);
      } else {
        console.error('Failed to load note');
        alert('Не удалось открыть заметку: ' + notePath);
      }
    } catch (error) {
      console.error('Error opening note:', error);
      alert('Ошибка при открытии заметки: ' + error);
    }
  };

  const saveCurrentNote = async () => {
    if (!currentNote) return;
    await ipcRenderer.invoke('save-note', currentNote);
  };

  const handleContentChange = (newContent: string) => {
    if (!currentNote) return;
    
    const updatedNote: Note = {
      ...currentNote,
      content: newContent,
      modified: new Date(),
      wordCount: countWords(newContent)
    };
    
    setCurrentNote(updatedNote);
    updateEditorStats(newContent);
  };

  const updateEditorStats = (content: string) => {
    const words = countWords(content);
    const characters = content.length;
    const lines = content.split('\n').length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    setEditorStats({ words, characters, lines, readingTime });
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const updateDiscordPresence = () => {
    if (!currentNote || !settings?.discordRPC) return;
    
    ipcRenderer.invoke('update-discord-presence', {
      state: `Редактирую: ${currentNote.title}`,
      details: `${editorStats.words} слов`,
      startTimestamp: startTime,
      largeImageKey: 'disdian-logo',
      largeImageText: 'Disdian',
      smallImageKey: 'writing',
      smallImageText: 'Пишу заметку'
    });
  };

  const updateSettings = async (newSettings: AppSettings) => {
    await ipcRenderer.invoke('update-settings', newSettings);
    setSettings(newSettings);
  };

  const handleDeleteNote = async (notePath: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заметку?')) return;
    
    await ipcRenderer.invoke('delete-note', notePath);
    await loadFileTree();
    
    if (currentNote?.path === notePath) {
      setCurrentNote(null);
    }
  };

  const handleCreateFolder = (parentPath: string) => {
    setPromptConfig({
      show: true,
      title: 'Создать новую папку',
      placeholder: 'Введите название папки...',
      onConfirm: async (folderName: string) => {
        setPromptConfig(null);
        try {
          await ipcRenderer.invoke('create-folder', parentPath, folderName);
          await loadFileTree();
        } catch (error) {
          console.error('Error creating folder:', error);
          alert('Ошибка при создании папки: ' + error);
        }
      }
    });
  };

  return (
    <div className="app">
      <Toolbar
        onNewNote={handleNewNote}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onOpenSettings={() => setShowSettings(true)}
        onSearch={() => setShowSearch(true)}
        showPreview={showPreview}
        showSidebar={showSidebar}
      />
      
      <div className="app-content">
        {showSidebar && (
          <Sidebar
            fileTree={fileTree}
            currentNotePath={currentNote?.path}
            onNoteSelect={openNote}
            onNoteDelete={handleDeleteNote}
            onCreateFolder={handleCreateFolder}
            onRefresh={loadFileTree}
          />
        )}
        
        <div className="editor-container">
          {currentNote ? (
            <>
              <Editor
                content={currentNote.content}
                onChange={handleContentChange}
              />
              
              {showPreview && (
                <Preview
                  content={currentNote.content}
                  stats={editorStats}
                  note={currentNote}
                />
              )}
            </>
          ) : (
            <div className="no-note-selected">
              <h2>Выберите заметку или создайте новую</h2>
              <p>Используйте боковую панель для навигации или нажмите Ctrl+N</p>
            </div>
          )}
        </div>
      </div>
      
      <StatusBar
        stats={editorStats}
        currentNote={currentNote}
        theme={theme}
      />
      
      {showSettings && settings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={updateSettings}
        />
      )}
      
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onNoteSelect={openNote}
        />
      )}
      
      {promptConfig && (
        <PromptModal
          title={promptConfig.title}
          placeholder={promptConfig.placeholder}
          onConfirm={promptConfig.onConfirm}
          onCancel={() => setPromptConfig(null)}
        />
      )}

      {showOnboarding && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;

