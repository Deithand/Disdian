declare module 'discord-rpc' {
  export interface Presence {
    state?: string;
    details?: string;
    startTimestamp?: number;
    endTimestamp?: number;
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
    partyId?: string;
    partySize?: number;
    partyMax?: number;
    matchSecret?: string;
    joinSecret?: string;
    spectateSecret?: string;
    instance?: boolean;
    buttons?: Array<{ label: string; url: string }>;
  }

  export interface ClientOptions {
    transport: 'ipc' | 'websocket';
  }

  export interface LoginOptions {
    clientId: string;
    clientSecret?: string;
    accessToken?: string;
    rpcToken?: string;
    tokenEndpoint?: string;
    scopes?: string[];
  }

  export class Client {
    constructor(options: ClientOptions);
    on(event: 'ready' | 'connected' | 'disconnected', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    login(options: LoginOptions): Promise<void>;
    setActivity(presence: Presence): Promise<Presence>;
    clearActivity(): Promise<void>;
    destroy(): Promise<void>;
  }

  export default Client;
}

