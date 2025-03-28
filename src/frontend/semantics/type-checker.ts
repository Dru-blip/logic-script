import {SymbolTable} from "./symbols/symbol-table.ts";
import {AstAnalyzer} from "./ast-analyzer.ts";
import type {PrimitiveType} from "../../types";
import {type LogicLiteral, type LogicNode, NodeType, Program, VariableDeclaration} from "../parser/ast";
import type {TypeDeclSymbol} from "./symbols/type-decl-symbol.ts";
import type {ExpressionStatement} from "../parser/ast/statements/expression.ts";


export class TypeChecker extends AstAnalyzer<void> {
    symbols:SymbolTable<TypeDeclSymbol>
    constructor() {
        super();
        this.symbols=new SymbolTable()
    }

    check(ast:LogicNode):boolean {
        this.visit(ast)
        return true
    }


    visit(ast: LogicNode){
        switch (ast.type){
            case NodeType.Program:{
                this.visitProgram(<Program>ast)
                break
            }
            case NodeType.ExpressionStatement:{
                this.visit((<ExpressionStatement>ast).expr)
                break
            }
            case NodeType.Literal:{
                this.visitLiteral(<LogicLiteral<number|string|boolean,PrimitiveType>>ast)
                break
            }
            case NodeType.VariableDeclaration:{
                this.visitVariableDeclaration(<VariableDeclaration>ast)
                break;
            }
            default:{
                return;
            }
        }
    }

    visitProgram(node:Program) {
        for(const statement of node.statements){
            this.visit(statement)
        }
    }

    visitVariableDeclaration(node: VariableDeclaration){
        console.log(node)
    }

    visitLiteral(node: LogicLiteral<number | string | boolean, PrimitiveType>){
        throw new Error("Method not implemented.");
    }
}