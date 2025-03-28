import {ArrayType, type LogicParser, type ParseResult, PrimitiveType} from "../../../types";
import {LgErrorCode, LgSyntaxError} from "../../errors";
import {TokenType} from "../../lexer";
import {LogicLiteral} from "../ast";
import {ParserContext} from "../context";
import {expressionList} from "./expression-list.ts";
import {ArrayLiteral} from "../ast/literal.ts";

export const literal: LogicParser<LogicLiteral<any, PrimitiveType> | ArrayLiteral> = (
    context: ParserContext
) => {
    const {currentToken} = context;
    if (currentToken.type === TokenType.NUMBER) {
        return {
            isOk: true,
            value: new LogicLiteral<number, PrimitiveType.INT>(
                Number(currentToken.literal),
                PrimitiveType.INT,
                "number",
                context.currentToken.location
            ),
        };
    }

    if (currentToken.type === TokenType.BOOLEAN) {
        return {
            isOk: true,
            value: new LogicLiteral<boolean, PrimitiveType.BOOLEAN>(
                currentToken.literal === "true",
                PrimitiveType.BOOLEAN,
                "boolean",
                context.currentToken.location
            ),
        };
    }

    if (currentToken.type === TokenType.STRING) {
        return {
            isOk: true,
            value: new LogicLiteral<string, PrimitiveType.STR>(
                currentToken.literal,
                PrimitiveType.STR,
                "string",
                context.currentToken.location
            ),
        };
    }

    if (currentToken.type === TokenType.LSQRB) {
        context.advance()
        const literals = expressionList(context, TokenType.RSQRB)
        if (!literals.isOk) {
            return <ParseResult<never>>literals
        }
        return {isOk: true, value: new ArrayLiteral(literals.value!, currentToken.location)}
    }

    if (currentToken.type === TokenType.ERROR) {
        return LgSyntaxError.unexpected(
            context,
            "Unknown token",
            LgErrorCode.UNKNOWN_KEYWORD
        );
    }

    if (currentToken.type === TokenType.EOF) {
        // console.log(context.currentToken);
        return LgSyntaxError.unexpected(
            context,
            "Unexpected end of file",
            LgErrorCode.UNEXPECTED_EOF
        );
    }
    return LgSyntaxError.unexpected(context, "");
};
