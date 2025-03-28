import type {ParseResult} from "../../../types";
import type {LogicNode} from "../ast";
import type {ParserContext} from "../context.ts";
import {TokenType} from "../../lexer";
import {expression} from "./expressions";
import {LgSyntaxError} from "../../errors";


export const expressionList: (context: ParserContext, endType: TokenType) => ParseResult<LogicNode[] | never> = (context, endType) => {
    const expressions: LogicNode[] = []
    while (!context.check(endType)) {
        const expr = expression(context)
        if (!expr.isOk) {
            return <ParseResult<never>>expr
        }

        expressions.push(expr.value!)

        if(context.check(TokenType.COMMA)){
            context.advance()
        }
    }

    if(!context.check(endType)) {
        return LgSyntaxError.unexpected(context, endType)
    }

    return {
        isOk: true,
        value: expressions
    }
}