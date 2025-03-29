export class SymbolTable<T> {
    private readonly defs: Map<String, T>

    constructor(public parent?: SymbolTable<T>) {
        this.defs = new Map()
    }

    addSymbol(name: string, symbol: T): void {
        this.defs.set(name, symbol)
    }

    getSymbol(name: string): T|undefined{
        return this.defs.get(name)
    }

    getSymbols(): Readonly<typeof this.defs> {
        return this.defs
    }
}