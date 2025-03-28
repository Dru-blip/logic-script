import {SymbolTable} from "../symbols/symbol-table.ts";
import {AstAnalyzer} from "../ast-analyzer.ts";
import {type LogicType, PrimitiveType} from "../../../types";
import {type LogicLiteral, type LogicNode, NodeType, Program, VariableDeclaration} from "../../parser/ast";
import type {TypeDeclSymbol} from "../symbols/type-decl-symbol.ts";
import type {ExpressionStatement} from "../../parser/ast/statements/expression.ts";
import type {TypeCheckerResult} from "./types.ts";


export class TypeChecker extends AstAnalyzer<TypeCheckerResult> {
    symbols: SymbolTable<TypeDeclSymbol>

    constructor() {
        super();
        this.symbols = new SymbolTable()
    }

    check(ast: LogicNode): boolean {
        const res=this.visit(ast)
        // console.log(this.symbols.getSymbols())
        if(!res.isOk){
            console.log(res)
        }

        console.log(this.symbols.getSymbols())
        return true

    }

    visit(ast: LogicNode): TypeCheckerResult {
        switch (ast.type) {
            case NodeType.Program: {
                return this.visitProgram(<Program>ast)
            }
            case NodeType.ExpressionStatement: {
                return this.visit((<ExpressionStatement>ast).expr)
            }
            case NodeType.Literal: {
                return this.visitLiteral(<LogicLiteral<number | string | boolean, PrimitiveType>>ast)
            }
            case NodeType.VariableDeclaration: {
                return this.visitVariableDeclaration(<VariableDeclaration>ast)
            }
            default: {
                return {
                    isOk: false,
                    error: "Unexpected type",
                }
            }
        }
    }

    visitProgram(node: Program): TypeCheckerResult {
        for (const statement of node.statements) {
            const res = this.visit(statement)
            if (!res.isOk) {
                return res
            }
        }
        return {
            isOk: true,
            type: PrimitiveType.UNKNOWN
        }
    }

    visitVariableDeclaration(node: VariableDeclaration): TypeCheckerResult {
        const id = node.name.name
        const declType = node.declType
        const initType = this.visit(node.initializer!)

        if (!initType.isOk) {
            return initType
        }

        if (declType !== initType.type) {
            return {
                isOk: false,
                error: "Type mismatch",
            }
        }

        this.symbols.addSymbol(id, {name: id, declType: declType})

        return {
            isOk: true,
            type: PrimitiveType.UNKNOWN
        }
    }

    visitLiteral(node: LogicLiteral<number | string | boolean, PrimitiveType>): TypeCheckerResult {
        return {
            isOk: true,
            type: node.declType
        }
    }
}