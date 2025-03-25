import type { TokenLocation } from "../../types";

export enum TokenType {
  //Operators
  PLUS = "+",
  MINUS = "-",
  ASTERISK = "*",
  SLASH = "/",
  MODULO = "%",
  ASSIGN = "=",
  EQUALS = "==",
  LESS_THAN = "<",
  GREATER_THAN = ">",
  LESS_THAN_EQUAL = "<=",
  GREATER_THAN_EQUAL = ">=",
  BANG = "!",
  NOT_EQUAL = "!=",
  COLON = ":",

  //PUNCTUATION
  HASH = "#",
  COMMA = ",",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  // Keywords
  FN = "fn",
  IF = "If",
  ELSE = "Else",
  RANGE = "Range",
  FOR = "For",
  RETURN = "return",
  LET = "let",
  MUT = "mut",
  AND = "and",
  OR = "or",

  IDENTIFIER = "IDENTIFIER",

  ERROR = "error",

  //Types
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "boolean",
  TRUE = "true",
  FALSE = "false",

  INT = "Int",
  BOOL = "Bool",
  STR = "Str",
  ANY = "any",
  VOID = "void",
  EOF = "EOF",
}

export class Token {
  constructor(
    public literal: string,
    public type: TokenType,
    public location: TokenLocation,
  ) {}
}
