import { expression } from "..";
import type { LogicParser } from "../../../../types";
import { LgSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import type { Identifier, LogicNode } from "../../ast";
import { AssignmentExpression } from "../../ast/assignments/variable-assignment";
import { logicOr } from "../expressions/logic-or";
import { primary } from "../expressions/primary";

export const assignment: LogicParser<AssignmentExpression | LogicNode> = (
  context
) => {
  if (!context.check(TokenType.IDENTIFIER)) {
    return LgSyntaxError.unexpected(context, "expected identifier");
  }

  if (context.nextToken.type !== TokenType.ASSIGN) {
    return logicOr(context);
  }

  const identifier = primary(context);

  if (!identifier.isOk) {
    return LgSyntaxError.unexpected(context, "expected identifier");
  }

  context.advance();
  const expr = expression(context);
  if (!expr.isOk) {
    return LgSyntaxError.missingAssignment(context, "expected expression");
  }
  return {
    isOk: true,
    value: new AssignmentExpression(
      identifier.value as Identifier,
      expr.value as LogicNode
    ),
  };
};
