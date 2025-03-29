import type { LogicParser, ParseResult } from "../../../../types";
import { CallExpression } from "../../ast/expressions/call.ts";
import { primary } from "./primary.ts";
import { Identifier, type LogicNode } from "../../ast";
import { TokenType } from "../../../lexer";
import { expression } from "./index.ts";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { MemberExpression } from "../../ast/expressions/member.ts";
import { ArrayAccess } from "../../ast/expressions/array-access.ts";

const argumentList: LogicParser<LogicNode[]> = (context) => {
  context.advance();

  const args: LogicNode[] = [];
  while (!context.check(TokenType.RPAREN)) {
    const expr = expression(context);
    if (!expr.isOk) {
      return <ParseResult<never>>expr;
    }
    args.push(expr.value!);
    if (context.check(TokenType.COMMA)) {
      context.advance();
    }
  }
  if (!context.check(TokenType.RPAREN)) {
    return LgSyntaxError.unexpected(context, ")");
  }
  context.advance();

  return {
    isOk: true,
    value: args,
  };
};

export const call: LogicParser<CallExpression | LogicNode> = (context) => {
  const expr = primary(context);
  if (!expr.isOk) {
    return expr;
  }

  let val = expr.value;
  while (true) {
    if (context.check(TokenType.LPAREN)) {
      const args = argumentList(context);
      if (!args.isOk) {
        return <ParseResult<never>>args;
      }

      val = new CallExpression(val!, args.value!);
    } else if (context.check(TokenType.DOT)) {
      context.advance();
      const ident = new Identifier(
        context.currentToken.literal,
        context.currentToken.location,
      );
      context.advance();
      val = new MemberExpression(val!, ident);
    } else if (context.check(TokenType.LSQRB)) {
      const { currentToken } = context;
      context.advance();
      const index = expression(context);
      if (!index.isOk) {
        return <ParseResult<never>>index;
      }
      if (!context.check(TokenType.RSQRB)) {
        return LgSyntaxError.unexpected(context, "]");
      }
      context.advance();
      val = new ArrayAccess(val!, index.value!, currentToken.location);
    } else {
      break;
    }
  }

  return {
    isOk: true,
    value: val,
  };
};
