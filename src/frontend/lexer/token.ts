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
  LET = "Let",
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
  EOF = "EOF",
}

export class Token {
  constructor(
    public literal: string,
    public type: TokenType,
    public line: number,
    public col: number,
    public offset: number,
  ) {}
}
