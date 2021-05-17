import { parse } from "../deps.ts";
import { Parser } from './parser.ts';
import { Protobuf } from './protobuf.ts';
import { Source, LocalSource, GithubSource } from './source/mod.ts';

export async function main(adapter: new (root: Source) => Parser = Protobuf) {
  const args = parse(Deno.args, {
    string: [ 'ref', 'models' ],
    default: {
      ref: 'master'
    }
  });
  
  const source: Source = args.models
    ? new LocalSource(args.models)
    : new GithubSource(args.ref);
  
  const parser = new adapter(source);
  await parser.loadDefinition();
  parser.process(args);
}
