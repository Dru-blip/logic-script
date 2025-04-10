import type { LogicParser, ParseResult } from "../../../../types";
import { ArrayAccess } from "../../ast/expressions/array-access.ts";
import { expression } from "./index.ts";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import type { LogicNode } from "../../ast";

export const arrayAccess: LogicParser<ArrayAccess | LogicNode> = (context) => {
  const expr = expression(context);

  if (!expr.isOk) {
    return <ParseResult<never>>expr;
  }

  if (context.check(TokenType.LSQRB)) {
    context.advance();

    const token = context.currentToken;
    const index = expression(context);

    if (!index.isOk) {
      return <ParseResult<never>>index;
    }

    if (!context.check(TokenType.RSQRB)) {
      return LgSyntaxError.unexpected(context, "]");
    }

    context.advance();
    return {
      isOk: true,
      value: new ArrayAccess(expr.value!, index.value!, token.location),
    };
  }

  return expr;
};
