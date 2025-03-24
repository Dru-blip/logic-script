import { TokenType } from "../../lexer";
import { LogicLiteral } from "../ast";
import { ParserContext } from "../context";
import { PrimitiveType, type LogicParser } from "../types";

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
        {
          line: currentToken.line,
          col: currentToken.col,
          offset: currentToken.offset,
        },
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
        {
          line: currentToken.line,
          col: currentToken.col,
          offset: currentToken.offset,
        },
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
        {
          line: currentToken.line,
          col: currentToken.col,
          offset: currentToken.offset,
        },
      ),
    };
  }

  return {
    isOk: false,
    error: `Unexpected token ${currentToken.type} at ${currentToken.line}:${currentToken.col}`,
  };
};
