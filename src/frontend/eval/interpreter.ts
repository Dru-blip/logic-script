import { SymbolTable } from "./symbol-table/table.ts";
import { AstAnalyzer } from "../analyzer/ast-analyzer.ts";
import {
  BinaryExpression,
  BlockStatement,
  FunctionDeclaration,
  Identifier,
  LogicLiteral,
  type LogicNode,
  NodeType,
  Program,
  UnaryExpression,
  VariableDeclaration,
} from "../parser/ast";
import type { LogicObject } from "./objects/logic-object.ts";
import { LogicInt } from "./objects/int.ts";
import type { AssignmentExpression } from "../parser/ast/assignments/variable-assignment.ts";
import { type ArrayLiteral } from "../parser/ast/literal.ts";
import { type ArrayAccess } from "../parser/ast/expressions/array-access.ts";
import { type CallExpression } from "../parser/ast/expressions/call.ts";
import type { RangeExpression } from "../parser/ast/expressions/range.ts";
import type { StructInitialisation } from "../parser/ast/assignments/struct-initialisation.ts";
import { type ExpressionStatement } from "../parser/ast/statements/expression.ts";
import type { IfStatement } from "../parser/ast/control-flow/if.ts";
import type { ForStatement } from "../parser/ast/control-flow/for.ts";
import type { StructDeclaration } from "../parser/ast/declarations/struct.ts";
import { TokenType } from "../lexer";
import { BuiltinFunction } from "./objects/builtin-function.ts";
import { LArray } from "./objects/array.ts";
import { LFunction } from "./objects/function.ts";

export class Interpreter extends AstAnalyzer {
  symbols: SymbolTable;

  constructor() {
    super();
    this.symbols = new SymbolTable();
    this.initBuiltins();
  }

  enterScope() {
    const parent = this.symbols;
    this.symbols = new SymbolTable(parent);
  }

  leaveScope() {
    this.symbols = this.symbols.parent!;
  }

  initBuiltins() {
    this.symbols.addSymbol(
      "print",
      new BuiltinFunction("print", (objects: LogicObject[]) => {
        console.log(`${objects}`);
      }),
    );
  }

  visit(node: LogicNode) {
    switch (node.type) {
      case NodeType.Program: {
        return this.visitProgram(<Program>node);
      }
      case NodeType.StructDeclaration: {
        return this.visitStructDeclaration(<StructDeclaration>node);
      }
      case NodeType.FunctionDeclaration: {
        return this.visitFunctionDeclaration(<FunctionDeclaration>node);
      }
      case NodeType.VariableDeclaration: {
        return this.visitVariableDeclaration(<VariableDeclaration>node);
      }
      case NodeType.ForStatement: {
        return this.visitForStatement(<ForStatement>node);
      }
      case NodeType.IfStatement: {
        return this.visitIfStatement(<IfStatement>node);
      }
      case NodeType.BlockStatement: {
        return this.visitBlockStatement(<BlockStatement>node);
      }
      case NodeType.ExpressionStatement: {
        return this.visitExpressionStatement(<ExpressionStatement>node);
      }
      case NodeType.AssignmentExpression: {
        return this.visitAssignmentExpression(<AssignmentExpression>node);
      }
      case NodeType.StructInitializer: {
        return this.visitStructInitializer(<StructInitialisation>node);
      }
      case NodeType.RangeExpression: {
        return this.visitRangeExpression(<RangeExpression>node);
      }
      case NodeType.CallExpression: {
        return this.visitCallExpression(<CallExpression>node);
      }
      case NodeType.ArrayAccess: {
        return this.visitArrayAccess(<ArrayAccess>node);
      }
      case NodeType.ArrayLiteral: {
        return this.visitArrayLiteral(<ArrayLiteral>node);
      }
      case NodeType.BinaryExpression: {
        return this.visitBinaryExpression(<BinaryExpression>node);
      }
      case NodeType.UnaryExpression: {
        return this.visitUnaryExpression(<UnaryExpression>node);
      }
      case NodeType.Identifier: {
        return this.visitIdentifier(<Identifier>node);
      }
      case NodeType.Literal: {
        return this.visitLiteral(<LogicLiteral>node);
      }
    }
  }

