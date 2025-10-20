import React, { useState } from 'react';
import { AppSettings } from '../../shared/types';
import { X, FolderOpen } from 'lucide-react';
import '../styles/Modal.css';

const { ipcRenderer } = window.require('electron');

interface SettingsModalProps {
  settings: AppSettings;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleSelectFolder = async () => {
    const folder = await ipcRenderer.invoke('select-folder');
    if (folder) {
      setLocalSettings({ ...localSettings, workspacePath: folder });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Настройки</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Раздел "Внешний вид" убран - используется только светлая тема */}
          
          <div className="setting-group">
            <h3>Редактор</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoSave: e.target.checked
                  })}
                />
                Автосохранение
              </label>
            </div>
            
            {localSettings.autoSave && (
              <div className="setting-item">
                <label>Интервал автосохранения (секунды)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={localSettings.autoSaveInterval / 1000}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoSaveInterval: parseInt(e.target.value) * 1000
                  })}
                />
              </div>
            )}
          </div>
          
          <div className="setting-group">
            <h3>Discord интеграция</h3>
            
            <div className="setting-item">
              <label>Discord Client ID</label>
              <input
                type="text"
                placeholder="1234567890123456789"
                value={localSettings.discordClientId || ''}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  discordClientId: e.target.value
                })}
              />
              <p className="setting-hint">
                Получите Client ID на{' '}
                <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer">
                  discord.com/developers/applications
                </a>
              </p>
            </div>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.discordRPC}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    discordRPC: e.target.checked
                  })}
                  disabled={!localSettings.discordClientId}
                />
                Включить Discord Rich Presence
              </label>
              <p className="setting-hint">
                {!localSettings.discordClientId 
                  ? '⚠️ Сначала укажите Client ID выше' 
                  : 'Отображать активность Disdian в профиле Discord'}
              </p>
            </div>
          </div>
          
          <div className="setting-group">
            <h3>Рабочая папка</h3>
            
            <div className="setting-item">
              <label>Путь к заметкам</label>
              <div className="folder-select">
                <input
                  type="text"
                  value={localSettings.workspacePath}
                  readOnly
                />
                <button onClick={handleSelectFolder}>
                  <FolderOpen size={16} />
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

