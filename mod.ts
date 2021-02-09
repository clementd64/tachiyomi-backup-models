import { parse, resolve } from "./deps.ts";
import { Parser } from './src/parser.ts';
import Protobuf from './src/protobuf.ts';

export * from './src/parser.ts';
export * from './src/generator.ts';
export * from './src/protobuf.ts';

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: [ 'models', 'adapter' ],
    default: {
      models: './tachiyomi/app/src/main/java/eu/kanade/tachiyomi/data/backup/full/models/',
    }
  });
  
  const adapter: new (root: string) => Parser =
    args.adapter
      ? (await import(resolve(args.adapter))).default
      : Protobuf;
  
  const p = new adapter(args.models);
  await p.loadDefinition();
  p.process(args);
}
