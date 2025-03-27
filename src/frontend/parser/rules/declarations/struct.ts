import type {LogicParser, LogicType, ParseResult} from "../../../../types";
import {StructDeclaration, StructProperty} from "../../ast/declarations/struct.ts";
import {TokenType} from "../../../lexer";
import {LgSyntaxError} from "../../../errors";
import {Identifier} from "../../ast";
import {typeDeclaration} from "./variable.ts";


const structMember:LogicParser<StructProperty>=(context)=>{
    if(!context.check(TokenType.IDENTIFIER)){
        return LgSyntaxError.unexpected(context,'identifier')
    }
    const {currentToken}=context
    const ident= new Identifier(currentToken.literal,currentToken.location)
    context.advance()

    let decltype: LogicType|undefined;
    const ty=typeDeclaration(context)
    if(!ty.isOk){
        return <ParseResult<never>>ty;
    }
    decltype=ty.value

    if(!context.check(TokenType.SEMICOLON)){
        return LgSyntaxError.missingSemicolon(context)
    }
    context.advance()

    return {
        isOk:true,
        value:new StructProperty(ident,decltype!)
    }

}

const structBody:LogicParser<StructProperty[]>=(context)=>{
    if(!context.check(TokenType.LBRACE)){
        return LgSyntaxError.unexpected(context,"{")
    }

    context.advance();

    const props:StructProperty[]=[];
    while (!context.check(TokenType.RBRACE)){
        const prop=structMember(context)
        if(!prop.isOk){
            return <ParseResult<never>>prop
        }
        props.push(prop.value!)
    }

    if(!context.check(TokenType.RBRACE)){
        return LgSyntaxError.unexpected(context,"}")
    }

    context.advance();

    return {
        isOk:true,
        value:props
    }
}

export const struct: LogicParser<StructDeclaration> = (context) => {
    context.advance();

    if (!context.check(TokenType.IDENTIFIER)) {
        return LgSyntaxError.unexpected(context, "identifier")
    }

    const ident = new Identifier(context.currentToken.literal, context.currentToken.location)

    context.advance()

    const body = structBody(context)

    if (!body.isOk) {
        return <ParseResult<never>>body;
    }

    return {
        isOk: true,
        value: new StructDeclaration(ident, body.value!)
    }
}