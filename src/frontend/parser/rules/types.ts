import { type LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { Identifier } from "../ast";
import { LgSyntaxError } from "../../errors/syntax.ts";
import { LArrayType, LogicType } from "../../type-system";
import { Int } from "../../type-system/int.ts";
import { Str } from "../../type-system/str.ts";
import { Bool } from "../../type-system/bool.ts";
import { Any } from "../../type-system/any-type.ts";
import { LIdentifier } from "../../type-system/identifier.ts";
import { LObject } from "../../type-system/object.ts";

export const typeParser: LogicParser<LogicType> = (context) => {
  const { currentToken } = context;

  let declType: LogicType;
  switch (currentToken.type) {
    case TokenType.INT: {
      context.advance();
      declType = Int;
      break;
    }
    case TokenType.STR: {
      context.advance();
      declType = Str;
      break;
    }
    case TokenType.BOOL: {
      context.advance();
      declType = Bool;
      break;
    }
    case TokenType.ANY: {
      context.advance();
      declType = Any;
      break;
    }
    case TokenType.TYRANGE: {
      context.advance();
      declType = new LObject("Range");
      break;
    }
    case TokenType.IDENTIFIER: {
      const id = new Identifier(currentToken.literal, currentToken.location!);
      declType = new LIdentifier(id);
      context.advance();
      break;
    }
    case TokenType.LSQRB: {
      context.advance();
      const of = typeParser(context);
      if (!of.isOk) {
        return of;
      }
      if (!context.check(TokenType.RSQRB)) {
        return LgSyntaxError.unexpected(context, "]");
      }
      context.advance();
      declType = new LArrayType(of.value!);
      break;
    }
    default: {
      return LgSyntaxError.unexpected(context, "unknown type");
    }
  }

  return {
    isOk: true,
    value: declType!,
  };
};
