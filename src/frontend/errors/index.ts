import chalk from "chalk";
import type { TokenLocation } from "../../types";

export interface LogicError {
  filename: string;
  location: TokenLocation;
  message: string;
  expected: string;
  unexpected: string;
}

export interface LgLexicalError extends LogicError {}

export interface LgSyntaxError extends LogicError {}

export const makeSyntaxError = (
  filename: string,
  location: TokenLocation,
  message: string,
  expected?: string,
  unexpected?: string,
): LgSyntaxError => ({
  filename,
  location,
  message,
  expected: expected ?? "",
  unexpected: unexpected ?? " ",
});

export const printError = (error: LogicError, source: string): void => {
  const { filename, location, message, expected, unexpected } = error;
  const sourceLines = source.split("\n");
  const errorLine = sourceLines[location.line] || "";

  let details = message;
  if (expected && unexpected) {
    details += ` (expected '${expected}', found '${unexpected}')`;
  } else if (expected) {
    details += ` (expected '${expected}')`;
  } else if (unexpected) {
    details += ` (unexpected '${unexpected}')`;
  }

  const fileInfo = chalk.blue(
    `${filename}:${location.line + 1}:${location.col}`,
  );
  console.log(`error: ${chalk.red(details)}`);
  console.log(` --> ${fileInfo}`);
  console.log(`${" ".repeat(2)} |`);
  console.log(`${String(location.line + 1)} ${" "}| ${errorLine}`);
  console.log(`${" ".repeat(2)} | ${" ".repeat(location.col)}^`);
  console.log();
};
