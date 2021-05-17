import { Source, SourceEntry } from './source.ts';
import { join } from '../../deps.ts';

interface FileEntry extends SourceEntry {
  name: string,
  path: string,
}

export class LocalSource extends Source {
  async readDir(): Promise<FileEntry[]> {
    const dir: FileEntry[] = [];

    for await (const entry of Deno.readDir(this.config)) {
      dir.push({
        name: entry.name,
        path: join(this.config, entry.name),
      });
    }

    return dir;
  }

  readFile(entry: FileEntry): Promise<string> {
    return Deno.readTextFile(entry.path);
  }
}

export default LocalSource;
