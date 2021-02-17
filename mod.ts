export * from './src/parser.ts';
export * from './src/generator.ts';
export * from './src/protobuf.ts';
export * from './src/source/mod.ts';

import { main } from './src/cli.ts';
export { main };

if (import.meta.main) {
  await main();
}
