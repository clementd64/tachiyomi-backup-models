import { join, Args } from "../deps.ts";

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

  /** Parsed definition */
  protected defs: {[key: string]: Entry[]} = {};

  /** The models source directory */
  private root = '';

  constructor(root: string) {
    this.root = root;
  }

  /** Load and parse all models */
  public async loadDefinition() {
    for await (const entry of Deno.readDir(this.root)) {
      await this.parseFile(join(entry.name));
    }
  }
  
  /** Parse a model file */
  private async parseFile(filename: string) {
    const name = filename.replace('.kt', '');

    const entries: Entry[] = [];
    const file = await Deno.readTextFile(join(this.root, filename));

    for (let entry; (entry = Parser.regex.exec(file));) {
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

    if (entries.length !== (file.match(/^\s*(?!\/\/\s*)@ProtoNumber/gm)?.length ?? 0)) {
      throw new Error(`Not all @ProtoNumber matched in ${name}\n  matched: ${entries.map(v => v.name).join(', ')}`);
    }

    if (entries.length) {
      this.defs[name] = entries;
    }
  }

  /** post processing function */
  public abstract process(args: Args): Promise<void> | void;
}
