import type {ParserContext} from "../parser/context.ts";
import type {ParseResult, TokenLocation} from "../../types";
import {LgErrorType, LogicError} from "./index.ts";

export enum LgSyntaxErrorCode {
    MISSING_TYPE = "E1001",
    UNEXPECTED_TOKEN = "E1002",
    MISSING_ASSIGNMENT = "E1003",
    UNCLOSED_PARENTHESIS = "E1004",
    UNKNOWN_KEYWORD = "E1005",
    UNEXPECTED_EOF = "E1008",
    MISSING_SEMICOLON = "E1009",
}

const SYNTAX_ERROR_HINTS: Map<string, string> = new Map([
    [LgSyntaxErrorCode.MISSING_TYPE, "Provide a valid type, e.g., `let b: Int = 10;`"],
    [LgSyntaxErrorCode.UNEXPECTED_TOKEN, "Check for unexpected symbols or misplaced keywords."],
    [LgSyntaxErrorCode.MISSING_ASSIGNMENT, "Did you mean to use `=` for assignment? e.g., `let x: Int = 5;`"],
    [LgSyntaxErrorCode.UNCLOSED_PARENTHESIS, "Ensure all opening `(` have a matching closing `)`."],
    [LgSyntaxErrorCode.UNKNOWN_KEYWORD, "Did you mean to use a valid keyword? Check the language syntax."],
    [LgSyntaxErrorCode.UNEXPECTED_EOF, "Your code seems to end abruptly. Did you forget to close a block or add a semicolon?"],
    [LgSyntaxErrorCode.MISSING_SEMICOLON, "Statements must end with `;`. Did you forget to add one?"],
]);

export class LgSyntaxError extends LogicError {
    constructor(
        filename: string,
        location: TokenLocation,
        message: string,
        code: LgSyntaxErrorCode,
        expected?: string,
        unexpected?: string
    ) {
        super(filename, location, message, code, LgErrorType.SYNTAX, expected, unexpected);
    }

    printError(source: string) {
        super.printError(source, SYNTAX_ERROR_HINTS);
    }


    static unexpected(
        context: ParserContext,
        expected: string
    ): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSyntaxError(
                context.lexer.filename,
                context.currentToken.location,
                `Expected ${expected}, but found '${context.currentToken.type}'.`,
                LgSyntaxErrorCode.UNEXPECTED_TOKEN,
                expected,
                context.currentToken.type
            ),
        };
    }

    static missingType(context: ParserContext): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSyntaxError(
                context.lexer.filename,
                context.currentToken.location,
                "Type annotation is required.",
                LgSyntaxErrorCode.MISSING_TYPE
            ),
        };
    }

    static missingSemicolon(context: ParserContext): ParseResult<never> {
        context.advance();
        return {
            isOk: false,
            error: new LgSyntaxError(
                context.lexer.filename,
                context.currentToken.location,
                "Expected ';' at the end of the statement.",
                LgSyntaxErrorCode.MISSING_SEMICOLON,
                "';'",
                context.currentToken.type
            ),
        };
    }

    static missingAssignment(context: ParserContext): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSyntaxError(
                context.lexer.filename,
                context.currentToken.location,
                "Assignment operator '=' is required.",
                LgSyntaxErrorCode.MISSING_ASSIGNMENT,
                "'='",
                context.currentToken.type
            ),
        };
    }

    static missingParenthesis(context: ParserContext, unexpected: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSyntaxError(
                context.lexer.filename,
                context.currentToken.location,
                "Unclosed parenthesis detected.",
                LgSyntaxErrorCode.UNCLOSED_PARENTHESIS,
                "')'",
                unexpected
            ),
        };
    }
}
