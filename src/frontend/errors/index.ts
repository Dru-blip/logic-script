import chalk from "chalk";
import type {ParseResult, TokenLocation} from "../../types";
import type {ParserContext} from "../parser/context";

export enum LgErrorCode {
    MISSING_TYPE = "E1001",
    UNEXPECTED_TOKEN = "E1002",
    MISSING_ASSIGNMENT = "E1003",
    UNCLOSED_PARENTHESIS = "E1004",
    UNKNOWN_KEYWORD = "E1005",
    UNEXPECTED_EOF = "E1008",
    MISSING_SEMICOLON = "E1009",
    UNDEFINED_VARIABLE = "E2001",
    TYPE_MISMATCH = "E2002",
    REDECLARATION = "E2003",
    UNDEFINED_FUNCTION = "E2004",
    INVALID_OPERATION = "E2005",
}

const ERROR_HINTS: Map<LgErrorCode, string> = new Map([
    [LgErrorCode.MISSING_TYPE, "Provide a valid type, e.g., `let b: Int = 10`"],
    [
        LgErrorCode.UNEXPECTED_TOKEN,
        "Check for unexpected symbols or misplaced keywords.",
    ],
    [
        LgErrorCode.MISSING_ASSIGNMENT,
        "Did you mean to use `=` for assignment? e.g., `let x:Int = 5`",
    ],
    [
        LgErrorCode.UNCLOSED_PARENTHESIS,
        "Ensure all opening `(` have a matching closing `)`.",
    ],
    [
        LgErrorCode.UNKNOWN_KEYWORD,
        "Did you mean to use a valid keyword? Check the language syntax.",
    ],
    [
        LgErrorCode.UNEXPECTED_EOF,
        "Your code seems to end abruptly. Did you forget to close a block, add a semicolon, or complete an expression?",
    ],
    [
        LgErrorCode.MISSING_SEMICOLON,
        "Statements must end with `;`. Did you forget to add one?",
    ],
    [LgErrorCode.REDECLARATION, "A variable with this name already exists in the current scope."],
    [LgErrorCode.TYPE_MISMATCH, "Ensure type consistency in expressions."],
    [LgErrorCode.UNDEFINED_FUNCTION, "Ensure the function is defined before calling it."],
    [LgErrorCode.UNDEFINED_VARIABLE, "Check if the variable is declared before use."],
    [LgErrorCode.INVALID_OPERATION, "Verify that the operation is valid for the given types."],
]);

// export interface LogicError {
//     filename: string;
//     location: TokenLocation;
//     message: string;
//     code: LgErrorCode;
//     expected?: string;
//     unexpected?: string;
//
//     printError: (source: string) => void;
// }

export enum LgErrorType {
    SYNTAX = "SyntaxError",
    SEMANTIC = "SemanticError",
}

export abstract class LogicError {
    protected expected?: string
    protected unexpected?: string

    protected constructor(
        public filename: string,
        public location: TokenLocation,
        public message: string,
        public code: string,
        public type: LgErrorType,
        expected: string | undefined
        , unexpected: string | undefined) {
        this.expected = expected;
        this.unexpected = unexpected;
    }

    printError(source: string, hints: Map<string, string>) {
        const {filename, location, message, code, expected, unexpected} = this;
        const sourceLines = source.split("\n");
        const errorLine = sourceLines[location.line] || "";
        const hint = hints.get(code) || "Check for errors.";

        const fileInfo = chalk.blue(`${filename}:${location.line + 1}:${location.col + 1}`);

        const details = expected
        console.log(`${chalk.red(`${this.type}[${code}]:`)} ${message}`);
        console.log(` --> ${fileInfo}`);
        console.log(`${" ".repeat(2)} |`);
        console.log(`${String(location.line + 1)} ${" "}| ${errorLine}`);
        console.log(
            `${" ".repeat(2)} | ${" ".repeat(location.col)}${chalk.red("^")} ${chalk.dim(details || "")}`
        );
        console.log(`\n  ${chalk.green("= help:")} ${chalk.yellow(hint)}`);
        console.log();
    }
}


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
        const {filename, location, message, code, details} = this;
        const sourceLines = source.split("\n");
        const errorLine = sourceLines[location.line] || "";
        const hint = ERROR_HINTS.get(code) || "Check semantic rules.";

        const fileInfo = chalk.blue(`${filename}:${location.line + 1}:${location.col + 1}`);

        console.log(`${chalk.red(`error[${code}]:`)} ${message}`);
        console.log(` --> ${fileInfo}`);
        console.log(`${" ".repeat(2)} |`);
        console.log(`${String(location.line + 1)} ${" "}| ${errorLine}`);
        console.log(
            `${" ".repeat(2)} | ${" ".repeat(location.col)}${chalk.red("^")} ${chalk.dim(details || "")}`
        );
        console.log(`\n  ${chalk.green("= help:")} ${chalk.yellow(hint)}`);
        console.log();
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