import {Token, TokenType} from "./token";

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
    // console.log(source);
    this.keywords.set("fn", TokenType.FN);
    this.keywords.set("for", TokenType.FOR);
    this.keywords.set("if", TokenType.IF);
    this.keywords.set("else", TokenType.ELSE);
    this.keywords.set("return", TokenType.RETURN);
    this.keywords.set("true", TokenType.BOOLEAN);
    this.keywords.set("false", TokenType.BOOLEAN);
    this.keywords.set("mut", TokenType.MUT);
    this.keywords.set("..", TokenType.RANGE);
    this.keywords.set("let", TokenType.LET);
    this.keywords.set("and", TokenType.AND);
    this.keywords.set("or", TokenType.OR);
    this.keywords.set("Int", TokenType.INT);
    this.keywords.set("Bool", TokenType.BOOL);
    this.keywords.set("Str", TokenType.STR);
    this.keywords.set("any", TokenType.ANY);
    this.keywords.set("void", TokenType.VOID);
    this.keywords.set("in",TokenType.IN)

    this.position = 0;
    this.line = 0;
    this.advance();
    this.advance();
    this.col = 0;
  }

  /**
   * Advances the current character and updates the position, line, and column.
   */
  private advance() {
    this.currentChar = this.nextChar;
    this.nextChar = this.source.at(this.position++);
    if (this.currentChar === "\n") {
      this.line++;
      this.col = 1;
    } else if (this.currentChar) {
      this.col++;
    }
    // console.log(`line: ${this.line},col: ${this.col},offset: ${this.position} char:${this.currentChar}`)
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

  private makeToken(
    type: TokenType,
    literal: string,
    location: { line: number; col: number; offset: number },
  ) {
    // console.log("making token: ", {
    //   type,
    //   literal,
    //   offset: location.offset,
    //   line: location.line,
    //   col: location.offset,
    // });
    return new Token(literal, type, location);
  }

  /**
   * Skips whitespace characters (spaces, tabs, and newlines).
   */
  private skipWhiteSpaces() {
    while (true) {
      if (
        this.currentChar === " " ||
        this.currentChar === "\t" || this.currentChar==="" ||
        this.currentChar === "\r"
      ) {
      } else if (this.currentChar === "\n") {
        // console.log(this.position)
      } else {
        break;
      }
      this.advance();
    }
  }

  /**
   * Scans and returns an operator token type.
   *
   * @returns A TokenType corresponding to the scanned operator.
   */
  private scanOperators(): TokenType {
    let tokenType: TokenType;

    switch (this.currentChar) {
      case "+": {
        tokenType = TokenType.PLUS;
        break;
      }
      case "-": {
        tokenType = TokenType.MINUS;
        break;
      }
      case "*": {
        tokenType = TokenType.ASTERISK;
        break;
      }
      case "/": {
        tokenType = TokenType.SLASH;
        break;
      }
      case "=": {
        if (this.nextChar === "=") {
          this.advance();
          tokenType = TokenType.EQUALS;
        } else {
          tokenType = TokenType.ASSIGN;
        }
        break;
      }
      case "}": {
        tokenType = TokenType.RBRACE;
        break;
      }
      case "{": {
        tokenType = TokenType.LBRACE;
        break;
      }
      case "(": {
        tokenType = TokenType.LPAREN;
        break;
      }
      case ")": {
        tokenType = TokenType.RPAREN;
        break;
      }
      case "!": {
        if (this.nextChar === "=") {
          this.advance();
          tokenType = TokenType.NOT_EQUAL;
        } else {
          tokenType = TokenType.BANG;
        }
        break;
      }
      case ",": {
        tokenType = TokenType.COMMA;
        break;
      }
      case "<": {
        if (this.nextChar === "=") {
          this.advance();
          tokenType = TokenType.LESS_THAN_EQUAL;
        } else {
          tokenType = TokenType.LESS_THAN;
        }
        break;
      }
      case ">": {
        if (this.nextChar === "=") {
          this.advance();
          tokenType = TokenType.GREATER_THAN_EQUAL;
        } else {
          tokenType = TokenType.GREATER_THAN;
        }
        break;
      }
      default: {
        tokenType = TokenType.EOF;
      }
    }

    this.advance();
    return tokenType;
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

    const location = {
      line: this.line,
      col: this.col,
      offset: this.position,
    };

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
        const type = this.scanOperators();
        return this.makeToken(type, type, location);
      }
      case ":": {
        this.advance();
        return this.makeToken(TokenType.COLON, ":", location);
      }
      case ";":{
        this.advance()
        return this.makeToken(TokenType.SEMICOLON,";",location)
      }
      case '"': {
        let literal = "";
        this.advance();
        while (this.currentChar !== '"') {
          literal += this.currentChar;
          this.advance();
        }
        this.advance();
        return this.makeToken(TokenType.STRING, literal, location);
      }
      default: {
        if (this.isDigit(this.currentChar)) {
          let literal = "";
          while (this.isDigit(this.currentChar)) {
            literal += this.currentChar;
            this.advance();
          }

          return this.makeToken(TokenType.NUMBER, literal, location);
        } else if (this.isAlpha(this.currentChar)) {
          let literal = "";
          while (this.isAlphaNumeric(this.currentChar)) {
            literal += this.currentChar;
            this.advance();
          }

          if (this.keywords.has(literal)) {
            return this.makeToken(
              this.keywords.get(literal)!,
              literal,
              location,
            );
          }
          return this.makeToken(TokenType.IDENTIFIER, literal, location);
        }
        if (this.currentChar === undefined) {
          return this.makeToken(TokenType.EOF, "", location);
        }
        // assert(false, `Unexpected character: ${this.currentChar}`);
        const errorToken = this.makeToken(
          TokenType.ERROR,
          "invalid character",
          location,
        );
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
