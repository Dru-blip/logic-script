import type { LogicParser, ParseResult } from "../../../../types";
import { FunctionDeclaration, Identifier } from "../../ast";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { FunctionParam } from "../../ast/declarations/functions.ts";
import { block } from "../statements/block.ts";
import { typeParser } from "../types.ts";
import { LogicType } from "../../../type-system";

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
    if (!context.check(TokenType.COLON)) {
      return LgSyntaxError.unexpected(context, ":");
    }
    context.advance();
    const declType = typeParser(context);
    if (!declType.isOk) {
      return <ParseResult<never>>declType;
    }

    if (context.check(TokenType.COMMA)) {
      context.advance();
    }

    paramsList.push(new FunctionParam(ident, declType.value!));
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
    return LgSyntaxError.unexpected(context, "identifier");
  }
  const ident = new Identifier(
    context.currentToken.literal,
    context.currentToken.location,
  );
  context.advance();

  const paramsList = parameterList(context);
  if (!paramsList.isOk) {
    return <ParseResult<never>>paramsList;
  }

  let returnType: LogicType;
  if (context.check(TokenType.ARROW)) {
    context.advance();
    const { currentToken } = context;
    const ty = typeParser(context);
    if (!ty.isOk) {
      return <ParseResult<never>>ty;
    }
    // context.advance()
    returnType = ty.value!;
  }

  const body = block(context);

  if (!body.isOk) {
    return <ParseResult<never>>body;
  }

  return {
    isOk: true,
    value: new FunctionDeclaration(
      ident,
      paramsList.value!,
      body.value!,
      returnType!,
    ),
  };
};
