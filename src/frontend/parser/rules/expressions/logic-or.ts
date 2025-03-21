import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
import { type LogicParser } from "../../types";
import { logicAnd } from "./logic-and";

export const logicOr: LogicParser<LogicNode> = (context) => {
  let left = logicAnd(context);

  if (left.isOk) {
    while (context.match([TokenType.OR])) {
      const { currentToken } = context;
      context.advance();
      const operator = currentToken;
      const right = logicAnd(context);
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
