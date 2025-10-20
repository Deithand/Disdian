import { DiscordPresence } from '../shared/types';
export declare class DiscordRPCManager {
    private client;
    private isConnected;
    private reconnectTimeout;
    private clientId;
    constructor(clientId?: string);
    connect(): Promise<void>;
    disconnect(): void;
    private scheduleReconnect;
    private setDefaultPresence;
    updatePresence(presence: DiscordPresence): void;
    updateNoteActivity(noteTitle: string, wordCount: number): void;
    updateBrowsingActivity(): void;
}
//# sourceMappingURL=discordRPC.d.ts.map