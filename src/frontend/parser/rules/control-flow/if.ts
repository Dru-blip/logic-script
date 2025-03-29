import type {LogicParser} from "../../../../types";
import {LgSyntaxError} from "../../../errors/syntax.ts";
import {TokenType} from "../../../lexer";
import {BlockStatement, type LogicNode} from "../../ast";
import {IfStatement} from "../../ast/control-flow/if";
import {block} from "../statements/block";
import {expression} from "../expressions";

export const ifStatement: LogicParser<IfStatement | LogicNode> = (context) => {
    if (!context.check(TokenType.IF)) {
        return LgSyntaxError.unexpected(context, "Expected 'if'");
    }

    context.advance()

    const condition = expression(context)

    if (!condition.isOk) {
        return condition
    }

    const thenBlock = block(context)

    if (!thenBlock.isOk) {
        return thenBlock
    }

    let elseBlock;
    if(context.check(TokenType.ELSE)){
        context.advance();
        elseBlock = block(context)
        if(!elseBlock.isOk) {
            return elseBlock
        }
    }

    return {
        isOk: true,
        value: new IfStatement(
            <LogicNode>condition.value,
            <BlockStatement>thenBlock.value,
            elseBlock?.value??undefined
        ),
    };
};
