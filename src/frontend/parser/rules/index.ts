import type {LogicParser} from "../../../types";
import {TokenType} from "../../lexer";
import {type LogicNode} from "../ast";
import {ifStatement} from "./control-flow/if";
import {variableDeclaration} from "./declarations/variable";
import {expressionStatement} from "./expressions";
import {forStatement} from "./control-flow/for.ts";
import {breakContinue} from "./statements/breakContinue.ts";

export const statement: LogicParser<LogicNode> = (context) => {
  switch (context.currentToken.type) {
    case TokenType.LET: {
      return variableDeclaration(context);
    }
    case TokenType.FOR:{
      return forStatement(context)
    }
    case TokenType.IF: {
      return ifStatement(context);
    }
    case TokenType.BREAK:
    case TokenType.CONTINUE:{
      return breakContinue(context)
    }
    default: {
      return expressionStatement(context);
    }
  }
};
