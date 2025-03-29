import {BinaryExpression, Identifier, LogicLiteral, type LogicNode, Program, VariableDeclaration} from "../parser/ast";
import type {PrimitiveType} from "../../types";
import type {TypeCheckerResult} from "./type-checker/types.ts";
import type {RangeExpression} from "../parser/ast/expressions/range.ts";
import type {AssignmentExpression} from "../parser/ast/assignments/variable-assignment.ts";
import type {ArrayLiteral} from "../parser/ast/literal.ts";
import type {ArrayAccess} from "../parser/ast/expressions/array-access.ts";


export abstract class AstAnalyzer<T> {
    abstract visit(ast:LogicNode):T;
    abstract visitProgram(node:Program):T;
    abstract visitVariableDeclaration(node:VariableDeclaration):T;

    abstract visitAssignmentExpression(node:AssignmentExpression):T
    abstract visitRangeExpression(node: RangeExpression): T
    abstract visitBinaryExpression(node: BinaryExpression): T
    abstract visitArrayAccess(node:ArrayAccess):T
    abstract visitIdentifier(node: Identifier): T
    abstract visitArrayLiteral(node: ArrayLiteral): T
    abstract visitLiteral(node:LogicLiteral<number | string | boolean, PrimitiveType>):T;
}