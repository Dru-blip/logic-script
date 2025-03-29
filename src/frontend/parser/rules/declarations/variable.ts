import {TokenType} from "../../../lexer";
import {type LogicParser, type LogicType, type ParseResult} from "../../../../types";
import {LgSyntaxError} from "../../../errors/syntax.ts";
import {Identifier, type LogicNode, VariableDeclaration} from "../../ast";
import {primary} from "../expressions/primary";
import {expression} from "../expressions";
import {typeParser} from "../types.ts";


export const variableDeclaration: LogicParser<VariableDeclaration> = (
    context
) => {
    if (!context.check(TokenType.LET)) {
        return LgSyntaxError.unexpected(context, "Expected 'let' keyword");
    }
    context.advance();
    const ident = primary(context);

    if (!ident.isOk) {
        return {
            isOk: false,
            error: ident.error,
        };
    }

    let decltype: LogicType | undefined;
    if (!context.check(TokenType.COLON)) {
        return LgSyntaxError.unexpected(context, ":");
    }
    context.advance()
    const ty = typeParser(context)

    if (!ty.isOk) {
        return <ParseResult<never>>ty;
    }

    decltype = ty.value

    let expr: LogicNode | undefined;
    if (context.check(TokenType.ASSIGN)) {
        context.advance();
        const result = expression(context);
        if (result.error) {
            return LgSyntaxError.missingAssignment(
                context,
            );
        }
        expr = result.value;
    }

    if (!context.check(TokenType.SEMICOLON)) {
        return LgSyntaxError.unexpected(context, "';'");
    }

    context.advance();
    if (!decltype && !expr) {
        return LgSyntaxError.missingAssignment(
            context,
        );
    }

    if (decltype && !expr) {
        return {
            isOk: true,
            value: new VariableDeclaration(<Identifier>ident.value, null, decltype),
        };
    }

    return {
        isOk: true,
        value: new VariableDeclaration(
            <Identifier>ident.value,
            <LogicNode>expr,
            decltype!
        ),
    };
};
