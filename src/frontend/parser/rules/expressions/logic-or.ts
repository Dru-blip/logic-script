import type { LogicParser } from "../../../../types";
import { LgErrorCode, makeSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import { BinaryExpression, type LogicNode } from "../../ast";
// import { type LogicParser } from "../../types";
import { logicAnd } from "./logic-and";

export const logicOr: LogicParser<LogicNode> = (context) => {
  // console.log("parsing logic or expression");
  let left = logicAnd(context);

  if (left.isOk) {
    while (context.match([TokenType.OR])) {
      const { currentToken } = context;
      context.advance();
      const operator = currentToken;
      const right = logicAnd(context);
      if (!right.isOk) {
        // console.log(right);
        return right;
      }
      left = {
        value: new BinaryExpression(operator, left.value!, right.value!),
        isOk: true,
      };
    }
    
  }
  if(!context.check(TokenType.SEMICOLON)){
    return {
      isOk:false,
      error:makeSyntaxError(context.lexer.filename,context.currentToken.location,LgErrorCode.MISSING_SEMICOLON,"expected ';'")
    }
  }
  return left;
};
