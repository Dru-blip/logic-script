import { expression } from "..";
import type { LogicParser } from "../../../../types";
import { LgErrorCode, makeSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import type { LogicNode } from "../../ast";
import { IfExpression } from "../../ast/control-flow/if";

export const ifExpresion: LogicParser<IfExpression> = (context) => {
  if (!context.check(TokenType.IF)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected 'if'",
      ),
    };
  }

  context.advance();
  if (!context.check(TokenType.LESS_THAN)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected '<'",
      ),
    };
  }
  context.advance();
  const condition = expression(context);

  if (condition.error) {
    return {
      isOk: false,
      error: condition.error,
    };
  }

  if (!context.check(TokenType.COMMA)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected ','",
      ),
    };
  }

  context.advance();

  const thenBranch = expression(context);

  if (thenBranch.error) {
    return {
      isOk: false,
      error: thenBranch.error,
    };
  }

  if (!context.check(TokenType.COMMA)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected ','",
      ),
    };
  }

  context.advance();

  const elseBranch = expression(context);

  if (elseBranch.error) {
    return {
      isOk: false,
      error: elseBranch.error,
    };
  }

  if (!context.check(TokenType.GREATER_THAN)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected '>'",
      ),
    };
  }

  context.advance();

  return {
    isOk: true,
    value: new IfExpression(
      <LogicNode>condition.value,
      <LogicNode>thenBranch.value,
      <LogicNode>elseBranch.value,
    ),
  };
};
