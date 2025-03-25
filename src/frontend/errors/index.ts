import chalk from "chalk";
import type { TokenLocation } from "../../types";

export enum LgErrorCode {
  MISSING_TYPE = "E1001",
  UNEXPECTED_TOKEN = "E1002",
  MISSING_ASSIGNMENT = "E1003",
  UNCLOSED_PARENTHESIS = "E1004",
  UNKNOWN_KEYWORD = "E1005",
  UNEXPECTED_EOF = "E1008",
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
]);

export interface LogicError {
  filename: string;
  location: TokenLocation;
  message: string;
  code: LgErrorCode;
  expected?: string;
  unexpected?: string;
}

export const makeSyntaxError = (
  filename: string,
  location: TokenLocation,
  code: LgErrorCode,
  message: string,
  expected?: string,
  unexpected?: string,
): LogicError => ({
  filename,
  location,
  code,
  message,
  expected: expected ?? "",
  unexpected: unexpected ?? "",
});

export const printError = (error: LogicError, source: string): void => {
  const { filename, location, message, code, expected, unexpected } = error;
  const sourceLines = source.split("\n");
  const errorLine = sourceLines[location.line] || "";
  const hint = ERROR_HINTS.get(code) || "Check syntax.";

  const fileInfo = chalk.blue(
    `${filename}:${location.line + 1}:${location.col + 1}`,
  );

  console.log(`${chalk.red(`error[${code}]:`)} ${message}`);
  console.log(` --> ${fileInfo}`);
  console.log(`${" ".repeat(2)} |`);
  console.log(`${String(location.line + 1)} ${" "}| ${errorLine}`);
  console.log(
    `${" ".repeat(2)} | ${" ".repeat(location.col)}${chalk.red("^")} ${chalk.dim(`unexpected '${unexpected}', expected ${expected}`)}`,
  );
  console.log(`\n  ${chalk.green("= help:")} ${chalk.yellow(hint)}`);
  console.log();
};
