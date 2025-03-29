import {SymbolTable} from "../symbols/symbol-table.ts";
import {AstAnalyzer} from "../ast-analyzer.ts";
import {type LogicType, PrimitiveType} from "../../../types";
import {
    BinaryExpression,
    Identifier,
    type LogicLiteral,
    type LogicNode,
    NodeType,
    Program,
    VariableDeclaration,
} from "../../parser/ast";
import type {TypeDeclSymbol} from "../symbols/type-decl-symbol.ts";
import type {ExpressionStatement} from "../../parser/ast/statements/expression.ts";
import type {TypeCheckerResult} from "./types.ts";
import {LgSemanticError} from "../../errors/semantics.ts";
import type {RangeExpression} from "../../parser/ast/expressions/range.ts";
import {LgErrorCode} from "../../errors";

export class TypeChecker extends AstAnalyzer<TypeCheckerResult> {
    symbols: SymbolTable<TypeDeclSymbol>;

    typeRules: Map<string, LogicType> = new Map([
        ["Int+Int", PrimitiveType.INT],
        ["Int-Int", PrimitiveType.INT],
        ["Int*Int", PrimitiveType.INT],
        ["Int/Int", PrimitiveType.INT],
        ["Int%Int", PrimitiveType.INT],
        ["Int<Int", PrimitiveType.BOOLEAN],
        ["Int>Int", PrimitiveType.BOOLEAN],
        ["Int<=Int", PrimitiveType.BOOLEAN],
        ["Int>=Int", PrimitiveType.BOOLEAN],
        ["Int!=Int", PrimitiveType.BOOLEAN],
        ["Int==Int", PrimitiveType.BOOLEAN],
        ["Str+Str", PrimitiveType.STR],
        ["Bool!=Bool", PrimitiveType.BOOLEAN],
        ["Bool==Bool", PrimitiveType.BOOLEAN],
        ["BoolandBool", PrimitiveType.BOOLEAN],
        ["BoolorBool", PrimitiveType.BOOLEAN],
    ]);

    constructor(public fileName: string) {
        super();
        this.symbols = new SymbolTable();
    }

    check(ast: LogicNode) {
        // console.log(this.symbols.getSymbols())
        return this.visit(ast);
    }

    visit(ast: LogicNode): TypeCheckerResult {
        switch (ast.type) {
            case NodeType.Program: {
                return this.visitProgram(<Program>ast);
            }
            case NodeType.VariableDeclaration: {
                return this.visitVariableDeclaration(<VariableDeclaration>ast);
            }
            case NodeType.ExpressionStatement: {
                return this.visit((<ExpressionStatement>ast).expr);
            }
            case NodeType.RangeExpression: {
                return this.visitRangeExpression(<RangeExpression>ast)
            }
            case NodeType.BinaryExpression: {
                return this.visitBinaryExpression(<BinaryExpression>ast);
            }
            case NodeType.Literal: {
                return this.visitLiteral(
                    <LogicLiteral<number | string | boolean, PrimitiveType>>ast,
                );
            }
            case NodeType.Identifier: {
                return this.visitIdentifier(<Identifier>ast);
            }
            default: {
                return {
                    isOk: false,
                    value: PrimitiveType.UNKNOWN,
                };
            }
        }
    }

    visitProgram(node: Program): TypeCheckerResult {
        let result: TypeCheckerResult;
        for (const statement of node.statements) {
            const res = this.visit(statement);
            if (!res.isOk) {
                return res;
            }
            result = res;
        }
        return result!;
    }

    visitVariableDeclaration(node: VariableDeclaration): TypeCheckerResult {
        const id = node.name.name;
        const declType = node.declType;
        const initType = this.visit(node.initializer!);

        if (!initType.isOk) {
            return initType;
        }

        if (declType !== initType.value) {
            return LgSemanticError.typeMismatch(
                this.fileName,
                node,
                node.name.location,
                declType.toString(),
                initType.value!.toString(),
            );
        }

        this.symbols.addSymbol(id, {name: id, declType: declType});

        return {
            isOk: true,
            value: declType,
        };
    }

    visitRangeExpression(node: RangeExpression): TypeCheckerResult {
        const lht = this.visit(node.start);
        if (!lht.isOk) {
            return lht;
        }
        const rht = this.visit(node.end);
        if (!rht.isOk) {
            return rht;
        }

        if (lht.value === PrimitiveType.INT && lht.value !== rht.value) {
            return {
                isOk: false,
                error: new LgSemanticError(
                    this.fileName,
                    node.op.location,
                    "Range expression requires both operands to be Int",
                    LgErrorCode.INVALID_OPERATION,
                    lht.value?.toString(),
                    rht.value?.toString(),
                ),
            };
        }

        return {
            isOk: true,
            value: lht.value,
        };
    }

    visitBinaryExpression(node: BinaryExpression): TypeCheckerResult {
        const lht = this.visit(node.left);
        if (!lht.isOk) {
            return lht;
        }
        const rht = this.visit(node.right);
        if (!rht.isOk) {
            return rht;
        }

        const op = node.operator.literal;
        if (lht.value !== rht.value) {
            return LgSemanticError.invalidBinOp(
                this.fileName,
                node,
                lht.value!,
                rht.value!,
            );
        }
        const key = lht.value?.toString() + op + rht.value?.toString();
        const typeRule = this.typeRules.get(key);
        if (!typeRule) {
            return LgSemanticError.invalidOperation(
                this.fileName,
                node.operator,
                lht.value!,
                rht.value!,
            );
        }
        return {
            isOk: true,
            value: this.typeRules.get(key),
        };
    }

    visitIdentifier(node: Identifier): TypeCheckerResult {
        const variable = this.symbols.getSymbol(node.name);
        if (!variable) {
            return LgSemanticError.undefinedVariable(this.fileName, node);
        }

        return {
            isOk: true,
            value: variable.declType,
        };
    }

    visitLiteral(
        node: LogicLiteral<number | string | boolean, PrimitiveType>,
    ): TypeCheckerResult {
        return {
            isOk: true,
            value: node.declType,
        };
    }
}
