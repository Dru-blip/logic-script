import type { LogicParser } from "../../../../types";
import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
import { unary } from "./unary";

export const multiplicative: LogicParser<LogicNode> = (context) => {
  let left = unary(context);

  if (!left.isOk) {
    return left;
  }
  while (context.match([TokenType.ASTERISK, TokenType.SLASH])) {
    const { currentToken } = context;
    context.advance();
    const operator = currentToken;
    const right = unary(context);
    if (!right.isOk) {
      return right;
    }
    left = {
      value: new BinaryExpression(operator, left.value!, right.value!),
      isOk: true,
    };
  }
  return left;
};
