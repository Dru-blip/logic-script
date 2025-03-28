export class SymbolTable<T>{
    private defs:Map<String,T>
    constructor(public parent?:SymbolTable<T>) {
        this.defs = new Map()
    }

    addSymbol(name:string,symbol:T):void{
        this.defs.set(name, symbol)
    }

    getSymbols():Readonly<typeof this.defs>{
        return this.defs
    }
}