import assert from "node:assert";
import { Token, TokenType } from "./token";

export { Token, TokenType };

/**
 * A lexer that tokenizes a source code string into a stream of tokens.
 */
export class Lexer {
  /**
   * The current position in the source code string.
   */
  private position: number;

  /**
   * The next character in the source code string.
   */
  private nextChar: string | undefined;

  /**
   * The current character being processed.
   */
  private currentChar: string | undefined;

  /**
   * The current line number.
   */
  private line: number;

  /**
   * The current column number.
   */
  private col: number;

  /**
   * A map of keywords to their corresponding token types.
   */
  private keywords: Map<string, TokenType> = new Map();

  /**
   * Creates a new Lexer instance.
   *
   * @param source The source code string to tokenize.
   * @param filename The name of the file being tokenized.
   */
  constructor(
    public readonly source: string,
    public readonly filename: string,
  ) {
    this.keywords.set("fn", TokenType.FN);
    this.keywords.set("For", TokenType.FOR);
    this.keywords.set("If", TokenType.IF);
    this.keywords.set("Else", TokenType.ELSE);
    this.keywords.set("return", TokenType.RETURN);
    this.keywords.set("true", TokenType.BOOLEAN);
    this.keywords.set("false", TokenType.BOOLEAN);
    this.keywords.set("mut", TokenType.MUT);
    this.keywords.set("Range", TokenType.RANGE);
    this.keywords.set("Let", TokenType.LET);
    this.keywords.set("and", TokenType.AND);
    this.keywords.set("or", TokenType.OR);
    this.keywords.set("Int", TokenType.INT);
    this.keywords.set("Bool", TokenType.BOOL);
    this.keywords.set("Str", TokenType.STR);

    this.position = 0;
    this.line = 1;
    this.col = 1;
    this.advance();
    this.advance();
  }

  /**
   * Advances the current character and updates the position, line, and column.
   */
  private advance() {
    this.currentChar = this.nextChar;
    this.nextChar = this.source.at(this.position++);
    this.col++;

    assert(
      this.position <= this.source.length,
      `Lexer advance(): position ${this.position} exceeded source length ${this.source.length}`,
    );
  }

  /**
   * Returns the current character without advancing the position.
   *
   * @returns The current character.
   */
  private peek() {
    return this.currentChar;
  }

  /**
   * Returns the next character without advancing the position.
   *
   * @returns The next character.
   */
  private next() {
    return this.nextChar;
  }

  /**
   * Creates a new Token instance.
   *
   * @param type The token type.
   * @param literal The token literal.
   * @returns A new Token instance.
   */
  private makeToken(type: TokenType, literal: string) {
    return new Token(
      literal,
      type,
      this.line,
      this.col,
      this.position - literal.length,
    );
  }

  /**
   * Skips whitespace characters (spaces, tabs, and newlines).
   */
  private skipWhiteSpaces() {
    while (true) {
      if (
        this.currentChar === " " ||
        this.currentChar === "\t" ||
        this.currentChar === "\r"
      ) {
        this.col++;
      } else if (this.currentChar === "\n") {
        this.line++;
        this.col = 1;
      } else {
        break;
      }
      this.advance();
    }
  }

