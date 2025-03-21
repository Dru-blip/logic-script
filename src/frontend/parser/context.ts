import { Lexer } from "../lexer";
import { Token, TokenType } from "../lexer/token";

export class ParserContext {
  lexer: Lexer;
  currentToken!: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.advance();
  }

  advance() {
    this.currentToken = this.lexer.nextToken();
  }

  peek(): Token {
    return this.currentToken;
  }

  match(tokenTypes: TokenType[]): boolean {
    for (const tokenType of tokenTypes) {
      if (this.currentToken.type === tokenType) {
        return true;
      }
    }
    return false;
  }

  check(tokenType: TokenType): boolean {
    return this.currentToken.type === tokenType;
  }

  consume(type: TokenType, message: string) {
    if (this.check(type)) {
      this.advance();
    }

    this.error(message);
  }

  error(message: string): void {
    console.error(
      `[line ${this.currentToken.line}, col ${this.currentToken.col}] Error: ${message}`,
    );
    throw new Error(message);
  }
}
