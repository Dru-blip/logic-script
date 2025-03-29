import {type LogicParser, type ParseResult, PrimitiveType} from "../../../types";
import {TokenType} from "../../lexer";
import {LogicLiteral} from "../ast";
import {ParserContext} from "../context";
import {expressionList} from "./expression-list.ts";
import {ArrayLiteral} from "../ast/literal.ts";
import {LgSyntaxError} from "../../errors/syntax.ts";

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
    }else if (currentToken.type === TokenType.BOOLEAN) {
        return {
            isOk: true,
            value: new LogicLiteral<boolean, PrimitiveType.BOOLEAN>(
                currentToken.literal === "true",
                PrimitiveType.BOOLEAN,
                "boolean",
                context.currentToken.location
            ),
        };
    }else if (currentToken.type === TokenType.STRING) {
        return {
            isOk: true,
            value: new LogicLiteral<string, PrimitiveType.STR>(
                currentToken.literal,
                PrimitiveType.STR,
                "string",
                context.currentToken.location
            ),
        };
    }else if (currentToken.type === TokenType.LSQRB) {
        context.advance()
        const literals = expressionList(context, TokenType.RSQRB)
        if (!literals.isOk) {
            return <ParseResult<never>>literals
        }
        return {isOk: true, value: new ArrayLiteral(literals.value!, currentToken.location)}
    }else if (currentToken.type === TokenType.ERROR) {
        return LgSyntaxError.unexpected(
            context,
            "Unknown token",
        );
    }else if (currentToken.type === TokenType.EOF) {
        return LgSyntaxError.unexpected(
            context,
            "end of file",
        );
    }else{
        return LgSyntaxError.unexpected(context, "");
    }

};
