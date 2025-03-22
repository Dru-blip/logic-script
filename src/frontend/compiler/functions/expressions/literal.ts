import type { LogicLiteral } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const literal: CompilerFunction<LogicLiteral> = (
  node: LogicLiteral,
  context: CompilerContext,
) => {
  if (node.literalType === "string") {
    const value = <string>node.value;
    const buffer = new Uint8Array(value.length);
    const { written } = new TextEncoder().encodeInto(value, buffer);
    context.unit.constantTable.set(buffer);
  }

  if (node.literalType === "number") {
    console.log(`Number(${node.value})`);
  }

  if (node.literalType === "boolean") {
    console.log(`Boolean(${node.value})`);
  }
};
