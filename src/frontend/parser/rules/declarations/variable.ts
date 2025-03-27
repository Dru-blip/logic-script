import {TokenType} from "../../../lexer";
import {type LogicParser, type LogicType} from "../../../../types";
import {LgSyntaxError} from "../../../errors";
import {Identifier, type LogicNode, VariableDeclaration} from "../../ast";
import {tokenToType} from "../../utils";
import {primary} from "../expressions/primary";
import {expression} from "../expressions";

export const variableDeclaration: LogicParser<VariableDeclaration> = (
  context
) => {
  if (!context.check(TokenType.LET)) {
    return LgSyntaxError.unexpected(context, "Expected 'let' keyword");
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
    if (ty === null) {
      return LgSyntaxError.missingType(
        context,
        "expected type after ':'",
        context.currentToken.type
      );
    }
    decltype = ty;
    context.advance();
  } else {
    return LgSyntaxError.missingType(
      context,
      "expected type after ':'",
      context.currentToken.type
    );
  }

  let expr: LogicNode | undefined;
  if (context.check(TokenType.ASSIGN)) {
    context.advance();
    const result = expression(context);
    if (result.error) {
      return LgSyntaxError.missingAssignment(
        context,
        "expression",
        "expression after '='"
      );
    }
    expr = result.value;
  }

  if(!context.check(TokenType.SEMICOLON)){
    return LgSyntaxError.unexpected(context, "';'");
  }

  context.advance();
  if (!decltype && !expr) {
    return LgSyntaxError.missingAssignment(
      context,
      "expression",
      "expression after '='"
    );
  }

  if (decltype && !expr) {
    return {
      isOk: true,
      value: new VariableDeclaration(<Identifier>ident.value, null, decltype),
    };
  }

  return {
    isOk: true,
    value: new VariableDeclaration(
      <Identifier>ident.value,
      <LogicNode>expr,
      decltype!
    ),
  };
};
