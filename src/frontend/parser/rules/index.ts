import type { LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { assignment } from "./assignments/assignment";
import { ifExpresion } from "./control-flow/if";
import { variableDeclaration } from "./declarations/variable";
import { expressionStatement } from "./expressions";

export const statement: LogicParser<LogicNode> = (context) => {
  switch (context.currentToken.type) {
    case TokenType.LET: {
      return variableDeclaration(context);
    }
    case TokenType.IDENTIFIER: {
      return assignment(context);
    }
    case TokenType.IF: {
      return ifExpresion(context);
    }
    default: {
      return expressionStatement(context);
    }
  }
};
