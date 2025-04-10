import type { LogicParser } from "../../../../types";
import { BreakStatement } from "../../ast/statements/break.ts";
import { ContinueStatement } from "../../ast/statements/continue.ts";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";

export const breakContinue: LogicParser<BreakStatement | ContinueStatement> = (
  context,
) => {
  let node: BreakStatement | ContinueStatement;
  if (context.check(TokenType.CONTINUE)) {
    node = new ContinueStatement(context.currentToken.location);
  } else {
    node = new BreakStatement();
  }

  context.advance();

  if (!context.check(TokenType.SEMICOLON)) {
    return LgSyntaxError.missingSemicolon(context);
  }
  context.advance();

  return {
    isOk: true,
    value: node,
  };
};
