import { compileNode } from "..";
import type { GroupingExpression } from "../../../parser/ast/expressions/group";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const group: CompilerFunction<GroupingExpression> = (
  node: GroupingExpression,
  context: CompilerContext,
) => {
  compileNode(node.expr, context);
};
