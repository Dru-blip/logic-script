import { Lexer } from "../lexer";
import { Program, type LogicNode } from "./ast";
import { ParserContext } from "./context";
import { expression } from "./rules/expressions";
import type { ParseResult } from "./types";

/**
 * Parses the given source code and returns a program node.
 *
 * @param source The source code to parse.
 * @param filename The filename of the source code.
 * @returns The parsed program node.
 */
export const parse = (source: string, filename: string) => {
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
