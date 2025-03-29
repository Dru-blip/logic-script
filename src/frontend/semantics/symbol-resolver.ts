import {AstAnalyzer} from "./ast-analyzer.ts";
import {BinaryExpression, LogicLiteral, type LogicNode, Program, VariableDeclaration} from "../parser/ast";
import  {type PrimitiveType} from "../../types";
import {SymbolTable} from "./symbols/symbol-table.ts";


export class SymbolResolver extends AstAnalyzer<any>{
    symbols:SymbolTable<any>
    constructor() {
        super();
        this.symbols=new SymbolTable()
    }
    visit(ast: LogicNode): any {

    }

    visitLiteral(node: LogicLiteral<number | string | boolean, PrimitiveType>): any {
    }

    visitProgram(node: Program): any {
    }

    visitVariableDeclaration(node: VariableDeclaration): any {
    }

    visitBinaryExpression(node: BinaryExpression): any {
    }
}