import { LgErrorCode, LgErrorType, LogicError } from "./index.ts";
import type { SemanticResult, TokenLocation } from "../../types";
import type { ParserContext } from "../parser/context.ts";
import { BinaryExpression, Identifier, type LogicNode } from "../parser/ast";
import { Token } from "../lexer";
import { LogicType } from "../type-system";
import type {CallExpression} from "../parser/ast/expressions/call.ts";

const SEMANTIC_ERROR_HINTS: Map<string, string> = new Map([
  [
    LgErrorCode.UNDEFINED_VARIABLE,
    "Check if the variable is declared before use.",
  ],
  [LgErrorCode.TYPE_MISMATCH, "Ensure type consistency in expressions."],
  [
    LgErrorCode.REDECLARATION,
    "A variable with this name already exists in the current scope.",
  ],
  [
    LgErrorCode.UNDEFINED_FUNCTION,
    "Ensure the function is defined before calling it.",
  ],
  [
    LgErrorCode.INVALID_OPERATION,
    "Verify that the operation is valid for the given types.",
  ],
]);

export class LgSemanticError extends LogicError {
  constructor(
    public filename: string,
    public location: TokenLocation,
    public message: string,
    public code: LgErrorCode,
    expected?: string,
    unexpected?: string,
  ) {
    super(
      filename,
      location,
      message,
      code,
      LgErrorType.SEMANTIC,
      expected,
      unexpected,
    );
  }

  printError(source: string) {
    super.printError(source, SEMANTIC_ERROR_HINTS);
  }

  static argumentCountMismatch(
      fileName: string,
      node: CallExpression,
      expected: number,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
          fileName,
          node.location,
          `Expected ${expected} arguments, but got ${node.args.length}.`,
          LgErrorCode.ARGUMENT_COUNT_MISMATCH,
      ),
    };
  }



  static undefinedVariable(
    fileName: string,
    node: Identifier,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        fileName,
        node.location,
        `Use of undeclared variable '${node.name}'.`,
        LgErrorCode.UNDEFINED_VARIABLE,
      ),
    };
  }

  static typeMismatch(
    fileName: string,
    node: LogicNode,
    location: TokenLocation,
    expected: string,
    found: string,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        fileName,
        location,
        `Type mismatch: expected '${expected}', found '${found}'.`,
        LgErrorCode.TYPE_MISMATCH,
      ),
    };
  }

  static invalidBinOp(
    fileName: string,
    node: BinaryExpression,
    leftType: LogicType,
    rightType: LogicType,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        fileName,
        node.operator.location,
        `Invalid operands for '${node.operator.literal}'. ` +
          `Expected both operands to be of the same type, but found '${leftType}' and '${rightType}'. `,
        LgErrorCode.INVALID_OPERATION,
      ),
    };
  }

  static invalidOperation(
    fileName: string,
    operator: Token,
    leftHand: LogicType,
    rightHand: LogicType,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        fileName,
        operator.location,
        `Invalid operation "${operator.literal}" between ${leftHand.toString()} and ${rightHand.toString()}`,
        LgErrorCode.INVALID_OPERATION,
      ),
    };
  }

  static redeclaration(
    context: ParserContext,
    varName: string,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        context.lexer.filename,
        context.currentToken.location,
        `Variable '${varName}' is already declared in this scope.`,
        LgErrorCode.REDECLARATION,
      ),
    };
  }

  static undefinedFunction(
    context: ParserContext,
    funcName: string,
  ): SemanticResult<never> {
    return {
      isOk: false,
      error: new LgSemanticError(
        context.lexer.filename,
        context.currentToken.location,
        `Call to undefined function '${funcName}'.`,
        LgErrorCode.UNDEFINED_FUNCTION,
      ),
    };
  }
}
