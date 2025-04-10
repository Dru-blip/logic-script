import { TokenType } from "../../../lexer";
import { type LogicParser, type ParseResult } from "../../../../types";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { Identifier, type LogicNode, VariableDeclaration } from "../../ast";
import { primary } from "../expressions/primary";
import { expression } from "../expressions";

export const variableDeclaration: LogicParser<VariableDeclaration> = (
  context,
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

  let expr: LogicNode | undefined;
  if (context.check(TokenType.ASSIGN)) {
    context.advance();
    const result = expression(context);
    if (result.error) {
      return LgSyntaxError.missingAssignment(context);
    }
    expr = result.value;
  }

  // if (!context.check(TokenType.SEMICOLON)) {
  //   return LgSyntaxError.unexpected(context, "';'");
  // }
  //
  // context.advance();

  return {
    isOk: true,
    value: new VariableDeclaration(<Identifier>ident.value, <LogicNode>expr),
  };
};
