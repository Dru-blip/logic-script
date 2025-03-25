import { expression } from "..";
import type { LogicParser } from "../../../../types";
import { LgErrorCode, makeSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import type { Identifier, LogicNode } from "../../ast";
import { AssignmentExpression } from "../../ast/assignments/variable-assignment";
import { primary } from "../expressions/primary";

export const assignment: LogicParser<AssignmentExpression> = (context) => {
  const { currentToken, lexer } = context;
  if (!context.check(TokenType.IDENTIFIER)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        lexer.filename,
        currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "expected identifier",
      ),
    };
  }

  const identifier = primary(context);

  if (!identifier.isOk) {
    return {
      isOk: false,
      error: makeSyntaxError(
        lexer.filename,
        currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "expected identifier",
      ),
    };
  }

  if (!context.check(TokenType.ASSIGN)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        lexer.filename,
        currentToken.location,
        LgErrorCode.MISSING_ASSIGNMENT,
        "expected '='",
      ),
    };
  }
  context.advance();
  const expr = expression(context);
  if (!expr.isOk) {
    return {
      isOk: false,
      error: makeSyntaxError(
        lexer.filename,
        currentToken.location,
        LgErrorCode.MISSING_ASSIGNMENT,
        "expected expression",
      ),
    };
  }
  return {
    isOk: true,
    value: new AssignmentExpression(
      identifier.value as Identifier,
      expr.value as LogicNode,
    ),
  };
};
