import {Lexer} from "../lexer";
import {parse} from "../parser";
import {readFileSync} from "node:fs";
import {Interpreter} from "../eval/interpreter.ts";

const fileName =
    "/home/gojo/Desktop/workspaces/logic script/sandbox/hello/src/main.lgs";

// const source = await Bun.file(fileName).text();
const source = readFileSync(fileName).toString();

const name = "main.lgs";
//
// const lexer = new Lexer(source, name);
//
// const tokens = lexer.getTokens();
// console.log(tokens);

const parser = parse(
    source
    , name
);

const ast = parser.parse();

const interpreter = new Interpreter();
interpreter.visit(ast.value!)
