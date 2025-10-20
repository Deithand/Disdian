import * as DiscordRPC from 'discord-rpc';
import { DiscordPresence } from '../shared/types';

export class DiscordRPCManager {
  private client: DiscordRPC.Client | null = null;
  private isConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private clientId: string;

  constructor(clientId?: string) {
    // Используем переданный ID или дефолтный
    this.clientId = clientId || '1234567890000';
  }

  async connect() {
    if (this.isConnected) return;

    if (!this.clientId || this.clientId.trim() === '') {
      console.warn('⚠️  Discord Client ID not set');
      return;
    }

    try {
      this.client = new DiscordRPC.Client({ transport: 'ipc' });

      this.client.on('ready', () => {
        console.log('✅ Discord RPC Connected successfully!');
        this.isConnected = true;
        this.setDefaultPresence();
      });

      this.client.on('disconnected', () => {
        console.log('⚠️  Discord RPC Disconnected');
        this.isConnected = false;
        this.scheduleReconnect();
      });

      console.log(`🔗 Connecting to Discord with Client ID: ${this.clientId}`);
      await this.client.login({ clientId: this.clientId });
    } catch (error) {
      console.error('❌ Failed to connect to Discord RPC:', error);
      console.log('💡 Убедитесь что:');
      console.log('   1. Discord запущен');
      console.log('   2. Client ID правильный');
      console.log('   3. Приложение зарегистрировано на https://discord.com/developers/applications');
      // Не переподключаемся при ошибке, чтобы не спамить
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      this.client.destroy();
      this.client = null;
      this.isConnected = false;
      console.log('🔌 Discord RPC disconnected');
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      console.log('🔄 Attempting to reconnect to Discord...');
      this.connect();
    }, 15000); // Retry after 15 seconds
  }

  private setDefaultPresence() {
    this.updatePresence({
      state: 'Просматриваю заметки',
      details: 'В главном меню',
      startTimestamp: Date.now(),
      largeImageKey: 'disdian-logo',
      largeImageText: 'Disdian',
      smallImageKey: 'idle',
      smallImageText: 'Idle'
    });
  }

  updatePresence(presence: DiscordPresence) {
    if (!this.isConnected || !this.client) {
      console.log('⚠️  Cannot update presence - Discord not connected');
      return;
    }

    try {
      this.client.setActivity({
        state: presence.state || 'Работаю с заметками',
        details: presence.details || 'Disdian',
        startTimestamp: presence.startTimestamp || Date.now(),
        largeImageKey: presence.largeImageKey || 'disdian-logo',
        largeImageText: presence.largeImageText || 'Disdian Note Taking',
        smallImageKey: presence.smallImageKey || 'writing',
        smallImageText: presence.smallImageText || 'Writing',
        instance: false,
      });
      console.log('📝 Discord presence updated');
    } catch (error) {
      console.error('❌ Failed to update Discord presence:', error);
    }
  }

  updateNoteActivity(noteTitle: string, wordCount: number) {
    this.updatePresence({
      state: `Редактирую: ${noteTitle}`,
      details: `${wordCount} слов`,
      startTimestamp: Date.now(),
      largeImageKey: 'disdian-logo',
      largeImageText: 'Disdian',
      smallImageKey: 'writing',
      smallImageText: 'Пишу заметку'
    });
  }

  updateBrowsingActivity() {
    this.updatePresence({
      state: 'Просматриваю заметки',
      details: 'Организую проект',
      startTimestamp: Date.now(),
      largeImageKey: 'disdian-logo',
      largeImageText: 'Disdian',
      smallImageKey: 'browsing',
      smallImageText: 'Browsing'
    });
  }
}
