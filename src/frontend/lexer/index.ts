import { Token, TokenType } from "./token";

export { Token, TokenType };

export class Lexer {
  private position: number;
  private nextChar: string | undefined;
  private currentChar: string | undefined;
  private line: number;
  private col: number;

  private keywords: Map<string, TokenType> = new Map();

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

    this.position = 0;
    this.line = 1;
    this.col = 1;
    this.advance();
    this.advance();
  }

  private advance() {
    this.currentChar = this.nextChar;
    this.nextChar = this.source.at(this.position++);
    this.col++;
  }

  private peek() {
    return this.currentChar;
  }

  private next() {
    return this.nextChar;
  }

  private makeToken(type: TokenType, literal: string) {
    return new Token(
      literal,
      type,
      this.line,
      this.col,
      this.position - literal.length,
    );
  }

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

  private isDigit(char: string | undefined) {
    return char && char >= "0" && char <= "9";
  }

  private isAlpha(char: string | undefined) {
    return (
      char && ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z"))
    );
  }

  private isAlphaNumeric(char: string | undefined) {
    return this.isAlpha(char) || this.isDigit(char);
  }

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
