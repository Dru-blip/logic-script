import type { LogicLiteral } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import { Opcode } from "../../opcodes";
import type { CompilerFunction } from "../../types";

export const literal: CompilerFunction<LogicLiteral> = (
  node: LogicLiteral,
  context: CompilerContext,
) => {
  const { unit } = context;
  if (node.literalType === "string") {
    const value = <string>node.value;
    const constant = unit.constantTable.getConstant(value);
    if (constant) {
      unit.globalInstructions.set(
        new Uint8Array([Opcode.LOAD_CONST, constant.index]),
        unit.totalGlobalBytes,
      );
      unit.totalGlobalBytes += 2;
      return;
    }
    const valueBuffer = [...new TextEncoder().encode(value), 0];
    const buffer = new Uint8Array(4 + value.length);
    buffer.set([unit.totalConstants, 0x01, value.length], 0);
    unit.totalConstants += 1;

    buffer.set(valueBuffer, 3);
    unit.constantTable.addConstant(value, {
      value: buffer,
      index: unit.totalConstants - 1,
    });
    unit.totalConstantBytes += buffer.byteLength;
    unit.globalInstructions.set(
      new Uint8Array([Opcode.LOAD_CONST, unit.totalConstants - 1]),
      unit.totalGlobalBytes,
    );
    unit.totalGlobalBytes += 2;
    return;
  }

  if (node.literalType === "number") {
    const value = <number>node.value;
    const constant = unit.constantTable.getConstant(value.toString());
    if (constant) {
      unit.globalInstructions.set(
        new Uint8Array([Opcode.LOAD_CONST, constant.index]),
        unit.totalGlobalBytes,
      );
      unit.totalGlobalBytes += 2;
      return;
    }
    const numBuffer = new ArrayBuffer(4);
    const view = new DataView(numBuffer);
    view.setUint32(0, value, true);
    const bytes = new Uint8Array(numBuffer);

    const buffer = new Uint8Array(3 + bytes.length);
    buffer.set([unit.totalConstants, 0x02, bytes.length], 0);
    buffer.set(bytes, 3);
    unit.totalConstants += 1;
    unit.constantTable.addConstant(value.toString(), {
      value: buffer,
      index: unit.totalConstants - 1,
    });
    unit.totalConstantBytes += buffer.byteLength;
    unit.globalInstructions.set(
      new Uint8Array([Opcode.LOAD_CONST, unit.totalConstants - 1]),
      unit.totalGlobalBytes,
    );
    unit.totalGlobalBytes += 2;
    return;
  }

  if (node.literalType === "boolean") {
    console.log(`Boolean(${node.value})`);
    return;
  }
};
