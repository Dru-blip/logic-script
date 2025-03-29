import { statement } from ".."
import type { LogicParser } from "../../../../types"
import { LgSyntaxError } from "../../../errors/syntax.ts"
import { TokenType } from "../../../lexer"
import { BlockStatement, type LogicNode } from "../../ast"



export const block:LogicParser<BlockStatement>=(context)=>{
    if(!context.check(TokenType.LBRACE)){
        return LgSyntaxError.unexpected(context,"{")
    }
    context.advance()

    const statements:LogicNode[]=[]

    while(!context.check(TokenType.RBRACE)){
        const expr=statement(context)
        if(!expr.isOk){
            return {isOk:false,error:expr.error}
        }
        statements.push(<LogicNode>expr.value)
    }

    if(!context.check(TokenType.RBRACE)){
        return LgSyntaxError.unexpected(context,"}")
    }

    context.advance()
    return {
        isOk:true,
        value:new BlockStatement(statements)
    }
}