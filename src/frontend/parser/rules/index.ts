import type { LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { assignment } from "./assignments/assignment";
import { ifExpresion } from "./control-flow/if";
// import { type LogicParser } from "../types";
import { variableDeclaration } from "./declarations/variable";
import { logicOr } from "./expressions/logic-or";

export const expression: LogicParser<LogicNode> = (context) => {
  // console.log("parsing expression");
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
      return logicOr(context);
    }
  }
};
