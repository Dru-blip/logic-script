import { parse } from "../parser";

const source=await Bun.file("/home/gojo/Desktop/workspaces/logic script/sandbox/hello/src/main.lgs").text()
const name="main.lgs"

// const lexer=new Lexer(source,name)

// const tokens=lexer.getTokens()
// console.log(tokens)

const parser = parse(
  source
  ,name
);

const ast = parser.parse();

console.log(ast.value)
