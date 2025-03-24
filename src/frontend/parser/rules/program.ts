import { TokenType } from "../../lexer";
import { Program } from "../ast";
import type { LogicParser } from "../types";
import { expression } from ".";

export const program: LogicParser<Program> = (context) => {
  const expressions = [];
  while (context.currentToken.type !== TokenType.EOF) {
    const expr = expression(context);
    if (expr.isOk) {
      statements.push(expr.value!);
    } else {
    }
    expressions.push(expr.value!);
  }

  return { isOk: true, value: new Program(expressions) };
};
