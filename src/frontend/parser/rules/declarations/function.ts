import type { LogicParser, ParseResult } from "../../../../types";
import { FunctionDeclaration, Identifier } from "../../ast";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { FunctionParam } from "../../ast/declarations/functions.ts";
import { block } from "../statements/block.ts";

const parameterList: LogicParser<FunctionParam[]> = (context) => {
  if (!context.check(TokenType.LPAREN)) {
    return LgSyntaxError.unexpected(context, "(");
  }
  context.advance();

  const paramsList: FunctionParam[] = [];
  while (!context.check(TokenType.RPAREN)) {
    if (!context.check(TokenType.IDENTIFIER)) {
      return LgSyntaxError.unexpected(context, "identifier");
    }
    const ident = new Identifier(
      context.currentToken.literal,
      context.currentToken.location,
    );
    context.advance();

    if (context.check(TokenType.COMMA)) {
      context.advance();
    }

    paramsList.push(new FunctionParam(ident));
  }
  if (!context.check(TokenType.RPAREN)) {
    return LgSyntaxError.unexpected(context, ")");
  }
  context.advance();

  return {
    isOk: true,
    value: paramsList,
  };
};

export const functionDeclaration: LogicParser<FunctionDeclaration> = (
  context,
) => {
  context.advance();
  if (!context.check(TokenType.IDENTIFIER)) {
    context.functionDeclarationDepth.pop();
    return LgSyntaxError.unexpected(context, "identifier");
  }
  const ident = new Identifier(
    context.currentToken.literal,
    context.currentToken.location,
  );
  context.advance();

  const paramsList = parameterList(context);
  if (!paramsList.isOk) {
    context.functionDeclarationDepth.pop();
    return <ParseResult<never>>paramsList;
  }

  const body = block(context);

  if (!body.isOk) {
    context.functionDeclarationDepth.pop();
    return <ParseResult<never>>body;
  }

  context.functionDeclarationDepth.pop();

  return {
    isOk: true,
    value: new FunctionDeclaration(ident, paramsList.value!, body.value!),
  };
};
