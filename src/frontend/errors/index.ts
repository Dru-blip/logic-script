import chalk from "chalk";
import type {TokenLocation} from "../../types";

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

        const details = expected ?? "" + unexpected ?? ""
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
