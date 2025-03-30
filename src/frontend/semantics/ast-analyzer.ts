import {
  BinaryExpression,
  BlockStatement,
  FunctionDeclaration,
  Identifier,
  LogicLiteral,
  type LogicNode,
  Program,
  VariableDeclaration,
} from "../parser/ast";
import type { RangeExpression } from "../parser/ast/expressions/range.ts";
import type { AssignmentExpression } from "../parser/ast/assignments/variable-assignment.ts";
import type { ArrayLiteral } from "../parser/ast/literal.ts";
import type { ArrayAccess } from "../parser/ast/expressions/array-access.ts";
import { LogicType } from "../type-system";
import type { IfStatement } from "../parser/ast/control-flow/if.ts";
import type { ForStatement } from "../parser/ast/control-flow/for.ts";
import type { CallExpression } from "../parser/ast/expressions/call.ts";
import type {StructDeclaration} from "../parser/ast/declarations/struct.ts";

export abstract class AstAnalyzer<T> {
  abstract visit(ast: LogicNode): T;

  abstract visitProgram(node: Program): T;

  abstract visitStructDeclaration(node: StructDeclaration): T;

  abstract visitFunctionDeclaration(node: FunctionDeclaration): T;

  abstract visitForStatement(node: ForStatement): T;

  abstract visitIfStatement(node: IfStatement): T;

  abstract visitBlockStatement(node: BlockStatement): T;

  abstract visitVariableDeclaration(node: VariableDeclaration): T;

  abstract visitAssignmentExpression(node: AssignmentExpression): T;

  abstract visitRangeExpression(node: RangeExpression): T;

  abstract visitBinaryExpression(node: BinaryExpression): T;

  abstract visitArrayAccess(node: ArrayAccess): T;

  abstract visitCallExpression(node: CallExpression): T;

  abstract visitIdentifier(node: Identifier): T;

  abstract visitArrayLiteral(node: ArrayLiteral): T;

  abstract visitLiteral(
    node: LogicLiteral<number | string | boolean, LogicType>,
  ): T;
}
