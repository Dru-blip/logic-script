import type { ParserContext } from "./context";

export type ParseResult<T> = {
  isOk: boolean;
  value?: T;
  error?: string;
};

export type LogicParser<T> = (context: ParserContext) => ParseResult<T>;

export type TokenLocation = {
  line: number;
  col: number;
  offset: number;
};
