import type { ParserContext } from "../parser/context.ts";
import type { ParseResult, TokenLocation } from "../../types";
import { LgErrorCode, LgErrorType, LogicError } from "./index.ts";

const ERROR_HINTS: Map<string, string> = new Map([
  [LgErrorCode.MISSING_TYPE, "Provide a valid type, e.g., `let b: Int = 10;`"],
  [
    LgErrorCode.UNEXPECTED_TOKEN,
    "Check for unexpected symbols or misplaced keywords.",
  ],
  [
    LgErrorCode.MISSING_ASSIGNMENT,
    "Did you mean to use `=` for assignment? e.g., `let x: Int = 5;`",
  ],
  [
    LgErrorCode.UNCLOSED_PARENTHESIS,
    "Ensure all opening `(` have a matching closing `)`.",
  ],
  [
    LgErrorCode.UNKNOWN_KEYWORD,
    "Did you mean to use a valid keyword? Check the language syntax.",
  ],
  [
    LgErrorCode.UNEXPECTED_EOF,
    "Your code seems to end abruptly. Did you forget to close a block or add a semicolon?",
  ],
  [
    LgErrorCode.MISSING_SEMICOLON,
    "Statements must end with `;`. Did you forget to add one?",
  ],
]);

export class LgSyntaxError extends LogicError {
  constructor(
    filename: string,
    location: TokenLocation,
    message: string,
    code: LgErrorCode,
    expected?: string,
    unexpected?: string,
  ) {
    super(
      filename,
      location,
      message,
      code,
      LgErrorType.SYNTAX,
      expected,
      unexpected,
    );
  }

  printError(source: string) {
    super.printError(source, ERROR_HINTS);
  }

  static unexpected(
    context: ParserContext,
    expected: string,
  ): ParseResult<never> {
    return {
      isOk: false,
      error: new LgSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        `Expected ${expected}, but found '${context.currentToken.type}'.`,
        LgErrorCode.UNEXPECTED_TOKEN,
        expected,
        context.currentToken.type,
      ),
    };
  }

  static missingType(context: ParserContext): ParseResult<never> {
    return {
      isOk: false,
      error: new LgSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "Type annotation is required.",
        LgErrorCode.MISSING_TYPE,
      ),
    };
  }

  static missingSemicolon(context: ParserContext): ParseResult<never> {
    const { lexer, currentToken } = context;
    context.advance();
    // console.log(currentToken.location)
    return {
      isOk: false,
      error: new LgSyntaxError(
        lexer.filename,
        currentToken.location,
        "Expected ';' at the end of the statement.",
        LgErrorCode.MISSING_SEMICOLON,
        "';'",
        currentToken.type,
      ),
    };
  }

  static missingAssignment(context: ParserContext): ParseResult<never> {
    return {
      isOk: false,
      error: new LgSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "Assignment operator '=' is required.",
        LgErrorCode.MISSING_ASSIGNMENT,
        "'='",
        context.currentToken.type,
      ),
    };
  }

  static missingParenthesis(
    context: ParserContext,
    unexpected: string,
  ): ParseResult<never> {
    return {
      isOk: false,
      error: new LgSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "Unclosed parenthesis detected.",
        LgErrorCode.UNCLOSED_PARENTHESIS,
        "')'",
        unexpected,
      ),
    };
  }
}
