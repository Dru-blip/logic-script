import type { LogicParser } from "../../../../types";
import { LgErrorCode, makeSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
// import { type LogicParser } from "../../types";
import { primary } from "./primary";
import { unary } from "./unary";

export const multiplicative: LogicParser<LogicNode> = (context) => {
  // console.log("parsing multiplicative");
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
  // if (context.peek().type === TokenType.NUMBER) {
  //   return {
  //     isOk: false,
  //     error: makeSyntaxError(
  //       context.lexer.filename,
  //       context.currentToken.location,
  //       LgErrorCode.UNEXPECTED_TOKEN,
  //       `Unexpected number '${
  //         context.peek().literal
  //       }'. Did you forget an operator?`
  //     ),
  //   };
  // }

  return left;
};
