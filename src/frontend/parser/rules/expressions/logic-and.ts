import type {LogicParser} from "../../../../types";
import {TokenType} from "../../../lexer";
import {BinaryExpression, type LogicNode} from "../../ast";
import {equality} from "./equality";

export const logicAnd: LogicParser<LogicNode> = (context) => {
    let left = equality(context);

    if (left.isOk) {
        while (context.match([TokenType.AND])) {
            const {currentToken} = context;
            context.advance();
            const operator = currentToken;
            const right = equality(context);
            if (!right.isOk) {
                return right;
            }
            left = {
                value: new BinaryExpression(operator, left.value!, right.value!),
                isOk: true,
            };
        }
    }
    return left;
};
