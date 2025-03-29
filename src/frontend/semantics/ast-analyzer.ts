import {BinaryExpression, LogicLiteral, type LogicNode, Program, VariableDeclaration} from "../parser/ast";
import type {PrimitiveType} from "../../types";


export abstract class AstAnalyzer<T> {
    abstract visit(ast:LogicNode):T;
    abstract visitProgram(node:Program):T;
    abstract visitBinaryExpression(node: BinaryExpression): T
    abstract visitLiteral(node:LogicLiteral<number | string | boolean, PrimitiveType>):T;
    abstract visitVariableDeclaration(node:VariableDeclaration):T;
}