import { TokenType } from "../../lexer";
import { Program } from "../ast";
// import type { LogicParser } from "../types";
import { expression } from ".";
import type { LogicParser } from "../../../types";
import type { LogicError } from "../../errors";

export const program: LogicParser<Program> = (context) => {
  const expressions = [];
  while (context.currentToken.type !== TokenType.EOF) {
    const expr = expression(context);
    if (expr.isOk) {
      expressions.push(expr.value!);
    } else {
      context.errors.push(<LogicError>expr.error);
    }
  }

  return { isOk: context.errors.length > 0, value: new Program(expressions) };
};
