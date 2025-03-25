import type { LogicParser } from "../../../../types";
import { makeSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import { Identifier, type LogicNode } from "../../ast";
import { type ParserContext } from "../../context";
// import { type LogicParser, type ParseResult } from "../../types";
import { literal } from "../literal";
import { group } from "./group";

export const primary: LogicParser<LogicNode> = (context: ParserContext) => {
  switch (context.currentToken.type) {
    case TokenType.NUMBER:
    case TokenType.STRING:
    case TokenType.BOOLEAN: {
      const result = literal(context);
      context.advance();
      return result;
    }
    case TokenType.IDENTIFIER: {
      const { literal, location } = context.currentToken;
      const result = {
        isOk: true,
        value: new Identifier(literal, location),
      };
      context.advance();
      return result;
    }

    case TokenType.LPAREN: {
      return group(context);
    }

    default: {
      return {
        isOk: false,
        error: makeSyntaxError(
          context.lexer.filename,
          context.currentToken.location,
          `Unexpected token ${context.currentToken.type}`,
        ),
      };
    }
  }
};
