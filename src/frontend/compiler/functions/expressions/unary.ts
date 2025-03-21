import { compileNode } from "..";
import type { UnaryExpression } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const unary: CompilerFunction<UnaryExpression> = (
  node: UnaryExpression,
  context: CompilerContext,
) => {
  console.log(node.type);
  console.log(node.operator.literal);
  compileNode(node.argument, context);
};
