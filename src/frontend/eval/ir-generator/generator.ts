import {
  BinaryExpression,
  BlockStatement,
  FunctionDeclaration,
  Identifier,
  LogicLiteral,
  Program,
  UnaryExpression,
  VariableDeclaration,
} from "../../parser/ast";
import type { ArrayAccess } from "../../parser/ast/expressions/array-access.ts";
import type { ExpressionStatement } from "../../parser/ast/statements/expression.ts";
import type { ArrayLiteral } from "../../parser/ast/literal.ts";
import type { CallExpression } from "../../parser/ast/expressions/call.ts";
import type { RangeExpression } from "../../parser/ast/expressions/range.ts";
import type { AssignmentExpression } from "../../parser/ast/assignments/variable-assignment.ts";
import type { IfStatement } from "../../parser/ast/control-flow/if.ts";
import type { ForStatement } from "../../parser/ast/control-flow/for.ts";
import type { StructDeclaration } from "../../parser/ast/declarations/struct.ts";
import type { StructInitialisation } from "../../parser/ast/assignments/struct-initialisation.ts";
import type { ReturnStatement } from "../../parser/ast/statements/return.ts";
import { AstAnalyzer } from "../../analyzer/ast-analyzer.ts";

export type IRInstruction = {
  opcode: string;
  operands?: any[];
  line?: number;
};

export type IRFunction = {
  name: string;
  params: string[];
  instructions: IRInstruction[];
};

export type IRModule = {
  globalInstructions: IRInstruction[];
  functions: IRFunction[];
  constants: any[];
};

export class IRGenerator extends AstAnalyzer {
  private constants: any[] = [];
  private globalInstructions: IRInstruction[] = [];
  private functions: IRFunction[] = [];

  private getConstantIndex(value: any): number {
    let index = this.constants.indexOf(value);
    if (index === -1) {
      index = this.constants.length;
      this.constants.push(value);
    }
    return index;
  }

  visitProgram(node: Program): IRModule {
    node.statements.forEach((stmt) => {
      const instructions = this.visitNode(stmt);
      // Add instructions to globalInstructions if not a function declaration
      if (!(stmt instanceof FunctionDeclaration)) {
        this.globalInstructions.push(...instructions);
      }
    });
    this.globalInstructions.push({ opcode: "Halt", operands: [] });

    return {
      globalInstructions: this.globalInstructions,
      functions: this.functions,
      constants: this.constants,
    };
  }

  visitIfStatement(node: IfStatement): IRInstruction[] {
    const instructions: IRInstruction[] = [];
    const conditionInstructions = this.visitNode(node.condition);
    instructions.push(...conditionInstructions);

    // Store the current instruction index for later backpatching
    const jumpIfFalseIndex = instructions.length;
    instructions.push({
      opcode: "JUMP_IF_FALSE",
      operands: [0], // Placeholder, will be updated later
      line: node.location.line,
    });

    const thenInstructions = this.visitNode(node.then);
    instructions.push(...thenInstructions);

    // If there's an else block, we need to jump over it after executing the then block
    if (node.or) {
      const jumpIndex = instructions.length;
      instructions.push({
        opcode: "JUMP",
        operands: [0], // Placeholder, will be updated later
        line: node.location.line,
      });

      // Update the JUMP_IF_FALSE operand to point to the else block
      instructions[jumpIfFalseIndex]!.operands = [
        instructions.length - jumpIfFalseIndex,
      ];

      const elseInstructions = this.visitNode(node.or);
      instructions.push(...elseInstructions);

      // Update the JUMP operand to point past the else block
      instructions[jumpIndex]!.operands = [instructions.length];
    } else {
      instructions[jumpIfFalseIndex]!.operands = [instructions.length];
    }

    return instructions;
  }

