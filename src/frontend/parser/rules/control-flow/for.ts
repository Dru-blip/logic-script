import type {LogicParser} from "../../../../types";
import {ForStatement} from "../../ast/control-flow/for.ts";
import {TokenType} from "../../../lexer";
import {LgSyntaxError} from "../../../errors";
import {primary} from "../expressions/primary.ts";
import {expression} from "../expressions";
import {block} from "../statements/block.ts";

export const forStatement:LogicParser<ForStatement>=(context)=>{
    if (!context.check(TokenType.FOR)) {
        return LgSyntaxError.unexpected(context, "Expected 'for'");
    }
    context.advance();

    if(!context.check(TokenType.IDENTIFIER)){
        return LgSyntaxError.unexpected(context, "Expected 'identifier'");
    }

    const ident=primary(context);

    if(!ident.isOk){
        return {
            isOk:false,
            error:ident.error
        }
    }

    if(!context.check(TokenType.IN)){
        return LgSyntaxError.unexpected(context, "Expected 'in'");
    }
    context.advance();

    const iterable=expression(context);
    if(!iterable.isOk){
        return {
            isOk:false,
            error:iterable.error
        };
    }

    const body=block(context)

    if(!body.isOk){
        return {
            isOk:false,
            error:iterable.error
        }
    }

    return {
        isOk:true,
        value:new ForStatement(ident.value!,iterable.value!,body.value!)
    }
}