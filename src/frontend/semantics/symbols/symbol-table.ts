export class SymbolTable<T> {
  private readonly defs: Map<String, T>;

  constructor(public parent?: SymbolTable<T>) {
    this.defs = new Map();
  }

  addSymbol(name: string, symbol: T): void {
    this.defs.set(name, symbol);
  }

  getSymbol(name: string): T | undefined {
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

  getSymbols(): Readonly<typeof this.defs> {
    return this.defs;
  }
}
