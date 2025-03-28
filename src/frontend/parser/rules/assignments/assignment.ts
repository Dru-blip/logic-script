import type {LogicParser, ParseResult} from "../../../../types";
import {TokenType} from "../../../lexer";
import {Identifier, type LogicNode} from "../../ast";
import {AssignmentExpression} from "../../ast/assignments/variable-assignment";
import {range} from "../expressions/range.ts";
import {MemberAssignment} from "../../ast/assignments/member-assignment.ts";
import {MemberExpression} from "../../ast/expressions/member.ts";

export const assignment: LogicParser<AssignmentExpression | MemberAssignment | LogicNode> = (
    context
) => {
    const ident = range(context)

    if (!ident.isOk) {
        return <ParseResult<never>>ident
    }

    if (context.check(TokenType.ASSIGN)) {
        context.advance();
        const expr = assignment(context);
        if (!expr.isOk) {
            return expr
        }
        if (ident.value instanceof Identifier) {
            return {
                isOk: true,
                value: new AssignmentExpression(ident.value, expr.value!)
            }
        }
        if(ident.value instanceof MemberExpression){
            return {
                isOk: true,
                value:new MemberAssignment(ident.value,expr.value!)
            }
        }
    }

    return ident
};
