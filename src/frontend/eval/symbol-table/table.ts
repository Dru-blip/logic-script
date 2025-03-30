import type { LogicObject } from "../objects/logic-object.ts";

export class SymbolTable {
  private readonly defs: Map<string, LogicObject>;

  constructor(public parent?: SymbolTable) {
    this.defs = new Map();
  }

  addSymbol(name: string, val: LogicObject) {
    this.defs.set(name, val);
  }

  getSymbol(name: string) {
    let temp: SymbolTable | undefined = this;
    while (temp !== null) {
      if (this.defs.has(name)) {
        return this.defs.get(name);
      }
      temp = temp?.parent;
    }
  }
}
