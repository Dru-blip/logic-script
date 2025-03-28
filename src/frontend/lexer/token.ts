import type {TokenLocation} from "../../types";

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
    SEMICOLON = ";",
    RANGE = "..",

    ARROW="->",
    DOT = ".",


    //PUNCTUATION
    HASH = "#",
    COMMA = ",",
    LPAREN = "(",
    RPAREN = ")",
    LBRACE = "{",
    RBRACE = "}",
    LSQRB="[",
    RSQRB="]",

    // Keywords
    FN = "fn",
    IF = "if",
    ELSE = "else",
    FOR = "for",
    RETURN = "return",
    LET = "let",
    MUT = "mut",
    AND = "and",
    OR = "or",
    IN = "in",
    CONTINUE="continue",
    BREAK="break",
    STRUCT="struct",

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
    TYRANGE="Range",
    EOF = "EOF",
}

export class Token {
    constructor(
        public literal: string,
        public type: TokenType,
        public location: TokenLocation,
    ) {
    }
}
