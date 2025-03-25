import { makeSyntaxError, type LogicError } from "../errors";
import { Lexer } from "../lexer";
import { Token, TokenType } from "../lexer/token";

export class ParserContext {
  lexer: Lexer;
  currentToken!: Token;
  errors: LogicError[];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
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
      return true
    } else {
      return false
    }
  }

  // error(message: string): void {
  //   this.errors.push(
  //     makeSyntaxError(this.lexer.filename, this.currentToken.location, message),
  //   );
  // }
}