  visitProgram(node: Program): any {
    for (const statement of node.statements) {
      this.visit(statement);
    }
  }

  visitFunctionDeclaration(node: FunctionDeclaration): any {
    this.symbols.addSymbol(
      node.name.name,
      new LFunction(node.name.name, node.params, node.body),
    );
  }

  visitBlockStatement(node: BlockStatement): any {
    for (const statement of node.statements) {
      this.visit(statement);
    }
  }

  visitVariableDeclaration(node: VariableDeclaration): any {
    const init = this.visit(node.initializer!);
    this.symbols.addSymbol(node.name.name, init);
  }

  visitExpressionStatement(node: ExpressionStatement): any {
    this.visit(node.expr);
  }

  visitCallExpression(node: CallExpression): any {
    const args = [];
    for (const arg of node.args) {
      args.push(this.visit(arg));
    }
    if (node.callee instanceof Identifier) {
      let func = this.symbols.getSymbol(node.callee.name);
      if (!func) {
        throw new Error(`Unexpected callee: ${node.callee.name}`);
      }
      if (func instanceof BuiltinFunction) {
        return func.call(args);
      }
      if (func instanceof LFunction) {
        return func.call(this, args);
      }
    }
  }

  visitAssignmentExpression(node: AssignmentExpression): any {
    if (node.target instanceof Identifier) {
      const id = node.target.name;
      const val = this.visit(node.value);
      this.symbols.addSymbol(id, val);
      return;
    }
  }

  visitArrayAccess(node: ArrayAccess): any {
    const array = this.visit(node.array);
    const index = this.visit(node.index);

    if (array instanceof LArray) {
      return array.elements.at(index.value);
    }
  }

  visitArrayLiteral(node: ArrayLiteral): LArray {
    const values: LogicObject[] = [];
    for (const value of node.values) {
      values.push(this.visit(value));
    }

    return new LArray(values);
  }

  visitBinaryExpression(node: BinaryExpression): any {
    const op = node.operator;
    const lhs: LogicObject = this.visit(node.left);
    const rhs: LogicObject = this.visit(node.right);

    if (lhs instanceof LogicInt && rhs instanceof LogicInt) {
      switch (op.type) {
        case TokenType.PLUS:
          return lhs.callMethod("add", [rhs]);
        case TokenType.MINUS:
          return lhs.callMethod("sub", [rhs]);
        case TokenType.ASTERISK:
          return lhs.callMethod("mul", [rhs]);
        case TokenType.SLASH:
          return lhs.callMethod("div", [rhs]);
        case TokenType.EQUALS:
          return lhs.callMethod("eq", [rhs]);
        case TokenType.NOT_EQUAL:
          return lhs.callMethod("neq", [rhs]);
        case TokenType.LESS_THAN:
          return lhs.callMethod("lt", [rhs]);
        case TokenType.LESS_THAN_EQUAL:
          return lhs.callMethod("lte", [rhs]);
        case TokenType.GREATER_THAN:
          return lhs.callMethod("gt", [rhs]);
        case TokenType.GREATER_THAN_EQUAL:
          return lhs.callMethod("gte", [rhs]);
        default:
          throw new Error(`Unknown operator '${op}'`);
      }
    }

    throw new Error("type mismatch");
  }

  visitUnaryExpression(node: UnaryExpression): any {}

  visitIdentifier(node: Identifier): any {
    return this.symbols.getSymbol(node.name);
  }

  visitLiteral(node: LogicLiteral<number | string | boolean>): LogicObject {
    if (node.literalType === "number") {
      return new LogicInt(<number>node.value);
    }
    return <LogicInt>{};
  }
}
