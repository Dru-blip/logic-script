import {
  BinaryExpression, BlockStatement,
  FunctionDeclaration,
  Identifier,
  LogicLiteral,
  Program,
  UnaryExpression,
  VariableDeclaration,
} from "../parser/ast";
import type { ArrayAccess } from "../parser/ast/expressions/array-access.ts";
import type { ExpressionStatement } from "../parser/ast/statements/expression.ts";
import type { ArrayLiteral } from "../parser/ast/literal.ts";
import type { CallExpression } from "../parser/ast/expressions/call.ts";
import type { RangeExpression } from "../parser/ast/expressions/range.ts";
import type { AssignmentExpression } from "../parser/ast/assignments/variable-assignment.ts";
import type { IfStatement } from "../parser/ast/control-flow/if.ts";
import type { ForStatement } from "../parser/ast/control-flow/for.ts";
import type { StructDeclaration } from "../parser/ast/declarations/struct.ts";
import type { StructInitialisation } from "../parser/ast/assignments/struct-initialisation.ts";
import type {ReturnStatement} from "../parser/ast/statements/return.ts";

export abstract class AstAnalyzer {
  abstract visitProgram(node: Program): any;

  abstract visitStructDeclaration(node: StructDeclaration): any;

  abstract visitFunctionDeclaration(node: FunctionDeclaration): any;

  abstract visitVariableDeclaration(node: VariableDeclaration): any;

  abstract visitForStatement(node: ForStatement): any;

  abstract visitIfStatement(node: IfStatement): any;

  abstract visitBlockStatement(node: BlockStatement): any;

  abstract visitReturnStatement(node:ReturnStatement):any

  abstract visitExpressionStatement(node: ExpressionStatement): any;

  abstract visitAssignmentExpression(node: AssignmentExpression): any;

  abstract visitStructInitializer(node: StructInitialisation): any;

  abstract visitRangeExpression(node: RangeExpression): any;

  abstract visitCallExpression(node: CallExpression): any;

  abstract visitArrayAccess(node: ArrayAccess): any;

  abstract visitArrayLiteral(node: ArrayLiteral): any;

  abstract visitBinaryExpression(node: BinaryExpression): any;

  abstract visitUnaryExpression(node: UnaryExpression): any;

  abstract visitIdentifier(node: Identifier): any;

  abstract visitLiteral(node: LogicLiteral<number | string | boolean>): any;
}
