import { Generator } from './generator.ts';

export class Protobuf extends Generator {
  /** kotlin type mapping */
  static type = {
    'String': 'string',
    'Int': 'int32',
    'Long': 'int64',
    'Boolean': 'bool',
    'Float': 'float',
  };

  /** Build schema from parsed definition */
  build(): string {
    const lines = ['syntax = "proto2";', ''];
    for (const name in this.defs) {
      lines.push(`message ${name} {`);

      for (const entry of this.defs[name]) {
        lines.push(
          `  // ${entry.match.trim()}`,
          `  ${entry.repeated ? 'repeated' : (entry.required ? 'required' : 'optional')} ${this.type(entry)} ${entry.name} = ${entry.number};`
        )
      }

      lines.push('}', '');
    }

    return lines.join('\n');
  }
}

export default Protobuf;
