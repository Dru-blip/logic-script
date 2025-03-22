import type { LogicLiteral } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const literal: CompilerFunction<LogicLiteral> = (
  node: LogicLiteral,
  context: CompilerContext,
) => {
  const { unit } = context;
  if (node.literalType === "string") {
    const value = <string>node.value;
    unit.totalConstants += 1;
    const valueBuffer = new TextEncoder().encode(value);
    const buffer = new Uint8Array(3 + value.length);
    buffer.set([unit.totalConstants, 0x01, value.length], 0);
    buffer.set(valueBuffer, 3);
    unit.constantTable.set(buffer, unit.totalConstantBytes);
    unit.totalConstantBytes += buffer.byteLength;
  }

  if (node.literalType === "number") {
    console.log(`Number(${node.value})`);
  }

  if (node.literalType === "boolean") {
    console.log(`Boolean(${node.value})`);
  }
};
