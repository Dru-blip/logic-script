import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { type LogicParser } from "../types";
import { variableDeclaration } from "./declarations/variable";
import { logicOr } from "./expressions/logic-or";

export const expression: LogicParser<LogicNode> = (context) => {
  switch (context.currentToken.type) {
    case TokenType.LET: {
      return variableDeclaration(context);
    }
    default: {
      return logicOr(context);
    }
  }
};
