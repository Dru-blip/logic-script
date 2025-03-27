import type {LogicParser, ParseResult} from "../../../../types";
import {StructDeclaration} from "../../ast/declarations/struct.ts";
import {TokenType} from "../../../lexer";
import {LgSyntaxError} from "../../../errors";
import {Identifier} from "../../ast";
import {block} from "../statements/block.ts";


export const struct: LogicParser<StructDeclaration> = (context) => {
    context.advance();

    if (!context.check(TokenType.IDENTIFIER)) {
        return LgSyntaxError.unexpected(context, "identifier")
    }

    const ident = new Identifier(context.currentToken.literal, context.currentToken.location)

    context.advance()

    const body = block(context)

    if (!body.isOk) {
        return <ParseResult<never>>body;
    }

    return {
        isOk: true,
        value: new StructDeclaration(ident, body.value!)
    }
}