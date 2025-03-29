import { AstAnalyzer } from "./ast-analyzer.ts";
import {
  BinaryExpression,
  BlockStatement,
  Identifier,
  LogicLiteral,
  type LogicNode,
  Program,
  VariableDeclaration,
} from "../parser/ast";
// import   from "../../types";
import { SymbolTable } from "./symbols/symbol-table.ts";
import { type RangeExpression } from "../parser/ast/expressions/range.ts";
import { type ArrayLiteral } from "../parser/ast/literal.ts";
import { type AssignmentExpression } from "../parser/ast/assignments/variable-assignment.ts";
import type { ArrayAccess } from "../parser/ast/expressions/array-access.ts";
import { LogicType } from "../type-system";

export class SymbolResolver extends AstAnalyzer<any> {
  symbols: SymbolTable<any>;

  constructor() {
    super();
    this.symbols = new SymbolTable();
  }

  visit(ast: LogicNode): any {}

  visitLiteral(node: LogicLiteral<number | string | boolean, LogicType>): any {}

  visitProgram(node: Program): any {}

  visitVariableDeclaration(node: VariableDeclaration): any {}

  visitBinaryExpression(node: BinaryExpression): any {}

  visitIdentifier(node: Identifier): any {}

  visitRangeExpression(node: RangeExpression): any {}

  visitArrayLiteral(node: ArrayLiteral): any {}

  visitAssignmentExpression(node: AssignmentExpression): any {}

  visitArrayAccess(node: ArrayAccess): any {}

  visitBlockStatement(node: BlockStatement): any {}
}
