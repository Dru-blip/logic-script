import type {LogicParser, ParseResult} from "../../../../types";
import {ReturnStatement} from "../../ast/statements/return.ts";
import {expression} from "../expressions";
import {TokenType} from "../../../lexer";
import {LgSyntaxError} from "../../../errors";


export const returnStatement:LogicParser<ReturnStatement> =(context)=>{
    context.advance()

    const value=expression(context)

    if(!value.isOk){
        return <ParseResult<never>>value
    }

    if(!context.check(TokenType.SEMICOLON)){
        return LgSyntaxError.missingSemicolon(context)
    }
    context.advance()

    return {
        isOk:true,
        value:new ReturnStatement(value.value!)
    }

}