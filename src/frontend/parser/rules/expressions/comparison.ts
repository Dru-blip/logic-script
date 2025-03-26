import type { LogicParser } from "../../../../types";
import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
import { additive } from "./additive";

export const comparison: LogicParser<LogicNode> = (context) => {
  const initialInsidebracket = context.isInsideAngleBrackets;
  let left = additive(context);

  if (left.isOk) {
    while (
      context.match([
        TokenType.GREATER_THAN,
        TokenType.GREATER_THAN_EQUAL,
        TokenType.LESS_THAN,
        TokenType.LESS_THAN_EQUAL,
      ])
    ) {
      const { currentToken } = context;

      if (currentToken.type === TokenType.GREATER_THAN) {
        if (
          context.isInsideAngleBrackets &&
          context.rightbracketDepth.length > 1
        ) {
          break;
        }
      }

      context.advance();
      const operator = currentToken;
      const right = additive(context);
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
