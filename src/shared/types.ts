export interface Note {
  id: string;
  title: string;
  content: string;
  path: string;
  tags: string[];
  created: Date;
  modified: Date;
  wordCount: number;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  children: (Folder | Note)[];
  type: 'folder';
}

export interface FileTreeItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  autoSaveInterval: number;
  discordRPC: boolean;
  discordClientId: string;
  workspacePath: string;
}

export interface DiscordPresence {
  state?: string;
  details?: string;
  startTimestamp?: number;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
}

export interface SearchResult {
  noteId: string;
  title: string;
  content: string;
  matches: number;
}

export interface EditorStats {
  words: number;
  characters: number;
  lines: number;
  readingTime: number;
}

