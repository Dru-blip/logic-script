import type {LogicParser} from "../../../../types";
import {TokenType} from "../../../lexer";
import {type LogicNode, UnaryExpression} from "../../ast";
import {call} from "./call.ts";

export const unary: LogicParser<LogicNode> = (context) => {
  const token = context.peek();
  if (context.match([TokenType.BANG, TokenType.MINUS])) {
    context.advance();
    const right = unary(context);
    if (right.isOk) {
      return { value: new UnaryExpression(token, right.value!), isOk: true };
    }

    // if (right.error) {
    //   right.error.expected = "Expected expression";
    //   right.error.unexpected = context.currentToken.literal;
    // }

    return right;
  }
  return call(context);
};
