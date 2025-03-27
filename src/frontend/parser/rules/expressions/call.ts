import type {LogicParser, ParseResult} from "../../../../types";
import {CallExpression} from "../../ast/expressions/call.ts";
import {primary} from "./primary.ts";
import type {LogicNode} from "../../ast";
import {TokenType} from "../../../lexer";
import {expression} from "./index.ts";
import {LgSyntaxError} from "../../../errors";


const argumentList: LogicParser<LogicNode[]> = (context) => {
    context.advance();

    const args: LogicNode[] = []
    while (!context.check(TokenType.RPAREN)) {
        const expr = expression(context)
        if (!expr.isOk) {
            return <ParseResult<never>>expr
        }
        args.push(expr.value!)
        if (context.check(TokenType.COMMA)) {
            context.advance();
        }
    }
    if (!context.check(TokenType.RPAREN)) {
        return LgSyntaxError.unexpected(context, ")")
    }
    context.advance()

    return {
        isOk: true,
        value: args
    }
}

export const call: LogicParser<CallExpression | LogicNode> = (context) => {
    const expr = primary(context)
    if (!expr.isOk) {
        return expr
    }

    if (context.check(TokenType.LPAREN)) {
        const args = argumentList(context)
        if (!args.isOk) {
            return <ParseResult<never>>args
        }
        return {
            isOk: true,
            value: new CallExpression(expr.value!, args.value!)
        }
    }


    return expr
}