import { expression } from "..";
import { Token, TokenType } from "../../../lexer";

import { Identifier, VariableDeclaration, type LogicNode } from "../../ast";
import {
  PrimitiveType,
  type LogicParser,
  type LogicType,
} from "../../../../types";
import { tokenToType } from "../../utils";
import { primary } from "../expressions/primary";
import { LgErrorCode, makeSyntaxError } from "../../../errors";

export const variableDeclaration: LogicParser<VariableDeclaration> = (
  context,
) => {
  if (!context.check(TokenType.LET)) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.UNEXPECTED_TOKEN,
        "Expected 'let' keyword",
      ),
    };
  }
  context.advance();
  const ident = primary(context);

  if (!ident.isOk) {
    return {
      isOk: false,
      error: ident.error,
    };
  }

  let decltype: LogicType | undefined;
  if (context.check(TokenType.COLON)) {
    context.advance();
    const ty = tokenToType(context.currentToken.type);
    if(ty===null){
      return {
        isOk:false,
        error:makeSyntaxError(context.lexer.filename,context.currentToken.location,LgErrorCode.MISSING_TYPE,"expected type","expected type after ':'",context.currentToken.type)
      }
    }
    context.advance();
  }

  let expr: LogicNode | undefined;
  if (context.check(TokenType.ASSIGN)) {
    context.advance();
    const result = expression(context);
    if (result.error) {
      return {
        error: result.error,
        isOk: false,
      };
    }
    expr = result.value;
  }

  if (!decltype && !expr) {
    return {
      isOk: false,
      error: makeSyntaxError(
        context.lexer.filename,
        context.currentToken.location,
        LgErrorCode.MISSING_ASSIGNMENT,
        "Expected variable type or expression",
      ),
    };
  }

  if (decltype && !expr) {
    return {
      isOk: true,
      value: new VariableDeclaration(<Identifier>ident.value, null, decltype),
    };
  }

  if (!decltype && expr) {
    return {
      isOk: true,
      value: new VariableDeclaration(
        <Identifier>ident.value,
        <LogicNode>expr,
        PrimitiveType.UNKNOWN,
      ),
    };
  }

  return {
    isOk: true,
    value: new VariableDeclaration(
      <Identifier>ident.value,
      <LogicNode>expr,
      decltype!,
    ),
  };
};
