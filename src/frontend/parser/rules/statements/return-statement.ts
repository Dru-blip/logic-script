import type { LogicParser, ParseResult } from "../../../../types";
import { ReturnStatement } from "../../ast/statements/return.ts";
import { expression } from "../expressions";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { LgErrorCode } from "../../../errors";

export const returnStatement: LogicParser<ReturnStatement> = (context) => {
  if (!context.insideFunction) {
    context.advance();
    return {
      isOk: false,
      error: new LgSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "return statement outside of function",
        LgErrorCode.INVALID_RETURN,
      ),
    };
  }
  context.advance();

  const value = expression(context);

  if (!value.isOk) {
    return <ParseResult<never>>value;
  }

  if (!context.check(TokenType.SEMICOLON)) {
    return LgSyntaxError.missingSemicolon(context);
  }
  context.advance();

  return {
    isOk: true,
    value: new ReturnStatement(value.value!),
  };
};
