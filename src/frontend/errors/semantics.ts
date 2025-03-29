import {LgErrorCode, LgErrorType, LogicError} from "./index.ts";
import type {ParseResult, TokenLocation} from "../../types";
import type {ParserContext} from "../parser/context.ts";


export enum LgSemanticErrorCode {
    UNDEFINED_VARIABLE = "S2001",
    TYPE_MISMATCH = "S2002",
    REDECLARATION = "S2003",
    UNDEFINED_FUNCTION = "S2004",
    INVALID_OPERATION = "S2005",
}

const SEMANTIC_ERROR_HINTS: Map<string, string> = new Map([
    [LgSemanticErrorCode.UNDEFINED_VARIABLE, "Check if the variable is declared before use."],
    [LgSemanticErrorCode.TYPE_MISMATCH, "Ensure type consistency in expressions."],
    [LgSemanticErrorCode.REDECLARATION, "A variable with this name already exists in the current scope."],
    [LgSemanticErrorCode.UNDEFINED_FUNCTION, "Ensure the function is defined before calling it."],
    [LgSemanticErrorCode.INVALID_OPERATION, "Verify that the operation is valid for the given types."],
]);

export class LgSemanticError extends LogicError {
    constructor(
        public filename: string,
        public location: TokenLocation,
        public message: string,
        public code: LgErrorCode,
        public details?: string,
        expected?: string,
        unexpected?: string) {
        super(filename, location, message, code, LgErrorType.SEMANTIC, expected, unexpected);
    }

    printError(source: string) {
        super.printError(source, SEMANTIC_ERROR_HINTS);
    }


    static undefinedVariable(context: ParserContext, varName: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSemanticError(
                context.lexer.filename,
                context.currentToken.location,
                `Use of undeclared variable '${varName}'.`,
                LgErrorCode.UNDEFINED_VARIABLE
            ),
        };
    }

    static typeMismatch(context: ParserContext, expected: string, found: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSemanticError(
                context.lexer.filename,
                context.currentToken.location,
                `Type mismatch: expected '${expected}', found '${found}'.`,
                LgErrorCode.TYPE_MISMATCH
            ),
        };
    }

    static redeclaration(context: ParserContext, varName: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSemanticError(
                context.lexer.filename,
                context.currentToken.location,
                `Variable '${varName}' is already declared in this scope.`,
                LgErrorCode.REDECLARATION
            ),
        };
    }

    static undefinedFunction(context: ParserContext, funcName: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSemanticError(
                context.lexer.filename,
                context.currentToken.location,
                `Call to undefined function '${funcName}'.`,
                LgErrorCode.UNDEFINED_FUNCTION
            ),
        };
    }

    static invalidOperation(context: ParserContext, operation: string): ParseResult<never> {
        return {
            isOk: false,
            error: new LgSemanticError(
                context.lexer.filename,
                context.currentToken.location,
                `Invalid operation: '${operation}'.`,
                LgErrorCode.INVALID_OPERATION
            ),
        };
    }
}
