import { compileNode } from "..";
import type { BinaryExpression } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const binary: CompilerFunction<BinaryExpression> = (
  node: BinaryExpression,
  context: CompilerContext,
) => {
  console.log(node.type);
  console.log(node.operator.literal);
  compileNode(node.left, context);
  compileNode(node.right, context);
};
