import { compileNode } from "..";
import { Program } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const program: CompilerFunction<Program> = (
  node: Program,
  context: CompilerContext,
) => {
  for (const statement of node.statements) {
    compileNode(statement, context);
  }
};
