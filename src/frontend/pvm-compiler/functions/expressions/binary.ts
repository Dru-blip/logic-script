import { compileNode } from "..";
import type { BinaryExpression } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import { Opcode } from "../../opcodes";
import type { CompilerFunction } from "../../types";

export const binary: CompilerFunction<BinaryExpression> = (
  node: BinaryExpression,
  context: CompilerContext,
) => {
  const { unit } = context;

  compileNode(node.left, context);
  compileNode(node.right, context);
  unit.globalInstructions.set(
    new Uint8Array([Opcode.TOKEN_TO_OPCODE[node.operator.type]!]),
    unit.totalGlobalBytes,
  );
  unit.totalGlobalBytes += 1;
};
