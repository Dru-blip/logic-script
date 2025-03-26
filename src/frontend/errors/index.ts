import chalk from "chalk";
import type { ParseResult, TokenLocation } from "../../types";
import type { ParserContext } from "../parser/context";

export enum LgErrorCode {
  MISSING_TYPE = "E1001",
  UNEXPECTED_TOKEN = "E1002",
  MISSING_ASSIGNMENT = "E1003",
  UNCLOSED_PARENTHESIS = "E1004",
  UNKNOWN_KEYWORD = "E1005",
  UNEXPECTED_EOF = "E1008",
  MISSING_SEMICOLON = "E1009",
}

const ERROR_HINTS: Map<LgErrorCode, string> = new Map([
  [LgErrorCode.MISSING_TYPE, "Provide a valid type, e.g., `let b: Int = 10`"],
  [
    LgErrorCode.UNEXPECTED_TOKEN,
    "Check for unexpected symbols or misplaced keywords.",
  ],
  [
    LgErrorCode.MISSING_ASSIGNMENT,
    "Did you mean to use `=` for assignment? e.g., `let x:Int = 5`",
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
    "Your code seems to end abruptly. Did you forget to close a block, add a semicolon, or complete an expression?",
  ],
  [
    LgErrorCode.MISSING_SEMICOLON,
    "Statements must end with `;`. Did you forget to add one?",
  ],
]);

export interface LogicError {
  filename: string;
  location: TokenLocation;
  message: string;
  code: LgErrorCode;
  expected?: string;
  unexpected?: string;

  printError: (source: string) => void;
}

export class LgSyntaxError implements LogicError {
  constructor(
    public filename: string,
    public location: TokenLocation,
    public message: string,
    public code: LgErrorCode,
    public expected?: string,
    public unexpected?: string
  ) {}

  printError(source: string) {
    const { filename, location, message, code, expected, unexpected } = this;
    const sourceLines = source.split("\n");
    const errorLine = sourceLines[location.line] || "";
    const hint = ERROR_HINTS.get(code) || "Check syntax.";

    const fileInfo = chalk.blue(
      `${filename}:${location.line + 1}:${location.col + 1}`
    );

    console.log(`${chalk.red(`error[${code}]:`)} ${message}`);
    console.log(` --> ${fileInfo}`);
    console.log(`${" ".repeat(2)} |`);
    console.log(`${String(location.line + 1)} ${" "}| ${errorLine}`);
    console.log(
      `${" ".repeat(2)} | ${" ".repeat(location.col)}${chalk.red(
        "^"
      )} ${chalk.dim(`unexpected '${unexpected}', expected ${expected}`)}`
    );
    console.log(`\n  ${chalk.green("= help:")} ${chalk.yellow(hint)}`);
    console.log();
  }

  static unexpected(
    context: ParserContext,
    expected: string,
    code: LgErrorCode = LgErrorCode.UNEXPECTED_TOKEN
  ): ParseResult<never> {
    return {
      isOk: false,
      error: LgSyntaxError.makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        code,
        `Expected ${expected}`,
        `Unexpected token: ${context.currentToken.type}`
      ),
    };
  }

  static missingType(
    context: ParserContext,
    expected: string,
    unexpected?: string
  ): ParseResult<never> {
    return {
      isOk: false,
      error: LgSyntaxError.makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.MISSING_TYPE,
        expected,
        expected,
        unexpected
      ),
    };
  }

  static missingParanthesis(
    context: ParserContext,
    message: string,
    unexpected: string
  ): ParseResult<never> {
    return {
      isOk: false,
      error: LgSyntaxError.makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNCLOSED_PARENTHESIS,
        message,
        "')'",
        unexpected
      ),
    };
  }

  static missingAssignment(
    context: ParserContext,
    expected: string,
    unexpected?: string
  ): ParseResult<never> {
    return {
      isOk: false,
      error: LgSyntaxError.makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.MISSING_ASSIGNMENT,
        expected,
        expected,
        unexpected
      ),
    };
  }

  static missingSemicolon(context: ParserContext): ParseResult<never> {

    context.advance()
    return {
      isOk: false,
      error: LgSyntaxError.makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.MISSING_SEMICOLON,
        "expected ';'",
        '";"',
        context.currentToken.type
      ),
    };
  }

  static makeSyntaxError = (
    filename: string,
    location: TokenLocation,
    code: LgErrorCode,
    message: string,
    expected?: string,
    unexpected?: string
  ): LogicError =>
    new LgSyntaxError(filename, location, message, code, expected, unexpected);
}
