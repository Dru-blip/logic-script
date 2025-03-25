import type { LogicParser } from "../../../../types";
import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
// import { type LogicParser } from "../../types";
import { multiplicative } from "./multiplicative";
import { primary } from "./primary";

export const additive: LogicParser<LogicNode> = (context) => {
  // console.log("parsing additive expression");

  let left = multiplicative(context);

  if (left.isOk) {
    while (context.match([TokenType.PLUS, TokenType.MINUS])) {
      const { currentToken } = context;
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
