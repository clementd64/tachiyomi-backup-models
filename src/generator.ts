import { Args } from "../deps.ts";
import { Parser, Entry } from './parser.ts';

export abstract class Generator extends Parser {
  /** scalar type mapping */
  static type: {[key: string]: string} = {};

  /** Convert kotlin type */
  protected type({ type }: Entry): string {
    if (type in (this.constructor as typeof Generator).type) {
      return (this.constructor as typeof Generator).type[type];
    }

    if (type in this.defs) {
      return type;
    }
    
    throw new Error(`Unknow type ${type}`);
  }
  
  /** Build schema from parsed definition */
  public abstract build(): string;

  /** output the generated schema */
  public async process(args: Args) {
    const schema = this.build();

    if (args._.length === 0 || args._[0] === '-') {
      console.log(schema);
    } else {
      await Deno.writeTextFile(args._[0].toString(), schema);
    }
  }
}