  /**
   * Scans and returns an operator token.
   *
   * @returns An operator token.
   */
  private scanOperators() {
    let token;
    switch (this.currentChar) {
      case "+": {
        token = this.makeToken(TokenType.PLUS, "+");
        break;
      }
      case "-": {
        token = this.makeToken(TokenType.MINUS, "-");
        break;
      }
      case "*": {
        token = this.makeToken(TokenType.ASTERISK, "*");
        break;
      }
      case "/": {
        token = this.makeToken(TokenType.SLASH, "/");
        break;
      }
      case "=": {
        if (this.nextChar === "=") {
          this.advance();
          token = this.makeToken(TokenType.EQUALS, "==");
        } else {
          token = this.makeToken(TokenType.ASSIGN, "=");
        }
        break;
      }
      case "}": {
        token = this.makeToken(TokenType.RBRACE, "}");
        break;
      }
      case "{": {
        token = this.makeToken(TokenType.LBRACE, "{");
        break;
      }
      case "(": {
        token = this.makeToken(TokenType.LPAREN, "(");
        break;
      }
      case ")": {
        token = this.makeToken(TokenType.RPAREN, ")");
        break;
      }
      case "!": {
        if (this.nextChar === "=") {
          this.advance();
          token = this.makeToken(TokenType.NOT_EQUAL, "!=");
        } else {
          token = this.makeToken(TokenType.BANG, "!");
        }
        break;
      }
      case ",": {
        token = this.makeToken(TokenType.COMMA, ",");
        break;
      }
      case "<": {
        if (this.nextChar === "=") {
          this.advance();
          token = this.makeToken(TokenType.LESS_THAN_EQUAL, "<=");
        } else {
          token = this.makeToken(TokenType.LESS_THAN, "<");
        }
        break;
      }
      case ">": {
        if (this.nextChar === "=") {
          this.advance();
          token = this.makeToken(TokenType.GREATER_THAN_EQUAL, ">=");
        } else {
          token = this.makeToken(TokenType.GREATER_THAN, ">");
        }
        break;
      }
      default: {
        token = new Token(
          "eof",
          TokenType.EOF,
          this.line,
          this.col,
          this.position,
        );
      }
    }
    this.advance();
    return token;
  }

  /**
   * Checks if a character is a digit.
   *
   * @param char The character to check.
   * @returns True if the character is a digit, false otherwise.
   */
  private isDigit(char: string | undefined) {
    return char && char >= "0" && char <= "9";
  }

  /**
   * Checks if a character is an alphabet character.
   *
   * @param char The character to check.
   * @returns True if the character is an alphabet character, false otherwise.
   */
  private isAlpha(char: string | undefined) {
    return (
      char && ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z"))
    );
  }

  /**
   * Checks if a character is alphanumeric.
   *
   * @param char The character to check.
   * @returns True if the character is alphanumeric, false otherwise.
   */
  private isAlphaNumeric(char: string | undefined) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  /**
   * Returns the next token from the source code.
   *
   * @returns The next token.
   */
  nextToken() {
    this.skipWhiteSpaces();

    switch (this.currentChar) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "=":
      case "!":
      case ",":
      case "}":
      case "{":
      case "(":
      case ")":
      case "<":
      case ">": {
        return this.scanOperators();
      }
      case '"': {
        let literal = "";
        this.advance();
        while (this.currentChar !== '"') {
          literal += this.currentChar;
          this.advance();
        }
        this.advance();
        return this.makeToken(TokenType.STRING, literal);
      }
      default: {
        if (this.isDigit(this.currentChar)) {
          let literal = "";
          while (this.isDigit(this.currentChar)) {
            literal += this.currentChar;
            this.advance();
          }

          return this.makeToken(TokenType.NUMBER, literal);
        } else if (this.isAlpha(this.currentChar)) {
          let literal = "";
          while (this.isAlphaNumeric(this.currentChar)) {
            literal += this.currentChar;
            this.advance();
          }

          if (this.keywords.has(literal)) {
            return this.makeToken(this.keywords.get(literal)!, literal);
          }
          return this.makeToken(TokenType.IDENTIFIER, literal);
        }
        if (this.currentChar === undefined) {
          return new Token(
            "eof",
            TokenType.EOF,
            this.line,
            this.col,
            this.position,
          );
        }
        assert(false, `Unexpected character: ${this.currentChar}`);
        const errorToken = this.makeToken(TokenType.ERROR, "invalid character");
        this.advance();
        return errorToken;
      }
    }
  }

  getTokens() {
    let token = this.nextToken();
    const tokens = [token];
    while (token.type !== TokenType.EOF) {
      token = this.nextToken();
      tokens.push(token);
    }
    return tokens;
  }
}
