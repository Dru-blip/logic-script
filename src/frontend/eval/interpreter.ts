import { SymbolTable } from "./symbol-table/table.ts";
import { AstAnalyzer } from "../analyzer/ast-analyzer.ts";
import {
  BinaryExpression,
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

export class Interpreter extends AstAnalyzer {
  symbols: SymbolTable;

  constructor() {
    super();
    this.symbols = new SymbolTable();
  }

  // initBuiltins(){
  //   this.symbols.addSymbol("print",)
  // }

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

  visitVariableDeclaration(node: VariableDeclaration): any {
    const init = this.visit(node.initializer!);
    this.symbols.addSymbol(node.name.name, init);
  }

  visitCallExpression(node: CallExpression): any {
    console.log(node);
  }

  visitExpressionStatement(node: ExpressionStatement): any {
    this.visit(node.expr);
  }

  visitAssignmentExpression(node: AssignmentExpression): any {
    if (node.target instanceof Identifier) {
      const id = node.target.name;
      const val = this.visit(node.value);
      this.symbols.addSymbol(id, val);
      return;
    }
  }

  visitArrayAccess(node: ArrayAccess): any {}

  visitArrayLiteral(node: ArrayLiteral): any {}

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
          return lhs === rhs;
        case TokenType.NOT_EQUAL:
          return lhs !== rhs;
        case TokenType.LESS_THAN:
          return lhs < rhs;
        case TokenType.LESS_THAN_EQUAL:
          return lhs <= rhs;
        case TokenType.GREATER_THAN:
          return lhs > rhs;
        case TokenType.GREATER_THAN_EQUAL:
          return lhs >= rhs;
        default:
          throw new Error(`Unknown operator '${op}'`);
      }
    }
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
