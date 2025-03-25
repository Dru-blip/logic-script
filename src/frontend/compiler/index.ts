import type { FileSink } from "bun";
import type { LogicConfig } from "../../types";
import { parse } from "../parser";
import { CompilerContext } from "./context";
import type { Program } from "../parser/ast";
import { compileNode } from "./functions";

/**
 * Compiles a source file into an intermediate representation.
 *
 * @param {string} filePath - The path to the source file.
 * @param {CompilerContext} context - The compiler context for tracking state.
 * @returns {Promise<{ run: () => void }>} An object with a `run` function to execute the compiled code.
 * @throws {Error} If the file does not exist or parsing fails.
 */
export const compile = async (
  filePath: string,
  context: CompilerContext,
): Promise<{ run: () => void }> => {
  const file = Bun.file(filePath);
  if (!file.exists()) throw new Error(`File ${filePath} does not exist`);

  const source = await file.text();
  const par = parse(source, filePath);
  const ast = par.parse();
  if (!ast.isOk) {
    // console.log(ast.error);
    process.exit(1);
  }

  return {
    /**
     * Executes the compiled code from the AST.
     */
    run: () => compileNode(ast.value!, context),
  };
};