  visitBlockStatement(node: BlockStatement): IRInstruction[] {
    const instructions: IRInstruction[] = [];

    for (const statement of node.statements) {
      const stmtInstructions = this.visitNode(statement);
      instructions.push(...stmtInstructions);
    }

    return instructions;
  }

  visitFunctionDeclaration(node: FunctionDeclaration): IRInstruction[] {
    const funcInstructions: IRInstruction[] = [];
    const funcIR: IRFunction = {
      name: node.name.name,
      params: node.params.map((param) => param.id.name),
      instructions: [],
    };

    node.body.statements.forEach((stmt) => {
      const stmtInstructions = this.visitNode(stmt);
      funcIR.instructions.push(...stmtInstructions);
    });

    this.functions.push(funcIR);

    return funcInstructions;
  }

  visitVariableDeclaration(node: VariableDeclaration): IRInstruction[] {
    const instructions: IRInstruction[] = [];
    if (node.initializer) {
      const initInstructions = this.visitNode(node.initializer);
      instructions.push(...initInstructions);
    }
    instructions.push({
      opcode: "STORE",
      operands: [node.name.name],
      line: node.name.location.line,
    });
    return instructions;
  }

  visitLiteral(node: LogicLiteral<number | string | boolean>): IRInstruction[] {
    const index = this.getConstantIndex(node.value);
    return [
      { opcode: "LOAD_CONST", operands: [index], line: node.location.line },
    ];
  }

  visitIdentifier(node: Identifier): IRInstruction[] {
    return [
      { opcode: "LOAD", operands: [node.name], line: node.location.line },
    ];
  }

  visitExpressionStatement(node: ExpressionStatement): IRInstruction[] {
    return this.visitNode(node.expr);
  }

  visitBinaryExpression(node: BinaryExpression): IRInstruction[] {
    const leftInstructions = this.visitNode(node.left);
    const rightInstructions = this.visitNode(node.right);

    return [
      ...leftInstructions,
      ...rightInstructions,
      { opcode: node.operator.literal, line: node.operator.location.line },
    ];
  }

  visitAssignmentExpression(node: AssignmentExpression): IRInstruction[] {
    if (node.target instanceof Identifier) {
      const valueInstructions = this.visitNode(node.value);
      return [
        ...valueInstructions,
        {
          opcode: "STORE",
          operands: [node.target.name],
          line: node.location.line,
        },
      ];
    }
    throw new Error(
      `Unsupported assignment target type: ${node.target.constructor.name}`,
    );
  }

  visitReturnStatement(node: ReturnStatement): IRInstruction[] {
    const valueInstructions = this.visitNode(node.value);
    return [
      ...valueInstructions,
      { opcode: "RETURN", line: node.location.line },
    ];
  }

  visitCallExpression(node: CallExpression): IRInstruction[] {
    const instructions: IRInstruction[] = [];
    node.args.forEach((arg: any) => {
      const argInstructions = this.visitNode(arg);
      instructions.push(...argInstructions);
    });

    if (node.callee instanceof Identifier) {
      instructions.push({
        opcode: "CALL",
        operands: [node.callee.name, node.args.length],
        line: node.location.line,
      });
    } else {
      throw new Error(
        `Unsupported callee type: ${node.callee.constructor.name}`,
      );
    }

    return instructions;
  }

  visitArrayAccess(node: ArrayAccess): IRInstruction[] {
    const arrayInstructions = this.visitNode(node.array);
    const indexInstructions = this.visitNode(node.index);

    return [
      ...arrayInstructions,
      ...indexInstructions,
      { opcode: "INDEX", line: node.location.line },
    ];
  }

