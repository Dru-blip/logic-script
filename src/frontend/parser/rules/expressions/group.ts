import {expression} from ".";
import type {LogicParser} from "../../../../types";
import {LgErrorCode} from "../../../errors";
import {TokenType} from "../../../lexer";
import type {LogicNode} from "../../ast";
import {GroupingExpression} from "../../ast/expressions/group";
import {LgSyntaxError} from "../../../errors/syntax.ts";

export const group: LogicParser<LogicNode> = (context) => {
    // console.log("parsing grouping expression");
    context.advance();
    const expr = expression(context);
    if (expr.error) {
        return expr;
    }

    const consumed = context.consume(
        TokenType.RPAREN,
        "Expected ')' after expression",
        LgErrorCode.UNCLOSED_PARENTHESIS
    );
    if (!consumed) {
        return LgSyntaxError.missingParenthesis(
            context,
            `found ${context.currentToken}`,
        )
    }
    // context.advance();
    return {
        isOk: true,
        value: new GroupingExpression(expr.value!),
    };
};
