import type { LogicNode } from "../parser/ast";
import type { CompilerContext } from "./context";

export type CompilerFunction<T extends LogicNode> = (
  node: T,
  context: CompilerContext,
) => any;
