import type {LogicParser} from "../../../../types";
import {LgSyntaxError} from "../../../errors";
import {TokenType} from "../../../lexer";
import {Identifier, type LogicNode} from "../../ast";
import {AssignmentExpression} from "../../ast/assignments/variable-assignment";
import {expression} from "../expressions";
import {range} from "../expressions/range.ts";

export const assignment: LogicParser<AssignmentExpression | LogicNode> = (
    context
) => {
    if (!context.check(TokenType.IDENTIFIER)) {
        return range(context)
    }

    if(context.check(TokenType.IDENTIFIER) && context.nextToken.type!==TokenType.ASSIGN){
        return range(context)
    }

    const identifier = new Identifier(context.currentToken.literal, context.currentToken.location);

    context.advance();

    if (!context.check(TokenType.ASSIGN)) {
        return {
            isOk: true,
            value: identifier
        }
    }
    context.advance();
    const expr = expression(context);
    if (!expr.isOk) {
        return LgSyntaxError.missingAssignment(context, "expected expression");
    }
    return {
        isOk: true,
        value: new AssignmentExpression(
            identifier,
            expr.value as LogicNode
        ),
    };
};
