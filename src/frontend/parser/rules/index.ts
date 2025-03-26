import type { LogicParser } from "../../../types";
import { LgErrorCode } from "../../errors";
import { TokenType } from "../../lexer";
import { type LogicNode } from "../ast";
import { assignment } from "./assignments/assignment";
import { ifExpresion } from "./control-flow/if";
import { variableDeclaration } from "./declarations/variable";
import { logicOr } from "./expressions/logic-or";

export const expression: LogicParser<LogicNode> = (context) => {
  let result;
  switch (context.currentToken.type) {
    case TokenType.LET: {
      result=variableDeclaration(context);
      break
    }
    case TokenType.IDENTIFIER: {
      result=assignment(context);
      break
    }
    case TokenType.IF: {
      result= ifExpresion(context);
      break
    }
    default: {
      result=logicOr(context);
    }
  }

  return result;
};
