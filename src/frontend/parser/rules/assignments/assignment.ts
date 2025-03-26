import type {LogicParser} from "../../../../types";
import {LgSyntaxError} from "../../../errors";
import {TokenType} from "../../../lexer";
import {Identifier, type LogicNode} from "../../ast";
import {AssignmentExpression} from "../../ast/assignments/variable-assignment";
import {expression} from "../expressions";
import {logicOr} from "../expressions/logic-or";

export const assignment: LogicParser<AssignmentExpression | LogicNode> = (
    context
) => {
    if (!context.check(TokenType.IDENTIFIER)) {
        return logicOr(context)
    }

    if(context.check(TokenType.IDENTIFIER) && context.nextToken.type!==TokenType.ASSIGN){
        return logicOr(context)
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
