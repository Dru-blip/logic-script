import { TokenType } from "../../lexer";
import { LogicLiteral } from "../ast";
import { ParserContext } from "../context";
import { type LogicParser } from "../types";

export const literal: LogicParser<LogicLiteral> = (context: ParserContext) => {
  const { currentToken } = context;
  if (currentToken.type === TokenType.NUMBER) {
    return {
      isOk: true,
      value: new LogicLiteral<number>(Number(currentToken.literal), "number", {
        line: currentToken.line,
        col: currentToken.col,
        offset: currentToken.offset,
      }),
    };
  }

  if (currentToken.type === TokenType.BOOLEAN) {
    return {
      isOk: true,
      value: new LogicLiteral<boolean>(
        currentToken.literal === "true",
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
      value: new LogicLiteral<string>(currentToken.literal, "string", {
        line: currentToken.line,
        col: currentToken.col,
        offset: currentToken.offset,
      }),
    };
  }

  return {
    isOk: false,
    error: `Unexpected token ${currentToken.type} at ${currentToken.line}:${currentToken.col}`,
  };
};
