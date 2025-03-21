import { expression } from ".";
import { TokenType } from "../../../lexer";
import type { LogicNode } from "../../ast";
import { GroupingExpression } from "../../ast/expressions/group";
import type { LogicParser } from "../../types";

export const group: LogicParser<LogicNode> = (context) => {
  context.advance();
  const expr = expression(context);
  if (expr.error) {
    return expr;
  }
  context.consume(TokenType.RPAREN, "Expected ')' after expression");
  context.advance();
  return {
    isOk: true,
    value: new GroupingExpression(expr.value!),
  };
};
