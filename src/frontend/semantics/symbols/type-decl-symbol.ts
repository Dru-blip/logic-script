import type {LogicType} from "../../../types";


export class TypeDeclSymbol {
    constructor(public name: string,public declType:LogicType) {}
}