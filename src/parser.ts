import { Args } from '../deps.ts';
import { Source, SourceEntry } from './source/source.ts';

export interface Entry {
  repeated: boolean,
  required: boolean,
  number: number,
  type: string,
  name: string,
  match: string,
}

export abstract class Parser {
  /**
   * The magic regex
   * 
   * The kotlin models are build with class properties like
   * - @ProtoNumber(2) var url: String
   * - @ProtoNumber(3) var title: String = ""
   * - @ProtoNumber(6) var description: String?
   * - @ProtoNumber(7) var genre: List<String>
   * 
   * This regex match 5 groups  
   * - number: the protobuf field number (inside ProtoNumber)  
   * - name: the field name ("url" in the first example)  
   * - list: the type if it's a list ("String" in the fourth example)  
   * - type: the type if not a list ("String" in the other example)  
   * - optional: if the field if optional (match " =" in second example and "?" in third example)  
   * 
   * some field are commented (used in 1.x, not in 0.x), so we must not match it (negative group with "//")
   */
  static regex = /^\s*(?!\/\/\s*)@ProtoNumber\((?<number>\d+)\)\s+va[rl]\s+(?<name>\w+):\s+(?:(?:List<(?<list>\w+)>)|(?<type>\w+))(?<optional>\?|(:?\s+=))?/gm;

  /** Definition regex. Match class and properties */
  static defsRegex = /class (?<name>\w+)\((?<defs>(?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gm;

  /** Parsed definition */
  protected defs: {[key: string]: Entry[]} = {};

  /** Source models provider */
  private source: Source;

  private addInvalid = false;

  constructor(source: Source, addInvalid = false) {
    this.source = source;
    this.addInvalid = addInvalid;
  }

  /** Load and parse all models */
  public async loadDefinition() {
    const dir = await this.source.readDir();

    for (const entry of dir) {
      await this.parseFile(entry);
    }

    if (!this.addInvalid) {
      const invalid = Object.entries(this.defs).filter(v => v[1].some(w => w.number === 0)).map(v => v[0]);
      
      for (const name in this.defs) {
        if (invalid.includes(name)) {
          delete this.defs[name];
        } else {
          this.defs[name] = this.defs[name].filter(v => !invalid.includes(v.type));
        }
      }
    }
  }
  
  /** Parse a model file */
  private async parseFile(sourceEntry: SourceEntry) {
    const file = await this.source.readFile(sourceEntry);

    for (let defs; (defs = Parser.defsRegex.exec(file)?.groups as {name: string, defs: string});) {
      const entries: Entry[] = [];

      for (let entry; (entry = Parser.regex.exec(defs.defs));) {
        const groups = entry.groups as {[key: string]: string};
        entries.push({
          repeated: Boolean(groups.list),
          required: !groups.optional,
          number: Number(groups.number),
          type: groups.list ? groups.list : groups.type,
          name: groups.name,
          match: entry[0],
        });
      }
  
      if (entries.length !== (defs.defs.match(/^\s*(?!\/\/\s*)@ProtoNumber/gm)?.length ?? 0)) {
        throw new Error(`Not all @ProtoNumber matched in ${defs.name}\n  matched: ${entries.map(v => v.name).join(', ')}`);
      }
  
      if (entries.length) {
        this.defs[defs.name] = entries;
      }
    }
  }

  /** post processing function */
  public abstract process(args: Args): Promise<void> | void;
}

export default Parser;
