import type { LogicParser } from "../../../../types";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { TokenType } from "../../../lexer";
import type { LogicNode } from "../../ast";
import { ExpressionStatement } from "../../ast/statements/expression";
import { assignment } from "../assignments/assignment";

export const expression: LogicParser<LogicNode> = (context) => {
  const expr = assignment(context);

  if (!expr.isOk) {
    return expr;
  }
  return expr;
};

export const expressionStatement: LogicParser<
  ExpressionStatement | LogicNode
> = (context) => {
  const expr = assignment(context);

  if (!expr.isOk) {
    return expr;
  }

  if (!context.check(TokenType.SEMICOLON)) {
    return LgSyntaxError.missingSemicolon(context);
  }

  context.advance();
  return {
    isOk: true,
    value: new ExpressionStatement(<LogicNode>expr.value),
  };
};
