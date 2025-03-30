import type { LogicParser, ParseResult } from "../../../../types";
import {
  StructDeclaration,
  StructProperty,
} from "../../ast/declarations/struct.ts";
import { TokenType } from "../../../lexer";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { FunctionDeclaration, Identifier } from "../../ast";
import { functionDeclaration } from "./function.ts";

const structProperty: LogicParser<StructProperty> = (context) => {
  if (!context.check(TokenType.IDENTIFIER)) {
    return LgSyntaxError.unexpected(context, "identifier");
  }
  const { currentToken } = context;
  const ident = new Identifier(currentToken.literal, currentToken.location);
  context.advance();

  if (!context.check(TokenType.SEMICOLON)) {
    return LgSyntaxError.missingSemicolon(context);
  }
  context.advance();

  return {
    isOk: true,
    value: new StructProperty(ident),
  };
};

const structBody: LogicParser<{
  methods: FunctionDeclaration[];
  props: StructProperty[];
}> = (context) => {
  if (!context.check(TokenType.LBRACE)) {
    return LgSyntaxError.unexpected(context, "{");
  }

  context.advance();

  const props: StructProperty[] = [];
  const methods: FunctionDeclaration[] = [];
  while (!context.check(TokenType.RBRACE)) {
    if (context.check(TokenType.FN)) {
      const method = functionDeclaration(context);
      if (!method.isOk) {
        return <ParseResult<never>>method;
      }
      methods.push(method.value!);
      continue;
    }
    const prop = structProperty(context);
    if (!prop.isOk) {
      return <ParseResult<never>>prop;
    }
    props.push(prop.value!);
  }

  if (!context.check(TokenType.RBRACE)) {
    return LgSyntaxError.unexpected(context, "}");
  }

  context.advance();

  return {
    isOk: true,
    value: {
      methods,
      props,
    },
  };
};

export const struct: LogicParser<StructDeclaration> = (context) => {
  context.advance();

  if (!context.check(TokenType.IDENTIFIER)) {
    return LgSyntaxError.unexpected(context, "identifier");
  }

  const ident = new Identifier(
    context.currentToken.literal,
    context.currentToken.location,
  );

  context.advance();

  const body = structBody(context);

  if (!body.isOk) {
    return <ParseResult<never>>body;
  }

  const { value } = body;
  return {
    isOk: true,
    value: new StructDeclaration(ident, value?.props!, value?.methods!),
  };
};
