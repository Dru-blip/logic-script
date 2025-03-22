import { TokenType } from "../../lexer";
import { Program } from "../ast";
import type { LogicParser } from "../types";
import { expression } from "./expressions";

export const program: LogicParser<Program> = (context) => {
  const statements = [];
  while (context.currentToken.type !== TokenType.EOF) {
    const expr = expression(context);
    if (expr.error) {
      return {
        isOk: false,
        error: expr.error,
      };
    }
    statements.push(expr.value!);
  }

  return { isOk: true, value: new Program(statements) };
};
