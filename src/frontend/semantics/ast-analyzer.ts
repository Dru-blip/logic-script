import {BinaryExpression, Identifier, LogicLiteral, type LogicNode, Program, VariableDeclaration} from "../parser/ast";
import type {PrimitiveType} from "../../types";
import type {TypeCheckerResult} from "./type-checker/types.ts";
import type {RangeExpression} from "../parser/ast/expressions/range.ts";


export abstract class AstAnalyzer<T> {
    abstract visit(ast:LogicNode):T;
    abstract visitProgram(node:Program):T;

    abstract visitVariableDeclaration(node:VariableDeclaration):T;
    abstract visitRangeExpression(node: RangeExpression): T
    abstract visitBinaryExpression(node: BinaryExpression): T
    abstract visitIdentifier(node: Identifier): T
    abstract visitLiteral(node:LogicLiteral<number | string | boolean, PrimitiveType>):T;

}