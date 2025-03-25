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
  const errorLine = sourceLines[location.line - 2] || "";

  let details = message;
  if (expected && unexpected) {
    details += ` (expected '${expected}', found '${unexpected}')`;
  } else if (expected) {
    details += ` (expected '${expected}')`;
  } else if (unexpected) {
    details += ` (unexpected '${unexpected}')`;
  }

  console.log(location);
  console.log(errorLine);

  console.error(
    `error: ${details}\n` +
      ` --> ${filename}:${location.line}:${location.col}\n` +
      `  |\n` +
      `${String(location.line).padStart(2)} | ${errorLine}\n` +
      `  | ${" ".repeat(location.col)}^`,
  );
};
