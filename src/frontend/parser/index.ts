import { Lexer } from "../lexer";
import { Program, type LogicNode } from "./ast";
import { ParserContext } from "./context";
import { expression } from "./rules/expressions";
import type { ParseResult } from "./types";

export const parser = (source: string, filename: string) => {
  const lexer = new Lexer(source, filename);
  const context = new ParserContext(lexer);

  return {
    parse: (): ParseResult<LogicNode> => {
      const expr = expression(context);
      if (expr.error) {
        return expr;
      }
      return {
        isOk: true,
        value: new Program([expr.value!]),
      };
    },
  };
};
