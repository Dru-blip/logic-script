import type { FileSink } from "bun";
import type { LogicConfig } from "../../types";
import { parser } from "../parser";
import { CompilerContext } from "./context";
import type { Program } from "../parser/ast";
import { compileNode } from "./functions";

export const compile = async (filePath: string, context: CompilerContext) => {
  const file = Bun.file(filePath);
  if (!file.exists()) throw new Error(`File ${filePath} does not exist`);

  const source = await file.text();
  const par = parser(source, filePath);
  const ast = par.parse();
  if (ast.error) {
    console.error(ast.error);
    process.exit(1);
  }

  return {
    run: () => compileNode(ast.value!, context),
  };
};
