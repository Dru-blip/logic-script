import type {LogicParser} from "../../../../types";
import {LgErrorCode, LgSyntaxError} from "../../../errors";
import {TokenType} from "../../../lexer";
import {Identifier, type LogicNode} from "../../ast";
import {type ParserContext} from "../../context";
// import { type LogicParser, type ParseResult } from "../../types";
import {literal} from "../literal";
import {group} from "./group";

export const primary: LogicParser<LogicNode> = (context: ParserContext) => {
  // console.log("parsing primary");
  const { currentToken } = context;
  switch (currentToken.type) {
    case TokenType.NUMBER:
    case TokenType.STRING:
    case TokenType.BOOLEAN:
    case TokenType.LSQRB:{
      const result = literal(context);
      context.advance();
      return result;
    }
    case TokenType.IDENTIFIER: {
      const { literal, location } = currentToken;
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
      if (context.check(TokenType.EOF)) {
        return LgSyntaxError.unexpected(
            context,
            "expected expression",
            LgErrorCode.UNEXPECTED_EOF
          )
      }
      return  LgSyntaxError.unexpected(
          context,
          `expected expression`,
        )
    }
  }
};
