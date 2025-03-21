import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
import { type LogicParser } from "../../types";
import { primary } from "./primary";
import { unary } from "./unary";

export const multiplicative: LogicParser<LogicNode> = (context) => {
  let left = unary(context);

  if (left.isOk) {
    while (context.match([TokenType.ASTERISK, TokenType.SLASH])) {
      const { currentToken } = context;
      context.advance();
      const operator = currentToken;
      const right = multiplicative(context);
      if (!right.isOk) {
        return right;
      }
      left = {
        value: new BinaryExpression(operator, left.value!, right.value!),
        isOk: true,
      };
    }
  }
  return left;
};
