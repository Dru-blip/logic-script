import type {LogicParser} from "../../../../types";
import {TokenType} from "../../../lexer";
import {BinaryExpression, type LogicNode} from "../../ast";
import {comparison} from "./comparison";

export const equality: LogicParser<LogicNode> = (context) => {

    let left = comparison(context);

    if (left.isOk) {
        while (context.match([TokenType.EQUALS, TokenType.NOT_EQUAL])) {
            const {currentToken} = context;
            context.advance();
            const operator = currentToken;
            const right = comparison(context);
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
