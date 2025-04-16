import type { FileSink } from "bun";
import type { CompiledUnit } from "./units/compiled-unit";

export class Transformer {
  static write(fileWriter: FileSink, unit: CompiledUnit) {
    const header = Transformer.writeHeader(unit);

    const constants = unit.constantTable.toBuffer();
    fileWriter.write(header);
    fileWriter.write(constants);
    fileWriter.write(unit.globalInstructions.slice(0, unit.totalGlobalBytes));
    fileWriter.write(new Uint8Array([0x79]));
    fileWriter.end();
  }

  static splitIntoTwoBytes(value: number): [number, number] {
    // [lsb,msb]
    return [value & 0xff, (value >> 8) & 0xff];
  }

  static writeHeader(unit: CompiledUnit) {
    const header = new Uint8Array(15);

    //Magic Number "PVMC"
    header[0] = 0x50;
    header[1] = 0x56;
    header[2] = 0x4d;
    header[3] = 0x43;

    // Version Number
    header[4] = 0x01;
    header[5] = 0x00;

    // Byte Order
    header[6] = 0x01;

    // Constant pool size
    const poolSize = Transformer.splitIntoTwoBytes(unit.totalConstantBytes);
    // console.log(poolSize);
    header[7] = poolSize[0];
    header[8] = poolSize[1];

    // function count
    header[9] = 0x00;
    header[10] = 0x00;

    // instruction count
    const size = Transformer.splitIntoTwoBytes(unit.totalGlobalBytes);
    // console.log(size);
    header[11] = size[0];
    header[12] = size[1];

    // stack size
    const stackSize = Transformer.splitIntoTwoBytes(2048);
    console.log(stackSize);
    header[13] = stackSize[0];
    header[14] = stackSize[1];

    return header;
  }
}
