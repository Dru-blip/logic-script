import { statement } from ".";
import type { LogicParser } from "../../../types";
import type { LogicError } from "../../errors";
import { TokenType } from "../../lexer";
import { Program } from "../ast";

export const program: LogicParser<Program> = (context) => {
  const statements = [];
  while (context.currentToken.type !== TokenType.EOF) {
    const stmt = statement(context);
    if (stmt.isOk) {
      statements.push(stmt.value!);
    } else {
      context.errors.push(<LogicError>stmt.error);
    }
  }

  return { isOk: context.errors.length > 0, value: new Program(statements) };
};
