import type { LogicLiteral } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import { Opcode } from "../../opcodes";
import type { CompilerFunction } from "../../types";

interface LiteralTypeHandler {
  typeCode: number;
  serializeValue: (value: any) => Uint8Array;
}

const literalTypeHandlers: Record<string, LiteralTypeHandler> = {
  string: {
    typeCode: 0x01,
    serializeValue: (value: string) =>
      new Uint8Array([...new TextEncoder().encode(value), 0]),
  },
  number: {
    typeCode: 0x02,
    serializeValue: (value: number) => {
      const numBuffer = new ArrayBuffer(4);
      const view = new DataView(numBuffer);
      view.setUint32(0, value, true);
      return new Uint8Array(numBuffer);
    },
  },
};

export const literal: CompilerFunction<
  LogicLiteral<string | number | boolean>
> = (node, context: CompilerContext) => {
  const { unit } = context;

  const value = node.value;
  const stringKey = value.toString();

  const constant = unit.constantTable.getConstant(stringKey);
  if (constant) {
    unit.globalInstructions.set(
      new Uint8Array([Opcode.LOAD_CONST, constant.index]),
      unit.totalGlobalBytes,
    );
    unit.totalGlobalBytes += 2;
    return;
  }

  const handler = literalTypeHandlers[node.literalType];
  if (!handler) return;

  const valueBuffer = handler.serializeValue(value);

  const buffer = new Uint8Array(3 + valueBuffer.length);
  buffer.set([unit.totalConstants, handler.typeCode, valueBuffer.length], 0);
  unit.totalConstants += 1;
  buffer.set(valueBuffer, 3);

  unit.constantTable.addConstant(stringKey, {
    value: buffer,
    index: unit.totalConstants - 1,
  });
  unit.totalConstantBytes += buffer.byteLength;

  unit.globalInstructions.set(
    new Uint8Array([Opcode.LOAD_CONST, unit.totalConstants - 1]),
    unit.totalGlobalBytes,
  );
  unit.totalGlobalBytes += 2;
};
