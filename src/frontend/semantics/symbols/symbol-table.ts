export class SymbolTable<T>{
    defs:Map<String,T>
    constructor(public parent?:SymbolTable<T>) {
        this.defs = new Map()
    }
}