import { statement } from ".";
import type { LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { Program } from "../ast";
import type { LgSyntaxError } from "../../errors/syntax.ts";

export const program: LogicParser<Program> = (context) => {
  const statements = [];
  while (context.currentToken.type !== TokenType.EOF) {
    const stmt = statement(context);
    if (stmt.isOk) {
      statements.push(stmt.value!);
    } else {
      context.errors.push(<LgSyntaxError>stmt.error);
      break;
    }
  }
  return { isOk: context.errors.length === 0, value: new Program(statements) };
};
