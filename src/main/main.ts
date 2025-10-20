import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { DiscordRPCManager } from './discordRPC';
import { Note, AppSettings, FileTreeItem } from '../shared/types';

let mainWindow: BrowserWindow | null = null;
let discordRPC: DiscordRPCManager | null = null;
let currentSettings: AppSettings = {
  theme: 'light', // Светлая тема по умолчанию
  autoSave: true,
  autoSaveInterval: 30000,
  discordRPC: true, // Включено с дефолтным ID
  discordClientId: '1429861818960056501', // Дефолтный Client ID
  workspacePath: path.join(app.getPath('documents'), 'Disdian')
};

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../../public/icon.png'),
    show: false
  });

  // Load the renderer
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
  
  // Initialize Discord RPC
  if (currentSettings.discordRPC && currentSettings.discordClientId) {
    discordRPC = new DiscordRPCManager(currentSettings.discordClientId);
    await discordRPC.connect();
  }

  // Ensure workspace directory exists
  await ensureWorkspaceDirectory();
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Файл',
      submenu: [
        {
          label: 'Новая заметка',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-new-note')
        },
        {
          label: 'Открыть папку',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu-open-folder')
        },
        { type: 'separator' },
        {
          label: 'Настройки',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow?.webContents.send('menu-settings')
        },
        { type: 'separator' },
        {
          label: 'Выход',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Правка',
      submenu: [
        { label: 'Отменить', role: 'undo' },
        { label: 'Повторить', role: 'redo' },
        { type: 'separator' },
        { label: 'Вырезать', role: 'cut' },
        { label: 'Копировать', role: 'copy' },
        { label: 'Вставить', role: 'paste' },
        { type: 'separator' },
        {
          label: 'Найти',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow?.webContents.send('menu-find')
        }
      ]
    },
    {
      label: 'Вид',
      submenu: [
        { label: 'Перезагрузить', role: 'reload' },
        { label: 'DevTools', role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Боковая панель',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu-toggle-sidebar')
        }
      ]
    },
    {
      label: 'Помощь',
      submenu: [
        {
          label: 'Показать обучение',
          click: () => mainWindow?.webContents.send('menu-show-onboarding')
        },
        { type: 'separator' },
        {
          label: 'О программе',
          click: () => mainWindow?.webContents.send('menu-about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function ensureWorkspaceDirectory() {
  try {
    await fs.access(currentSettings.workspacePath);
    console.log('Workspace directory exists:', currentSettings.workspacePath);
  } catch {
    console.log('Creating workspace directory:', currentSettings.workspacePath);
    await fs.mkdir(currentSettings.workspacePath, { recursive: true });
    console.log('Workspace directory created');
  }
}

// IPC Handlers
ipcMain.handle('get-workspace-path', () => {
  return currentSettings.workspacePath;
});

ipcMain.handle('set-workspace-path', async (_, newPath: string) => {
  currentSettings.workspacePath = newPath;
  return true;
});

ipcMain.handle('read-file-tree', async () => {
  return await readFileTree(currentSettings.workspacePath);
});

ipcMain.handle('read-note', async (_, filePath: string) => {
  try {
    const fullPath = path.join(currentSettings.workspacePath, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const stats = await fs.stat(fullPath);
    
    const note: Note = {
      id: filePath,
      title: path.basename(filePath, '.md'),
      content,
      path: filePath,
      tags: extractTags(content),
      created: stats.birthtime,
      modified: stats.mtime,
      wordCount: countWords(content)
    };
    
    return note;
  } catch (error) {
    console.error('Error reading note:', error);
    return null;
  }
});

ipcMain.handle('save-note', async (_, note: Note) => {
  try {
    const fullPath = path.join(currentSettings.workspacePath, note.path);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, note.content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving note:', error);
    return false;
  }
});

ipcMain.handle('create-note', async (_, folderPath: string, title: string) => {
  try {
    console.log('Creating note:', { title, folderPath, workspacePath: currentSettings.workspacePath });
    
    const fileName = `${sanitizeFileName(title)}.md`;
    const targetDir = folderPath 
      ? path.join(currentSettings.workspacePath, folderPath)
      : currentSettings.workspacePath;
    const fullPath = path.join(targetDir, fileName);
    
    console.log('Full path:', fullPath);
    
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Create file
    await fs.writeFile(fullPath, `# ${title}\n\n`, 'utf-8');
    
    console.log('Note created successfully');
    
    // Return relative path
    const relativePath = folderPath ? path.join(folderPath, fileName) : fileName;
    return relativePath;
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
});

ipcMain.handle('delete-note', async (_, filePath: string) => {
  try {
    const fullPath = path.join(currentSettings.workspacePath, filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
});

ipcMain.handle('create-folder', async (_, parentPath: string, folderName: string) => {
  try {
    const fullPath = path.join(currentSettings.workspacePath, parentPath, folderName);
    await fs.mkdir(fullPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating folder:', error);
    return false;
  }
});

ipcMain.handle('search-notes', async (_, query: string) => {
  const results: any[] = [];
  await searchInDirectory(currentSettings.workspacePath, query, results);
  return results;
});

ipcMain.handle('update-discord-presence', (_, presence: any) => {
  if (discordRPC && currentSettings.discordRPC) {
    discordRPC.updatePresence(presence);
  }
});

ipcMain.handle('get-settings', () => {
  return currentSettings;
});

ipcMain.handle('update-settings', async (_, settings: AppSettings) => {
  const prevClientId = currentSettings.discordClientId;
  currentSettings = { ...currentSettings, ...settings };
  
  // Toggle Discord RPC based on settings
  if (settings.discordRPC && settings.discordClientId) {
    // Если Client ID изменился, переподключаемся
    if (discordRPC && prevClientId !== settings.discordClientId) {
      discordRPC.disconnect();
      discordRPC = null;
    }
    
    if (!discordRPC) {
      discordRPC = new DiscordRPCManager(settings.discordClientId);
      await discordRPC.connect();
    }
  } else if (!settings.discordRPC && discordRPC) {
    discordRPC.disconnect();
    discordRPC = null;
  }
  
  return true;
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory', 'createDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Helper functions
async function readFileTree(dirPath: string): Promise<FileTreeItem[]> {
  try {
    const items = await fs.readdir(dirPath);
    const fileTree: FileTreeItem[] = [];

    for (const item of items) {
      if (item.startsWith('.')) continue; // Skip hidden files
      
      const fullPath = path.join(dirPath, item);
      const stats = await fs.stat(fullPath);
      const relativePath = path.relative(currentSettings.workspacePath, fullPath);

      if (stats.isDirectory()) {
        const children = await readFileTree(fullPath);
        fileTree.push({
          id: relativePath,
          name: item,
          path: relativePath,
          type: 'folder',
          children
        });
      } else if (item.endsWith('.md')) {
        fileTree.push({
          id: relativePath,
          name: item,
          path: relativePath,
          type: 'file'
        });
      }
    }

    return fileTree.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error reading file tree:', error);
    return [];
  }
}

async function searchInDirectory(dirPath: string, query: string, results: any[]) {
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      if (item.startsWith('.')) continue;
      
      const fullPath = path.join(dirPath, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        await searchInDirectory(fullPath, query, results);
      } else if (item.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerContent.includes(lowerQuery)) {
          const relativePath = path.relative(currentSettings.workspacePath, fullPath);
          results.push({
            noteId: relativePath,
            title: path.basename(item, '.md'),
            content: content.substring(0, 200),
            matches: (content.match(new RegExp(query, 'gi')) || []).length
          });
        }
      }
    }
  } catch (error) {
    console.error('Error searching directory:', error);
  }
}

function extractTags(content: string): string[] {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1]);
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function sanitizeFileName(name: string): string {
  const sanitized = name
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\s-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // If sanitized name is empty, use timestamp
  return sanitized || `note-${Date.now()}`;
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (discordRPC) {
    discordRPC.disconnect();
  }
});

