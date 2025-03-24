import { expression } from "..";
import { Token, TokenType } from "../../../lexer";
import { Optional } from "../../../optional";
import { Identifier, VariableDeclaration, type LogicNode } from "../../ast";
import { PrimitiveType, type LogicParser, type LogicType } from "../../types";
import { tokenToType } from "../../utils";
import { primary } from "../expressions/primary";

export const variableDeclaration: LogicParser<VariableDeclaration> = (
  context,
) => {
  if (context.check(TokenType.LET)) {
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
      decltype = tokenToType(context.currentToken.type);
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
        error: "Expected variable type or expression",
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
  }
  return {
    isOk: false,
    error: "Expected 'let' keyword",
  };
};
