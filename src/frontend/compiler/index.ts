import { LogicLiteral, type LogicNode, Program } from "../parser/ast";
import { Module } from "./module.ts";
import { ExpressionStatement } from "../parser/ast/statements/expression.ts";
import { OpCode } from "./opcode.ts";

export class Compiler {
  public module: Module;

  constructor(public program: Program) {
    this.module = new Module();
  }

  public compile(): void {
    this.compileStatements(this.program.statements);
  }

  public compileStatements(statements: LogicNode[]) {
    for (const node of statements) {
      this.compileStatement(node);
    }
  }

  public compileStatement(statement: LogicNode) {
    if (statement instanceof ExpressionStatement) {
      this.compileExpression(statement.expr);
    }
  }

  public compileExpression(expression: LogicNode) {
    if (expression instanceof LogicLiteral) {
      this.compileLiteral(expression);
    }
  }

  public compileLiteral(expression: LogicLiteral) {
    this.module.intructions.push(OpCode.LOAD);
    const index = this.module.constants.add(expression.value);
    this.module.intructions.push(index);
  }
}
