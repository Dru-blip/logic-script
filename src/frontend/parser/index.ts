import type { ParseResult } from "../../types";
import { Lexer } from "../lexer";
import { Program } from "./ast";
import { ParserContext } from "./context";
import { program } from "./rules/program";

/**
 * Parses the given source code and returns a program node.
 *
 * @param source The source code to parse.
 * @param filename The filename of the source code.
 * @returns The parsed program node.
 */
export const parse: (
  source: string,
  filename: string
) => {
  parse: () => ParseResult<Program>;
} = (source: string, filename: string) => {
  const lexer = new Lexer(source, filename);
  const context = new ParserContext(lexer);

  return {
    parse: () => {
      const programNode = program(context);
      if (context.errors.length > 0) {
        for (const error of context.errors) {
          error.printError(source);
        }

        return {
          isOk: false,
          error: context.errors[0],
        };
      }
      return programNode;
    },
  };
};
