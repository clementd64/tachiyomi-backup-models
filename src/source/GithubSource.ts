import { Source, SourceEntry } from './source.ts';

interface FileEntry extends SourceEntry {
  name: string,
  download_url: string,
  type: string,
}

export class GithubSource extends Source {
  readDir(): Promise<FileEntry[]> {
    const url = new URL('https://api.github.com/repos/tachiyomiorg/tachiyomi/contents/app/src/main/java/eu/kanade/tachiyomi/data/backup/full/models');
    url.searchParams.append('ref', this.config || 'master');
    return fetch(url)
      .then(r => r.json() as Promise<FileEntry[]>)
      .then(r => r.filter(v => v.type === 'file'));
  }

  readFile(entry: FileEntry): Promise<string> {
    return fetch(entry.download_url)
      .then(r => r.text());
  }
}
