export interface SourceEntry {
  name: string,
}

export abstract class Source {
  config = '';

  constructor(config: string) {
    this.config = config;
  }

  abstract readDir(): Promise<SourceEntry[]>;
  abstract readFile(entry: SourceEntry): Promise<string>;
}
