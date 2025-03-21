import { Lexer } from "./index";
import { TokenType } from "./token";

describe("Lexer", () => {
  it("should tokenize single-character operators", () => {
    const lexer = new Lexer("+ - * / = { } ( ) , < >", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.ASTERISK,
      TokenType.SLASH,
      TokenType.ASSIGN,
      TokenType.LBRACE,
      TokenType.RBRACE,
      TokenType.LPAREN,
      TokenType.RPAREN,
      TokenType.COMMA,
      TokenType.LESS_THAN,
      TokenType.GREATER_THAN,
      TokenType.EOF,
    ]);
  });

  it("should tokenize numbers", () => {
    const lexer = new Lexer("123 456 789", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.literal)).toEqual(["123", "456", "789", "eof"]);
    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.NUMBER,
      TokenType.NUMBER,
      TokenType.NUMBER,
      TokenType.EOF,
    ]);
  });

  it("should tokenize strings", () => {
    const lexer = new Lexer('"hello" "world"', "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.literal)).toEqual(["hello", "world", "eof"]);
    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.STRING,
      TokenType.STRING,
      TokenType.EOF,
    ]);
  });

  it("should tokenize keywords", () => {
    const lexer = new Lexer("fn If Else return true false mut Let", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.FN,
      TokenType.IF,
      TokenType.ELSE,
      TokenType.RETURN,
      TokenType.TRUE,
      TokenType.FALSE,
      TokenType.MUT,
      TokenType.LET,
      TokenType.EOF,
    ]);
  });

  it("should handle identifiers", () => {
    const lexer = new Lexer("variableName anotherVar some123", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.literal)).toEqual([
      "variableName",
      "anotherVar",
      "some123",
      "eof",
    ]);
    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.IDENTIFIER,
      TokenType.IDENTIFIER,
      TokenType.IDENTIFIER,
      TokenType.EOF,
    ]);
  });

  it("should handle whitespace and newlines", () => {
    const lexer = new Lexer("\n\t   fn\nIf Else\treturn", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.FN,
      TokenType.IF,
      TokenType.ELSE,
      TokenType.RETURN,
      TokenType.EOF,
    ]);
  });

  it("should return an error token for invalid characters", () => {
    const lexer = new Lexer("@ $", "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.ERROR,
      TokenType.ERROR,
      TokenType.EOF,
    ]);
  });

  it("should handle mixed content", () => {
    const lexer = new Lexer(`fn myFunc() { return 42 }`, "test.txt");
    const tokens = lexer.getTokens();

    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.FN,
      TokenType.IDENTIFIER,
      TokenType.LPAREN,
      TokenType.RPAREN,
      TokenType.LBRACE,
      TokenType.RETURN,
      TokenType.NUMBER,
      TokenType.RBRACE,
      TokenType.EOF,
    ]);
  });
});
