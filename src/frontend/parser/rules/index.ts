import type { LogicParser } from "../../../types";
import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { assignment } from "./assignments/assignment";
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
    default: {
      return logicOr(context);
    }
  }
};
