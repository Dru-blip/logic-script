import type { LogicObject } from "../objects/logic-object.ts";

export class SymbolTable {
  private readonly defs: Map<string, LogicObject>;

  constructor(public parent?: SymbolTable) {
    this.defs = new Map();
  }

  addSymbol(name: string, val: LogicObject) {
    this.defs.set(name, val);
  }

  getSymbol(name: string): LogicObject | undefined {
    let symbol = this.defs.get(name);

    if (symbol) {
      return symbol;
    }

    let parent = this.parent;
    while (parent) {
      symbol = parent?.getSymbol(name);
      if (!symbol) {
        parent = parent?.parent;
      } else {
        return symbol;
      }
    }
  }
}