  // visitForStatement(node: ForStatement): IRInstruction[] {
  //   const instructions: IRInstruction[] = [];
  //
  //   // Initialize loop variable
  //   if (node.init) {
  //     const initInstructions = this.visitNode(node.init);
  //     instructions.push(...initInstructions);
  //   }
  //
  //   // Mark the start of the loop
  //   const loopStartIndex = instructions.length;
  //
  //   // Evaluate condition
  //   if (node.condition) {
  //     const conditionInstructions = this.visitNode(node.condition);
  //     instructions.push(...conditionInstructions);
  //
  //     // Jump out of loop if condition is false
  //     instructions.push({
  //       opcode: "JUMP_IF_FALSE",
  //       operands: [0], // Placeholder
  //       line: node.location.line,
  //     });
  //     const jumpOutIndex = instructions.length - 1;
  //
  //     // Loop body
  //     const bodyInstructions = this.visitNode(node.body);
  //     instructions.push(...bodyInstructions);
  //
  //     // Update step
  //     if (node.update) {
  //       const updateInstructions = this.visitNode(node.update);
  //       instructions.push(...updateInstructions);
  //     }
  //
  //     // Jump back to condition
  //     instructions.push({
  //       opcode: "JUMP",
  //       operands: [loopStartIndex - instructions.length],
  //       line: node.location.line,
  //     });
  //
  //     // Update jump out target
  //     instructions[jumpOutIndex].operands = [
  //       instructions.length - jumpOutIndex,
  //     ];
  //   }
  //
  //   return instructions;
  // }

  visitUnaryExpression(node: UnaryExpression): IRInstruction[] {
    const exprInstructions = this.visitNode(node.argument);
    return [
      ...exprInstructions,
      {
        opcode: `UNARY_${node.operator.literal}`,
        line: node.operator.location.line,
      },
    ];
  }

  visitArrayLiteral(node: ArrayLiteral): IRInstruction[] {
    const instructions: IRInstruction[] = [];

    // Push each element onto the stack
    for (const element of node.values) {
      const elementInstructions = this.visitNode(element);
      instructions.push(...elementInstructions);
    }

    instructions.push({
      opcode: "BUILD_ARRAY",
      operands: [node.values.length],
      line: node.location.line,
    });

    return instructions;
  }

  // visitStructDeclaration(node: StructDeclaration): IRInstruction[] {
  //   // Register the struct type in constants
  //   const structName = node.name.name;
  //   const fields = node.fields.map((field) => field.name.name);
  //   const structIndex = this.getConstantIndex({
  //     type: "struct",
  //     name: structName,
  //     fields,
  //   });
  //
  //   return [
  //     {
  //       opcode: "LOAD_CONST",
  //       operands: [structIndex],
  //       line: node.location.line,
  //     },
  //     {
  //       opcode: "DEFINE_STRUCT",
  //       operands: [structName],
  //       line: node.location.line,
  //     },
  //   ];
  // }

  // visitStructInitialisation(node: StructInitialisation): IRInstruction[] {
  //   const instructions: IRInstruction[] = [];
  //
  //   // Load struct type
  //   instructions.push({
  //     opcode: "LOAD",
  //     operands: [node.struct.name],
  //     line: node.location.line,
  //   });
  //
  //   // Push each field value onto the stack
  //   for (const field of node.fields) {
  //     const valueInstructions = this.visitNode(field.value);
  //     instructions.push(...valueInstructions);
  //   }
  //
  //   // Create struct instance
  //   instructions.push({
  //     opcode: "BUILD_STRUCT",
  //     operands: [node.fields.length],
  //     line: node.location.line,
  //   });
  //
  //   return instructions;
  // }

  visitRangeExpression(node: RangeExpression): IRInstruction[] {
    const startInstructions = this.visitNode(node.start);
    const endInstructions = this.visitNode(node.end);

    const instructions = [...startInstructions, ...endInstructions];

    instructions.push({
      opcode: "BUILD_RANGE",
      operands: [2],
      line: node.op.location.line,
    });

    return instructions;
  }

  private visitNode(node: any): IRInstruction[] {
    if (!node) return [];
    const method = (this as any)[`visit${node.type}`];
    if (method) return method.call(this, node);
    throw new Error(`Unknown AST Node: ${node.type}`);
  }
}
