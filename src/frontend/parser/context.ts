import { makeSyntaxError, type LogicError } from "../errors";
import { Lexer } from "../lexer";
import { Token, TokenType } from "../lexer/token";

export class ParserContext {
  lexer: Lexer;
  currentToken!: Token;
  nextToken!:Token;
  errors: LogicError[];

  public isInsideAngleBrackets = false;
  public leftbracketDepth: string[] = [];
  public rightbracketDepth:string[]=[]

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.advance();
    this.advance()
  }

  advance() {
    const prevToken=this.currentToken;
    this.currentToken=this.nextToken
    this.nextToken = this.lexer.nextToken();

    if (this.currentToken&& this.currentToken.type === TokenType.LESS_THAN) {
      if(prevToken && prevToken.type===TokenType.IF){
        this.isInsideAngleBrackets = true;        
      }
    }
    if (this.currentToken && this.currentToken.type === TokenType.GREATER_THAN) {
      this.rightbracketDepth.push('<')
    }
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
