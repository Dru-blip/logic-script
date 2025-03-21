import { Lexer } from "../lexer";
import { ParserContext } from "./context";
import { expression } from "./rules/expressions";

export const parser = (source: string, filename: string) => {
  const lexer = new Lexer(source, filename);
  const context = new ParserContext(lexer);

  return {
    parse: () => expression(context),
  };
};
