import { parse, resolve } from "./deps.ts";
import { Parser } from './src/parser.ts';
import Protobuf from './src/protobuf.ts';
import { Source, LocalSource, GithubSource } from './src/source/mod.ts';

export * from './src/parser.ts';
export * from './src/generator.ts';
export * from './src/protobuf.ts';
export * from './src/source/mod.ts';

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: [ 'ref', 'models', 'adapter' ],
    default: {
      ref: 'master'
    }
  });
  
  const adapter: new (root: Source) => Parser =
    args.adapter
      ? (await import(resolve(args.adapter))).default
      : Protobuf;
  
  const source: Source = args.models
    ? new LocalSource(args.models)
    : new GithubSource(args.ref);
  
  const parser = new adapter(source);
  await parser.loadDefinition();
  parser.process(args);
}
