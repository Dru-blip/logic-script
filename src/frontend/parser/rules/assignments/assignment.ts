import type { LogicParser, ParseResult } from "../../../../types";
import { TokenType } from "../../../lexer";
import { BinaryExpression, Identifier, type LogicNode } from "../../ast";
import { AssignmentExpression } from "../../ast/assignments/variable-assignment";
import { range } from "../expressions/range.ts";
import { MemberAssignment } from "../../ast/assignments/member-assignment.ts";
import { MemberExpression } from "../../ast/expressions/member.ts";
import { ArrayAccess } from "../../ast/expressions/array-access.ts";
import { StructInitialisation } from "../../ast/assignments/struct-initialisation.ts";
import { LgSyntaxError } from "../../../errors/syntax.ts";
import { expression } from "../expressions";

export const propertyAssignment: LogicParser<Record<string, LogicNode>> = (
  context,
) => {
  context.advance();

  const properties: Record<string, LogicNode> = {};
  while (!context.check(TokenType.RBRACE)) {
    if (!context.check(TokenType.IDENTIFIER)) {
      return LgSyntaxError.unexpected(context, "identifier");
    }
    const id = new Identifier(
      context.currentToken.literal,
      context.currentToken.location,
    );

    context.advance();

    if (!context.check(TokenType.ASSIGN)) {
      return LgSyntaxError.unexpected(context, "=");
    }
    context.advance();

    const value = expression(context);
    if (!value.isOk) {
      return <ParseResult<never>>value;
    }

    if (context.check(TokenType.COMMA)) {
      context.advance();
    }
    properties[id.name] = value.value!;
  }

  context.advance();

  return {
    isOk: true,
    value: properties,
  };
};

export const assignment: LogicParser<
  AssignmentExpression | MemberAssignment | LogicNode
> = (context) => {
  const ident = range(context);

  if (!ident.isOk) {
    return <ParseResult<never>>ident;
  }

  if (context.check(TokenType.LBRACE)) {
    if (ident.value instanceof BinaryExpression) {
      return ident;
    }
    const properties = propertyAssignment(context);
    if (!properties.isOk) {
      return <ParseResult<never>>properties;
    }

    return {
      isOk: true,
      value: new StructInitialisation(
        <Identifier>ident.value,
        properties.value!,
      ),
    };
  }

  if (context.check(TokenType.ASSIGN)) {
    const { currentToken } = context;
    context.advance();
    const expr = assignment(context);
    if (!expr.isOk) {
      return expr;
    }
    if (ident.value instanceof Identifier) {
      return {
        isOk: true,
        value: new AssignmentExpression(
          currentToken.location,
          ident.value,
          expr.value!,
        ),
      };
    }
    if (ident.value instanceof MemberExpression) {
      return {
        isOk: true,
        value: new AssignmentExpression(
          currentToken.location,
          ident.value,
          expr.value!,
        ),
      };
    }
    if (ident.value instanceof ArrayAccess) {
      return {
        isOk: true,
        value: new AssignmentExpression(
          currentToken.location,
          ident.value,
          expr.value!,
        ),
      };
    }
  }

  return ident;
};
