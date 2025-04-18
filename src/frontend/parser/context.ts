import { LgErrorCode, type LogicError } from "../errors";
import { Lexer } from "../lexer";
import { Token, TokenType } from "../lexer";
import { LgSyntaxError } from "../errors/syntax.ts";

export class ParserContext {
  lexer: Lexer;
  currentToken!: Token;
  nextToken!: Token;
  errors: LogicError[];

  public isInsideAngleBrackets = false;
  public leftbracketDepth: string[] = [];
  public rightbracketDepth: string[] = [];

  // for handling nested function declarations
  public functionDeclarationDepth: boolean[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.advance();
    this.advance();
  }

  advance() {
    const prevToken = this.currentToken;
    this.currentToken = this.nextToken;
    this.nextToken = this.lexer.nextToken();

    if (this.currentToken && this.currentToken.type === TokenType.FN) {
      this.functionDeclarationDepth.push(true);
    }

    // if (this.currentToken&& this.currentToken.type === TokenType.LESS_THAN) {
    //   if(prevToken && prevToken.type===TokenType.IF){
    //     this.isInsideAngleBrackets = true;
    //   }
    // }
    // if (this.currentToken && this.currentToken.type === TokenType.GREATER_THAN) {
    //   this.rightbracketDepth.push('<')
    // }
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

  consume(type: TokenType, message: string, code: LgErrorCode) {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  expect(type: TokenType, message: string) {
    if (!this.check(type)) {
      return {
        isOk: false,
        error: LgSyntaxError.unexpected(this, message),
      };
    }
  }
}
