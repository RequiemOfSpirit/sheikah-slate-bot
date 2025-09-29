import 'discord.js';

declare module 'discord.js' {
  interface Client extends BaseClient {
    on<Event extends keyof ClientEvents>(
      event: Event,
      listener: (...args: ClientEvents[Event]) => void | Promise<void>,
    ): this;
  }
}
