import type { LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { ifStatement } from "./control-flow/if";
import { variableDeclaration } from "./declarations/variable";
import { expressionStatement } from "./expressions";

export const statement: LogicParser<LogicNode> = (context) => {
  switch (context.currentToken.type) {
    case TokenType.LET: {
      return variableDeclaration(context);
    }
    case TokenType.IF: {
      return ifStatement(context);
    }
    default: {
      return expressionStatement(context);
    }
  }
};
