import type {LogicParser} from "../../../types";
import {TokenType} from "../../lexer";
import {type LogicNode} from "../ast";
import {ifStatement} from "./control-flow/if";
import {variableDeclaration} from "./declarations/variable";
import {expressionStatement} from "./expressions";
import {forStatement} from "./control-flow/for.ts";
import {breakContinue} from "./statements/break-continue.ts";
import {struct} from "./declarations/struct.ts";
import {functionDeclaration} from "./declarations/function.ts";
import {returnStatement} from "./statements/return-statement.ts";
import {block} from "./statements/block.ts";

export const statement: LogicParser<LogicNode> = (context) => {
  switch (context.currentToken.type) {
    case TokenType.LET: {
      return variableDeclaration(context);
    }
    case TokenType.STRUCT: {
      return struct(context);
    }
    case TokenType.FN: {
      return functionDeclaration(context);
    }
    case TokenType.FOR: {
      return forStatement(context);
    }
    case TokenType.IF: {
      return ifStatement(context);
    }
    case TokenType.LBRACE:{
      return block(context);
    }
    case TokenType.BREAK:
    case TokenType.CONTINUE: {
      return breakContinue(context);
    }
    case TokenType.RETURN: {
      return returnStatement(context);
    }
    default: {
      return expressionStatement(context);
    }
  }
};
