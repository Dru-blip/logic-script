import {AstAnalyzer} from "./ast-analyzer.ts";
import {LogicLiteral} from "../parser/ast";
import type {PrimitiveType} from "../../types";
import {SymbolTable} from "./symbols/symbol-table.ts";


export class SymbolResolver extends AstAnalyzer{
    symbols:SymbolTable
    constructor() {
        super();
        this.symbols=new SymbolTable()
    }
    visit(ast: AstAnalyzer): void {

    }

    visitLiteral(node: LogicLiteral<number | string | boolean, PrimitiveType>): void {
    }
}