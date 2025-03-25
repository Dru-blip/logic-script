import { PrimitiveType, type LogicParser } from "../../../types";
import { makeSyntaxError } from "../../errors";
import { TokenType } from "../../lexer";
import { LogicLiteral } from "../ast";
import { ParserContext } from "../context";
// import { PrimitiveType, type LogicParser } from "../types";

export const literal: LogicParser<LogicLiteral<any, PrimitiveType>> = (
  context: ParserContext,
) => {
  const { currentToken } = context;
  if (currentToken.type === TokenType.NUMBER) {
    return {
      isOk: true,
      value: new LogicLiteral<number, PrimitiveType.INT>(
        Number(currentToken.literal),
        PrimitiveType.INT,
        "number",
        context.currentToken.location,
      ),
    };
  }

  if (currentToken.type === TokenType.BOOLEAN) {
    return {
      isOk: true,
      value: new LogicLiteral<boolean, PrimitiveType.BOOLEAN>(
        currentToken.literal === "true",
        PrimitiveType.BOOLEAN,
        "boolean",
        context.currentToken.location,
      ),
    };
  }

  if (currentToken.type === TokenType.STRING) {
    return {
      isOk: true,
      value: new LogicLiteral<string, PrimitiveType.STR>(
        currentToken.literal,
        PrimitiveType.STR,
        "string",
        context.currentToken.location,
      ),
    };
  }

  if (currentToken.type === TokenType.ERROR) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "Unexpected token",
      ),
    };
  }

  if (currentToken.type === TokenType.EOF) {
    // console.log(context.currentToken);
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        "Unexpected end of file",
      ),
    };
  }
  return {
    isOk: false,
    error: makeSyntaxError(
      context.lexer.filename,
      context.currentToken.location,
      "",
    ),
  };
};
