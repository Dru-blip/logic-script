import {IndexedSet} from "./indexed-set.ts";

export class Module {
    public intructions:number[]=[]
    public constants:IndexedSet<any>
    constructor() {
        this.constants = new IndexedSet<any>();
    }
}