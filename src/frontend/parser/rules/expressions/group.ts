import { expression } from "../index";
import { TokenType } from "../../../lexer";
import type { LogicNode } from "../../ast";
import { GroupingExpression } from "../../ast/expressions/group";
import type { LogicParser } from "../../../../types";
import { LgErrorCode, makeSyntaxError } from "../../../errors";
// import type { LogicParser } from "../../types";

export const group: LogicParser<LogicNode> = (context) => {
  // console.log("parsing grouping expression");
  context.advance();
  const expr = expression(context);
  if (expr.error) {
    return expr;
  }

  const consumed = context.consume(
    TokenType.RPAREN,
    "Expected ')' after expression",
  );
  if (!consumed) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNCLOSED_PARENTHESIS,
        "expected ')'",
        "')'",
        `found ${context.currentToken}`,
      ),
    };
  }
  context.advance();
  return {
    isOk: true,
    value: new GroupingExpression(expr.value!),
  };
};
